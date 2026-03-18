import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import type { INavLink } from '@/types';
import { sidebarLinks } from '@/constants/index.ts';

const LeftSidebar = () => {
    const { pathname } = useLocation();
    const { mutate: signOut, isSuccess} = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext(); 
useEffect(() => {
    if(isSuccess) navigate(0);
}, [isSuccess])

  return (
    <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-67.5 bg-dark-2">
        <div className="flex flex-col gap-11">
            <Link to="/" className="flex gap-3 items-center">
                <img 
                    src="/assets/images/logo-text.png"
                    alt="Logo"
                    width={170}
                    height={36}
                />
            </Link>

            <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                <img 
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                alt="profile" 
                className="h-14 w-14 rounded-full"
                />
                <div className='flex flex-col'>
                    <p className="body-bold">
                        {user.name}
                    </p>
                    <p className="text-[14px] font-normal leading-[140%] text-light-3">
                        @{user.username}
                    </p>                    
                </div>
            </Link>
            <ul className='flex flex-col gap-6'>
                {sidebarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <li className={`rounded-lg base-medium hover:bg-primary-500 transition group ${isActive && 'bg-primary-500'}`}
                        key={link.label}>
                            <NavLink to={link.route} className="group flex gap-4 items-center p-4">
                                <img 
                                    src={link.imgURL}
                                    alt={link.label}
                                    className={`group-hover:invert group-hover:brightness-0 ${isActive && 'invert brightness-0 transition'}`}
                                />
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
         <Button variant="ghost"  className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-white! cursor-pointer" onClick={() => signOut()}>
            <img 
                src="/assets/icons/logout.svg"
                alt="logout"
            />
            <p className='text-[14px] font-medium leading-[140%] lg:text-[16px] lg:font-medium lg:leading-[140%]'>Logout</p>
        </Button>
    </nav>
  )
}

export default LeftSidebar