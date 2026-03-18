import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {
    const { mutate: signOut, isSuccess} = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext(); 
useEffect(() => {
    if(isSuccess) navigate(0);
}, [isSuccess])

  return (
    <section className="sticky top-0 z-50 md:hidden bg-dark-2 w-full">
        <div className="flex justify-between items-center py-4 px-5">
            <Link to="/" className="flex gap-3 items-center">
                <img 
                    src="/assets/images/logo-text.png"
                    alt="Logo"
                    width={100}
                    height={325}
                />
            </Link>
            <div className="flex gap-4">
                <Button variant="ghost"  className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white !important" onClick={() => signOut()}>
                    <img 
                        src="/assets/icons/logout.svg"
                        alt="logout"
                    />
                </Button>
                <Link to={`/profile/${user.id}`} className="flex justify-center items-center gap-3">
                    <img 
                    src={user.imageUrl || "assets/icons/profile-placeholder.svg"} 
                    alt="profile" 
                    className="h-8 w-8 rounded-full"
                    />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default Topbar