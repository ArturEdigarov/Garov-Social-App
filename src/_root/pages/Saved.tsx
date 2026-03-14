import { Loader } from '@/components/shared/Loader';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounde';
import { useGetCurrentUser, useGetPosts, useGetSavedPosts, useGetUsers, useSearchPosts, useSearchSavedPosts, useSearchUsers } from '@/lib/react-query/queriesAndMutations';
import GridPostList from '@/components/shared/GridPostList';
import SearchResults from '@/components/shared/SearchResults';
import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import SearchSavedPostsResults from '@/components/shared/SearchSavedPostsResults';
import { useUserContext } from '@/context/AuthContext';
const saved = () => {

  const { ref, inView } = useInView();
  const { user } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();

  const { data: savedPosts, fetchNextPage, hasNextPage } = useGetSavedPosts(user.id);

  const [searchValue, setSearchValue] = useState("");
  const shouldShowSearchResults = searchValue !== "";
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchSavedPosts(debouncedValue, user.id);

  console.log("🔍 Saved: searchValue =", searchValue);
  console.log("🔍 Saved: debouncedValue =", debouncedValue);
  console.log("🔍 Saved: searchedPosts =", searchedPosts);
  console.log("🔍 Saved: isSearchFetching =", isSearchFetching);

  // debug the fetched pages so we know what's coming back
  console.log("🔍 Saved: savedPosts =", savedPosts);
  
  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])
  if(!savedPosts) {
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )
  }

  const shouldShowSavedPosts = !shouldShowSearchResults && savedPosts?.pages.every((item) => !item || !item.documents || item.documents.length === 0);
  if (!savedPosts) return <Loader />;
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <div className='w-full gap-3 flex'>
          <img src="assets/icons/save.svg" alt="" />
          <h2 className='h3-bold md:h2-bold'>Saved Posts</h2>
        </div>
        
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
          <Input type="text" placeholder='Search' className='explore-search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
        </div>
      </div>



      {/* <div className='flex flex-wrap gap-9 w-full max-w-5xl mt-10'>
        {shouldShowSearchResults ? (
          <SearchSavedPostsResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts}/>
        ): shouldShowSavedPosts ? (
          <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
        ) : savedPosts.pages.map((item, index) => (
          <GridPostList key={`page-${index}`} posts={posts} />
        ))}
      </div>  */
      <div className='flex flex-wrap gap-9 w-full max-w-5xl mt-10'>
        {shouldShowSearchResults ? (
          <SearchSavedPostsResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts}/>
        ) : shouldShowSavedPosts ? (
          <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
        ) : (
          savedPosts.pages.map((item, index) => {
            // ТРАНСФОРМАЦИЯ происходит ПРЯМО ЗДЕСЬ для каждой страницы
            const posts = item.documents.map((saveDocument: any) => ({
              ...saveDocument.post,
              creator: saveDocument.post.creator,
            }));

            return <GridPostList key={`page-${index}`} posts={posts} />;
          })
        )}
      </div>
      }
      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default saved