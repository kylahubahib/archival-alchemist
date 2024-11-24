import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import Modal from '@/Components/Modal';
import { MdMessage } from 'react-icons/md';
import Repository from './Partials/Repository';
import Posts from './Partials/Posts';
import SubscriptionForm from './Partials/SubscriptionForm';
import { Accordion, AccordionItem, User } from '@nextui-org/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import ChooseARole from './Partials/ChooseARole';
import Manuscript from '@/Components/Manuscript';



export default function UserProfile({ user}) {
    const [activeTab, setActiveTab] = useState('posts');
    const [profilePic, setProfilePic] = useState(auth.user.user_pic);
    const [manuscripts, setManuscript] = useState(null);

    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
            searchProfile={true}
        >
            <Head title="Profile" />

            <div className="py-8 -z-0">
                <div className="max-w-full mx-8 my-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md "
                     style={{ maxWidth: 'calc(100% - 16px)', transition: 'all 0.3s ease-in-out' }}>
                    <div className="flex items-start pt-8">
                        <div className="relative">
                            <div className="flex items-center flex-col space-y-2">
                                <div className="relative w-20 h-20">
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-2xl font-semibold">{user.user.name}</h3>
                            <p className="text-xs font-medium text-gray-800">Has been a member since {format(new Date(auth.user.created_at), 'yyyy')}</p>
                            <p className="text-sm text-gray-600 mt-2">{user.user.user_aboutme}</p>
                            <div className="mt-4">
                                <a href={route('chatify')} className="text-gray-600 hover:text-gray-800 flex items-center">
                                    <MdMessage size={32} className="mr-2" />
                                    <span>Message</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-300 h-px my-4"></div>

                    <div className="flex justify-center space-x-6 mt-4">
                        <button
                            className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'posts' ? 'border-b-2 border-gray-800' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        {auth.user.user_type !== 'general_user' && <button
                            className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'repository' ? 'border-b-2 border-gray-800' : ''}`}
                            onClick={() => setActiveTab('repository')}
                        >
                            Repository
                        </button>}
                    </div>
                </div>

                <div className="my-4">
                    {activeTab === 'accountSettings' && (
                        <>

                        <div className="mx-auto sm:px-6 lg:px-10 space-y-4">

                            {auth.user.user_type === 'general_user' && <div className=" p-4 bg-white shadow sm:rounded-lg m-2">
                                <ChooseARole className="max-w-xl" user={auth.user}/>
                            </div>
                            }

                            <div className=" p-4 bg-white shadow sm:rounded-lg m-2">
                                <SubscriptionForm className="max-w-xl" user={auth.user}/>
                            </div>

                            <Accordion variant='splitted'>
                                <AccordionItem key="1" aria-label="Profile Information" title="Profile Information">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Password Information" title="Password Information">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </AccordionItem>
                                <AccordionItem key="4" aria-label="Account Deletio" title="Account Deletion">
                                    <DeleteUserForm className="max-w-xl" />
                                </AccordionItem>
                            </Accordion>
                        </div>

                        </>
                    )}
                </div>

                <div className="my-4">
                    {activeTab === 'posts' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">


                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <Posts className="max-w-xl" />
                            </div>

                        </div>
                    )}
                </div>

                <div className="my-4">
                    {activeTab === 'repository' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">


                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg"> 
                                <div className="min-h-screen max-w-xl"><Manuscript manuscripts={manuscripts} /></div>;
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
