import type { Models } from 'appwrite';
import { Loader } from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchedPosts: { documents: Models.Document[]; total: number } | any;

}
const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
    console.log("🔍 SearchResults получил:", { isSearchFetching, searchedPosts });
    console.log("🔍 searchedPosts.documents:", searchedPosts?.documents);
    console.log("🔍 documents length:", searchedPosts?.documents?.length);
    
    if(isSearchFetching) {
        console.log("⏳ Идет поиск...");
        return <Loader/>
    }
    if(searchedPosts && searchedPosts.documents.length > 0) {
        console.log("✅ Найдено постов:", searchedPosts.documents.length);
        return (
            <GridPostList posts={searchedPosts.documents}/>
            
        )
    }
    console.log("❌ Результатов не найдено");
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults