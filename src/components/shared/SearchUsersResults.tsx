import type { Models } from 'appwrite';
import { Loader } from './Loader';
import GridUserList from './GridUserList';

type SearchUsersResultsProps = {
    isSearchFetching: boolean;
    searchedUsers: { documents: Models.Document[]; total: number } | any;

}
const SearchUsersResults = ({ isSearchFetching, searchedUsers }: SearchUsersResultsProps) => {
    if(isSearchFetching) {
        return <Loader/>
    }
    if(searchedUsers && searchedUsers.documents.length > 0) {
        return (
            <GridUserList users={searchedUsers.documents}/>
            
        )
    }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchUsersResults