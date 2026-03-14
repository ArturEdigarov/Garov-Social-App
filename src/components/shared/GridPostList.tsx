import { useUserContext } from '@/context/AuthContext';
import type { Models } from 'appwrite';
import React from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
type GridPostListProps = {
    posts: any & {
        creator: any;
        caption: string;
        location: string;
        imageUrl: string;
        tags: string[];
        likes: any;
    };
    showUser?: boolean;
    showStats?: boolean;
}
const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
    const { user } = useUserContext();
    console.log('🔍 GridPostList получил posts:', posts);
    console.log('📊 posts массив?', Array.isArray(posts));
    console.log('📊 posts.length:', posts?.length);
    
  return (
    <ul className='grid-container'>
         {posts?.map((post) => (
            console.log("ВВВОООТТ creator", post.creator),
            <li key={post.$id} className='relative min-2-80 h-80'>
                <Link to={`/posts/${post.$id}`}>
                    <img src={post?.imageUrl} alt="post" className='h-full w-full object-cover rounded-3xl border border-dark-4' />
                </Link>
                <div className='grid-post_user'>
                    {showUser && (
                        <div className='flex items-center justify-start gap-2 flex-1'>
                            <img src={post?.creator?.imageUrl} alt="creator" className='h-8 w-8 rounded-full' />
                            <p className='line-clamp-1'>{post?.creator?.name}</p>
                        </div>
                    )}
                    {showStats && <PostStats post={post} userId={user.id}/>}
                </div>
            </li>
         ))}
    </ul>
  )
}

export default GridPostList