import { ID, Query } from 'appwrite';
import type { INewUser, INewPost, IUpdatePost } from "@/types";
import { account, avatars } from './config';
import { databases, appwriteConfig } from './config';
import { storage } from './config';

export async function createUserAccount(user: INewUser) { 
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,

            user.password,
            user.name
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            imageUrl: new URL(avatarUrl),
            email: newAccount.email,
            username: user.username,
        })

        return newUser;
    } catch (error) {
        console.error('createUserAccount error:', error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    name: string;
    imageUrl: URL;
    email: string;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            ID.unique(),
            user,
        )
        return newUser;
    } catch (error){
        console.log(error);
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();
        
        return currentAccount;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function signInAccount(user: { email: string; password: string; }) {
    try{
        const session = await account.createEmailPasswordSession( user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) return null;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [
                Query.equal("accountId", currentAccount.$id),
                // ВАЖНО: Добавляем выборку всех полей (*) и всех вложенных полей в 'save'
                Query.select(['*', 'save.*', "posts.*"]) 
            ]

        )
        if (!currentUser || currentUser.documents.length === 0) {
            return null;
        }
        return currentUser.documents[0];
    } catch (error) {
        return null;
    }
}

export async function SignOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
} 
export async function createPost(post: INewPost) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);
        if(!uploadedFile) throw Error('File upload failed');
        const fileUrl = await getFilePreview(uploadedFile.$id);
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error('File URL generation failed');
        }

        // Create tags in an array
        
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
                likes: [],
            }
        )
        if(!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error('Post creation failed');
        }
        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}
export async function getFilePreview(fileId: string) {
    try {
       const fileUrl = storage.getFileView(
            appwriteConfig.storageId,
            fileId
        );
        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: 'success' };
    } catch (error) {
        console.log(error);
    }
}
export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postTableId,
        [
            Query.orderDesc("$createdAt"),
            Query.limit(20),
            Query.select([
                    '*',          
                    'likes.*',    
                    'creator.*'   
                ]), 
        ]
        );

        return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            postId,
            {
                likes: likesArray,
            }
        ) 
        if(!updatedPost) throw Error('Could not like post');
        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}
export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesTableId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        ) 
        if(!updatedPost) throw Error('Could not like post');
        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesTableId,
            savedRecordId,
        ) 
        if(!statusCode) throw Error('Could not like post');
        return { status: 'success' };
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            postId,
            [Query.select([ "*", "creator.*", "likes.*"])]
        )
        return post;
    } catch (error) {
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {
            let image = {
                imageUrl: post.imageUrl,
                imageId: post.imageId,
            }
            if(hasFileToUpdate){
                const uploadedFile = await uploadFile(post.file[0]);
                if(!uploadedFile) throw Error('File upload failed');
                const fileUrl = await getFilePreview(uploadedFile.$id);
                if(!fileUrl) {
                    deleteFile(uploadedFile.$id);
                    throw Error('File URL generation failed');
                }
                image = {...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id}
            }

        
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        )
        if(!updatedPost) {
            await deleteFile(post.imageId);
            throw Error('Post creation failed');
        }
        return updatePost;
    } catch (error) {
        console.log(error);
    }
}
export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId || postId == "") throw Error('Post ID and Image ID are required for deletion');

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            postId,
        )
        return { status: 'success' };
    } catch(error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string | null}) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(20), Query.select(["*", "creator.*", "likes.*"])];
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            queries
        )
        if (!posts) throw Error('Could not fetch posts');
        return posts;
    } catch (error) {
        console.log(error);
    }
}
export async function searchPosts(searchTerm: string) {
    try {
        
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            [Query.search("caption", searchTerm), Query.select(["*", "creator.*", "likes.*"])]
        )
        
        if (!posts) throw Error('Could not fetch posts');
        return posts;
    } catch (error) {
        
        return { documents: [], total: 0 };
    }
}
export async function searchUsers(searchTerm: string) {
    try {
        
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [Query.search("name", searchTerm)]
        )
        
        
        if (!users) {
            throw Error('Could not fetch users');
        }
        
        return users;
    } catch (error) {
        return { documents: [], total: 0 };
    }
}
export async function getInfiniteUsers({ pageParam }: { pageParam: string | null}) {
    const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(20), Query.select(["*", "save.*", "liked.*"])];
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            queries
        )
        if (!users) throw Error('Could not fetch users');
        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function searchSavedPosts(searchTerm: string, userId: string) {
    try {

        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            [Query.select(["*", "creator.*", "save.*", "likes.*"]), Query.search("caption", searchTerm), Query.equal("save.user", userId)]
        )
        
        if (!savedPosts) {
            throw Error('Could not fetch users');
        }
        
        return savedPosts;
    } catch (error) {
        return { documents: [], total: 0 };
    }
}
export async function getInfiniteSavedPosts({ pageParam, userId }: { pageParam: string | null,  userId: string}) {
    const queries: any[] = [Query.equal("user", userId), Query.orderDesc("$createdAt"), Query.limit(20), Query.select(["*", "post.*", "post.creator.*", "post.likes.*" ])];
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesTableId,
            queries
        )
        if (!savedPosts) throw Error('Could not fetch users');
        return savedPosts;
    } catch (error) {
        console.log(error);
    }
}

export async function updateProfile(
    user: {
        userId: string;
        name: string;
        bio: string;
        file: File[];
        imageUrl: any;
        imageId: string;
        username: string;
    }
) {
    const hasFileToUpdate = user.file.length > 0;
    try {
            let image = {
                imageUrl: user.imageUrl,
                imageId: user.imageId,
            }
            if(hasFileToUpdate){
                const uploadedFile = await uploadFile(user.file[0]);
                if(!uploadedFile) throw Error('File upload failed');
                const fileUrl = await getFilePreview(uploadedFile.$id);
                if(!fileUrl) {
                    deleteFile(uploadedFile.$id);
                    throw Error('File URL generation failed');
                }
                image = {...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id}
            }


        // Save post to database
        const updatedProfile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            user.userId,
            {
                name: user.name,                
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                username: user.username,
            }
        )
        if(updatedProfile && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }
        return updatedProfile;
    } catch (error) {
        console.log(error);
    }
}
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      userId,
      [
        Query.select(['*', 'save.*', 'posts.*']) 
      ]
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getInfiniteLikedPosts({ pageParam, userId }: { pageParam: string | null,  userId: string}) {
    const queries: any[] = [ Query.orderDesc("$createdAt"), Query.limit(20), Query.select(["*", "creator.*", "likes.*" ]), Query.equal("likes.$id", userId)];
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const likedPosts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postTableId,
            queries
        )
        if (!likedPosts) throw Error('Could not fetch users');
        return likedPosts;
    } catch (error) {
        console.log(error);
    }
}