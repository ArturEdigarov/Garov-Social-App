import { Loader } from '@/components/shared/Loader';
import { useGetLikedPosts} from '@/lib/react-query/queriesAndMutations';
import GridPostList from '@/components/shared/GridPostList';
import { useInView } from 'react-intersection-observer';
import { useUserContext } from '@/context/AuthContext';
const LikedPosts = () => {

  const { ref } = useInView();
  const { user } = useUserContext();

  const { data: likedPosts, hasNextPage } = useGetLikedPosts(user.id);
  
  if (!likedPosts) return <Loader />;
  return (
    <div className='explore-container'>
      {<div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {likedPosts.pages.map((item, index) => (
            <GridPostList 
              key={`page-${index}`} 
              posts={item?.documents} 
              showStats={false}               
            />
          ))}
      </div>
      }
      {hasNextPage && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default LikedPosts