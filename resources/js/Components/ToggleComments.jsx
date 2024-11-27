import { useState, useEffect } from 'react';
import axios from 'axios';

// Get the CSRF token from the meta tag in the HTML head
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Set the CSRF token as a default header for axios
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

const ToggleComments = ({ manuscripts, man_id, man_doc_title,  isOpen, toggleSidebar }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [repliesText, setRepliesText] = useState({});  // New state for individual replies
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState([]);
    const [fetchError, setFetchError] = useState(false);

    console.log("This are the props passed in Togglecomments:", manuscripts);
    console.log("This is the chosen one:", manuscripts.man_doc_title)

    console.log("Second: This is the chosen one:", man_id)
    console.log("Second Title: This is the chosen one:", man_doc_title)

    
    // Fetch comments from the API
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/fetch-comments/${man_id}`);
                console.log("Retrieved comments from API:", response.data);

                // Set the comments if valid data is received
                setComments(Array.isArray(response.data.comments) ? response.data.comments : []);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setFetchError(true);
            }
        };

        if (man_id) {
            fetchComments();
        }
    }, [man_id]);

    // Submit a new comment
    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                manuscript_id: man_id,
                parent_id: null, // No parent ID for a main comment
            };

            try {
                const response = await axios.post('/comments', commentData, {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken, // Ensure CSRF token is passed
                    },
                });
                console.log('Comment added successfully:', response.data);
                setComments([...comments, response.data]); // Update the comments list
                setNewComment('');
            } catch (error) {
                console.error('Error submitting comment:', error.response);
            }
        }
    };

    // Submit a reply to a comment
    const handleReplySubmit = async (commentId) => {
        if (repliesText[commentId]?.trim()) {
            const replyData = {
                content: repliesText[commentId], // Use the reply text for the specific comment
                manuscript_id: man_id,
                parent_id: commentId, // Set the parent ID for the reply
            };

            try {
                const response = await axios.post('/comments', replyData);
                console.log('Reply added successfully:', response.data);
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, replies: [...comment.replies, response.data] }
                            : comment
                    )
                );
                setRepliesText((prev) => ({ ...prev, [commentId]: '' })); // Clear the reply text for that comment
                setActiveCommentId(null);
            } catch (error) {
                console.error('Error submitting reply:', error.response);
            }
        }
    };

    // Toggle expanded comments (show all or first 3)
    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Toggle replies visibility for a specific comment
    const handleToggleReplies = (commentId) => {
        if (expandedReplies.includes(commentId)) {
            setExpandedReplies(expandedReplies.filter(id => id !== commentId)); // Hide replies
        } else {
            setExpandedReplies([...expandedReplies, commentId]); // Show replies
        }
    };

    // Limit comments to the first 3 if not expanded
    const displayedComments = isExpanded ? comments : comments.slice(0, 3);

    return (
        <div
            className={`fixed right-0 top-12 h-full bg-slate-200 text-gray-500 transition-all duration-300 ease-in-out ${isOpen ? 'w-1/2' : 'w-0'}`}
        >
            <div className="flex h-full">
                <div className="w-12 bg-slate-300 flex items-center justify-center">
                    <button
                        onClick={toggleSidebar}
                        className="bg-gray-400 text-white p-3 rounded-full hover:bg-slate-400 focus:outline-none shadow-md transform transition-all duration-300 ease-in-out hover:scale-110"
                    >
                        <span className="text-2xl font-bold">×</span>
                    </button>
                </div>

                <div className="w-px bg-white shadow-md h-full"></div>

                {isOpen && (
                    <div className="flex-1 p-6 overflow-y-auto h-full mb-20">
                        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                        <p className="text-base">Book Title ⮚ <span className="text-lg font-bold">{man_doc_title}</span></p>
                        <p className="text-sm pt-2">Share your thoughts or ask questions about this book! 🙌</p>
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
                        <div>
                        <button
                            onClick={handleToggleExpanded}
                            className="mt-4 text-blue-500"
                        >
                            {comments.length === 0
                                ? `Comments 0`
                                : isExpanded
                                ? 'See Less'
                                : 'View All Comments'}
                        </button>
                        </div>
                        <div className="mt-6">
                            {displayedComments.map((comment) => (
                                <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <p className="text-gray-800">{comment.content}</p>

                                    <button
                                        onClick={() => setActiveCommentId(comment.id)}
                                        className="mt-2 text-sm text-blue-500"
                                    >
                                        Reply
                                    </button>

                                    <button
                                        onClick={() => handleToggleReplies(comment.id)}
                                        className="mt-2 text-sm text-blue-500 ml-2"
                                    >
                                        {expandedReplies.includes(comment.id) ? 'Hide Replies' : 'View Replies'}
                                    </button>

                                    {expandedReplies.includes(comment.id) && (
                                        <div className="mt-4 pl-6">
                                            {comment.replies && comment.replies.length > 0 ? (
                                                comment.replies.map((reply) => (
                                                    <div key={reply.id} className="bg-gray-200 p-3 rounded-md mb-2">
                                                        <p className="text-gray-700">{reply.content}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No replies yet.</p>
                                            )}
                                        </div>
                                    )}

                                    {activeCommentId === comment.id && (
                                        <div className="mt-4">
                                            <textarea
                                                className="w-full p-2 rounded-md"
                                                placeholder="Write your reply..."
                                                rows="3"
                                                value={repliesText[comment.id] || ''}  // Use specific reply text for this comment
                                                onChange={(e) => setRepliesText({ ...repliesText, [comment.id]: e.target.value })}
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

                    </div>
                )}
            </div>
        </div>
    );
};

export default ToggleComments;
