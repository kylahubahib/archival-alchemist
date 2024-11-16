import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '@nextui-org/react';
import PreviewTask from '@/Pages/Users/Class/Teacher/PreviewTask';

const TaskInstructions = ({ folders, onBack, task, taskID }) => {
  const [tasks, setTasks] = useState([]);  // Store the tasks
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [hasMore, setHasMore] = useState(true);  // Whether more tasks are available
  const [isPreviewMode, setIsPreviewMode] = useState(false);  // For preview mode
  const [selectedTask, setSelectedTask] = useState(null);  // Store the selected task for preview

  // Fetch tasks based on scroll (this is the only place we get new data)
  const fetchAssignedTasks = useCallback(async () => {
    if (!folders || !folders[0]) return;  // Ensure we have folder data
    try {
      setLoading(true);

      console.log('Fetching tasks for folder:', folders[0].id);
      const response = await fetch(`/fetch-specificAssignedTask/${folders[0].id}?taskID=${taskID}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      console.log('Fetched tasks:', data);

      if (data.length > 0) {
        setTasks(data);  // Overwrite tasks (reset the list)
        setHasMore(true);  // Indicate more tasks are available
      } else {
        setHasMore(false);  // No more tasks to load
      }
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [folders, taskID]);

  // Handle scroll event to trigger fetching of new tasks when reaching the bottom
  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;

    if (bottom && !loading && hasMore) {
      console.log('Reached bottom, loading more tasks...');
      fetchAssignedTasks();  // Trigger fetching more tasks
    }
  };

  useEffect(() => {
    fetchAssignedTasks();  // Fetch initial tasks when component mounts
  }, [fetchAssignedTasks]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);  // Attach scroll listener

    return () => {
      window.removeEventListener('scroll', handleScroll);  // Clean up scroll listener
    };
  }, [loading, hasMore]);

  // Retry fetching tasks if error occurs
  const retryFetch = () => {
    setError(null);
    console.log('Retrying fetch...');
    fetchAssignedTasks();
  };

  // Handle viewing task details
  const handleViewDetails = (task) => {
    console.log('Viewing details for task:', task);
    setSelectedTask(task);
    setIsPreviewMode(true);  // Switch to preview mode
  };

  // Handle going back from preview mode
  const handleBackToStream = () => {
    console.log('Going back to task list');
    setSelectedTask(null);
    setIsPreviewMode(false);  // Exit preview mode
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
      <p className="text-gray-700 text-base">
        <strong>Instructions:</strong> {task.task_instructions}
      </p>
      <div className="flex justify-between text-sm text-gray-600 mt-4">
        <p><strong>Start Date:</strong> {new Date(task.task_startdate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {new Date(task.task_duedate).toLocaleDateString()}</p>
      </div>
    </Card>
  ));

  // If in preview mode, render PreviewTask component
  if (isPreviewMode && selectedTask) {
    return <PreviewTask task={selectedTask} onBack={handleBackToStream} />;
  }

  // Return JSX for task list and loading/error states
  return (
<div className="pl-10 mt-0 bg-gray-100 rounded-lg shadow-lg w-full h-screen fixed left-0 overflow-hidden">

      {/* Loading & Error States */}
      {loading && tasks.length === 0 && (
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

      {/* Error State */}
      {error && (
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={retryFetch} color="error" className="w-full mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 italic">No tasks assigned yet.</p>
      )}

      {/* Task Cards */}
      {!loading && !error && tasks.length > 0 && (
        <div className="flex flex-col items-center gap-5 py-3 overflow-y-auto">
          {tasks.map((task) => (
            <MemoizedCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Loading more message */}
      {loading && hasMore && <p className="text-center text-gray-600 mt-4">Loading more tasks...</p>}
    </div>
  );
};

export default TaskInstructions;
