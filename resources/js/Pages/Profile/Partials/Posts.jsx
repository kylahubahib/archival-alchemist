import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDistanceToNow } from 'date-fns';
import ReportModal from '@/Components/ReportModal';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
    Button, Input, Textarea, 
    Spinner
  } from '@nextui-org/react';
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);



export default function Posts({ user}) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/profile/post').then(response => {
            if(response.data) {
                setPosts(response.data);
            }
        })
    })

    useEffect(() => {
        console.log('Post', posts);
    }, [posts])

    const formatPostDate = (dateString) => {
        const date = dayjs.utc(dateString).tz(dayjs.tz.guess()); // Adjust to local timezone
        return date.fromNow(); // Display as relative time, e.g., "5 minutes ago"
    };

    
    console.log(posts)

    return (
        <div>
            <div className="flex flex-col items-center -mt-21 min-h-screen">
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map(post => {
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
                  src={`http://127.0.0.1:8000/${post.user?.user_pic}`}
                  alt={post.user ? `${post.user.name}'s avatar` : 'Avatar placeholder'}
                  className="w-16 h-16 mr-4 rounded-full"
                />


                <div className="flex-grow ">

                  <p className="font-semibold">
                    {post.user?.name || "Anonymous"}
                  </p>


                  <h3
                    className="text-xl text-black font-normal cursor-pointer mt-2 hover:text-gray-700"
                    onClick={() => {}}
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
                      {post.comments || 0}
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
                <div className="absolute right-0 top-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" size="lg">...</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem onClick={() => {}}>Report</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
            </div>
          );
        })
              ) : (
                <p className="text-gray-500 mt-20">No discussions found.</p>
              )}
              </div>
        </div>
    );
}
