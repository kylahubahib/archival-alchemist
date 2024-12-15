import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Tooltip } from '@nextui-org/react';
import PreviewTask from '@/Pages/Users/Class/Teacher/PreviewTask';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Stream = ({auth, user, folders, onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Pagination state
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for preview
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Track if preview mode is active


  console.log("These are inside the props:", folders);
  console.log("First Folder ID:", folders.id);  // Safe access using optional chaining

  console.log("This is the section ID :", folders.id);
  // Fetch tasks with pagination
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    // Copy the actual class code to the clipboard
    navigator.clipboard.writeText(folders.section_classcode).then(() => {
      // Show a toast notification
      toast.success('Copied successfully!');
    });
  };

  console.log('Copied:', copied); // Log to check if state is updating


  const fetchAssignedTasks = useCallback(async () => {

    try {
        setLoading(true);
        const response = await fetch(`/fetch-AssignedTask/${folders.id}?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        setTasks((prevTasks) => [...prevTasks, ...data]);  // Append tasks
        setHasMore(data.length > 0); // Check if there are more tasks
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [folders, page]);

    useEffect(() => {
      fetchAssignedTasks();
    }, [fetchAssignedTasks]);


  // Scroll event listener
  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;

    if (bottom && !loading && hasMore) {
      setPage((prevPage)); // Load next page
    }
  };


  useEffect(() => {
    // Attach the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  // Retry fetching tasks
  const retryFetch = () => {
    setError(null);
    fetchAssignedTasks();
  };

  // Handle "View Details" button click
  const handleViewDetails = (task) => {
    setSelectedTask(task);  // Set the selected task for preview
    setIsPreviewMode(true);  // Activate preview mode
  };

  // Handle back button click inside PreviewTask
  const handleBackToStream = () => {
    setSelectedTask(null);  // Clear selected task
    setIsPreviewMode(false); // Deactivate preview mode
  };

  // Memoized Card component to prevent unnecessary re-renders
  const MemoizedCard = React.memo(({ task }) => (
    <Card
      key={task.id}
      className="w-[100%] max-w-4xl p-6 bg-white shadow-md rounded-lg"
    >
      <h4 className="text-gray-800 text-xl font-semibold mb-2">
        {task.task_title}
      </h4>
      <p className="text-gray-700 text-base truncate">
        <strong>Instructions:</strong> {task.task_instructions}
      </p>
      <div className="flex justify-between text-sm text-gray-600 mt-4">
        <p><strong>Start Date:</strong> {new Date(task.task_startdate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {new Date(task.task_duedate).toLocaleDateString()}</p>
      </div>
      <div className="mt-4 text-center">
        <Button
          color="primary"
          className="w-full"
          onClick={() => handleViewDetails(task)} // Set selected task
        >
          View Details
        </Button>
      </div>
    </Card>
  ));



// Assuming folders is an array, and you are using the first folder object
const folder = folders.id; // Use optional chaining to safely access the first item
  // Log the folder and its properties outside of JSX
  console.log("folder:", folders);
  console.log("folder.course:", folders?.course);
  console.log("folder.course.course_acronym:", folders?.course?.course_acronym);
  console.log("folder.section_name:", folders?.section_name);

  // Fallback to defaults if the properties are undefined
  const courseAcronym = folders?.course?.course_acronym || 'Unknown Course';
  const sectionName = folders?.section_name || 'Unknown Section';
  if (isPreviewMode) {
    return <PreviewTask auth={auth} user={user} folders={folders} onBack={handleBackToStream} task={selectedTask} taskID={selectedTask?.id}/>;
  }

  return (
    <div className="mt-0 bg-gray-100 w-relative h-screen">
      {/* Static Cover Photo */}
      <div className="relative w-relative h-48">
        <img
          src="images/coverphoto.jpg"
          alt="Class Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
          <h2 className="text-white text-3xl font-bold">"Always make a total effort,</h2>
          <h2 className="text-white text-1xl font-bold">even when the odds are against you."</h2>
          <h2 className="text-white text-xl font-bold">- Alan Palmer -</h2>
        </div>    {folders && (

<div className="absolute bottom-0 left-0 p-3 bg-black bg-opacity-50">
<h3 className="text-white text-xl font-semibold">
{console.log("folder:", folders)}
{console.log("folder.course:", folders?.course)}
{console.log("courseAcronym:", courseAcronym)}
{console.log("sectionName:", sectionName)}
<h3 className="text-white text-xl font-semibold">
{courseAcronym} {sectionName}
</h3>
</h3>
</div>
)}
      </div>

      {/* Class Code and Course Info */}
      <div className="relative flex items-center justify-between w-full p-4 bg-white rounded-bl-lg rounded-br-lg shadow-md">
        {/* Left: Class Code */}
        <div className="relative flex items-center">
      <div
        className="p-2 bg-gray-200 text-gray-800 border border-gray-800 text-sm rounded-md shadow-md cursor-pointer"
        onClick={handleCopy}
      >
        <span className="text-sm">ClassCode:</span>
        <span className="p-2 text-lg font-bold text-blue-600">{folders.section_classcode}</span>

        <Tooltip
          content={copied ? 'Copied!' : 'Click to Copy'}
          visible={copied}
          color={copied ? 'success' : 'default'}
        >
          <button className="ml-2 text-blue-400 text-xs bg-white rounded-full px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">
            Copy
          </button>
        </Tooltip>
      </div>

      {/* Toast Container for notifications */}<ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    </div>



      </div>

      {/* Other Content */}
      {loading && !tasks.length && (
        <div className="flex flex-col items-center gap-5 py-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-[95%] max-w-4xl p-6 bg-gray-200 shadow-md rounded-lg animate-pulse border border-gray-100"
            >
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div>
          <p className="text-center text-red-600">{error}</p>
          <Button onClick={retryFetch} color="error" className="w-full">
            Retry
          </Button>
        </div>
      )}

      {tasks.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 italic h-screen">No projects assigned yet.</p>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="flex flex-col items-center gap-5 py-3">
          {tasks.map((task) => (
            <MemoizedCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {loading && hasMore && <p className="text-center text-gray-600">Loading more tasks...</p>}
    </div>
  );

};

export default Stream;
