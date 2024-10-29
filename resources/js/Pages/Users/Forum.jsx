import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Button, Input, Textarea 
} from '@nextui-org/react';
import SearchBar from '@/Components/SearchBar';
import { Inertia } from "@inertiajs/inertia";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function Forum({ auth }) {
  const isAuthenticated = !!auth.user;
  const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

  // State for modal input, posts, and confirmation modal
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  // Modal state management
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handlePostSubmit = async () => {
    // Trim title, body, and tags
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    const trimmedTags = tags.map(tag => tag.trim()).filter(tag => tag !== "");

    // Validate fields
    if (!trimmedTitle || !trimmedBody || trimmedTags.length === 0) {
      toast.error("All fields are required.");
      return;
    }

    // Prepare the new post data
    const newPost = {
      title: trimmedTitle,
      body: trimmedBody,
      tags: trimmedTags,
      user_id: auth.user.id, // Assuming `auth` contains user data
    };

    // Get CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    console.log('CSRF Token:', csrfToken); // Debugging: Log the CSRF token

    // Submit post with try-catch block
    try {
      const response = await fetch('/forum-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Failed to create forum post');
      }

      const createdPost = await response.json();
      // Handle successful post creation
      setPosts([createdPost, ...posts]); // Update the state to include the new post
      setTitle(''); // Reset title input
      setBody(''); // Reset body input
      setTags([]); // Reset tags input
      setTagInput(''); // Clear any tag input if used
      onOpenChange(); // Close the modal or reset the form
      toast.success("Post created successfully!"); // Show success message

    } catch (error) {
      console.error('Error creating forum post:', error); // Log the error for debugging
      toast.error('Error creating post. Please try again.'); // Show error message
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatTimePassed = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const hours = Math.floor(diff / 3600);
    return `${hours} hrs ago`;
  };

  const incrementViewCount = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, viewCount: (post.viewCount || 0) + 1 };
      }
      return post;
    }));
  };

  const openPost = (id) => {
    Inertia.get(`/posts/${id}`);
  };

  const handleDeleteConfirmation = (postId) => {
    setPostToDelete(postId); // Store the ID of the post to delete
    onConfirmOpen(); // Open the confirmation dialog
  };

  const handleDeletePost = async () => {
    if (postToDelete !== null) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      try {
        const response = await fetch(`http://127.0.0.1:8000/forum-posts/${postToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        });

        if (response.ok) {
          // Update the posts state to remove the deleted post
          setPosts(posts.filter(post => post.id !== postToDelete));
          toast.success('Post deleted successfully.');
        } else {
          throw new Error('Failed to delete post.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Error deleting post.');
      } finally {
        setPostToDelete(null); // Reset the post to delete
        onConfirmOpenChange(); // Close the confirmation dialog
      }
    }
  };

  const handleReportPost = (postId) => {
    // Ideally, integrate with your backend for actual reporting
    alert(`Post ${postId} has been reported.`);
    toast.info(`Post ${postId} has been reported.`);
  };


  return (
    <MainLayout
      user={auth.user}
      header={<div className="flex items-center justify-between px-6"></div>}
    >
      <Head title="Forum" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-14">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-8 font-bold text-xl text-black h-auto overflow-auto">
              {/* Sort Dropdown and Search Bar */}
              <div className="flex items-center space-x-4 justify-between">
                <div className="mb-8">
                  <h2 className="font-semibold text-4xl text-gray-800 leading-tight mt-2 ml-1">Forum</h2>
                  <div className='gap-4'>
                    <Button className="bg-customBlue w-56 text-white mt-4" variant="solid">
                      All Discussions
                    </Button>
                    <Button className="bg-customBlue w-56 text-white mt-2" variant="solid">
                      My Posts
                    </Button>
                  </div>
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

              {/* Forum Posts */}
              <div className="flex flex-col items-center -mt-21 ml-32">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="border-b pb-4 mb-4 w-3/4 relative flex flex-col"
                      onMouseEnter={() => incrementViewCount(post.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={post.user?.avatar ? `http://127.0.0.1:8000/${post.user.avatar}` : "https://via.placeholder.com/150"}
                          alt={post.user ? `${post.user.name}'s avatar` : 'Avatar placeholder'}
                          className="w-16 h-16 mr-4 rounded-full"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold">{post.user?.name || "Anonymous"}</p>
                          <h3
                            className="text-2xl text-blue-500 cursor-pointer"
                            onClick={() => openPost(post.id)}
                          >
                            {post.title}
                          </h3>
                          {/* Display only the first 50 characters of the body */}
                          <p className="font-thin text-medium">{post.body.length > 50 ? `${post.body.slice(0, 50)}...` : post.body}</p>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <span>{formatTimePassed(post.timestamp)}</span>
                            <span className="ml-4">
                              <i className="fas fa-eye"></i> {post.viewCount || 0} views
                            </span>
                            <span className="ml-4">
                              <i className="fas fa-comment"></i> {post.commentCount || 0} comments
                            </span>
                            <span className="ml-4">
                              Tags:{" "}
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-1"
                                >
                                  {tag}
                                </span>
                              ))}
                            </span>
                          </div>
                          <Button
                            color="error"
                            auto
                            onClick={() => handleDeleteConfirmation(post.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            color="warning"
                            auto
                            onClick={() => handleReportPost(post.id)}
                          >
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No posts available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton
        className="bg-white"
      >
        <ModalContent>
          <ModalHeader>Add New Post</ModalHeader>
          <ModalBody>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <Input
              label="Tags"
              value={tagInput}
              onKeyDown={handleTagKeyDown}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-300 rounded-full px-2 py-1 text-sm mr-2"
                >
                  {tag}
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button auto flat color="error" onClick={onOpenChange}>
              Close
            </Button>
            <Button auto onClick={handlePostSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        closeButton
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this post?
          </ModalBody>
          <ModalFooter>
            <Button auto flat color="error" onClick={onConfirmOpenChange}>
              Cancel
            </Button>
            <Button auto onClick={handleDeletePost}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
