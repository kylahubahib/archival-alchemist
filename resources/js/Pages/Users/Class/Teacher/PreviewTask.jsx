import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import People from '@/Pages/Users/Class/Teacher/People';
import Grades from '@/Pages/Users/Class/Teacher/Grades';
import AssignedprojectForm from '@/Pages/Users/Class/Teacher/AssignedprojectForm';
import TaskInstructions from '@/Pages/Users/Class/Teacher/TaskInstructions';
import StudentWork from '@/Pages/Users/Class/Teacher/StudentWork';

const PreviewTask = ({ folders, onBack, task, taskID }) => {
    const [showForm, setShowForm] = useState(false);
    const [activeSection, setActiveSection] = useState('taskInstructions');
    console.log('TaskInstructions received task:', task);
    console.log('TaskInstructions received taskID:', taskID);

    const handleShowGrades = () => {
        setActiveSection('grades');
    };

    const handleShowPeople = () => {
        setActiveSection('people');
    };

    const handleShowAssignedProject = () => {
        setActiveSection('taskInstructions');
    };

    const handleShowStudentWork = () => {
        setActiveSection('studentWork');
    };

    return (
<div className="header-bar w-full bg-gray-100 h-full border-b border-gray-200 shadow-sm absolute top-0 left-0 items-center z-10">
{/* <div className="header-bar w-screen bg-gray-100 border-b border-gray-200 shadow-sm absolute top-0 left-0 items-center z-10"> */}
{/* Header Bar */}
            <div className="header-bar bg-gray-100 border-b border-gray-200 shadow-sm ml-5 px-10 pt-0 flex items-center justify-between">

                {/* Left side buttons */}
                <div className="flex space-x-4 mt-1 mr-5">
                    <button
                        onClick={handleShowAssignedProject}
                        className={`text-gray-600 font-semibold ${activeSection === 'taskInstructions' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Task Instructions
                    </button>

                    <button
                        onClick={handleShowStudentWork}
                        className={`text-gray-600 font-semibold ${activeSection === 'studentWork' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Student Work
                    </button>
                    <button
                        onClick={handleShowPeople}
                        className={`text-gray-600 font-semibold ${activeSection === 'people' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        People
                    </button>

                    {/* <button
                        onClick={handleShowGrades}
                        className={`text-gray-600 font-semibold ${activeSection === 'grades' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                        Grades
                    </button> */}
                </div>

                {/* Right side buttons: "+ Assign Project" and Back */}
                <div className="flex items-center space-x-4 mt-1">
                    {/* <Button onClick={handleAssignProjectClick} auto color="primary" className="bg-blue-500 text-white font-semibold hover:bg-blue-600" >
                        + Assign Project
                    </Button> */}
                    <Button onClick={onBack} auto bordered color="error" className="text-gray-600 font-semibold hover:text-blue-500">
                        Back to Stream
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

            {/* Content Section with Margin Top */}
            <div className="w-full bg-gray-100  pt-12"> {/* Add mt-12 to create space below the header */}
                {activeSection === 'people' && <People folders={folders} onBack={() => setActiveSection('')} />}
                {activeSection === 'grades' && <Grades  folders={folders}  onBack={() => setActiveSection('')} />}
                {activeSection === 'taskInstructions' && <TaskInstructions folders={folders} onBack={() => setActiveSection('')}  task={task} taskID={taskID}/>}
                {activeSection === 'studentWork' && <StudentWork folders={folders} onBack={() => setActiveSection('')}  task={task} taskID={taskID}/>}
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

export default PreviewTask;
