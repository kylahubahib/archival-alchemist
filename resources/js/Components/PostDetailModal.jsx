// src/components/PostDetailModal.jsx
import React from 'react';

const PostDetailModal = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
        <button
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-6">
          {/* User's profile picture and name */}
          <div className="flex items-center mb-4">
            <img 
              src={post.userProfilePicture} // Adjust according to your post data structure
              alt={`${post.userName}'s profile`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-semibold text-gray-800">{post.userName}</div>
              <div className="text-sm text-gray-500">{post.timePassed}</div> {/* Adjust time passed according to your post data structure */}
            </div>
            <div className="ml-auto text-sm text-gray-500">
              {post.tags && post.tags.length > 0 ? post.tags.map(tag => (
                <span key={tag.id} className="inline-block bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{tag.name}</span>
              )) : 'No tags'}
            </div>
          </div>

          {/* Post Title */}
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          
          {/* Post Body */}
          <p className="text-gray-700 mb-6">{post.body}</p>
          
          {/* Views and Comments Count */}
          <div className="text-sm text-gray-500 mb-4">
            <span>Views: {post.viewCount}</span> | 
            <span> Comments: {post.comments}</span>
          </div>
        </div>
        
        {/* Comment Section */}
        <div className="p-6 border-t mt-4">
          <p className="text-gray-500">Comment Section</p>
          {/* Placeholder for actual comment functionality */}
          {/* Add your existing comment section component or code here */}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
