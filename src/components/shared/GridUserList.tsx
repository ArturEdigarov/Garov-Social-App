import { useUserContext } from '@/context/AuthContext';

import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
type GridUserListProps = {
    users: any & {
        username: any;
        liked: any;
        name: string;
        imageUrl: string;
        save: any;
        email: any;
        posts: any;
    };
    showUser?: boolean;
    showStats?: boolean;
}
const GridUserList = ({ users, showUser = true }: GridUserListProps) => {
    const { user } = useUserContext();
    console.log("вот юзер", user)
    console.log('🔍 GridPostList получил users:', users);
    console.log('📊 users массив?', Array.isArray(users));
    console.log('📊 users.length:', users?.length);

  return (
    <ul className='grid-container'>
         {users.map((users : any) => (
            <li key={users.$id} className='relative min-w-80 max-h-80 border border-dark-4 rounded-3xl'>
                <Link to={`/profile/${users.$id}`}>  
                    <div className=''>
                        {showUser && (
                            <div className='flex flex-col items-center justify-start mt-10 mb-10 gap-4 flex-1'>
                                <img src={users.imageUrl} alt="creator" className='h-15 w-15 rounded-full' />
                                <div className='flex flex-col items-center'>    
                                    <p className='line-clamp-1'>{users.name}</p>
                                    <p className='line-clamp-1 text-light-4'>@{users.username}</p>
                                </div>
                                <Button size="lg" className='bg-primary-600'>Follow</Button>
                            </div>
                        )}
                    </div>
                </Link>
            </li>
         ))}
    </ul>
  )
}

export default GridUserList