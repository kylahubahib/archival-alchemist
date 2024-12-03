import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaComment, FaTrash, FaFlag } from 'react-icons/fa';  // Added icons for delete and report
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';

const PostDetailModal = ({ isOpen, onClose, post, loggedInUser }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Key for localStorage
  const localStorageKey = `comments_forum_post_${post?.id}`;

  // Fetch comments from the database or localStorage
  const fetchComments = async (postId) => {
    try {
      console.log('Fetching comments from server...');
      setIsLoading(true);
      const response = await axios.get(`/forum-comments/${postId}`);
      console.log('API Response:', response.data); // Log the full response
      
      const commentArray = Array.isArray(response.data.comments)
        ? response.data.comments
        : [];
      const fetchedComments = commentArray.map((comment) => ({
        comId: comment.id.toString(),
        userId: comment.user?.id || 'unknown',
        fullName: comment.user?.name || 'Anonymous',
        avatarUrl: 
          comment.user?.user_pic || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'Anonymous')}&background=random`,
        text: comment.comment?.toString() || '', // Convert to string
        replies: comment.replies || [],
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/forum-comments/${commentId}`);
      console.log('Comment deleted:', response.data);
      setComments(comments.filter(comment => comment.comId !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  // Handle report comment
  const handleReportComment = async (commentId) => {
    try {
      const response = await axios.post(`/report-comment/${commentId}`);
      console.log('Comment reported:', response.data);
      alert('Comment has been reported.');
    } catch (error) {
      console.error('Error reporting comment:', error);
      alert('Failed to report comment. Please try again.');
    }
  };

  // Submit a new comment
  const handleCommentSubmit = async (newComment) => {
    const loggedInUser = {
      id: '01a', // Replace with dynamic user ID if available
      name: 'Logged-in User Name', // Replace with dynamic logged-in user's name
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Logged-in User Name')}&background=random`, // Fallback avatar
    };
  
    // Temporary comment for UI update
    const tempComment = {
      comId: `temp-${Date.now()}`,
      userId: loggedInUser.id,
      fullName: loggedInUser.name,
      avatarUrl: loggedInUser.avatar,
      text: newComment.text.toString(),
      replies: [],
    };
  
    // Optimistic UI: Add the temporary comment
    setComments((prev) => [...prev, tempComment]);
  
    try {
      const response = await axios.post('/forum-comments', {
        forum_post_id: post.id,
        user_id: loggedInUser.id,
        comment: newComment.text,
      });
  
      const savedComment = {
        comId: response.data.comment.id.toString(),
        userId: response.data.comment.user_id,
        fullName: response.data.comment.user?.name || loggedInUser.name,
        avatarUrl: response.data.comment.user?.user_pic || loggedInUser.avatar,
        text: response.data.comment.comment.toString(),
        replies: [],
      };
  
      // Update state with the saved comment, replacing the temporary comment
      setComments((prev) =>
        prev.map((comment) =>
          comment.comId === tempComment.comId ? savedComment : comment
        )
      );
    } catch (error) {
      console.error('Error saving comment:', error);
  
      // Remove the temporary comment if the API call fails
      setComments((prev) =>
        prev.filter((comment) => comment.comId !== tempComment.comId)
      );
      alert('Failed to save comment. Please try again.');
    }
  };
  

  // Load comments from the database when the modal is opened
  useEffect(() => {
    if (isOpen && post?.id) {
      fetchComments(post.id);
    }
  }, [isOpen, post?.id]);

  const customNoComment = () => (
    <div className="text-gray-500 text-center mt-4">
      No comments yet. Be the first to comment!
    </div>
  );

  // Render actions based on the comment's owner and logged-in user
  const renderCommentActions = (comment) => (
    <div className="flex items-center justify-end mt-2 space-x-3">
      {/* Only show Delete option for the comment owner */}
      {comment.userId === loggedInUser.id && (
        <button
          onClick={() => handleDeleteComment(comment.comId)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash className="mr-2" /> Delete
        </button>
      )}
      
      {/* Show Report option for others */}
      {comment.userId !== loggedInUser.id && (
        <button
          onClick={() => handleReportComment(comment.comId)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <FaFlag className="mr-2" /> Report
        </button>
      )}
    </div>
  );

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen p-6 mt-5">
        <button
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex items-center mb-4 mt-5">
          <img
            src={post.user?.user_pic || 'https://ui-avatars.com/api/?name=User&background=random'}
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
            {post.tags?.map((tag, index) => (
              <span
                key={`${tag.id || index}-${tag.name}`}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h2>

        <p className="text-gray-700 mb-6">{post.body}</p>

        <div className="flex items-center text-gray-600 mb-6">
          <div className="flex items-center mr-4">
            <FaEye className="mr-1" />
            {post.viewCount || 0} Views
          </div>
          <div className="flex items-center">
            <FaComment className="mr-1" />
            {comments.length} Comments
          </div>
        </div>  

        <CommentSection
          currentUser={{
            currentUserId: loggedInUser?.id || '01a',
            currentUserImg: post?.user?.user_pic || 'https://ui-avatars.com/api/?name=User&background=random',  // Updated here
            currentUserProfile: 'Current User',
            currentUserEmail: 'test@example.com',
          }}
          comments={comments}
          onCommentSubmit={handleCommentSubmit}
          isLoading={isLoading}
          noComments={customNoComment}
          renderCommentActions={renderCommentActions}
        />
      </div>
    </div>
  );
};

export default PostDetailModal;
