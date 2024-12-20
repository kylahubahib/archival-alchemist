import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Button, Input, Textarea, 
  Spinner
} from '@nextui-org/react';
import SearchBar from '@/Components/SearchBar';
import { Inertia } from "@inertiajs/inertia";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PostDetailModal from '@/Components/PostDetailModal';
import { formatDistanceToNow } from 'date-fns';
import Echo from 'laravel-echo'; 
import Pusher from 'pusher-js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from "dayjs/plugin/relativeTime";
import ReportModal from '@/Components/ReportModal';
import { FaSearch } from "react-icons/fa"; 


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export default function Forum({ auth }) {
  const isAuthenticated = !!auth.user;
  const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

  // State for modal input, posts, and confirmation modal
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedSort, setSelectedSort] = useState('latest');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [commentCount, setCommentCount] = useState(0); // State to hold the comment count



  // Set up Axios CSRF token configuration globally
  // axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  // axios.defaults.withCredentials = true;


  const formatPostDate = (dateString) => {
    const date = dayjs.utc(dateString).tz(dayjs.tz.guess()); // Adjust to local timezone
    return date.fromNow(); // Display as relative time, e.g., "5 minutes ago"
};



useEffect(() => {
  if (!searchQuery) {
    setFilteredPosts(posts);
  }
}, [posts, searchQuery]);


const handleCommentCountUpdate = (postId, newCount) => {
  setCommentCount((prevCount) => ({
    ...prevCount,
    [postId]: newCount, // Update the count for the specific post
  }));
};

const handleSearchChange = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  if (query) {
    const filtered = posts.filter((post) => {
      const author = post.user?.name?.toLowerCase() || '';
      const title = post.title?.toLowerCase() || '';
      const tags = post.tags?.map((tag) => tag.name.toLowerCase()).join(' ') || '';

      return author.includes(query) || title.includes(query) || tags.includes(query);
    });

    setFilteredPosts(filtered);
  } else {
    setFilteredPosts(posts); // Reset to all posts when search query is cleared
  }
};


// Fetch posts with sorting option
const fetchPosts = async (sortType = 'latest') => {
  setLoading(true); // Start loading
  try {
    console.log(`Fetching posts with sort type: ${sortType}`);
    const response = await axios.get(`/forum-posts?sort=${sortType}`);
    console.log('Fetched posts:', response.data);
    setPosts(Array.isArray(response.data) ? response.data : []);
    setFilteredPosts(Array.isArray(response.data) ? response.data : []);  // Initially set all posts to filteredPosts
  } catch (error) {
    console.error('Error fetching posts:', error.response || error.message);
    setError(error.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

// useEffect for fetching posts and setting up Pusher
useEffect(() => {
  fetchPosts(selectedSort); // Fetch posts with the selected sort option

  const echo = new Echo({
    broadcaster: 'pusher',
    key: 'ed777339e9944a0f909f',
    cluster: 'ap1',
    forceTLS: true,
    client: new Pusher('ed777339e9944a0f909f', {
      cluster: 'ap1',
      encrypted: true,
    }),
  });

  echo.channel('forum-posts').listen('NewPostCreated', (event) => {
    setPosts((prevPosts) => [event.post, ...prevPosts]);
  });

  return () => {
    echo.disconnect();
  };
}, [selectedSort]); // Re-fetch when the selectedSort changes

// Handle sorting option change
const handleSortChange = (sortType) => {
  setSelectedSort(sortType); // Update sort option and trigger refetch
  fetchPosts(sortType); // Re-fetch posts based on selected sort option
};

// Handle post submission
const handlePostSubmit = async () => {
  // Validate fields
  if (!title.trim() || !body.trim() || tags.length === 0 || tags.every(tag => tag.trim() === "")) {
    toast.warn("All fields are required!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return; // Stop the submission process if validation fails
  }

  const newPost = {
    title: title.trim(),
    body: body.trim(),
    tags: tags.map(tag => tag.trim()).filter(tag => tag !== ""),
  };

  try {
    const response = await axios.post('/forum-posts', newPost);
    if (response.status === 201) {
      const postWithUserData = {
        ...response.data,
        user: auth.user,
      };

      // Add the new post to both posts and filteredPosts
      setPosts((prevPosts) => [postWithUserData, ...prevPosts]);
      setFilteredPosts((prevFiltered) => [postWithUserData, ...prevFiltered]);

      resetForm(); // Clear the form fields
      onOpenChange(); // Close the modal
      toast.success("Post created successfully!");
    }
  } catch (error) {
    handlePostError(error, newPost);
  }
};



// Render loading or error states
// if (loading) return <div className="flex justify-center mt-20"><Spinner/></div>;
if (error) return <div>Error: {error}</div>;

const handleTitleClick = async (postId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const postDetails = await response.json(); // Parse JSON from response
    const updatedViewCount = postDetails.viewCount;

    // Update the view count in the posts array
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, viewCount: updatedViewCount } : post
    ));

    showModal(postDetails); // Show modal with post details
  } catch (error) {
    console.error("Error fetching post details:", error);
  }
};



