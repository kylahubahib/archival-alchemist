import { BsQuestionCircleFill } from "react-icons/bs";
import { MdSpaceDashboard, MdSubscriptions } from "react-icons/md";
import { CgOrganisation } from "react-icons/cg";
import { FaScroll, FaFileContract, FaFlag, FaUsers, FaWrench, FaUserSecret, FaUserTie, FaUserGraduate, FaGraduationCap, FaBook, FaFacebookMessenger, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";

import { useEffect, useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SearchBar from '@/Components/SearchBar';
import Sidebar, { SidebarItem, SidebarSeparator, SidebarTitle } from '@/Components/Sidebar';
import GiveFeedbackModal from "@/Components/GiveFeedbackModal";
import ToastNotification from "@/Components/Toast";
import { FiBell } from "react-icons/fi";
import Echo from 'laravel-echo';

import { encodeAllParams } from "@/Components/Admins/Functions";

import SuperAdminNotification from "@/Components/Notifications/SuperAdminNotification";
import InsAdminNotification from "@/Components/Notifications/InsAdminNotification";
import { User } from "@nextui-org/react";
import { useForm } from "@inertiajs/react";
import PageHeader from "@/Components/Admins/PageHeader";

export default function AdminLayout({ user, header, children, university = '' }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { post } = useForm();

     // Remove the filterOpen item from local storage to reset its state
    // useEffect(() => {
    //     localStorage.removeItem('filterOpen');
    // }, []);


    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (

    <div className="min-h-screen bg-customlightBlue flex select-none">

        <div className="sm:block hidden">
        {user.user_type == 'superadmin' ? (
             //SIDEBAR FOR THE SUPER ADMIN
            <Sidebar color="customBlue" borderRadius="none" margin="0">
                <SidebarItem icon={<MdSpaceDashboard size={20} className="text-white group-hover:text-gray-600" />} text="Dashboard" color="white" to="/dashboard" />
                <SidebarTitle title="MANAGEMENT"></SidebarTitle>
                <SidebarItem icon={<FaUsers size={20} className="text-white group-hover:text-gray-600" />} text="Users" color="white" to="/users" />
                <SidebarItem icon={<FaBook size={20} className="text-white group-hover:text-gray-600" />} text="Archives" color="white" to="/archives" />
                <SidebarItem icon={<MdSubscriptions size={20} className="text-white group-hover:text-gray-600" />} text="User Subscriptions" color="white" to="/subscription-billing"/>
                <SidebarItem icon={<FaFlag size={20} className="text-white group-hover:text-gray-600" />} text="User Reports" color="white" to="/user-reports" />
                <SidebarItem icon={<FaEnvelopeOpen size={20} className="text-white group-hover:text-gray-600" />} text="User Feedbacks" color="white" to="/user-feedbacks" />

                <SidebarTitle title="CUSTOMIZATION"></SidebarTitle>
                <SidebarItem icon={<FaFileContract size={20} className="text-white group-hover:text-gray-600" />} text="Terms & Agreements" color="white" to="/manage-terms-and-conditions" />
                <SidebarItem icon={<FaScroll size={20} className="text-white group-hover:text-gray-600" />} text="Subscription Plans" color="white" to="/manage-subscription-plans" />
                <SidebarItem icon={<BsQuestionCircleFill size={20} className="text-white group-hover:text-gray-600" />} text="FAQs" color="white" to="/manage-faqs" />
                <SidebarItem icon={<FaWrench size={20} className="text-white group-hover:text-gray-600" />} text="Advanced" color="white" to="/advanced/forum" />
            </Sidebar>
        ) : (

            //SIDEBAR FOR THE INSTITUTION ADMIN
            <Sidebar color="customBlue" borderRadius="none" margin="0">

                <SidebarTitle title="MANAGEMENT"></SidebarTitle>
                <SidebarItem icon={<FaUserGraduate size={20} className="text-white group-hover:text-gray-600" />} text="Students" color="white" to="/institution/students"/>
                <SidebarItem icon={<FaUserTie size={20} className="text-white group-hover:text-gray-600" />} text="Faculties" color="white" to="/institution/faculties" />
                <SidebarItem icon={<FaUserSecret size={20} className="text-white group-hover:text-gray-600" />} text="Co-admins" color="white" to="/institution/coadmins" alert />
                <SidebarItem icon={<CgOrganisation size={20} className="text-white group-hover:text-gray-600" />} text="Departments" color="white" to="/institution/departments" />
                <SidebarItem icon={<FaGraduationCap size={20} className="text-white group-hover:text-gray-600" />} text="Sections" color="white" to="/institution/sections" />

                <SidebarItem icon={<FaBook size={20} className="text-white group-hover:text-gray-600" />} text="Archives" color="white" to="/institution/archives" />
                <SidebarItem icon={<MdSubscriptions size={20} className="text-white group-hover:text-gray-600" />} text="Subscription & Billing" color="white" to="/institution/subscription-billing" />

                <SidebarSeparator marginTop={'mt-[120px]'}/>

                <SidebarItem icon={<FaFacebookMessenger size={20} className="text-white group-hover:text-gray-600" />} text="Chat with us" color="white" to="https://m.me/432748959923780" externalLink/>
                <SidebarItem icon={<FaEnvelope size={20} className="text-white group-hover:text-gray-600" />} text="Give Feedback" color="white" onClick={openModal} isActiveModal={isModalOpen}/>
            </Sidebar>
        )}
        </div>

        <GiveFeedbackModal isOpen={isModalOpen} onClose={closeModal} />



        <div className="flex-1">

            <nav className="bg-white sticky top-0 shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex justify-between">
                        {user.user_type === 'institution_admin' &&
                        <div className="flex items-center">
                            <PageHeader className="uppercase">{university}</PageHeader>
                        </div>
                        }
                        <div></div>

                        <div className="flex">
                        <div className="flex items-center mx-3">
                            {/* <FiBell size={24} className="ml-3 text-gray-500" /> */}

                            {user.user_type === 'superadmin' ? (
                                    <SuperAdminNotification />
                                ) : (
                                    <InsAdminNotification user={user} />
                                )
                            }
                        </div>


                        <div className="hidden sm:flex sm:items-center sm:ml-5">
                            <div className=" relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                    <User
                                        color='primary'
                                        as="button"
                                        avatarProps={{
                                            className: "shadow shadow-white outline-[2.5px] outline-customBlue",
                                            src: `http://127.0.0.1:8000/${user?.user_pic}`
                                        }}
                                        className="transition-transform"
                                        description={user.email}
                                        name={user.name}
                                    />
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
                        {user.user_type == 'superadmin' ? (
                                    <>
                                    <ResponsiveNavLink href={route('dashboard.index')}>Dashboard</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('users')}>Users</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('archives')}>Archives</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('subscription-billing')}>User Subscriptions</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('user-reports.index')}>User Reports</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('user-feedbacks.index')}>User Feedbacks</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('manage-terms-and-conditions.index')}>Terms & Agreements</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('manage-subscription-plans.index')}>Subscription Plans</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('manage-faqs.index')}>FAQs</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('manage-forum-posts.index')}>Advanced</ResponsiveNavLink>
                                    </>
                            ) : (
                                    <>
                                    <ResponsiveNavLink href={route('institution-students')}>Students</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('institution-faculties')}>Faculties</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('institution-coadmins')}>Co-admins</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('manage-departments.index')}>Departments</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('institution-archives')}>Archives</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('institution-subscription-billing.index')}>Subscription & Billing</ResponsiveNavLink>
                                    <ResponsiveNavLink href="https://m.me/432748959923780" externalLink>Chat With Us</ResponsiveNavLink>
                                    <a onClick={openModal} className={`w-full flex font-medium items-start ps-3 pe-4 py-2 border-l-4 text-base focus:outline-none transition duration-150 ease-in-out
                                    text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300`}>
                                        Give Feedback
                                    </a>
                                    </>

                                )}
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

             {/* Main content */}
             <div>
                <main>{children}</main>
                <ToastNotification/>
            </div>

        </div>


    </div>
    );
}
