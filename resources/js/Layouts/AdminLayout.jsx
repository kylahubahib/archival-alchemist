import { BsQuestionCircleFill } from "react-icons/bs"; 
import { MdSpaceDashboard, MdSubscriptions } from "react-icons/md";
import { CgOrganisation } from "react-icons/cg";
import { FaScroll, FaFileContract, FaFlag, FaUsers, FaWrench, FaUserSecret, FaUserTie, FaUserGraduate, FaGraduationCap, FaBook, FaFacebookMessenger, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa"; 

import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SearchBar from '@/Components/SearchBar';
import Sidebar, { SidebarItem, SidebarTitle } from '@/Components/Sidebar';

export default function AdminLayout({ auth, user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-customlightBlue flex  overflow-auto">

        {user.user_type == 'superadmin' ? (
             //SIDEBAR FOR THE SUPER ADMIN
            <Sidebar color="customBlue" borderRadius="none" margin="0">
                <SidebarItem icon={<MdSpaceDashboard size={20} className="text-white group-hover:text-gray-600" />} text="Dashboard" color="white" marginBottom="5" to="/dashboard" />
                <SidebarTitle title="MANAGEMENT"></SidebarTitle>
                <SidebarItem icon={<FaUsers size={20} className="text-white group-hover:text-gray-600" />} text="Users" color="white" to="/users" />
                <SidebarItem icon={<FaBook size={20} className="text-white group-hover:text-gray-600" />} text="Archives" color="white" to="/archives" />
                <SidebarItem icon={<MdSubscriptions size={20} className="text-white group-hover:text-gray-600" />} text="Subscription & Billing" color="white" to="/subscription-billing"/>
                <SidebarItem icon={<FaFlag size={20} className="text-white group-hover:text-gray-600" />} text="User Reports" color="white" to="/user-reports" />
                <SidebarItem icon={<FaEnvelopeOpen size={20} className="text-white group-hover:text-gray-600" />} text="User Feedbacks" color="white" to="/user-feedbacks" />

                <SidebarTitle title="CUSTOMIZATION"></SidebarTitle>
                <SidebarItem icon={<FaFileContract size={20} className="text-white group-hover:text-gray-600" />} text="Terms & Conditions" color="white" to="/manage-terms-and-conditions" />
                <SidebarItem icon={<FaScroll size={20} className="text-white group-hover:text-gray-600" />} text="Subscription Plans" color="white" to="/subscription-plans" />
                <SidebarItem icon={<BsQuestionCircleFill size={20} className="text-white group-hover:text-gray-600" />} text="FAQs" color="white" to="/faq" />
                <SidebarItem icon={<FaWrench size={20} className="text-white group-hover:text-gray-600" />} text="Advanced" color="white" to="/advanced" />
            </Sidebar>
        ) : (
            
            //SIDEBAR FOR THE INSTITUTION ADMIN
            <Sidebar color="customBlue" borderRadius="none" margin="0">
            
                <SidebarTitle title="MANAGEMENT"></SidebarTitle>
                <SidebarItem icon={<FaUserGraduate size={20} className="text-white group-hover:text-gray-600" />} text="Students" color="white" to="/institution/students"/>
                <SidebarItem icon={<FaUserTie size={20} className="text-white group-hover:text-gray-600" />} text="Faculties" color="white" to="/institution/faculties" />
                <SidebarItem icon={<FaUserSecret size={20} className="text-white group-hover:text-gray-600" />} text="Co-admins" color="white" to="/institution/coadmins" alert />
                <SidebarItem icon={<CgOrganisation size={20} className="text-white group-hover:text-gray-600" />} text="Departments" color="white" to="/institution/departments" />
                <SidebarItem icon={<FaGraduationCap size={20} className="text-white group-hover:text-gray-600" />} text="Courses" color="white" to="/institution/courses" />
                <SidebarItem icon={<FaBook size={20} className="text-white group-hover:text-gray-600" />} text="Archives" color="white" to="/institution/archives" />
                <SidebarItem icon={<MdSubscriptions size={20} className="text-white group-hover:text-gray-600" />} text="Subscription & Billing" color="white" to="/institution/subscription-billing" />
                <SidebarItem icon={<FaFacebookMessenger size={20} className="text-white group-hover:text-gray-600" />} text="Chat with us" color="white" to="/institution/students"/>
                <SidebarItem icon={<FaEnvelope size={20} className="text-white group-hover:text-gray-600" />} text="Give Feedback" color="white" to="/institution/students" />
        </Sidebar>
        )}

       

        <div className="flex-1">
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                            <SearchBar></SearchBar>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                         {/* This part here is for responsive layout. Not yet configured*/}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                 {/* This part here is for responsive layout. Not yet configured*/}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main>{children}</main>
        </div>
    </div>
    );
}
