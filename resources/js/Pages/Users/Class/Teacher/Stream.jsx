import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '@nextui-org/react';
import PreviewTask from '@/Pages/Users/Class/Teacher/PreviewTask';

const Stream = ({ folders, onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Pagination state
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for preview
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Track if preview mode is active

  console.log("These are inside the props:", folders);
  console.log("First Folder ID:", folders[0]?.id);  // Safe access using optional chaining

  console.log("This is the section ID :", folders.id);
  // Fetch tasks with pagination
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
      setPage((prevPage) => prevPage + 1); // Load next page
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
      className="w-[95%] max-w-4xl p-6 bg-white shadow-md rounded-lg"
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

  // Access first folder from the folders array
  const folder = folders[0]; // Assuming you want the first folder's details
  const courseAcronym = folder?.course_acronym || 'Unknown Course';
  const sectionName = folder?.section_name || 'Unknown Section';

  if (isPreviewMode) {
    return <PreviewTask folders={folders} onBack={handleBackToStream} task={selectedTask} taskID={selectedTask?.id}/>;
  }

  return (
    <div className="mt-0 bg-gray-100 rounded-lg shadow-lg w-full">
      {/* Static Cover Photo Above All Cards with text overlays */}
      <div className="relative w-full h-48 mb-5">
        <img
          src="images/coverphoto.jpg"
          alt="Class Cover"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
          <h2 className="text-white text-3xl font-bold">"Always make a total effort,</h2>
          <h2 className="text-white text-1xl font-bold">even when the odds are against you."</h2>
          <h2 className="text-white text-xl font-bold">- Alan Palmer -</h2>
        </div>

        {/* Dynamically loaded message: Course Acronym and Section Name */}
        {folder && (
          <div className="absolute bottom-0 left-0 p-3 bg-black bg-opacity-50">
            <h3 className="text-white text-xl font-semibold">
              {courseAcronym} {sectionName}
            </h3>
          </div>
        )}
      </div>

      {/* Loading & Error States */}
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

      {/* Empty State */}
      {tasks.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 italic">No projects assigned yet.</p>
      )}

      {/* Task Cards */}
      {!loading && !error && tasks.length > 0 && (
        <div className="flex flex-col items-center gap-5 py-3">
          {tasks.map((task) => (
            <MemoizedCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Loading more message */}
      {loading && hasMore && <p className="text-center text-gray-600">Loading more tasks...</p>}
    </div>
  );
};

export default Stream;
