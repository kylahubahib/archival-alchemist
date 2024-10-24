import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import React from 'react';

export default function GuestLayout({ user, children }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    

    return (
        <div className="min-h-screen bg-customlightBlue flex flex-col">
            <nav className="bg-customlightBlue sticky top-0 z-50 select-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-customBlue font-bold text-lg">Archival Alchemist</h1>
                        <div className="hidden md:flex space-x-4 sm:space-x-6">
                            <NavLink href={route('home')} active={route().current('home')} className="text-customBlue">Home</NavLink>
                            <NavLink href={route('library')} active={route().current('library')} className="text-customBlue">Library</NavLink>
                            <NavLink href={route('forum')} active={route().current('forum')} className="text-customBlue">Forum</NavLink>
                            <NavLink href={route('tour')} active={route().current('tour')} className="text-customBlue">Tour</NavLink>
                            <NavLink href={route('pricing')} active={route().current('pricing')} className="text-customBlue">Pricing</NavLink>
                        </div>
                        <div className="hidden md:flex space-x-4 sm:space-x-6">
                            {user ? (
                                <>
                                    {user.user_type === 'superadmin' ? (
                                        <NavLink to={'/dashboard'} active={route().current('dashboard')} className="text-customBlue">My Account</NavLink>
                                    ) : user.user_type === 'admin' ? (
                                        <NavLink to={'/institution/students'} active={route().current('institution-students')} className="text-customBlue">My Account</NavLink>
                                    ) : (
                                        <NavLink to={'/savedlist'} active={route().current('savedlist')} className="text-customBlue">My Account</NavLink>
                                    )}
                                </>
                            ) : (
                                <>
                                    <NavLink href={route('login')} active={route().current('login')} className="text-customBlue">Login</NavLink>
                                    <NavLink href={route('register')} active={route().current('register')} className="text-customBlue">Register</NavLink>
                                </>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button
                                className="text-customBlue focus:outline-none"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* For mobile view */}
                {showMobileMenu && (
                    <div className="md:hidden">
                        <div className="absolute z-10 backdrop-blur-md min-w-full">
                            <ul className="space-y-4 p-5">
                                <li><NavLink href={route('home')} active={route().current('home')} className="text-customBlue block">Home</NavLink></li>
                                <li><NavLink href={route('library')} active={route().current('library')} className="text-customBlue block">Library</NavLink></li>
                                <li><NavLink href={route('forum')} active={route().current('forum')} className="text-customBlue block">Forum</NavLink></li>
                                <li><NavLink href={route('tour')} active={route().current('tour')} className="text-customBlue block">Tour</NavLink></li>
                                <li><NavLink href={route('pricing')} active={route().current('pricing')} className="text-customBlue block">Pricing</NavLink></li>
                                {user ? (
                                    <>
                                        {user.user_type === 'superadmin' ? (
                                            <li><NavLink to={'/dashboard'} active={route().current('dashboard')} className="text-customBlue block">My Account</NavLink></li>
                                        ) : user.user_type === 'admin' ? (
                                            <li><NavLink to={'/institution/students'} active={route().current('institution-students')} className="text-customBlue block">My Account</NavLink></li>
                                        ) : (
                                            <li><NavLink to={'/savedlist'} active={route().current('savedlist')} className="text-customBlue block">My Account</NavLink></li>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <li><NavLink href={route('login')} active={route().current('login')} className="text-customBlue block">Login</NavLink></li>
                                        <li><NavLink href={route('register')} active={route().current('register')} className="text-customBlue block">Register</NavLink></li>
                                    </>
                                )}

                            </ul>
                        </div>
                    </div>
                )}
            </nav>

            {children}
        </div>
    );
}
