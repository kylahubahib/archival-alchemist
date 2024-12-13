import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEye, FaComment, FaTrash, FaFlag, FaEdit, FaReply, FaEllipsisH } from 'react-icons/fa';
import { Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';

const PostDetailModal = ({ isOpen, onClose, post, loggedInUser, onUpdateCommentCount }) => {
 const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState({}); // To control the visibility of options
  const optionsRef = useRef(null); // Reference for the options menu

  
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

  // Submit a new comment or reply
  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        '/forum-comments',
        {
          forum_post_id: post.id,
          comment: newComment,
          parent_id: replyingTo?.id || null,
        },
        {
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
        }
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
      {
        headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content },
      }
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



  // Delete a comment
  const handleDeleteComment = async (id) => {
    try {
      const response = await axios.delete(`/forum-comments/${id}`, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
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

    return comments.map((comment) => (
      <div key={comment.id} className={`ml-${depth * 4} p-4 border-b border-gray-200`}>
        <div className="flex items-start space-x-4">
          <img
            src={comment.user?.avatar || '/default-avatar.png'}
            alt={comment.user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">{comment.user?.name || 'Unknown User'}</span>
              <span className="text-gray-500">{comment.created_at}</span>
            </div>

            <div className="mt-1 text-base text-gray-800">{comment.comment}</div>

            

            {/* Action Buttons */}
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <button
                onClick={() => setReplyingTo(comment)}
                className="flex items-center space-x-1 hover:text-blue-500"
              >
                <FaReply />
                <span>Reply</span>
              </button>

              {/* Three-dot menu for options */}
              <Dropdown>
                <DropdownTrigger>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => toggleOptions(comment.id)}
                  >
                    <FaEllipsisH />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Actions">
                  <DropdownItem  onClick={() => {setEditingComment(comment); setNewComment(comment.comment);
                    }}>
                    Edit
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDeleteComment(comment.id)} key="delete" className="text-danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Recursive rendering of replies */}
        {comment.replies && renderComments(comment.replies, depth + 1)}
      </div>
    ));
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
            src={`http://127.0.0.1:8000/${post.user?.user_pic || 'default-avatar.jpg'}`}
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

        {/* New Comment Section */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Share your thoughts..."
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={editingComment ? handleEditCommentSubmit : handleCommentSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {editingComment ? 'Save Changes' : 'Post Comment'}
            </button>
          </div>
        </div>

        {/* Render Comments */}
        <div>{renderComments(comments)}</div>
      </div>
    </div>
  );
};

export default PostDetailModal;
