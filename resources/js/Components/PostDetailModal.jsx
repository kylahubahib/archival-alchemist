import React from 'react';
import { FaEye, FaComment } from 'react-icons/fa';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';

const PostDetailModal = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  const handleAddComment = (newComment) => {
    console.log('New Comment Added:', newComment);
    // Add logic to send new comment to backend or update post data locally.
  };

  const customNoComment = () => (
    <div className="text-gray-500 text-center mt-4">No comments yet. Be the first to comment!</div>
  );

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
            src={post.user?.user_pic}
            alt={`${post.user?.name}'s profile`}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="font-light text-gray-800 ml-2 text-medium">{post.user?.name}</div>
            <div className="text-sm text-gray-500">{post.timePassed}</div>
          </div>
          <div className="flex space-x-2 mr-10">
            {post.tags && post.tags.length > 0
              ? post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-0.5 rounded"
                  >
                    {tag.name}
                  </span>
                ))
              : ''}
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h2>

        {/* Post Body */}
        <p className="text-gray-600 font-thin mb-6 leading-relaxed">{post.body}</p>

        {/* Views and Comments Count */}
        <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
          <div className="flex items-center space-x-1">
            <FaEye />
            <span>{post.viewCount} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment />
            <span>{post.comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-4">
          <CommentSection
            currentUser={{
              currentUserId: '01a', // Replace with actual user ID
              currentUserImg: 'https://ui-avatars.com/api/name=User&background=random', // Replace with user avatar
              currentUserProfile: '/user-profile', // Replace with user profile link
              currentUserFullName: 'Current User', // Replace with actual user name
            }}
            commentData={post.commentsData || []} // Pass existing comments here
            onSubmitAction={(newComment) => handleAddComment(newComment)}
            customNoComment={() => customNoComment()}
            logIn={{
              onLogin: () => alert('Please log in to comment!'),
              signUpLink: '/register',
            }}
            placeholder="Write your comment..."
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
