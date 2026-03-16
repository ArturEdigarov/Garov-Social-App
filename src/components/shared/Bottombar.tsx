import { Link, useLocation } from 'react-router-dom'; 
import { bottombarLinks } from "@/constants"

const Bottombar = () => {
    const { pathname } = useLocation();
  return (
    <section className="z-50 flex justify-between w-full sticky bottom-0 rounded-t-4xl bg-dark-2 px-5 py-4 md:hidden">
        {bottombarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
                    <Link to={link.route} className={`flex flex-center flex-col gap-1 p-2 transition group ${isActive && 'bg-primary-500 rounded-[10px]'}`}
                key={link.label}>
                        <img 
                            src={link.imgURL}
                            alt={link.label}
                            className={`m-auto  ${isActive && 'invert brightness-0 transition'}`}
                            width={16}
                            height={16}
                        />
                        <p className='text-[10px] font-medium leading-[140%] text-light-2'>{link.label}</p>
                    </Link>
            )
        })}
    </section>
  )
}

export default Bottombar