import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import People from '@/Pages/Users/Class/Teacher/People';
import Grades from '@/Pages/Users/Class/Teacher/Grades';
import AssignedprojectForm from '@/Pages/Users/Class/Teacher/AssignedprojectForm';
import Stream from '@/Pages/Users/Class/Teacher/Stream';

const ViewClass = ({ onBack, folders }) => {
    const [showForm, setShowForm] = useState(false);
    const [activeSection, setActiveSection] = useState('assignedProject');

    const handleShowGrades = () => {
        setActiveSection('grades');
    };

    const handleShowPeople = () => {
        setActiveSection('people');
    };

    const handleShowAssignedProject = () => {
        setActiveSection('assignedProject');
    };

    const handleAssignProjectClick = () => {
        setShowForm(true);  // Show form directly instead of toggling
    };

    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="header-bar w-h-screen bg-gray-100 border-b border-gray-200 shadow-sm ml-5 py-1 flex items-center justify-between">
                {/* Left side buttons */}
                <div className="flex space-x-4 mt-1 mr-5">
                    <button
                        onClick={handleShowAssignedProject}
                        className={`text-gray-600 font-semibold ${activeSection === 'assignedProject' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Stream
                    </button>
                    <button
                        onClick={handleShowPeople}
                        className={`text-gray-600 font-semibold ${activeSection === 'people' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        People
                    </button>
                    <button
                        onClick={handleShowGrades}
                        className={`text-gray-600 font-semibold ${activeSection === 'grades' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Grades
                    </button>
                </div>

                {/* Right side buttons: "+ Assign Project" and Back */}
                <div className="flex items-center space-x-4 mt-1">
                    <Button onClick={handleAssignProjectClick} auto color="primary" className="bg-blue-500 text-white font-semibold hover:bg-blue-600" >
                        + Assign Project
                    </Button>
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

            {/* Content Section */}
            <div className="w-full bg-white">
                {activeSection === 'people' && <People folders={folders} onBack={() => setActiveSection('')} />}
                {activeSection === 'grades' && <Grades  folders={folders}  onBack={() => setActiveSection('')} />}
                {activeSection === 'assignedProject' && <Stream folders={folders} onBack={() => setActiveSection('')} />}
            </div>

            {/* Conditionally Render AssignedprojectForm */}
            {showForm && (
                <div>
                    <AssignedprojectForm onBack={() => setShowForm(false)} folders={folders} /> {/* Hide form on form back */}
                </div>
            )}
        </div>
    );
};

export default ViewClass;