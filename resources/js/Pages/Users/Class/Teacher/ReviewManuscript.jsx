import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Modal from "@/Components/Modal"
// import { Avatar, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton

const ReviewManuscript = ({folders, onBack, task, taskID, closeModal, classes,  fileUrl  }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state


  const giveFeedback = async () => {
    const folder = folders[1];  // Or use a condition to select a specific folder
    console.log('Folder ID:', folder.id);  // Check if folder.id is valid

    // Log to check if startDate and dueDate are set correctly
    console.log("This is the Feedback!");

    try {
        // Correct the URL template literal

        const response = await axios.post(`/store-feedback/${classes.id}`);
        console.log("Review Manuscript: ", classes.id);
        // Handle successful save
        console.log(response.data);
        setTimeout(() => {
            onBack();  // Go back after successful save
        }, 500);

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
            <div className="px-6 py-4 ml-10 mr-mb-10 w-relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-600">Feedback</h2>
                <div className="relative group">
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg focus:outline-none hover:bg-gray-300">
                    Options ▼
                  </button>
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-40 hidden group-hover:block">
                    <button className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-100">
                      Approve
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                      Decline
                    </button>
                  </div>
                </div>
              </div>

              <textarea
                className="w-full h-48 border border-gray-300 rounded-lg p-3 mb-4 resize-none shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your feedback here..."
              ></textarea>

              <button onCLick={giveFeedback}
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
    </div>
  );
};

export default ReviewManuscript;
