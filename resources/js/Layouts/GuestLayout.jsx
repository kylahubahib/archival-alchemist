import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';

export default function GuestLayout({ user, children }) {
    return (
        <div className="min-h-screen bg-customlightBlue flex flex-col">
        <nav className="bg-transparent border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <h1 className="text-customBlue font-bold text-lg">Archival Alchemist</h1>
                    <div className="flex space-x-8 sm:space-x-10">
                        <NavLink href={route('home')} active={route().current('home')} className="text-customBlue">Home</NavLink>
                        <NavLink href={route('library')} className="text-customBlue">Library</NavLink>
                        <NavLink href={route('forum')} className="text-customBlue">Forum</NavLink>
                        <NavLink href={route('tour')} className="text-customBlue">Tour</NavLink>
                        <NavLink href={route('pricing')} className="text-customBlue">Pricing</NavLink>
                    </div>
                    <div className="flex space-x-8 sm:space-x-10">
                    {user ? (
                                <>
                                <NavLink to='/savedlist' active={route().current('savedlist')} className="text-customBlue">My Account</NavLink>
                                </>
                            ) : (
                                <>
                                <NavLink href={route('login')} active={route().current('login')} className="text-customBlue">Login</NavLink>
                                <NavLink href={route('register')} active={route().current('register')} className="text-customBlue">Register</NavLink>
                                </>
                            )}
                    </div>
                </div>
            </div>
        </nav>

        {children}
        </div>
    );
}
