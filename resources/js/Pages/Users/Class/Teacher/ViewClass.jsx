import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import People from '@/Pages/Users/Class/Teacher/People';
import Grades from '@/Pages/Users/Class/Teacher/Grades';
import AssignedprojectForm from '@/Pages/Users/Class/Teacher/AssignedprojectForm';
import AssignedProject from '@/Pages/Users/Class/Teacher/Assignedproject';

const ViewClass = ({ onBack, folders }) => {
    const [showForm, setShowForm] = useState(false);
    const [activeSection, setActiveSection] = useState('people');

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
            <div className="header-bar w-full bg-white border-b border-gray-200 shadow-sm px-10 py-4 flex items-center justify-between">
                {/* Left side buttons */}
                <div className="flex space-x-4 mt-3 mr-5">
                    <button
                        onClick={handleShowAssignedProject}
                        className={`text-gray-800 font-semibold ${activeSection === 'assignedProject' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Stream
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
                    <Button onClick={handleAssignProjectClick} auto color="primary" className="bg-blue-500 text-white font-semibold hover:bg-blue-600" >
                        + Assign Project
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-white">
                {activeSection === 'people' && <People folders={folders} onBack={() => setActiveSection('')} />}
                {activeSection === 'grades' && <Grades  folders={folders}  onBack={() => setActiveSection('')} />}
                {activeSection === 'assignedProject' && <AssignedProject folders={folders} onBack={() => setActiveSection('')} />}
            </div>
=
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
