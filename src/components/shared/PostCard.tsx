import React, { useEffect, useState } from 'react'
import type { Models } from "appwrite";
import { Link } from 'react-router-dom';
// Импортируй свой конфиг апврайта или функцию получения дока
import { databases } from '@/lib/appwrite/config'; 
import { appwriteConfig } from '@/lib/appwrite/config';
import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import PostStats from './PostStats';

type PostCardProps = {
  post: Models.Document & {
    creator: any; // Может прийти как строка (ID) или как объект
    caption: string;
    location: string;
    imageUrl: string;
    tags: string[];
  };
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
    
  // Определяем, пришел нам объект или просто строка-ID
/**  const creatorId = typeof post.creator === 'string' ? post.creator : post.creator?.$id;
  console.log("Creator:", post.creator);
  const isCreatorObject = typeof post.creator === 'object' && post.creator !== null;
    
  useEffect(() => {
    // Если creator пришел строкой и у нас еще нет данных в стейте
    if (typeof post.creator === 'string' && !userData) {
      const fetchCreator = async () => {
        try {
          setIsLoading(true);
          // ТУТ ВАЖНО: укажи ID своей базы и ID коллекции Users (или где лежат юзеры)
          const userDoc = await databases.getDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userTableId, 
            post.creator
          );
          setUserData(userDoc);
          
        } catch (error) {
          console.error("Ошибка при получении юзера:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCreator();
    }
  }, [post.creator, userData]);

  // Выбираем, какие данные использовать: из пропсов (если объект) или из стейта (если докачали)
  const creator = isCreatorObject ? post.creator : userData; **/
  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post.creator.$id}`}>
            <img 
              src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator" 
              className='rounded-full w-12 lg:h-12'
            />
          </Link>
          <div className='flex flex-col'>
             <p className="base-medium lg:body-bold text-light-1">
                {post.creator?.name || "Loading..."}
             </p>
             <div className='flex-center gap-2 text-light-3'>
                <p className="subtle-semibold lg:small-regular">
                    {multiFormatDateString(post.$createdAt) || "Loading..."}
                </p>
                <p className="subtle-semibold lg:small-regular">
                    {post.location || "Loading..."}
                </p>
             </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`} className={`${user.id !== post.creator?.$id && "hidden"}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className='small-medium lg:base-medium py-5'>
            <p>{post.caption}</p>
            <ul className='flex gap-1 mt-2'>
                {post.tags.map((tag: string) => (
                    <li key={tag} className='text-light-3'>
                        #{tag}
                    </li>
                ))}
            </ul>
        </div>
        <img src={post.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="post image" className='post-card_img'/>
      </Link>
      <PostStats post={post as any} userId={user.id}/>
      
    </div>
    
  )
}

export default PostCard