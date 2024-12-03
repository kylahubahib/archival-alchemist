import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import UserPost from './UserPost';
import { MdMessage } from 'react-icons/md';

export default function UserProfile({ auth, selectedUser }) {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{selectedUser.name}'s Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-8 -z-0">
                <div className="max-w-full mx-8 my-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
                    <div className="flex items-start pt-8">
                        <div className="relative">
                            <div className="flex items-center flex-col space-y-2">
                                <div className="relative w-20 h-20">
                                    <img
                                        src= {`http://127.0.0.1:8000/${selectedUser?.user_pic}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex-1 space-y-2">
                            <h3 className="text-2xl font-semibold">{selectedUser.name}</h3>
                            <p className="text-xs font-medium text-gray-800">Joined in {format(new Date(selectedUser.created_at), 'yyyy')}</p>
                            <p className="text-sm text-gray-600 mt-2">{selectedUser.user_aboutme}</p>
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
                            <button
                                className={`bg-white text-gray-600 hover:text-gray-800 py-2 px-4 border-0 ${activeTab === 'repository' ? 'border-b-2 border-gray-800' : ''}`}
                                onClick={() => setActiveTab('repository')}
                            >
                                Repository
                            </button>
                    </div>
                </div>

                <div className="my-4">
                    {activeTab === 'posts' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            {/* Posts Content */}
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <UserPost posts={selectedUser.forum_post}/>
                            </div>
                        </div>
                    )}
                </div>

                <div className="my-4">
                    {activeTab === 'repository' && (
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            {/* Repository Content */}
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                {/* Display repository here */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