// Open the modal with post details
const showModal = (postDetails) => {
  setSelectedPost(postDetails); // Set the selected post details
  setIsModalOpen(true); // Open the modal
};

// Close the modal
const closeModal = () => {
  setIsModalOpen(false); // Close the modal
  setSelectedPost(null); // Clear the selected post
  setIsReportModalOpen(false);
};

const handlePostError = async (error, newPost) => {
  if (error.response?.status === 419) {
    console.warn("CSRF token error. Refreshing token and retrying...");

    // await axios.get('/sanctum/csrf-cookie'); // Refresh CSRF token
    try {
      const retryResponse = await axios.post('/forum-posts', newPost);
      if (retryResponse.status === 201) {
        const postWithUserData = {
          ...retryResponse.data,
          user: auth.user,
        };
        setPosts([postWithUserData, ...posts]);
        resetForm();
        onOpenChange();
        toast.success("Post created successfully!");
      }
    } catch (retryError) {
      console.error("Retry failed:", retryError);
      toast.error("Error creating post. Please try again.");
    }
  } else {
    console.error("Error creating forum post:", error);
    toast.error("Error creating post. Please try again.");
  }
};

const resetForm = () => {
  setTitle('');
  setBody('');
  setTags([]);
  setTagInput('');
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

const handleDeleteConfirmation = (postId) => {
  setPostToDelete(postId);
  onConfirmOpen();
};

const handleDeletePost = async () => {
  if (postToDelete !== null) {
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
      const response = await axios.delete(`/forum-posts/${postToDelete}`, {
        headers: {
          // 'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (response.status === 200) {
        setPosts(posts.filter(post => post.id !== postToDelete));
        toast.success('Post deleted successfully.');
      } else {
        throw new Error('Failed to delete post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post.');
    } finally {
      setPostToDelete(null);
      onConfirmOpenChange();
    }
  }
};

const handleSearchResults = (filteredPosts) => {
  setFilteredPosts(filteredPosts);  // Update the filtered posts based on search results
};

const handleReportPost = (postId) => {
  setSelectedPost(postId);
  setIsReportModalOpen(true);
};

const handleStartDiscussion = () => {
  if (!isAuthenticated) {
    const proceed = window.confirm(
      "You need to log in or register to start a discussion. Would you like to log in now?"
    );
    if (proceed) {
      Inertia.visit('/login'); // Redirect to login
    }
    return;
  }

  // If authenticated, open the modal
  onOpenChange();
};

  
  
  return (
    <MainLayout
      user={auth.user}
      header={<div className="flex items-center justify-between px-6"></div>}
    >
      <Head title="Forum" />

      <div className="py-12">
        <div className="mx-auto sm:px-6 lg:px-14 min-h-screen">
        { !isModalOpen ? (
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg  min-h-screen">
              <div className="p-8 font-bold text-xl text-black overflow-auto">

                {/* Sort Dropdown and Search Bar */}
                <div className="flex space-x-10 justify-between  items-start">
                
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-customBlue text-white ml-3  mt-6" variant="solid ">
                      Sort by
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Sort options">
                    <DropdownItem key="latest" onClick={() => handleSortChange('latest')}>Latest</DropdownItem>
                    <DropdownItem key="oldest" onClick={() => handleSortChange('oldest')}>Oldest</DropdownItem>
                    <DropdownItem key="popular" onClick={() => handleSortChange('popular')}>Most Popular</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {/* Search Bar */}
                <div className="flex justify-between mb-6 mt-6">
                  <div className="relative w-full max-w-lg">
                    <Input
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by title, author, or tags"
                      classNames={{
                        base: "max-w-full drop-shadow-lg",
                        mainWrapper: "h-full",
                        input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                        inputWrapper: "h-full font-normal text-default-500",
                    }}
                      startContent={<FaSearch className="text-gray-500" />}
                      endContent={searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    />
                  </div>
                </div>


                <div className="ml-auo mt-6">
                  <Button
                    radius="full"
                    className="bg-gradient-to-r from-sky-400 to-blue-800 text-white w-56 font-bold box drop-shadow-lg "
                    onClick={handleStartDiscussion}
                  >
                    Start Discussion
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center -mt-21">
              { !loading ? (
                <>
              {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
                filteredPosts.map(post => {
                  // Date formatting with error handling
                  let formattedDate;
                  try {
                    const date = new Date(post.created_at);
                    formattedDate = !isNaN(date) ? `${formatDistanceToNow(date)} ago` : "Invalid date";
                  } catch (error) {
                    formattedDate = "Date error";
                  }

                  console.log(post.tags); // Check structure and values of post.tags





          return (
            
            <div className="border-b pb-4 mb-4 w-3/4 relative flex flex-col mt-10 " key={post.id}>
              <div className="flex items-start space-x-4">
              <img
                  // src={post.user?.user_pic ? {post.user.user_pic} : "https://via.placeholder.com/150"}
                  src={post.user?.user_pic}
                  alt={post.user ? `${post.user.name}'s avatar` : 'Avatar placeholder'}
                  className="w-16 h-16 mr-4 rounded-full"
                />


                <div className="flex-grow ">

                  <Link href={`/profile/${post.user?.id}`} className="font-semibold hover:underline">
                    {post.user?.name || "Anonymous"}
                  </Link>


                  <h3
                    className="text-xl text-black font-normal cursor-pointer mt-2 hover:text-gray-700"
                    onClick={() => handleTitleClick(post.id)}
                  >
                    {post.title}
                  </h3>

                  {/* Body Preview */}
                  <p className="mt-2 text-gray-700 text-medium font-extralight truncate max-w-xl">
                    {post.body}
                  </p>

                  {/* Time Passed, View, and Comment Counts */}
                  <div className="text-gray-500 text-sm mt-1 flex items-center">
                    <span className="mr-4">{formatPostDate(post.created_at)}</span>
                    <span className="mr-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      {post.viewCount || 0}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      {commentCount[post.id] || 0}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="text-sm text-gray-500 ml-5 mt-2">
                    Tags:
                    <span className="ml-2">
                    {Array.isArray(post.tags) && post.tags.length > 0 ? (
                        post.tags.map(tag => (
                          <span
                            key={tag.id}
                            className="inline-block bg-blue-800 text-white text-s font-semibold rounded-full px-3 py-1 mr-2"
                          >
                            {tag.name || "Unnamed Tag"}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No tags available</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown for actions */}
              {isAuthenticated && (
                <div className="absolute right-0 top-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" size="lg">...</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleReportPost(post.id)}>Report</DropdownItem>
                      {auth.user && post.user && auth.user.id === post.user.id && (
                        <DropdownItem onClick={() => handleDeleteConfirmation(post.id)}>Delete</DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          );
        })
              ) : (
                <p className="text-gray-500 mt-20">No discussions found.</p>
              )}
              </>) : (
                <Spinner className=" mt-44"/>
              )
              }
              </div>

              {/* Modal for displaying post details
              <PostDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                post={selectedPost}
                loggedInUser={auth.user}
              /> */}

            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg px-5">
              <PostDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                post={selectedPost}
                loggedInUser={auth.user}
                onUpdateCommentCount={(newCount) => handleCommentCountUpdate(post.id, newCount)} // Pass post.id

              />
          </div>
        )
        }

        </div>



          {/* Create Post Modal */}
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              <ModalHeader>Create a New Post</ModalHeader>
              <ModalBody>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  label="Title"
                  placeholder="Enter post title"
                  className="mb-4"
                  classNames={{
                      base: "max-w-full",
                      mainWrapper: "h-full",
                      input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                      inputWrapper: "h-full font-normal text-default-500",
                  }}
                />
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  label="Body"
                  placeholder="Enter post content"
                  className="mb-4"
                  classNames={{
                      base: "max-w-full",
                      mainWrapper: "h-full",
                      input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                      inputWrapper: "h-full font-normal text-default-500",
                  }}
                />
                <Input
                  value={tagInput}
                  onKeyDown={handleTagKeyDown}
                  onChange={(e) => setTagInput(e.target.value)}
                  label="Tags"
                  placeholder="Add a tag and press Enter"
                  className="mb-4"
                  classNames={{
                      base: "max-w-full",
                      mainWrapper: "h-full",
                      input: "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                      inputWrapper: "h-full font-normal text-default-500",
                  }}
                />
                <div className="flex flex-wrap mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 rounded-full px-2 py-1 text-sm mr-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 text-red-500">x</button>
                    </span>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handlePostSubmit}>Submit</Button>
                <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          


          {/* Delete Confirmation Modal */}
          <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange}>
            <ModalContent>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>Are you sure you want to delete this post?</ModalBody>
              <ModalFooter>
                <Button onClick={handleDeletePost}>Delete</Button>
                <Button variant="outline" onClick={onConfirmOpenChange}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

      </div>

      <ReportModal isOpen={isReportModalOpen} onClose={closeModal} reportLocation={'Forum'} reportedID={selectedPost}/> 
    </MainLayout>
  );
}