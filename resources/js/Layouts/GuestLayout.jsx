import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';

export default function GuestLayout({ auth, children }) {
    return (
        <div className="h-screen bg-customlightBlue flex flex-col">
            <nav className="bg-transparent border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-customBlue font-bold text-lg">Archival Alchemist</h1>
                        <div className="flex space-x-8 sm:space-x-10">
                            <NavLink href={route('home')} active={route().current('home')} className="text-customBlue">Home</NavLink>
                            <NavLink href="#" className="text-customBlue">Library</NavLink>
                            <NavLink href="#" className="text-customBlue">Forum</NavLink>
                            <NavLink href={route('tour')} className="text-customBlue">Tour</NavLink>
                            <NavLink href={route('pricing')} className="text-customBlue">Pricing</NavLink>
                        </div>
                        <div className="flex space-x-8 sm:space-x-10">
                        
                            <NavLink href={route('login')} active={route().current('login')} className="text-customBlue">Login</NavLink>
                            <NavLink href={route('register')} active={route().current('register')} className="text-customBlue">Register</NavLink>
                    
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-grow flex justify-center items-center">
                <div className="w-full max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
