import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaComment } from 'react-icons/fa';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';

const PostDetailModal = ({ isOpen, onClose, post }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post?.id) {
      fetchComments(post.id); // Pass post.id here
    }
  }, [isOpen, post?.id]);

  const fetchComments = async (postId) => {  // Accept postId as a parameter
    setIsLoading(true);
    try {
      const response = await axios.get(`/forum-comments/${postId}`); // Use postId
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (newComment) => {
    try {
      const response = await axios.post('/forum-comments', {
        forum_post_id: post.id, // Use post.id
        user_id: '01a', // Replace with dynamic logged-in user ID
        comment: newComment.text,
      });
      const savedComment = response.data;
      setComments((prevComments) => [...prevComments, savedComment]);
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Could not save the comment. Please try again.');
    }
  };

  const customNoComment = () => (
    <div className="text-gray-500 text-center mt-4">
      No comments yet. Be the first to comment!
    </div>
  );

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen p-6 mt-5">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* User Info and Tags */}
        <div className="flex items-center mb-4 mt-5">
          <img
            src={post.user?.user_pic || 'https://ui-avatars.com/api/?name=User&background=random'} // Fallback to default avatar
            alt={`${post.user?.name}'s profile`}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800 ml-2">
              {post.user?.name || 'User'}
            </div>
            <div className="text-sm text-gray-500">{post.timePassed}</div>
          </div>
          <div className="flex space-x-2">
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>

        {/* Post Body */}
        <p className="text-gray-600 mb-6 leading-relaxed">{post.body}</p>

        <p className="text-gray-600 font-thin mb-6 leading-relaxed">{post.body}</p>

        {/* Views and Comments Count */}
        <div className="flex items-center text-gray-500 text-sm mb-6 space-x-4">
          <div className="flex items-center space-x-1">
            <FaEye />
            <span>{post.viewCount} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment />
            <span>{comments.length} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-4">
          <CommentSection
            currentUser={{
              currentUserId: '01a', // Replace with actual logged-in user ID
              currentUserImg:
                'https://ui-avatars.com/api/?name=User&background=random', // Replace with actual user avatar
              currentUserProfile: '/user-profile',
              currentUserFullName: 'Current User', // Replace with dynamically fetched full name
            }}
            commentData={comments.map((comment) => ({
              userId: comment.user.id,
              comId: comment.id,
              fullName: comment.user.name,
              avatarUrl: comment.user.avatar || 'https://ui-avatars.com/api/?name=User&background=random', // Default if avatar is missing
              text: comment.comment,
              replies: comment.replies || [],
            }))}
            onSubmitAction={handleCommentSubmit}
            customNoComment={customNoComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
