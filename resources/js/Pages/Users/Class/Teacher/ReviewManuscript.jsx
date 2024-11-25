import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Modal from "@/Components/Modal"
// import { Avatar, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewManuscript = ({folders, onBack, task, taskID, closeModal, classes, manuscript, fileUrl  }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [isDisabled, setIsDisabled] = useState(false); // To disable the dropdown after selection
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);  // Track if dropdown selection is made

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



console.log("These are the props in review folders:", folders)
console.log("These are the props in review classes:", classes)
console.log("These are the props in review manuscript :", manuscript)


console.log("This is the Manuscrip ID :", manuscript.id)
useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/fetch-history/${manuscript.manuscript_id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            // Sort the data by revision_updated_at in descending order (latest first)
            const sortedData = data.sort((a, b) => new Date(b.revision_updated_at) - new Date(a.revision_updated_at));

            // Set the latest revision as the first element
            setHistoryData(sortedData[0]);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    fetchData();
}, [manuscript.manuscript_id]);


  // Loading and error handling

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const toggleDropdown = () => {
    setIsOpen(!isOpen);  // Toggle the dropdown visibility
    setDropdownError(false);  // Reset the error when the dropdown is opened
  };

  const handleAction = (action) => {
    console.log("Action:", action);
    setStatus(action);   // Set the selected action (Approve or Decline)
    setIsOpen(false);     // Close the dropdown immediately after selection
    setDropdownError(false);  // Reset the error when an action is selected
  };


  const giveFeedback = async () => {
    if (!status) {  // Check if status is selected
        setDropdownError(true);  // Set error if no dropdown option is selected
        return;  // Prevent form submission if no status is selected
      }
    const folder = folders[1];  // Or use a condition to select a specific folder
    console.log('Folder ID:', folder.id);  // Check if folder.id is valid

    console.log("These are the classes:", classes);
    // Log to check if startDate and dueDate are set correctly
    console.log("This is the Feedback!");

    console.log("This is the manuscript:", manuscript);
    console.log("Manuscript ID: ", manuscript.manuscript_id);
    const feedbackData = {
        comment,
        status,
        manuscript_id: manuscript.manuscript_id,
        ins_id: manuscript.ins_id,
        group_id: manuscript.group_id,
        section_id: manuscript.section_id,
        manuscriptCreated: manuscript.manuscript_created_at,
    };


    try {
        // Correct the URL template literal

        const response = await axios.post(`/store-feedback`, feedbackData);
        // Handle successful save
        console.log(response.data);

        toast.info('Feedback submitted successfully!');

        setComment('');
        setStatus('');
    } catch (error) {
        // Handle error
        console.error("Error saving project:", error);
    }
};


  // Toggle Modal state
  const seeHistory = () => {
    setIsModalOpen(true); // Open modal
    console.log('Modal is now Open: ',true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleBackClick = () => {
    closeModal(); // This will close the modal when the "Back" button is clicked
    onBack(); // Call the onBack function if needed (or handle other actions)
  };

  const toggleSidebar = ({folders, onBack, task, taskID}) => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = Math.max(200, Math.min(600, window.innerWidth - e.clientX));
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div
      className="relative bg-white px-6 mb-10 w-full items-center flex flex-col"
      style={{
        position: 'relative',
        top: '0px',
        zIndex: 10,
        paddingTop: '0',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex w-full h-screen fixed left-0">
        {/* Main content: File preview */}
        <div className="flex-grow overflow-y-auto bg-gray-50 border-r border-gray-300 shadow-inner">
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title="File Preview"
              className="w-full h-full"
              frameBorder="0"
            ></iframe>
          ) : (
            <div className="flex center items-center justify-center h-full text-gray-500">
              <p>No file to preview.</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? "w-12" : ""} bg-white shadow-lg border-l border-gray-300 relative`}
          style={{ width: isSidebarCollapsed ? 50 : `${sidebarWidth}px` }}
        >
          {!isSidebarCollapsed && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 left-0 h-full w-2 cursor-ew-resize bg-gray-300 hover:bg-gray-500"
            ></div>
          )}

          <div className="absolute top-0 left-2 h-full w-12 bg-gray-200 border-r border-gray-300 flex flex-col items-center py-4">
            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="mb-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {isSidebarCollapsed ? (
                <AiOutlineMenu className="text-2xl" />
              ) : (
                <AiOutlineClose className="text-2xl" />
              )}
            </button>

            {/* Additional icons */}
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none" onClick={seeHistory}>
              📄 {/* History Icon */}
            </button>
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none">
              🖊️ {/* Edit Icon */}
            </button>
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none">
              📤 {/* Upload Icon */}
            </button>
          </div>

          {/* Main sidebar content */}
          {!isSidebarCollapsed && (
            <div className="px-6 py-4 ml-10 mr-mb-10 w-relative flex flex-col">
              <div className="flex  justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-600">Feedback</h2>
                <div className="relative">
                  {/* Dropdown Toggle Button */}
                  <button
  className={`bg-gray-200 text-gray-700 px-3 py-1 rounded-lg focus:outline-none hover:bg-gray-300
    ${dropdownError ? 'shadow-lg shadow-red-500' : ''}`}  // Adds a red shadow if error
  onClick={toggleDropdown}
>
  {status ? (status === 'A' ? "Approved ▼" : "Declined ▼") : "Options ▼"}
</button>


                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-40">
                      <button
                        onClick={() => handleAction('A')} // Approve action
                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction('D')} // Decline action
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        Decline
                      </button>
                    </div>

      )}
    </div>

              </div>
              <div className="flex items-center">
  <p className="mr-2 text-sm py-2">Status:</p>
  <h1
    className={`text-base font-bold ${
      manuscript.man_doc_status === 'Declined'
        ? 'text-red-500'
        : manuscript.man_doc_status === 'Approved'
        ? 'text-green-500'
        : manuscript.man_doc_status === 'To-Review'
        ? 'text-blue-500'
        : manuscript.man_doc_status === 'Pending'
        ? 'text-yellow-500'
        : manuscript.man_doc_status === 'Missing'
        ? 'text-red-500'
        : 'text-blue-500'
    }`}
  >
    {manuscript.man_doc_status || "No manuscript submission from the group."}
  </h1>

</div>

<div>
  {loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p className="text-red-500 text-xs">Error: {error}</p>
  ) : historyData ? (
    <div className="history-item border p-2 mb-2 text-xs">
      {/* <p>
        <strong >Status:</strong> {historyData.manuscript_status}
      </p> */}
      <p>
      <strong >Last Updated:</strong>
        <p ClassName="text-base"></p>{' '}
        {new Date(historyData.revision_updated_at).toLocaleString()}
      </p>
    </div>
  ) : (
    <p ClassName="text-base text-gray-100">No revision history.</p>
  )}
</div>

              <textarea
                className="w-full h-48 border border-gray-300 rounded-lg p-3 mb-4 resize-none shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your feedback here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
              ></textarea>

              <button onClick={giveFeedback}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md">
                Return Feedback
              </button>
            </div>
          )}

{isModalOpen && (
    <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                <h5 className="mb-4 text-center font-bold text-gray-500">
                    This is the History Model
                </h5>
    </Modal>
)}
        </div>
      </div>
      <ToastContainer
  position="bottom-right"
  autoClose={2000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  style={{ zIndex: 9999 }} // Ensure this is on top
/>

    </div>

  );
};

export default ReviewManuscript;
