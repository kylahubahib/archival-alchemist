import { useState, useEffect } from 'react';
import axios from 'axios';

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const ToggleComments = ({ auth, manuscripts, man_id, man_doc_title, isOpen, toggleSidebar }) => {
    const [profilePic, setProfilePic] = useState(auth.user.user_pic);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [repliesText, setRepliesText] = useState({});
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState([]);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        console.log('SELECTED MANUSCRIPT: ', man_id);

        const fetchComments = async () => {
            try {
                const response = await axios.get(`/fetch-comments/${man_id}`);
                const commentsData = Array.isArray(response.data.comments) ? response.data.comments : [];
                setComments(commentsData);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setFetchError(true);
            }
        };

        if (man_id) fetchComments();
    }, [man_id]);

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                manuscript_id: man_id,
                parent_id: null,
            };

            try {
                const response = await axios.post('/comments', commentData);
                setComments([...comments, response.data]);
                setNewComment('');
            } catch (error) {
                console.error("Error submitting comment:", error);
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

    const handleToggleExpanded = () => setIsExpanded(!isExpanded);

    const handleToggleReplies = (commentId) => {
        setExpandedReplies((prev) =>
            prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
        );
    };

    const displayedComments = isExpanded ? comments : comments.slice(0, 3);

    return (
        <div
            className={`fixed right-0 top-12 h-full bg-slate-200 text-gray-500 transition-all duration-300 ease-in-out ${
                isOpen ? 'w-1/2' : 'w-0'
            }`}
        >
            <div className="flex h-full">
                <div className="w-12 bg-slate-300 flex items-center justify-center">
                    <button
                        onClick={toggleSidebar}
                        className="bg-gray-400 text-white p-3 rounded-full hover:bg-slate-400 focus:outline-none"
                    >
                        <span className="text-2xl font-bold">×</span>
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                    <p>
                        Book Title ⮚ <span className="font-bold">{man_doc_title}</span>
                    </p>
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
                        <button onClick={handleToggleExpanded} className="mt-4 text-blue-500">
                            {isExpanded ? "See Less" : `View All Comments (${comments.length})`}
                        </button>
                    </div>
                    <div className="mt-6">
                        {displayedComments.map((comment) => (
                            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src={
                                            comment.user_id === auth.user.id
                                                ? profilePic
                                                :   `http://127.0.0.1:8000/${comment.user?.user_pic}` || "/images/default_user_pic.png"
                                                // comment.user?.user_pic || "/images/default_user_pic.png"
                                        }
                                        alt="Profile Picture"
                                    />
                                    <span>
                                        {comment.user_id === auth.user.id ? "You" : comment.user?.name || "Unknown User"}
                                    </span>
                                </div>
                                <p className="text-gray-800">{comment.content}</p>
                                <button
                                    onClick={() => setActiveCommentId(comment.id)}
                                    className="text-sm text-blue-500 mt-2"
                                >
                                    Reply
                                </button>
                                <button
                                    onClick={() => handleToggleReplies(comment.id)}
                                    className="text-sm text-blue-500 mt-2 ml-2"
                                >
                                    {expandedReplies.includes(comment.id) ? "Hide Replies" : "View Replies"}
                                </button>
                                {expandedReplies.includes(comment.id) && (
                                    <div className="mt-4 pl-6">
                                        {comment.replies?.length > 0 ? (
                                            comment.replies.map((reply) => (
                                                <div key={reply.id} className="bg-gray-200 p-3 rounded-md mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            src={
                                                                reply.user_id === auth.user.id
                                                                    ? profilePic
                                                                    : reply.user?.user_pic || "/images/default_user_pic.png"
                                                            }
                                                            alt="Profile Picture"
                                                        />
                                                        <span>
                                                            {reply.user_id === auth.user.id
                                                                ? "You"
                                                                : reply.user?.name || "Unknown User"}
                                                        </span>
                                                    </div>
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
                                            value={repliesText[comment.id] || ""}
                                            onChange={(e) =>
                                                setRepliesText((prev) => ({
                                                    ...prev,
                                                    [comment.id]: e.target.value,
                                                }))
                                            }
                                        />
                                        <button
                                            onClick={() => handleReplySubmit(comment.id)}
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Submit Reply
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToggleComments;
