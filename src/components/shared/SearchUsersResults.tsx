import type { Models } from 'appwrite';
import { Loader } from './Loader';
import GridPostList from './GridPostList';
import GridUserList from './GridUserList';

type SearchUsersResultsProps = {
    isSearchFetching: boolean;
    searchedUsers: { documents: Models.Document[]; total: number } | any;

}
const SearchUsersResults = ({ isSearchFetching, searchedUsers }: SearchUsersResultsProps) => {
    console.log("🔍 SearchResults получил:", { isSearchFetching, searchedUsers });
    console.log("🔍 searchedUsers.documents:", searchedUsers?.documents);
    console.log("🔍 documents length:", searchedUsers?.documents?.length);
    
    if(isSearchFetching) {
        console.log("⏳ Идет поиск...");
        return <Loader/>
    }
    if(searchedUsers && searchedUsers.documents.length > 0) {
        console.log("✅ Найдено users:", searchedUsers.documents.length);
        return (
            <GridUserList users={searchedUsers.documents}/>
            
        )
    }
    console.log("❌ Результатов не найдено");
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchUsersResults