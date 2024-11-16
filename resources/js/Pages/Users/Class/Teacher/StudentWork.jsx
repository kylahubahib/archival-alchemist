import React, { useState } from "react";

import { Button } from '@nextui-org/react';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const StudentWork = ({folders, onBack, task, taskID,  fileUrl,  }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);

  // Toggle sidebar collapse state
  const toggleSidebar = ({folders, onBack, task, taskID}) => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };

  // Start resizing
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  // Resize the sidebar
  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = Math.max(200, Math.min(600, window.innerWidth - e.clientX));
      setSidebarWidth(newWidth);
    }
  };

  // Stop resizing
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
<div
  className="relative px-6 mr-mb-10 w-full items-center"
  style={{
    position: 'relative',
    top: '-100px', // Adjust this to move the element upwards
    zIndex: 10, // Ensure it’s above the parent container (can adjust the value as needed)
    paddingTop: '0', // Reducing the padding to adjust the space
  }}


      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header Section with Filter Options */}
      <header className="w-relative bg-white text-gray-800 py-2 px-8 shadow-md border-t-1 border-b-1 border-gray-300">
  <div className="flex justify-between items-center">
    <h1 className="text-[1.2rem] text-gray-500">Transforming Capstone Into Discoverable Knowledge</h1>

    {/* Filter Options */}
    <div className="flex space-x-6 ">
      <div className="flex items-center space-x-2 ">
        <label htmlFor="filter" className="text-sm">Filter:</label>
        <select
          id="filter"
          className="p-2 rounded border border-gray-300 text-sm"
        >
          <option value="all">All</option>
          <option value="approved">ByteBuddies</option>
          <option value="pending">GentleMatch</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="search" className="text-sm">Search:</label>
        <input
          id="search"
          type="text"
          className="p-2 rounded border border-gray-300 text-sm"
          placeholder="Search work..."
        />
<div className="pl-5 text-gray-600 hover:text-blue-600 flex items-center group">

<Button onClick={onBack} auto bordered color="error" className="text-gray-600 font-semibold hover:text-blue-500">
                        Back
                        <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 transform rotate-180 group-hover:text-blue-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
                    </Button>
</div>

      </div>
    </div>
  </div>
</header>


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
<div className="flex items-center justify-center h-96 text-gray-500">
  <p>No file to preview.</p>
</div>

          )}
        </div>

        {/* Right sidebar */}
        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? "w-12" : ""} bg-white shadow-lg border-l border-gray-300 relative`}
          style={{ width: isSidebarCollapsed ? 50 : `${sidebarWidth}px` }}
        >
          {/* Draggable handle on the left */}
          {!isSidebarCollapsed && (
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 left-0 h-full w-2 cursor-ew-resize bg-gray-300 hover:bg-gray-500"
            ></div>
          )}

          {/* Left sub-sidebar for icons */}
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
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none">
              📄 {/* Replace with a real icon */}
            </button>
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none">
              🖊️ {/* Replace with a real icon */}
            </button>
            <button className="mb-4 text-blue-600 hover:text-blue-800 focus:outline-none">
              📤 {/* Replace with a real icon */}
            </button>
          </div>

          {/* Main sidebar content */}
          {!isSidebarCollapsed && (
            <div className="px-6 py-4 ml-10 mr-mb-10 w-relative">
              {/* Sidebar header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-600">Feedback</h2>
                <div className="relative group">
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg focus:outline-none hover:bg-gray-300">
                    Options ▼
                  </button>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-40 hidden group-hover:block">
                    <button className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-100">
                      Approve
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                      Decline
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Other Options
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment box */}
              <textarea
                className="w-full h-48 border border-gray-300 rounded-lg p-3 mb-4 resize-none shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your feedback here..."
              ></textarea>

              {/* Return feedback button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md">
                Return Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentWork;
