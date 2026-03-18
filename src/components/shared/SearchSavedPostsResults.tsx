import type { Models } from 'appwrite';
import { Loader } from './Loader';
import GridPostList from './GridPostList';


type SearchUsersResultsProps = {
    isSearchFetching: boolean;
    searchedPosts: { documents: Models.Document[]; total: number } | any;

}
const SearchUsersResults = ({ isSearchFetching, searchedPosts }: SearchUsersResultsProps) => {   
    if(isSearchFetching) {
        return <Loader/>
    }
    if(searchedPosts && searchedPosts.documents.length > 0) {        
        return (
            <GridPostList posts={searchedPosts.documents}/>
            
        )
    }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchUsersResults