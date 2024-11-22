import { useState, useEffect } from 'react';
import axios from 'axios';

// Get the CSRF token from the meta tag in the HTML head
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Set the CSRF token as a default header for axios
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

const ToggleComments = ({manuscripts, isOpen, toggleSidebar }) => {
    const [comments, setComments] = useState([
        { id: 1, text: 'This is a comment.', replies: ['Great post!', 'Interesting perspective.'] },
        { id: 2, text: 'Here is another comment.', replies: ['Thanks for sharing!', 'I agree with this.'] },
        { id: 3, text: 'Great post!', replies: ['I have a question about this topic.'] },
        { id: 4, text: 'Interesting perspective.', replies: ['This is something I didn’t consider.'] },
        { id: 5, text: 'Thanks for sharing!', replies: [] },
        { id: 6, text: 'I have a question about this topic.', replies: [] },
    ]);

    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState([]);

    console.log("This are the props passed in Togglecomments:", manuscripts);
    console.log("This is the chosen one:", manuscripts.man_doc_title)

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                manuscript_id: manuscripts.id, // Example ID from your state
                parent_id: null,  // Add parent ID if this is a reply
            };

            try {
                const response = await axios.post('/comments', commentData, {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken, // Ensure the CSRF token is sent with the request
                    },
                });
                console.log('Comment added successfully:', response.data);
                // Handle success, like updating the comments list
                setComments([...comments, response.data]);
                setNewComment('');
            } catch (error) {
                console.error('Error submitting comment:', error.response);
                // Handle error (e.g., alert the user or display the error message)
            }
        }
    };

    const handleReplySubmit = (commentId) => {
        if (replyText.trim()) {
            setComments(
                comments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, replies: [...comment.replies, replyText] }
                        : comment
                )
            );
            setReplyText('');
            setActiveCommentId(null); // Close the reply textarea
        }
    };

    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleToggleReplies = (commentId) => {
        if (expandedReplies.includes(commentId)) {
            setExpandedReplies(expandedReplies.filter(id => id !== commentId)); // Hide replies
        } else {
            setExpandedReplies([...expandedReplies, commentId]); // Show replies
        }
    };

    const displayedComments = isExpanded ? comments : comments.slice(0, 3); // Display only first 3 comments if not expanded

    return (
        <div
            className={`fixed right-0 top-12 h-full bg-slate-200 text-gray-500 transition-all duration-300 ease-in-out ${isOpen ? 'w-1/2' : 'w-0'}`}
        >
            {/* Two-column layout */}
            <div className="flex h-full">
                {/* Left column (with button) */}
                <div className="w-12 bg-slate-300 flex items-center justify-center">
                    <button
                        onClick={toggleSidebar}
                        className="bg-gray-400 text-white p-3 rounded-full hover:bg-slate-400 focus:outline-none shadow-md transform transition-all duration-300 ease-in-out hover:scale-110"
                    >
                        <span className="text-2xl font-bold">×</span>
                    </button>
                </div>

                {/* Vertical line divider with shadow */}
                <div className="w-px bg-white shadow-md h-full"></div>

                {/* Right column (for the comment content) */}
                {isOpen && (
                    <div className="flex-1 p-6 overflow-y-auto h-full">
                        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                        <p className="text-base ">Book Title ⮚ <span className="text-lg font-bold">{manuscripts.man_doc_title}</span></p>
                        <p className="text-sm pt-2">Here you can share your thoughts or ask questions about this book!🙌</p>
                        <textarea
                            className="w-full mt-4 p-2 rounded-md"
                            placeholder="Write your comment here..."
                            rows="4"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            onClick={handleCommentSubmit}

                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Add Comment
                        </button>

                        {/* Displaying comments */}
                        <div className="mt-6">
                            {displayedComments.map((comment) => (
                                <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <p className="text-gray-800">{comment.text}</p>

                                    {/* Reply Button */}
                                    <button
                                        onClick={() => setActiveCommentId(comment.id)}
                                        className="mt-2 text-sm text-blue-500"
                                    >
                                        Reply
                                    </button>

                                    {/* Toggle Replies */}
                                    <button
                                        onClick={() => handleToggleReplies(comment.id)}
                                        className="mt-2 text-sm text-blue-500 ml-2"
                                    >
                                        {expandedReplies.includes(comment.id) ? 'Hide Replies' : 'View Replies'}
                                    </button>

                                    {/* Show replies if expanded */}
                                    {expandedReplies.includes(comment.id) && (
                                        <div className="mt-4 pl-6">
                                            {comment.replies.map((reply, index) => (
                                                <div key={index} className="bg-gray-200 p-3 rounded-md mb-2">
                                                    <p className="text-gray-700">{reply}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply input */}
                                    {activeCommentId === comment.id && (
                                        <div className="mt-4">
                                            <textarea
                                                className="w-full p-2 rounded-md"
                                                placeholder="Write your reply..."
                                                rows="3"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleReplySubmit(comment.id)}
                                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* See All / See Less button */}
                        <button
                            onClick={handleToggleExpanded}
                            className="mt-4 text-blue-500"
                        >
                            {isExpanded ? 'See Less' : 'View All Comments'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToggleComments;
