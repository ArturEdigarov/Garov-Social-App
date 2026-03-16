import { Loader } from '@/components/shared/Loader';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounde';
import {  useGetUsers, useSearchUsers } from '@/lib/react-query/queriesAndMutations';
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import SearchUsersResults from '@/components/shared/SearchUsersResults';
import GridUserList from '@/components/shared/GridUserList';

const allUsers = () => {

  const { ref, inView } = useInView();

  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();

  const [searchValue, setSearchValue] = useState("");
  const shouldShowSearchResults = searchValue !== "";
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedValue);
  
  console.log("🔍 AllUsers: searchValue =", searchValue);
  console.log("🔍 AllUsers: debouncedValue =", debouncedValue);
  console.log("🔍 AllUsers: searchedUsers =", searchedUsers);
  console.log("🔍 AllUsers: isSearchFetching =", isSearchFetching);
  
  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])
  if(!users) {
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )
  }

  const shouldShowUsers = !shouldShowSearchResults && users?.pages.every((item) => item?.documents.length === 0);
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>All Users</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
          <Input type="text" placeholder='Search' className='explore-search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
        </div>
      </div>

      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'>All</p>
          <img src="/assets/icons/filter.svg" alt="filter"  width={20} height={20}/>
        </div>
      </div>

      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowSearchResults ? (
          <SearchUsersResults isSearchFetching={isSearchFetching} searchedUsers={searchedUsers}/>
        ): shouldShowUsers ? (
          <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
        ) : users.pages.map((item, index) => (
          <GridUserList key={`page-${index}`} users={item?.documents} />
        ))}
      </div> 
      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader />
        </div>
      )}
    </div>
  )
}

export default allUsers