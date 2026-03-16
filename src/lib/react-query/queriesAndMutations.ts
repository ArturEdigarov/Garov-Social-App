import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query"
import { createUserAccount, signInAccount, SignOutAccount, createPost, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost, getInfinitePosts, searchPosts, searchUsers, getInfiniteUsers, searchSavedPosts, getInfiniteSavedPosts, updateProfile, getUserById, getInfiniteLikedPosts } from "../appwrite/api";
import type { INewPost, INewUser, IUpdatePost } from "@/types";
import { QUERY_KEYS } from "./queryKeys";


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string; }) => signInAccount(user),
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: SignOutAccount
    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, likesArray} : {postId: string, likesArray: string[]}) => likePost(postId, likesArray), 
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, userId } : {postId: string, userId: string}) => savePost(postId, userId), 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId), 
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}
export const useGetPostById =  (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })    
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId} : { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })    
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_POSTS],
        // Явно забираем pageParam из объекта, который дает useInfiniteQuery
        queryFn: ({ pageParam }) => getInfinitePosts({ pageParam: pageParam as string | null }),
        // В v5 начальный параметр ОБЯЗАТЕЛЕН
        initialPageParam: null as string | null, 
        getNextPageParam: (lastPage: any) => {
            // Если данных нет, возвращаем null, чтобы остановить загрузку
            if (!lastPage || lastPage.documents.length === 0) {
                return null;
            }
            // Берем ID последнего документа для курсора
            return lastPage.documents[lastPage.documents.length - 1].$id;
        }   
    })
}
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => {
            return searchPosts(searchTerm);
        },
        enabled: !!searchTerm
    })
}
export const useSearchUsers = (searchTerm: string) => {
    console.log("🔍 useSearchUsers hook: called with searchTerm =", searchTerm);
    console.log("🔍 useSearchUsers hook: enabled =", !!searchTerm);
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
        queryFn: async () => {
            console.log("🔍 useSearchUsers hook: queryFn EXECUTING for searchTerm =", searchTerm);
            try {
                const result = await searchUsers(searchTerm);
                console.log("🔍 useSearchUsers hook: queryFn got result =", result);
                return result;
            } catch(e) {
                console.error("❌ useSearchUsers hook: queryFn error =", e);
                throw e;
            }
        },
        enabled: !!searchTerm
    })
}
export const useGetUsers = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        // Явно забираем pageParam из объекта, который дает useInfiniteQuery
        queryFn: ({ pageParam }) => getInfiniteUsers({ pageParam: pageParam as string | null }),
        // В v5 начальный параметр ОБЯЗАТЕЛЕН
        initialPageParam: null as string | null, 
        getNextPageParam: (lastPage: any) => {
            // Если данных нет, возвращаем null, чтобы остановить загрузку
            if (!lastPage || lastPage.documents.length === 0) {
                return null;
            }
            // Берем ID последнего документа для курсора
            return lastPage.documents[lastPage.documents.length - 1].$id;
        }   
    })
}

export const useSearchSavedPosts = (searchTerm: string, userId: string) => {
    console.log("🔍 useSearchSavedPosts hook: called with searchTerm =", searchTerm);
    console.log("🔍 useSearchSavedPosts hook: enabled =", !!searchTerm);
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
        queryFn: async () => {
            console.log("🔍 useSearchSavedPosts hook: queryFn EXECUTING for searchTerm =", searchTerm);
            try {
                const result = await searchSavedPosts(searchTerm, userId);
                console.log("🔍 useSearchSavedPosts hook: queryFn got result =", result);
                return result;
            } catch(e) {
                console.error("❌ useSearchSavedPosts hook: queryFn error =", e);
                throw e;
            }
        },
        enabled: !!searchTerm
    })
}
export const useGetSavedPosts = (userId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS, userId],
        // Явно забираем pageParam из объекта, который дает useInfiniteQuery
        queryFn: ({ pageParam }) => getInfiniteSavedPosts({ pageParam: pageParam as string | null, userId }),
        // В v5 начальный параметр ОБЯЗАТЕЛЕН
        initialPageParam: null as string | null, 
        getNextPageParam: (lastPage: any) => {
            // Если данных нет, возвращаем null, чтобы остановить загрузку
            if (!lastPage || lastPage.documents.length === 0) {
                return null;
            }
            // Берем ID последнего документа для курсора
            return lastPage.documents[lastPage.documents.length - 1].$id;
        }
    })
}
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: any) => updateProfile(user),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })    
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
export const useGetLikedPosts = (userId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_LIKED_POSTS, userId],
        // Явно забираем pageParam из объекта, который дает useInfiniteQuery
        queryFn: ({ pageParam }) => getInfiniteLikedPosts({ pageParam: pageParam as string | null, userId }),
        // В v5 начальный параметр ОБЯЗАТЕЛЕН
        initialPageParam: null as string | null, 
        getNextPageParam: (lastPage: any) => {
            // Если данных нет, возвращаем null, чтобы остановить загрузку
            if (!lastPage || lastPage.documents.length === 0) {
                return null;
            }
            // Берем ID последнего документа для курсора
            return lastPage.documents[lastPage.documents.length - 1].$id;
        }
    })
}