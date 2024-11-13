import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import People from '@/Pages/Users/Class/Teacher/People';
import Grades from '@/Pages/Users/Class/Teacher/Grades';

const ViewClass = ({ onBack, folders}) => {
    const [activeSection, setActiveSection] = useState(''); // Track active section

    const handleShowGrades = () => {
        setActiveSection('grades');
    };

    const handleShowPeople = () => {
        setActiveSection('people');
    };

    const handleShowAssignedProject = () => {
        setActiveSection('assignedProject');
    };
    console.log('Folders in ViewClass:', folders);  // Check the folders prop
    return (
        <div className="w-full">
            {/* Header Bar */}
            <div className="header-bar w-full bg-white border-b border-gray-200 shadow-sm px-10 py-4 flex items-center justify-between">
                {/* Left side buttons */}
                <div className="flex space-x-4 mt-3 mr-5">
                    <button
                        onClick={handleShowAssignedProject}
                        className={`text-gray-800 font-semibold ${activeSection === 'assignedProject' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Assigned project
                    </button>
                    <button
                        onClick={handleShowPeople}
                        className={`text-gray-800 font-semibold ${activeSection === 'people' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        People
                    </button>
                    <button
                        onClick={handleShowGrades}
                        className={`text-gray-800 font-semibold ${activeSection === 'grades' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Grades
                    </button>
                </div>

                {/* Right side buttons: "+ Assign Project" and Back */}
                <div className="flex items-center space-x-4 mt-3">
                    <Button auto color="primary" className="bg-blue-500 text-white font-semibold hover:bg-blue-600">
                        + Assign Project
                    </Button>
                    <button onClick={onBack} className="flex items-center text-gray-800 font-semibold hover:text-blue-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="ml-2">Back</span>
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-white">
    {activeSection === 'people' && <People folders={folders} onBack={() => setActiveSection('')} />}
    {activeSection === 'grades' && <Grades onBack={() => setActiveSection('')} />} {/* Show Grades component */}
                {activeSection === 'assignedProject' && <div className="w-full bg-gray-100 p-6"><h3 className="text-gray-800 font-semibold">Assigned Project Section</h3></div>} {/* Show Assigned Project Section */}
                {!activeSection && (
                    <div className="w-full bg-gray-100 p-6"> {/* Default section when no option is selected */}
                        <h3 className="text-gray-800 font-semibold">Select an option above</h3>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ViewClass;
