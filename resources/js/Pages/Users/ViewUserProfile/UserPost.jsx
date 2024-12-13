import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import PostDetailModal from '@/Components/PostDetailModal';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, useDisclosure } from '@nextui-org/react';
import ReportModal from '@/Components/ReportModal';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export default function UserPost({forum_posts, auth}) {
  const isAuthenticated = !!auth.user;

    const [posts, setPosts] = useState(forum_posts);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCounts, setCommentCounts] = useState({});
    const [openPost, setOpenPost] = useState(false);
    const [body, setBody] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
    const [selectedSort, setSelectedSort] = useState('latest');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 

    
  const handleUpdateCommentCount = (postId, count) => {
    setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: count,
    }));
  };

    const formatPostDate = date => dayjs.utc(date).tz(dayjs.tz.guess()).fromNow();

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
    
        setSelectedPost(postDetails);  // Show modal with post details
        setOpenPost(true);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
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

    const closeModal = () => {
      setOpenPost(false);
      setIsReportModalOpen(false);
      setSelectedPost(null); 
    };
    
  const handleDeleteConfirmation = (postId) => {
    setPostToDelete(postId);
    onConfirmOpen();
  };


  const handleReportPost = (postId) => {
    setSelectedPost(postId);
    setIsReportModalOpen(true);
  };

  useEffect(() => {
    console.log(selectedPost);
  })


    return (
        <>
           { !openPost ? (
            <div className="min-h-screen flex flex-col items-center mt-8">
            {Array.isArray(posts) && posts.length > 0 ? (
                posts.map(post => (
                    <div
                        className="border-b pb-4 mb-4 w-3/4 flex flex-col relative"
                        key={post.id}
                    >
                        {/* User Info */}
                        <div className="flex items-start space-x-4">
                            <img
                                src={`http://127.0.0.1:8000/${post.user?.user_pic || 'default-avatar.jpg'}`}
                                alt={post.user?.name || "Anonymous"}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="flex-grow">
                                <p className="font-semibold">
                                    {post.user?.name || "Anonymous"}
                                </p> 
                                <h3 className="text-xl text-black font-normal cursor-pointer mt-2 hover:text-gray-700" onClick={() => handleTitleClick(post.id)} >
                                        {post.title}
                                </h3>
                                <p className="mt-2 text-gray-700 truncate max-w-xl">
                                    {post.body}
                                </p>
                                <div className="text-gray-500 text-sm mt-1">
                                    <span className="mr-4">{formatPostDate(post.created_at)}</span>
                                    <span className="mr-4">{post.viewCount || 0} Views</span>
                                    <span>{post.comments || 0} Comments</span>
                                </div>
                                {/* Tags */}
                                <div className="mt-2">
                                    {Array.isArray(post.tags) && post.tags.length > 0 ? (
                                        post.tags.map(tag => (
                                            <span
                                                key={tag.id}
                                                className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium mr-2"
                                            >
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">No Tags</span>
                                    )}
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
                ))
            ) : (
                <p className="text-gray-500 mt-20">No posts found.</p>
            )}
        </div>
            ) : (
                <div className="py-8 -z-0">
                    <div className="max-w-full mx-8 my-4 sm:px-6 lg:px-8">
                        <PostDetailModal
                            isOpen={openPost}
                            onClose={closeModal}
                            post={selectedPost}
                            loggedInUser={auth.user}
                            onUpdateCommentCount={handleUpdateCommentCount}
                        />
                    </div>
                </div>
            )

            }

          
          <ReportModal isOpen={isReportModalOpen} onClose={closeModal} reportLocation={'Forum'} reportedID={selectedPost}/> 
        </>
    );
}
