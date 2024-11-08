import React from 'react';
import { FaEye, FaComment } from 'react-icons/fa';

const PostDetailModal = ({ isOpen, onClose, post }) => {
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

        {/* User Info and Tags */}
        <div className="flex items-center mb-4 mt-5">
          <img 
            src={post.userProfilePicture} 
            alt={`${post.userName}'s profile`}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="font-light text-gray-800 ml-16 text-medium ">{post.user?.name}</div>
            <div className="text-sm text-gray-500">{post.timePassed}</div>
          </div>
          <div className="flex space-x-2 mr-10">
            {post.tags && post.tags.length > 0 ? post.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-0.5 rounded"
              >
                {tag.name}
              </span>
            )) : 'No tags'}
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
            <span>{post.comments} comments</span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t pt-4">
          <p className="text-gray-500">Comment Section</p>
          {/* Placeholder for actual comment functionality */}
          {/* Add your existing comment section component or code here */}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
