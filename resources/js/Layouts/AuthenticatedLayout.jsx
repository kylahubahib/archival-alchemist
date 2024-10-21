import { RiMessengerLine } from "react-icons/ri";
import { BiEnvelope } from "react-icons/bi";
import { MdChatBubbleOutline, MdOutlineForum, MdOutlineLabel,  } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { BiBookBookmark, BiBookOpen } from "react-icons/bi";
import { FiBell } from "react-icons/fi";
import { useEffect, useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Sidebar, { SidebarItem, SidebarSeparator } from '@/Components/Sidebar';

import { FaCrown, FaEnvelope } from "react-icons/fa";
import GiveFeedbackModal from "@/Components/GiveFeedbackModal";
import ToastNotification, { showToast } from "@/Components/Toast";

export default function Authenticated({ user, children, newProfile = null }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isPremium, setIsPremium] = useState(user.is_premium);
    const [profilePic, setProfilePic] = useState(user.user_pic);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    // Debugging: log the user type to console
    ////console.log(user.user_type); // Add this line to debug

    useEffect(() => {
        if(newProfile != null){
            setProfilePic(newProfile)
        }
    });

    return (
        <div className="bg-customlightBlue min-h-screen flex flex-col">
         <div className="flex-1 flex">
            {/* Sidebar */}
            <Sidebar color="white" borderRadius="xl" margin="3">
                <SidebarItem icon={<BiBookBookmark size={20} />} text="Favorites" to="/savedlist" />
                <SidebarItem icon={<BiBookOpen size={20} />} text="Library" to="/library" />
                <SidebarItem icon={<MdOutlineForum size={20} />} text="Forum" to="/forum" />
                {/* <SidebarItem icon={<MdOutlineLabel size={20} />} text="Tags" to="/tags" /> */}
                {user.user_type === 'teacher' ? (
                    <SidebarItem icon={<SiGoogleclassroom size={20} />} text="Class" to="/teacherclass" />
                ) : (
                    <SidebarItem icon={<SiGoogleclassroom size={20} />} text="Class" to="/studentclass" />
                )}
                <SidebarItem icon={<MdChatBubbleOutline size={20} />} text="Inbox" to="/inbox" />
                <SidebarSeparator marginTop={80}/>

                {/* <SidebarItem icon={<FaCrown size={20} color="#FFD700" />} text="Subscription" to="/subscription" /> */}
                <SidebarItem icon={<RiMessengerLine size={20} color="#006AFF" />} text="Chat with us" to="https://m.me/432748959923780" externalLink/>
                <SidebarItem icon={<BiEnvelope size={20} color="#294996" />} text="Give Feedback" onClick={openModal} isActiveModal={isModalOpen}/>
            </Sidebar>

            <GiveFeedbackModal isOpen={isModalOpen} onClose={closeModal} />

            <div className="flex-1 flex flex-col">
                <nav className="bg-customBlue border-b rounded-xl m-3 sticky top-3 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                {/* <div className="shrink-0 flex items-center">
                                    <SearchBar />
                                </div> */}
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <button className="rounded-full py-1 px-6 bg-green-300 flex flex-row space-x-2">
                                    <span>{isPremium ? [<FaCrown size={20} color="#FFD700" />] : null}</span>
                                    <span>{user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1).toLowerCase()}</span>
                                </button>

                                <FiBell size={24} className="ml-3 text-white" />

                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="relative items-center px-0 py-0 border border-transparent text-sm leading-4 font-medium rounded-full h-10 w-10 flex justify-center text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <img src={profilePic} className="w-full h-full rounded-full object-cover" />

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
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route('library')} active={route().current('library')}>
                                Library
                            </ResponsiveNavLink>
                        </div>

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

                <div className="flex-1">
                <main>{children}</main>
                <ToastNotification/>
                </div>
            </div>
        </div>
    </div>
    );
}
