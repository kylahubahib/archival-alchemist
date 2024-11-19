import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ManuscriptComment = ({ manuscriptId }) => {
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Laravel Echo
    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.REACT_APP_PUSHER_KEY,
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            forceTLS: true,
        });

        // Subscribe to the manuscript-specific channel
        echo.channel(`manuscript.${manuscriptId}`)
            .listen('CommentAdded', (event) => {
                setComments((prevComments) => [event.comment, ...prevComments]);
            });

        // Cleanup Echo on unmount
        return () => {
            echo.leaveChannel(`manuscript.${manuscriptId}`);
        };
    }, [manuscriptId]);

    // Fetch comments when the component mounts
useEffect(() => {
    axios
        .get(`/api/comments/${manuscriptId}`)
        .then((response) => {
            if (response.data && Array.isArray(response.data)) {
                setComments(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        })
        .catch((error) => console.error('Error fetching comments:', error));

    const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_KEY,
        cluster: process.env.REACT_APP_PUSHER_CLUSTER,
        forceTLS: true,
    });

    echo.channel('manuscript.' + manuscriptId)
        .listen('CommentAdded', (event) => {
            setComments((prevComments) => [event.comment, ...prevComments]);
        });

    return () => {
        echo.leaveChannel('manuscript.' + manuscriptId);
    };
}, [manuscriptId]);

    // Handle adding a new comment or reply
    const handleAddComment = () => {
        if (!newComment) return;
        setIsLoading(true);

        axios
            .post('/api/comments', {
                manuscript_id: manuscriptId,
                content: newComment,
                parent_id: replyingTo,
            })
            .then((response) => {
                if (replyingTo) {
                    // Update parent comment with new reply
                    setComments((prevComments) =>
                        prevComments.map((comment) =>
                            comment.id === replyingTo
                                ? { ...comment, replies: [...comment.replies, response.data] }
                                : comment
                        )
                    );
                } else {
                    setComments((prevComments) => [response.data, ...prevComments]);
                }
                setNewComment('');
                setReplyingTo(null);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
                setIsLoading(false);
            });
    };

    // Close comment form
    const handleSlideCloseToRight = () => {
        setIsFormVisible(false);
    };

    return (
        <div className="flex justify-end items-center">
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className="w-1/2 bg-white rounded-lg p-6 shadow-2xl"
                        style={{ position: 'absolute', top: 0, right: 0, height: '100vh' }}
                    >
                        <div className="relative h-full flex flex-col justify-center items-center">
                            <Button
                                onClick={handleSlideCloseToRight}
                                className="absolute top-3 left-6 bg-transparent text-black"
                            >
                                Close
                            </Button>

                            <h2 className="text-xl font-bold mb-6 text-gray-600">Comments Section</h2>

                            <Textarea
                                placeholder={
                                    replyingTo
                                        ? `Replying to comment #${replyingTo}...`
                                        : 'Write your comment here...'
                                }
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={4}
                                className="w-full mb-4"
                            />

                            <Button
                                onClick={handleAddComment}
                                disabled={isLoading}
                                className="w-full mt-4 bg-blue-500 text-white"
                            >
                                {isLoading ? 'Posting...' : replyingTo ? 'Reply' : 'Add Comment'}
                            </Button>

                            <div className="w-full mt-6 overflow-y-auto" style={{ maxHeight: '40vh' }}>
                                {comments.length > 0 ? (
                                    <ul>
                                        {comments.map((comment) => (
                                            <li key={comment.id} className="mb-4 border-b pb-2">
                                                <p>{comment.content}</p>
                                                <small className="text-gray-500">
                                                    {new Date(comment.created_at).toLocaleString()}
                                                </small>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setReplyingTo(comment.id)}
                                                    className="text-blue-500 mt-2"
                                                >
                                                    Reply
                                                </Button>
                                                {comment.replies?.length > 0 && (
                                                    <ul className="mt-4 ml-4 border-l pl-4">
                                                        {comment.replies.map((reply) => (
                                                            <li key={reply.id} className="mb-2">
                                                                <p>{reply.content}</p>
                                                                <small className="text-gray-500">
                                                                    {new Date(reply.created_at).toLocaleString()}
                                                                </small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManuscriptComment;
