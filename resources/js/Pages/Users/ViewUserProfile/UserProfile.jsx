import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import UserPost from './UserPost';
import { MdMessage } from 'react-icons/md';
import UserRepository from './UserRepository';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDistanceToNow } from 'date-fns';
import ReportModal from '@/Components/ReportModal';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
    Button, Input, Textarea, 
    Spinner
  } from '@nextui-org/react';
import PostDetailModal from '@/Components/PostDetailModal';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export default function UserProfile({ auth, selectedUser }) {
    const [activeTab, setActiveTab] = useState('posts');
    const [openPost, setOpenPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState(selectedUser.forum_post);
    const [commentCounts, setCommentCounts] = useState({});
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const formatPostDate = (dateString) => {
        const date = dayjs.utc(dateString).tz(dayjs.tz.guess()); // Adjust to local timezone
        return date.fromNow(); // Display as relative time, e.g., "5 minutes ago"
    };

    const closePost = () => {
        setOpenPost(false);
        setSelectedPost(null);
        setIsReportModalOpen(false);
    }

    const handleUpdateCommentCount = (postId, count) => {
        setCommentCounts((prevCounts) => ({
            ...prevCounts,
            [postId]: count,
        }));
    };

        
    const handleTitleClick = async (postId) => {
        try {
        const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`);
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const postDetails = await response.json(); // Parse JSON from response
        const updatedViewCount = postDetails.viewCount;
    
        // Update the view count in the posts array
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, viewCount: updatedViewCount } : post
        ));
    
        setSelectedPost(postDetails); 
        setOpenPost(true);
        } catch (error) {
        console.error("Error fetching post details:", error);
        }
    };

    
    const handleReportPost = (postId) => {
        setSelectedPost(postId);
        setIsReportModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{selectedUser.name}'s Profile</h2>}
        >
            <Head title="Profile" />

            { !openPost ? (
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
                                {/* <UserPost posts={selectedUser.forum_post}/> */}

                            <div>
                                <div className="flex flex-col items-center -mt-21 min-h-screen">
                                {Array.isArray(posts) && posts.length > 0 ? (
                                    posts.map(post => {
                                    // Date formatting with error handling
                                    let formattedDate;
                                    try {
                                        const date = new Date(post.created_at);
                                        formattedDate = !isNaN(date) ? `${formatDistanceToNow(date)} ago` : "Invalid date";
                                    } catch (error) {
                                        formattedDate = "Date error";
                                    }

                                    console.log(post.tags); // Check structure and values of post.tags


                            return (
                                
                                <div className="border-b pb-4 mb-4 w-3/4 relative flex flex-col mt-10 " key={post.id}>
                                <div className="flex items-start space-x-4">
                                <img
                                    // src={post.user?.user_pic ? {post.user.user_pic} : "https://via.placeholder.com/150"}
                                    src={`http://127.0.0.1:8000/${post.user?.user_pic}`}
                                    alt={post.user ? `${post.user.name}'s avatar` : 'Avatar placeholder'}
                                    className="w-16 h-16 mr-4 rounded-full"
                                    />


                                    <div className="flex-grow ">

                                    <p className="font-semibold">{post.user?.name || "Anonymous"}</p>

                                    <h3 className="text-xl text-black font-normal cursor-pointer mt-2 hover:text-gray-700" onClick={() => handleTitleClick(post.id)} >
                                            {post.title}
                                    </h3>

                                    {/* Body Preview */}
                                    <p className="mt-2 text-gray-700 text-medium font-extralight truncate max-w-xl">{post.body}</p>

                                    {/* Time Passed, View, and Comment Counts */}
                                    <div className="text-gray-500 text-sm mt-1 flex items-center">
                                        <span className="mr-4">{formatPostDate(post.created_at)}</span>
                                        <span className="mr-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        {post.viewCount || 0}
                                        </span>
                                        <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        {commentCounts[post.id] || post.comments }
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div className="text-sm text-gray-500 ml-5 mt-2">
                                        Tags:
                                        <span className="ml-2">
                                        {Array.isArray(post.tags) && post.tags.length > 0 ? (
                                            post.tags.map(tag => (
                                            <span
                                                key={tag.id}
                                                className="inline-block bg-blue-800 text-white text-s font-semibold rounded-full px-3 py-1 mr-2"
                                            >
                                                {tag.name || "Unnamed Tag"}
                                            </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">No tags available</span>
                                        )}
                                        </span>
                                    </div>
                                    </div>
                                </div>

                                {/* Dropdown for actions */}
                                    <div className="absolute right-0 top-2">
                                    <Dropdown>
                                        <DropdownTrigger>
                                        <Button variant="light" size="lg">...</Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                        <DropdownItem onClick={() =>  handleReportPost(post.id)}>Report</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    </div>
                                </div>
                            );
                            })
                                ) : (
                                    <p className="text-gray-500 mt-20">No discussions found.</p>
                                )}
                                </div>
                            </div>

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
                                <UserRepository auth={auth} manuscript={selectedUser?.manuscripts} user={auth.user}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            ) : (
                <div className="py-8 -z-0">
                    <div className="max-w-full mx-8 my-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
                        <PostDetailModal
                            isOpen={openPost}
                            onClose={closePost}
                            post={selectedPost}
                            loggedInUser={auth.user}
                            onUpdateCommentCount={handleUpdateCommentCount}

                        /> 
                    </div>
                </div>
            )

            }

            <ReportModal isOpen={isReportModalOpen} onClose={closePost} reportLocation={'Forum'} reportedID={selectedPost}/> 
        </AuthenticatedLayout>
    );
}
