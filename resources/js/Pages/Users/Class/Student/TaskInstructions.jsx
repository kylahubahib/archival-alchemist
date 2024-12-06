import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '@nextui-org/react';
import PreviewTask from '@/Pages/Users/Class/Teacher/PreviewTask';
import axios from 'axios';
import Modal from '@/Components/Modal';

const TaskInstructions = ({ folders, onBack, task, taskID }) => {
  const [tasks, setTasks] = useState([]);  // Store the tasks
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [hasMore, setHasMore] = useState(true);  // Whether more tasks are available
  const [isPreviewMode, setIsPreviewMode] = useState(false);  // For preview mode
  const [selectedTask, setSelectedTask] = useState(null);  // Store the selected task for preview
console.log("These are inside the folders:", folders);
console.log("This is the Task ID:", taskID);
  const [tags, setTags] = useState([]);
  const [users, setAuthors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
      group_name: '',
      man_doc_title: '',
      man_doc_description: '',
      man_doc_content: null,
      man_doc_adviser: '',
    //   agreed: false,
  });
  const [errors, setErrors] = useState({ users: '', tags: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  // const [suggestions, setSuggestions] = useState([]);
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [authorInputValue, setAuthorInputValue] = useState('');
  const [tagInputValue, setTagInputValue] = useState('');
  const [processing, Setprocessing] = useState(false);

    const [hasGroup, setHasGroup] = useState(false);

    useEffect(() => {
        // Fetch data from your Laravel API endpoint
        const checkGroupMembership = async () => {
            try {
                const response = await fetch('/api/check-group'); // Endpoint to check group membership
                const data = await response.json();
                setHasGroup(data.hasGroup); // Assuming the API returns { hasGroup: true/false }
            } catch (error) {
                console.error("Error fetching group membership:", error);
            }
        };

        checkGroupMembership();
    }, []);
console.log("This user has a group already.", hasGroup)

  const resetForm = () => {
      setFormValues({
          group_name: '',
          man_doc_title: '',
          man_doc_description: '',
          man_doc_content: null,
          man_doc_adviser: '',
        //   agreed: false,
      });
      setTags([]);
      setAuthors([]);
      setErrors({});
      setMessage('');
      setSuccess(false);
  };

  const handleTagKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.value.trim() !== '') {
          e.preventDefault(); // Prevent form submission on Enter
          setTags([...tags, e.target.value.trim()]);  // Update tags only
          setTagInputValue('');  // Clear input after adding tag
          setTagSuggestions([]); // Clear suggestions
      }
  };



  const handleAuthorKeyDown = (e) => {
      if (e.key === 'Enter' && e.target.value.trim() !== '') {
          e.preventDefault(); // Prevent form submission on Enter
          setAuthors([...users, e.target.value.trim()]);  // Update authors only
          setAuthorInputValue('');  // Clear input after adding author
          setAuthorSuggestions([]); // Clear suggestions
      }
  };



  const handleTagRemove = (index) => {
      setTags(tags.filter((_, i) => i !== index));
  };

  const handleAuthorsRemove = (index) => {
      setAuthors(users.filter((_, i) => i !== index));
  };


  const handleFormFieldChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormValues({
          ...formValues,
          [name]: type === 'checkbox' ? checked : value,
      });
  };


  const handleTagInputChange = (e) => {
      const { value } = e.target;
      setTagInputValue(value);
      if (value.trim()) {
          fetchTagSuggestions(value);
      } else {
          setTagSuggestions([]);
      }
  };



  const handleAuthorInputChange = (e) => {
      const { value } = e.target;
      setAuthorInputValue(value);
      if (value.trim()) {
          fetchAuthorSuggestions(value);
      } else {
          setAuthorSuggestions([]);
      }
  };

  const fetchTagSuggestions = async (query) => {
      try {
          const response = await axios.get('/api/tags/suggestions', {
              params: { query, tags },
          });
          setTagSuggestions(response.data);
      } catch (error) {
          console.error('Error fetching tag suggestions:', error.response?.data || error.message);
          setTagSuggestions([]);
          setMessage('Unable to fetch tag suggestions. Please try again later.');
      }
  };


  const fetchAuthorSuggestions = async (query) => {
      try {
          const response = await axios.get('/api/authors/suggestions', {
              params: { query, users },
          });
          setAuthorSuggestions(response.data);
      } catch (error) {
          console.error('Error fetching Author suggestions:', error.response?.data || error.message);
          setAuthorSuggestions([]);
          setMessage('Unable to fetch Author suggestions. Please try again later.');
      }
  };

  const handleSuggestionSelect = (suggestion) => {
      setTags([...tags, suggestion]);  // Update tags only
      setTagInputValue('');
      setTagSuggestions([]);
  };


  const handleAuthorSuggestionSelect = (suggestion) => {
      setAuthors([...users, suggestion]);
      setAuthorInputValue('');
      setAuthorSuggestions([]);
  };

  const handleFileChange = (e) => {
      const man_doc_content = e.target.files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (man_doc_content && allowedTypes.includes(man_doc_content.type)) {
          setFormValues({ ...formValues, man_doc_content });
      } else {
          setFormValues({ ...formValues, man_doc_content: null });
          alert('Only PDF and DOCX files are allowed.');
      }
  };

  const isFormValid = () => {
      return (
          formValues.group_name &&
          formValues.man_doc_title &&
          formValues.man_doc_description &&
          formValues.man_doc_adviser &&
          users.length > 0 &&
          tags.length > 0 &&
          formValues.man_doc_content
        //   formValues.agreed
      );
  };

  const checkIfTitleExists = async (title) => {
      try {
          const response = await axios.post('/api/check-title', { title });
          return response.data.exists;
      } catch (error) {
          console.error('Error checking title existence:', error);
          return false;
      }
  };

  const handleSubmit = async (e) => {

      e.preventDefault();
      const newErrors = {};

      if (!formValues.group_name) newErrors.group_name = 'Group name is required.';
      if (!formValues.man_doc_title) newErrors.man_doc_title = 'Title is required.';
      if (!formValues.man_doc_description) newErrors.man_doc_description = 'Description is required.';
      if (users.length === 0) newErrors.users = 'At least one user is required.';
      if (!formValues.man_doc_adviser) newErrors.man_doc_adviser = 'Adviser is required.';
      if (tags.length === 0) newErrors.tags = 'At least one tag is required.';
      if (!formValues.man_doc_content) newErrors.man_doc_content = 'A file is required.';
    //   if (!formValues.agreed) newErrors.agreed = 'You must agree to the terms and conditions.';

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const titleExists = await checkIfTitleExists(formValues.man_doc_title);
          if (titleExists) {
              setErrors({
                  man_doc_title: 'Oops, this project already exists. You may track your project and update it if necessary.'
              });
              return;
          }

          try {
              // Prepare form data
              const formData = new FormData();
              formData.append('group_name', formValues.group_name);
              formData.append('man_doc_title', formValues.man_doc_title);

              formData.append('man_doc_description', formValues.man_doc_description);
              formData.append('man_doc_adviser', formValues.man_doc_adviser);

              users.forEach(user => formData.append('name[]', user));
              tags.forEach(tag => formData.append('tags_name[]', tag));
              formData.append('man_doc_content', formValues.man_doc_content);
            //   formData.append('agreed', formValues.agreed);

              //Add the class_code
              formData.append('section_id', folders.id);
              formData.append('section_classcode', folders.section_classcode);
              formData.append('task_id', taskID);

              console.log('In here...')

              const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

              // Submit the form data
              const response = await axios.post('/api/capstone/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data', 'X-CSRF-TOKEN': csrfToken, },
              });

              setMessage(response.data.message);
              setSuccess(true);
          } catch (error) {
              console.error('Error Details:', error);
              if (error.response) {
                  console.error('Server Error:', error.response.data);
                  setMessage(error.response.data.message || 'Error uploading capstone project.');
                  setErrors(error.response.data.errors || {});
              } else if (error.request) {
                  console.error('No Response:', error.request);
                  setMessage('No response from the server. Please try again later.');
              } else {
                  console.error('Error:', error.message);
                  setMessage('An unexpected error occurred.');
              }
          }
      } else {
          window.scrollTo(0, 0);
      }
  };



  // Fetch tasks based on scroll (this is the only place we get new data)
  const fetchAssignedTasks = useCallback(async () => {
    if (!folders || !folders) return;  // Ensure we have folder data
    try {
      setLoading(true);

      console.log('Fetching tasks for folder:', folders.id);
      const response = await fetch(`/fetch-specificAssignedTask/${folders.id}?taskID=${taskID}`);
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
      className="w-[90%] relative p-6 bg-white shadow-md rounded-tl-lg rounded-tr-lg ml-20"

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
<div className="mt-0 bg-gray-100 w-full p-4 left-0 overflow-hidden">

      {/* Loading & Error States */}
      {loading && tasks.length === 0 && (
        <div className="flex flex-col items-left gap-5 ">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-[90%] relative p-6 ml-20 bg-gray-200 shadow-md rounded-tl-lg rounded-tr-lg animate-pulse border border-gray-100"
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

        // <div className="flex flex-col items-left gap-5 py-3 overflow-y-auto">
        <div className="flex flex-col items-left gap-5 overflow-y-auto">
          {tasks.map((task) => (
            <MemoizedCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Loading more message */}
      {loading && hasMore && <p className="text-center text-gray-600 mt-4">Loading more tasks...</p>}


      {!hasGroup ? (
      <div  className="w-[90%] max-relative p-6 bg-white shadow-md rounded-lg ml-20 mt-3">
        <div className="upload-capstone-container p-8">
            {success ? (
                <div>
                    <h2 className="text-green-600 mb-4"></h2>
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={resetForm}
                    >
                        Submit another manuscript project
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="left-column">
                        <div className="mb-4">
                        <input
                                type="text"
                                name="group_name"
                                placeholder="Group name"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.group_name}
                                onChange={handleFormFieldChange}
                            />
                            {errors.group_name && <div className="text-red-600 text-sm mb-2">{errors.group_name}</div>}


                            <input
                                type="text"
                                name="man_doc_title"
                                placeholder="Title"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.man_doc_title}
                                onChange={handleFormFieldChange}
                            />
                            {errors.man_doc_title && <div className="text-red-600 text-sm mb-2">{errors.man_doc_title}</div>}


                            <textarea
                                name="man_doc_description"
                                placeholder="Enter the description or research abstract"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.man_doc_description}
                                onChange={handleFormFieldChange}
                                rows="3"  // You can adjust this number to control the height of the textarea
                                cols="50"  // Optionally, adjust the number of columns
                            ></textarea>
                            {errors.man_doc_description && <div className="text-red-600 text-sm mb-2">{errors.man_doc_description}</div>}

                            <input
                                type="text"
                                name="man_doc_adviser"
                                placeholder="Adviser"
                                className="w-full p-2 border rounded mb-2"
                                value={formValues.man_doc_adviser}
                                onChange={handleFormFieldChange}
                            />
                            {errors.man_doc_adviser && <div className="text-red-600 text-sm mb-2">{errors.man_doc_adviser}</div>}
                        </div>




                        {/* Authors input  */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter authors name and press Enter"
                                className="w-full p-2 border rounded mb-2"
                                value={authorInputValue}
                                onChange={handleAuthorInputChange}
                                onKeyDown={handleAuthorKeyDown}
                            />
                            {errors.users && <div className="text-red-600 text-sm mb-2">{errors.users}</div>}
                            {authorSuggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 w-full">
                                    {authorSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleAuthorSuggestionSelect(suggestion.name)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}


                            <div className="tags-container flex flex-wrap mt-2">
                                {users.map((author, index) => (
                                    <div key={index} className="tag bg-gray-200 p-1 rounded mr-2 mb-2 flex items-center">
                                        {author}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-600"
                                            onClick={() => handleAuthorsRemove(index)}
                                        >
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>



                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter tags and press Enter"
                                className="w-full p-2 border rounded mb-2"
                                value={tagInputValue}
                                onChange={handleTagInputChange}
                                onKeyDown={handleTagKeyDown}
                            />
                            {errors.tags && <div className="text-red-600 text-sm mb-2">{errors.tags}</div>}
                            {tagSuggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 w-full">
                                    {tagSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleSuggestionSelect(suggestion.tags_name)}
                                        >
                                            {suggestion.tags_name}
                                        </li>
                                    ))}
                                </ul>
                            )}


                            <div className="tags-container flex flex-wrap mt-2">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag bg-gray-200 p-1 rounded mr-2 mb-2 flex items-center">
                                        {tag}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-600"
                                            onClick={() => handleTagRemove(index)}
                                        >
                                            &#x2715;
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className="right-column">
                        <div className="mb-4 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md text-center">
                            <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg transition hover:bg-gray-100">
                                <p className="text-gray-600 mb-2">Drag or drop file here</p>
                                <input
                                    type="file"
                                    className="w-full mt-2 cursor-pointer file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                                    onChange={handleFileChange}
                                    accept=".docx"
                                />
                            </div>
                            {errors.man_doc_content && (
                                <div className="text-red-600 text-sm mt-2">{errors.man_doc_content}</div>
                            )}
                        </div>

                        <div className="flex items-center mb-4">
                            {/* <input
                                type="checkbox"
                                name="agreed"
                                checked={formValues.agreed}
                                onChange={handleFormFieldChange}
                                className="mr-2"
                            /> */}
                            {/* <label>I agree to the terms and conditions</label> */}
                            {/* {errors.agreed && <div className="text-red-600 text-sm ml-2">{errors.agreed}</div>} */}
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white p-2 rounded w-full ${isFormValid() ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!isFormValid()}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            {message && (
                <div className={`mt-4 p-2 rounded ${success ? 'bg-green-200' : 'bg-red-200'}`}>
                    {message}
                </div>
            )}
            {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
        </div></div>):(<div  className="w-[90%] max-relative p-6 bg-green-300 text-center text-gray-700 shadow-md rounded-lg ml-20 mt-3">Your group has submitted successfully.</div>)}
    </div>

  );
};

export default TaskInstructions;
