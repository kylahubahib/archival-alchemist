import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEye, FaComment, FaTrash, FaFlag, FaEdit, FaReply, FaEllipsisH } from 'react-icons/fa';
import { Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Button } from '@nextui-org/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEye } from '@fortawesome/free-solid-svg-icons';  
import { Modal, ModalBody, ModalFooter, Alert } from '@nextui-org/react';
// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const PostDetailModal = ({ isOpen, onClose, post, loggedInUser, onUpdateCommentCount }) => {
 const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState({}); // To control the visibility of options
  const optionsRef = useRef(null); // Reference for the options menu
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false); // Track alert visibility


  

  const formatPostDate = (dateString) => {
    const date = dayjs.utc(dateString).tz(dayjs.tz.guess()); // Convert to local timezone
    return date.fromNow(); // Display as relative time, e.g., "5 minutes ago"
  };
  
  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/forum-comments/${post.id}`);
      console.log('Fetched Comments:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

   // Modal Close Handler
   const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };


  
  // Submit a new comment or reply
  const handleCommentSubmit = async () => {
    if (!loggedInUser) {
      setShowAlert(true); // Show alert if user is not logged in
      return;
    }
    
    try {
      const response = await axios.post(
        '/forum-comments',
        {
          forum_post_id: post.id,
          comment: newComment,
          parent_id: replyingTo?.id || null,
        },
        
      );

      const newCommentData = response.data;

      // Function to add a reply to the correct comment recursively
      const addReplyToComments = (comments, parentId, reply) => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            };
          }

          if (comment.replies) {
            return {
              ...comment,
              replies: addReplyToComments(comment.replies, parentId, reply),
            };
          }

          return comment;
        });
      };

      // If replying to a specific comment or reply
      if (replyingTo) {
        setComments((prev) => addReplyToComments(prev, replyingTo.id, newCommentData));
      } else {
        // If it's a new top-level comment
        setComments((prev) => [...prev, newCommentData]);
      }

      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
    }
  };

  // Edit an existing comment
 // Edit an existing comment or reply
const handleEditCommentSubmit = async () => {
  try {
    const response = await axios.put(
      `/forum-comments/${editingComment.id}`,
      { comment: newComment },
      
    );

    // Recursively update the specific comment or reply in the comments array
    const updateCommentInTree = (comments, updatedComment) => {
      return comments.map((comment) => {
        if (comment.id === updatedComment.id) {
          // Update the specific comment
          return { ...comment, comment: updatedComment.comment };
        }

        // Recursively check and update replies
        if (comment.replies) {
          return { ...comment, replies: updateCommentInTree(comment.replies, updatedComment) };
        }

        return comment;
      });
    };

    // Update comments with the edited comment
    setComments((prev) => updateCommentInTree(prev, response.data));

    setEditingComment(null); // Reset editing state
    setNewComment(""); // Clear input field
  } catch (error) {
    console.error("Error editing comment:", error);
  }
};

// Count comments including replies recursively
const countComments = (comments) => {
  let count = comments.length; // Start with the main comments count

  // Recursively count replies
  comments.forEach((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      count += countComments(comment.replies); // Add the replies count
    }
  });

  return count;
};

// After fetching comments or updating them, calculate the total count
useEffect(() => {
  if (comments.length > 0) {
    const totalCommentCount = countComments(comments); // Get total count
    onUpdateCommentCount(totalCommentCount); // Pass the updated count to the parent
  }
  
}, [comments]);




  // Delete a comment
  const handleDeleteComment = async (id) => {
    try {
      const response = await axios.delete(`/forum-comments/${id}`, {
       
      });

      console.log('Delete Response:', response.data);

      // Update the state to remove the deleted comment or reply
      const removeCommentById = (comments, idToRemove) => {
        return comments
          .map((comment) => {
            if (comment.id === idToRemove) {
              return null; // Remove the comment
            }

            // Recursively check and update replies
            if (comment.replies) {
              return { ...comment, replies: removeCommentById(comment.replies, idToRemove) };
            }

            return comment;
          })
          .filter(Boolean); // Remove `null` values from the array
      };

      setComments((prev) => removeCommentById(prev, id));
    } catch (error) {
      console.error('Error deleting comment:', error.response?.data || error.message);
    }
  };


  
  const renderComments = (comments, depth = 0) => {
    if (!comments || comments.length === 0) return null;

    return comments.map((comment) => {
      const isOwner = loggedInUser && loggedInUser.id === comment.user.id;

      return (
        <div key={comment.id} className={`ml-${depth * 4} p-4 border-b border-gray-200`}>
          <div className="flex items-start space-x-4">
            <img
              src={comment.user?.user_pic || '/default-avatar.png'}
              alt={comment.user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">{comment.user?.name || 'Unknown User'}</span>
                <span className="text-gray-500">{formatPostDate(comment.created_at)}</span>
              </div>

              <div className="mt-1 text-base text-gray-800">{comment.comment}</div>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <button
                  onClick={() => setReplyingTo(comment)}
                  className="flex items-center space-x-1 hover:text-blue-500"
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                  <span>Reply</span>
                </button>

                {/* Show options based on logged-in status */}
                {loggedInUser && (isOwner || loggedInUser.id === comment.user.id) ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingComment(comment);
                        setNewComment(comment.comment);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ) : (
                  loggedInUser && (
                    <button
                      onClick={() => handleReportComment(comment.id)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <FaFlag /> Report
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Recursive rendering of replies */}
          {comment.replies && renderComments(comment.replies, depth + 1)}
        </div>
      );
    });
  };

   // Render the alert when showAlert is true
   const renderAlert = () => {
    console.log("showAlert:", showAlert);  // Debugging
    if (!showAlert) return null;
    return (
      <Alert color="error" onClose={() => setShowAlert(false)} title="You must be logged in to post a comment!" className="nextui-alert mb-4" />
    );
    
  };
  
  // Close menu when clicking outside
 useEffect(() => {
  // Close the options menu if clicked outside
  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions({});
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);


  // Toggle the visibility of options (Edit/Delete/Reply) for each comment
  const toggleOptions = (commentId) => {
    setShowOptions((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // Toggle menu for the clicked comment
    }));
  };


  

  // Fetch comments when the modal is opened
  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen]);

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
          src={
            post.user?.user_pic && post.user.user_pic !== ''
              ? post.user.user_pic
              : 'https://ui-avatars.com/api/?name=User&background=random'
          }
          alt={post.user?.name ? `${post.user.name}'s avatar` : 'Avatar placeholder'}
          className="w-12 h-12 rounded-full mr-3"
        />






          <div className="flex-1">
            <div className="font-semibold text-2xl text-gray-800 ml-2">
              {post.user?.name || 'User'}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-gray-700 mb-4">{post.title}</h2>

        
        <p className="text-gray-600 mb-6 text-base font-normal">{post.body}</p>

        <div className="flex space-x-2 my-2 mb-8">
          {post.tags?.map((tag, index) => (
            <Chip key={`${tag.id || index}-${tag.name}`} color="primary" variant="flat">
              {tag.name}
            </Chip>
          ))}
        </div>

        <div className="flex items-center text-gray-600 mb-6">
          <div className="flex items-center text-base font-normal ">
          {/* Eye Icon */}
            <FontAwesomeIcon icon={faEye} />
            <span className='ml-2'>{post.viewCount || 0} Views</span>
          </div>
         
        </div>

     {/* Add New Comment */}
