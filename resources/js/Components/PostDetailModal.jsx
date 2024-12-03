import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaComment, FaTrash, FaFlag } from 'react-icons/fa';  // Added icons for delete and report
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css'
import { Chip } from '@nextui-org/react';

const PostDetailModal = ({ isOpen, onClose, post, loggedInUser }) => {
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

        // Map the comments with their replies
        const fetchedComments = commentArray.map((comment) => ({
          comId: comment.id.toString(),
          userId: comment.user?.id || 'unknown',
          fullName: comment.user?.name || 'Anonymous',
          avatarUrl: 
            comment.user?.user_pic || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'Anonymous')}&background=random`,
          text: comment.comment?.toString() || '', 
          replies: comment.replies?.map((reply) => ({
            comId: reply.id.toString(),
            userId: reply.user?.id || 'unknown',
            fullName: reply.user?.name || 'Anonymous',
            avatarUrl: 
              reply.user?.user_pic || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user?.name || 'Anonymous')}&background=random`,
            text: reply.comment?.toString() || '', 
          })) || [],  // If there are no replies, an empty array is used
        }));

        setComments(fetchedComments);

      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteComment = async (data) => {
      const { comIdToDelete, parentOfDeleteId } = data;
    
      console.log('Comment Id to delete:', comIdToDelete);
      console.log('Parent of Delete Id:', parentOfDeleteId);
    
      const id = comIdToDelete;
    
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        await axios.delete(`/forum-comments/${id}`, {headers: {'X-CSRF-TOKEN': csrfToken}});
    
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comId !== id)
        );
    
        console.log('Comment deleted successfully!');
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    };
    

    
    // HANDLE EDIT
    const handleEditComment = async (data) => {
      const { comId, text, parentOfEditedCommentId } = data; 

      console.log(data);

      const id = comId;

      console.log('Edit Id ', id);

      try {
        const response = await axios.put(`/forum-comments/${id}/edit`, {
          comment: text, 
        });
    
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comId === id
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
    

    // Handle report comment
    // const handleReportComment = async (commentId) => {
    //   try {
    //     const response = await axios.post(`/report-comment/${commentId}`);
    //     console.log('Comment reported:', response.data);
    //     alert('Comment has been reported.');
    //   } catch (error) {
    //     console.error('Error reporting comment:', error);
    //     alert('Failed to report comment. Please try again.');
    //   }
    // };

    // Submit a new comment
    const handleCommentSubmit = async (newComment) => {

      console.log(newComment);
      const user = {
        id: loggedInUser.id, // Replace with dynamic user ID if available
        name: loggedInUser.name, // Replace with dynamic logged-in user's name
        avatar: loggedInUser.user_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent('Logged-in User Name')}&background=random`, // Fallback avatar
      };

      // Temporary comment for UI update
      const tempComment = {
        comId: `temp-${Date.now()}`,
        userId: user.id,
        fullName: user.name,
        avatarUrl: user.user_pic,
        text: newComment.text.toString(),
        replies: [],
      };

      // Optimistic UI: Add the temporary comment
      setComments((prev) => [...prev, tempComment]);


      try {
        const response = await axios.post('/forum-comments', {
          forum_post_id: post.id,
          comment: newComment.text,
        });

        const savedComment = {
          comId: response.data.comment.id.toString(),
          userId: response.data.comment.user_id,
          fullName: response.data.comment.user?.name || user.name,
          avatarUrl: response.data.comment.user?.user_pic || user.avatar,
          text: response.data.comment.comment,
          replies: [],
        };

        console.log('Saved Comments: ', savedComment);

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

    const handleReplySubmit = async (data) => {
       const { repliedToCommentId, parentOfRepliedCommentId, text } = data;
      
      console.log(repliedToCommentId)

      const tempReply = {
        comId: `temp-reply-${Date.now()}`,
        userId: loggedInUser.id,
        fullName: loggedInUser.name,
        avatarUrl: loggedInUser.user_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(loggedInUser.name)}&background=random`,
        text: text,
        replies: [],
      };

    
      try {
        // Ensure parent ID is correctly parsed for the backend
        const response = await axios.post('/forum-comments', {
          forum_post_id: post.id,
          comment: text,
          parent_id: parseInt(repliedToCommentId, 10) || null, // Convert to integer if it's a string
        });
    
        const savedReply = {
          comId: response.data.comment.id.toString(),
          userId: response.data.comment.user_id,
          fullName: response.data.comment.user.name || loggedInUser.name,
          avatarUrl: response.data.comment.user.user_pic || tempReply.avatarUrl,
          text: response.data.comment.comment,
          replies: [],
        };
    
        // Replace temporary reply with saved reply
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comId === repliedToCommentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.comId === tempReply.comId ? savedReply : reply
                  ),
                }
              : comment
          )
        );
      } catch (error) {
        console.error('Error saving reply:', error);
        alert('Failed to save reply. Please try again.');
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


    const renderCommentActions = (commentId, userId) => (
      <div className="flex space-x-2 text-sm text-gray-500 font-normal">
        {/* Delete button visible only to the comment owner */}
        {loggedInUser?.id === userId && (
          <button
            onClick={() => handleDeleteComment(commentId)}
            className="flex items-center space-x-1 hover:text-red-500"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        )}
        {/* Report button visible to all users */}
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
        <div className="relative w-full p-5 mt-5 ">
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
              <div className="font-semibold text-2xl text-gray-800 ml-2">{post.user?.name || 'User'}</div>
              <div className="text-sm text-gray-500">{post.timePassed}</div>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-gray-700 mb-4">{post.title}</h2>

          <div className="flex space-x-2 my-2">
              {post.tags?.map((tag, index) => (
                <Chip  key={`${tag.id || index}-${tag.name}`} color='primary' variant='flat'> {tag.name}</Chip>
              ))}
            </div>


          <p className="text-gray-600 mb-6 text-base font-normal">{post.body}</p>

          <div className="flex items-center text-gray-600 mb-6">
            {/* View Count */}
            <div className="flex items-center mr-4 text-base font-normal">
              <FaEye className="mr-1" />
              {post.viewCount || 0} Views
            </div>
            {/* Comment */}
            <div className="flex items-center text-base font-normal">
              <FaComment className="mr-1" />
              {comments.length} Comments
            </div>
          </div>

          {/* COMMENT SECTION */}
          <div>
          <CommentSection
            currentUser={{
              currentUserId: loggedInUser?.id || '01a',
              currentUserImg: loggedInUser?.user_pic || 'https://ui-avatars.com/api/?name=User&background=random',
              currentUserProfile: 'Current User',
              currentUserFullName: loggedInUser?.name || 'Current User',
            }}
            logIn={{
              loginLink: '/login',
              signupLink: '/signup',
            }}
            commentData={comments}
            onSubmitAction={handleCommentSubmit}
            onReplyAction={handleReplySubmit}
            customNoComment={customNoComment}
            onDeleteAction={handleDeleteComment}
            onEditAction={handleEditComment}
            titleStyle={{ color: '#4b5563', fontSize: '20px'}}
            submitBtnStyle={{ border: '1px solid #294996', backgroundColor: '#294996', fontStyle: 'normal' }}
          />

          </div>
        </div>
      </div>
    );
};

export default PostDetailModal;

