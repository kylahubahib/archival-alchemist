import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaBookmark, FaEye, FaComment, FaFileDownload } from 'react-icons/fa';

export default function SavedList({ auth }) {
    const [views, setViews] = useState(123); // Example number of views
    const [showComments, setShowComments] = useState(false); // State to manage comment visibility
    const [comments, setComments] = useState([
        { user: 'Commenter 1', text: 'This is a comment.' },
        { user: 'Commenter 2', text: 'This is another comment.' },
        { user: 'Commenter 3', text: 'This is yet another comment.' },
    ]); // Example comments
    const [isBookmarked, setIsBookmarked] = useState(false); // State to track bookmark status
    const [bookmarks, setBookmarks] = useState([]); // State to track bookmarked manuscripts

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Here you would also update the bookmarks state based on the current manuscript
        // For this example, we're just toggling the boolean
    };

    // Determine if there are comments or views
    const hasComments = comments.length > 0;
    const hasViews = views > 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Favorites</h2>}
        >
            <Head title="Favorites" />

            <section className="w-full mx-auto my-4">
                {bookmarks.length === 0 ? (
                    <div className="max-w-7xl mx-auto bg-white shadow-lg flex justify-center h-screen items-center shadow-sm sm:rounded-lg sticky">
                        <FaBookmark size={50} className="text-gray-500" />
                        <p className="text-gray-500 mt-2">Favorite Manuscript Capstone will be added here.</p>

                    </div>

                ) : (
                    <div className="w-full bg-white shadow-lg flex">
                        <div className="rounded w-40 h-full bg-gray-200 flex items-center justify-center">
                            <img
                                className="rounded w-36 h-46"
                                src="https://via.placeholder.com/150" // Placeholder image
                                alt="Book"
                            />
                        </div>
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-bold text-gray-900">Transforming Capstone Into Discoverable Knowledge</h2>
                            <p className="text-gray-700 mt-1">Author/s: John Doe</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-gray-200 px-2 py-1 text-sm rounded">Fiction</span>
                                <span className="bg-gray-200 px-2 py-1 text-sm rounded">Adventure</span>
                                <span className="bg-gray-200 px-2 py-1 text-sm rounded">Bestseller</span>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                                <div className={`flex items-center ${hasViews ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`}>
                                    <FaEye size={20} />
                                    <span className="ml-1">{views}</span>
                                </div>
                                <div className={`flex items-center ${hasComments ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`} onClick={toggleComments}>
                                    <FaComment size={20} />
                                    <span className="ml-1">
                                        {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'No comments yet'}
                                    </span>
                                </div>
                                <button className={`text-gray-600 hover:text-blue-500 ${isBookmarked ? 'text-blue-500' : ''}`} onClick={toggleBookmark}>
                                    <FaBookmark size={20} />
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                    <FaFileDownload size={20} />
                                </button>
                            </div>
                            {showComments && (
                                <div className="mt-4 space-y-4">
                                    {comments.map((comment, index) => (
                                        <div key={index} className="border p-2 rounded">
                                            <p className="font-bold">{comment.user}</p>
                                            <p>{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