<div className="mt-6 drop-shadow-lg">
  <Input
    label={replyingTo 
      ? `Replying to ${replyingTo.user?.name || 'a comment'}...` 
      : 'Write your comment here...'}
    type="text"
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    classNames={{
      base: "max-w-fullh",
      mainWrapper: "h-full",
      input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
      inputWrapper: "h-full font-normal text-default-500",
  }}  />
  <div className="mt-3 flex justify-end space-x-4">
    {replyingTo && (
      <button
        onClick={() => setReplyingTo(null)}
        className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out "
      >
        Cancel Reply
      </button>
    )}
    <button
  onClick={editingComment ? handleEditCommentSubmit : handleCommentSubmit}
  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-large
             hover:from-purple-600 hover:to-blue-700
             focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2
             transform transition-all duration-500 ease-in-out hover:scale-105 hover:cursor-pointer mt-6 font-bold" 
   disabled={!newComment.trim()}
>
      {editingComment ? 'Save' : 'Submit'}
    </button>
  </div>
</div>

{renderAlert()}


<div className="mb-5 mt-6 flex items-center text-base font-extrabold">
  Comments
  <span className="ml-2 w-8 h-5 flex items-center justify-center bg-blue-500 text-white text-sm rounded-lg">
  {countComments(comments)}
  </span>
</div>


      
        {/* Render Comments */}
        <div>{renderComments(comments)}</div>

        
      </div>
    </div>
  );
};

export default PostDetailModal;
