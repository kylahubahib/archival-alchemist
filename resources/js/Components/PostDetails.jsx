// src/pages/PostDetails.jsx
import React from "react";
import { InertiaLink } from "@inertiajs/inertia-react";

const PostDetails = ({ post }) => {
  return (
    <div className="p-8">
      <InertiaLink
        href="/forum"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Forum
      </InertiaLink>

      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex items-center mb-4">
          <img
            src={post.user.avatar}
            alt={`${post.user.name}'s avatar`}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">{post.user.name}</h2>
            <p className="text-sm text-gray-500">Posted {post.created_at}</p>
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-6">{post.title}</h1>

        <p className="text-lg text-gray-700 mb-8">{post.content}</p>

        <div className="flex gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">👁 {post.views} Views</span>
          <span>💬 {post.comments} Comments</span>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
