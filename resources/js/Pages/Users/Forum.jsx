import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Checkbox, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Textarea
} from '@nextui-org/react'; // NextUI components
import SearchBar from '@/Components/SearchBar'; // Custom SearchBar
import {Interia} from "@inertiajs/react";

export default function Forum({ auth }) {
  const isAuthenticated = !!auth.user;
  const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

  // State for modal input and posts
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState(''); // Temporary tag input
  const [tags, setTags] = useState([]); // Store tags as an array
  const [posts, setPosts] = useState(() => {
    // Load posts from local storage or initialize with an empty array
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  // Modal state management using NextUI
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Effect to save posts to local storage whenever the posts state changes
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // Function to handle post submission
  const handlePostSubmit = () => {
    const newPost = {
      id: posts.length + 1,
      title,
      body,
      tags, // store array of tags
      user: auth.user, // current user
      timestamp: new Date(),
      viewCount: 0, // Initialize view count
      commentCount: 0, // Initialize comment count
    };

    // Add new post to the posts array
    setPosts([newPost, ...posts]);

    // Clear the form fields after submission
    setTitle('');
    setBody('');
    setTags([]); // clear tags array
    setTagInput(''); // clear tag input

    // Close the modal
    onOpenChange();
  };

  // Function to handle Enter key press in the tag input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault(); // prevent form submission
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]); // Add new tag if not already present
      }
      setTagInput(''); // Clear input
    }
  };

  // Function to remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Function to format time (e.g., "2 hrs ago")
  const formatTimePassed = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const hours = Math.floor(diff / 3600);
    return `${hours} hrs ago`;
  };

  // Increment view count function
  const incrementViewCount = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, viewCount: post.viewCount + 1 }; // Increment view count
      }
      return post;
    }));
  };

  const Forum = ({ posts }) => {
    const openPost = (id) => {
      // Redirect to the PostDetail page for the selected post
      Inertia.get(`/posts/${id}`);
    };

  return (
    <MainLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between px-6">
          {/* Buttons beside the Forum Title */}
          <div className="flex items-center space-x-4">
            {/* You can add buttons here */}
          </div>
        </div>
      }
    >
      <Head title="Forum" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-14">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-8 font-bold text-xl text-black h-96">
              {/* Sort Dropdown and Search Bar */}
              <div className="flex items-center space-x-4 justify-between">
                {/* Forum Title */}
                <div className="mb-8">
                  <h2 className="font-semibold text-4xl text-gray-800 leading-tight">Forum</h2>
                </div>

                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-customBlue w-56 text-white" variant="solid">
                      Sort by
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Sort options">
                    <DropdownItem key="latest">Latest</DropdownItem>
                    <DropdownItem key="oldest">Oldest</DropdownItem>
                    <DropdownItem key="popular">Most Popular</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <SearchBar placeholder="Search..." />

                <div className="ml-auto">
                  <Button
                    radius="full"
                    className="bg-gradient-to-r from-sky-400 to-blue-800 text-white w-60"
                    onClick={onOpen}
                  >
                    Start Discussion
                  </Button>
                </div>
              </div>

              {/* All Discussions and Title Suggestions Buttons */}
              <div className="flex flex-col space-x-4 gap-4 mt-12 mb-8 -ml-3">
                <Button
                  className="bg-customBlue text-white w-48 ml-4"
                  radius="full"
                  variant="solid"
                >
                  All Discussions
                </Button>

                <Button
                  className="bg-customBlue text-white w-48"
                  radius="full"
                  variant="solid"
                >
                  Title Suggestions
                </Button>

                
              </div>

              {/*Forum Posts*/}
              <div className="flex flex-col items-center -mt-32 ml-32">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="border-b pb-4 mb-4 w-3/4"
            onMouseEnter={() => incrementViewCount(post.id)}
          >
            <div className="flex items-start space-x-4">
              <img
                src={post.user.avatar || "default-avatar-url"}
                alt={`${post.user.name}'s avatar`}
                className="w-12 h-12 mr-8 rounded-full"
              />
              <div>
                <h3
                  className="text-2xl text-blue-500 hover:underline cursor-pointer"
                  onClick={() => openPost(post.id)} // Navigate to post detail on click
                >
                  {post.title}
                </h3>
                <p className="font-thin text-medium">{post.body}</p>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <div className="font-light">
                    <span>{formatTimePassed(post.timestamp)}</span>
                  </div>
                  <span className="ml-4">
                    <i className="fas fa-eye"></i> {/* Eye icon */}
                    <span className="ml-1 font-thin">
                      {post.viewCount || 0} views
                    </span>
                  </span>
                  <span className="ml-4">
                    <i className="fas fa-comment"></i> {/* Comment icon */}
                    <span className="ml-1 font-thin">
                      {post.commentCount || 0} comments
                    </span>
                  </span>
                  <span className="ml-4">
                    Tags:
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 border border-blue-300 font-extralight px-2 py-1 gap-2 rounded-lg mr-1 ml-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>

            </div>
          </div>
         </div>
        </div>

      {/* Modal (NextUI Modal) */}
      <Modal className="max-w-3xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Add Discussion</ModalHeader>
            <ModalBody>
              <Input
                type="text"
                label="Title"
                placeholder="Enter Discussion Title"
                variant="bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                label="Body"
                placeholder="Tell us more about your discussion"
                variant="bordered"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              
              {/* Tags input */}
              <div className="mt-4">
                <h4 className="font-semibold">Tags</h4>
                <div className="flex flex-wrap">
                  {tags.map((tag, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 gap-2 rounded-lg mr-1 flex items-center">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 text-red-500">
                        &times; {/* Remove tag button */}
                      </button>
                    </div>
                  ))}
                  <Input
                    type="text"
                    placeholder="Add a tag"
                    variant="bordered"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>
            </ModalBody>

            {/* Flex container for checkbox and paragraph */}
            <div className="flex items-center mt-4 py-5 px-5">
              <Checkbox className="mr-2" />
              <p className="text-sm text-gray-600">
                I have reviewed and verified each file I am uploading. I have the right to share each file publicly and/or store a private copy accessible to me and the co-authors, as applicable. 
                By uploading this file, I agree to the Upload Conditions.
              </p>
            </div>

            {/* Flex container for buttons */}
            <div className="flex justify-end items-center mt-4 px-4 py-4">
              <Button onClick={onOpenChange} className="bg-red-400">
                Cancel
              </Button>
              <Button onClick={handlePostSubmit} color="success" className="ml-2">
                Post
              </Button>
            </div>
          </ModalContent>
        </Modal>

    </MainLayout>
  );
}
}