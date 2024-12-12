import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaComment, FaTrash, FaFlag } from 'react-icons/fa';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import { Chip } from '@nextui-org/react';

const PostDetailModal = ({ isOpen, onClose, post, loggedInUser, onUpdateCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments from the database or localStorage
  const fetchComments = async (postId) => {
    try {
      console.log('Fetching comments from server...');
      setIsLoading(true);

      const response = await axios.get(`/forum-comments/${postId}`);
      console.log('API Response:', response.data);

      const commentArray = Array.isArray(response.data.comments) ? response.data.comments : [];

      const fetchedComments = commentArray.map((comment) => ({
        comId: comment.id.toString(),
        userId: comment.user?.id || 'unknown',
        fullName: comment.user?.name || 'Anonymous',
        avatarUrl:
        `http://127.0.0.1:8000/${comment.user?.user_pic}` ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'Anonymous')}&background=random`,
        text: comment.comment?.toString() || '',
        replies: Array.isArray(comment.replies)
          ? comment.replies.map((reply) => ({
              comId: reply.id.toString(),
              userId: reply.user?.id || 'unknown',
              fullName: reply.user?.name || 'Anonymous',
              avatarUrl:
               `http://127.0.0.1:8000/${reply.user?.user_pic}` ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user?.name || 'Anonymous')}&background=random`,
              text: reply.comment?.toString() || '',
            }))
          : [], // Ensure replies is always an array
      }));

      setComments(fetchedComments);

      // Notify parent of comment count
      if (onUpdateCommentCount) {
        onUpdateCommentCount(postId, fetchedComments.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (data) => {
    const { comIdToDelete } = data;
  
    try {
      // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await axios.delete(`/forum-comments/${comIdToDelete}`, {
        // headers: { 'X-CSRF-TOKEN': csrfToken },
      });
  
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comId !== comIdToDelete)
      );
  
      // Update the comment count in the parent component
      if (onUpdateCommentCount) {
        onUpdateCommentCount(post.id, comments.length - 1);
      }
  
      console.log('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };


  const handleEditComment = async (data) => {
    const { comId, text } = data;

    try {
      const response = await axios.put(`/forum-comments/${comId}/edit`, {
        comment: text,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comId === comId
            ? { ...comment, text: response.data.comment.comment }
            : comment
        )
      );

      alert('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

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

  const handleCommentSubmit = async (newComment) => {
    try {
      const response = await axios.post('/forum-comments', {
        forum_post_id: post.id,
        comment: newComment.text,
      });

      const newCommentData = {
        comId: response.data.comment.id.toString(),
        userId: response.data.comment.user_id,
        fullName: response.data.comment.user?.name || loggedInUser.name,
        avatarUrl: `http://127.0.0.1:8000/${response.data.comment.user?.user_pic}` || `http://127.0.0.1:8000/${loggedInUser.user_pic}`,
        text: response.data.comment.comment,
        replies: [],
      };

      setComments((prev) => [...prev, newCommentData]);

      if (onUpdateCommentCount) {
        onUpdateCommentCount(post.id, comments.length + 1);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const redirectToLogin = () => {
    alert('Redirect to login');
    window.location.href = '/login';
  }


  const handleReplySubmit = async (data) => {
    // Existing implementation
  };

  useEffect(() => {
    if (isOpen && post?.id) {
      fetchComments(post.id);
    }
  }, [isOpen, post?.id]);

  const renderCommentActions = (commentId, userId) => (
    <div className="flex space-x-2 text-sm text-gray-500 font-normal">
      {loggedInUser?.id === userId && (
        <button
          onClick={() => handleDeleteComment({ comIdToDelete: commentId })}
          className="flex items-center space-x-1 hover:text-red-500"
        >
          <FaTrash />
          <span>Delete</span>
        </button>
      )}
      <button
        onClick={() => handleReportComment(commentId)}
        className="flex items-center space-x-1 hover:text-yellow-500"
      >
        <FaFlag />
        <span>Report</span>
      </button>
    </div>
  );
  if (!isOpen || !post) return null;

  

  return (
    <div className="inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full p-5 mt-5">
        <button
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex items-center mb-4 mt-5">
          <img
            src={`http://127.0.0.1:8000/${post.user?.user_pic}`|| 'https://ui-avatars.com/api/?name=User&background=random'}
            alt={`${post.user?.name}'s profile`}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="font-semibold text-2xl text-gray-800 ml-2">
              {post.user?.name || 'User'}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-gray-700 mb-4">{post.title}</h2>

        <div className="flex space-x-2 my-2">
          {post.tags?.map((tag, index) => (
            <Chip key={`${tag.id || index}-${tag.name}`} color="primary" variant="flat">
              {tag.name}
            </Chip>
          ))}
        </div>

        <p className="text-gray-600 mb-6 text-base font-normal">{post.body}</p>

        <div className="flex items-center text-gray-600 mb-6">
          <div className="flex items-center mr-4 text-base font-normal">
            <FaEye className="mr-1" />
            {post.viewCount || 0} Views
          </div>
          <div className="flex items-center text-base font-normal">
            <FaComment className="mr-1" />
            {comments.length} Comments
          </div>
        </div>

        <div>
          
        <CommentSection
  currentUser={loggedInUser?.id ? {
    currentUserId: loggedInUser?.id || '01a',
    currentUserImg:
    `http://127.0.0.1:8000/${loggedInUser?.user_pic}`
       || 'https://ui-avatars.com/api/?name=User&background=random',
    currentUserProfile: 'Current User',
    currentUserFullName: loggedInUser?.name || 'Current User',
  } : null}
  logIn={{
    onLogin: () => { window.location.href = '/login'; },
    onSignUp: () => { window.location.href = '/register'; } // Add this to handle sign-up redirection
  }}
  commentData={comments}
  onSubmitAction={handleCommentSubmit}
  onReplyAction={handleReplySubmit}
  onDeleteAction={handleDeleteComment}
  onEditAction={handleEditComment}
  customNoComment={() => <div>No comments yet. Be the first to comment!</div>}
/>


        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
