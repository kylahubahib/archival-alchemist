import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import People from '@/Pages/Users/Class/Student/People';
import Stream from '@/Pages/Users/Class/Student/Stream';

const StudentViewClass = ({ auth, user, onBack, folders }) => {
    const [showForm, setShowForm] = useState(false);
    const [activeSection, setActiveSection] = useState('assignedProject');


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
            <div className="header-bar w-h-screen bg-gray-100 border-b border-gray-200 shadow-sm py-1 flex items-center justify-between">
                {/* Left side buttons */}
                <div className="flex space-x-4 mt-1 ">
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
                </div>


            </div>

            {/* Content Section */}
            <div className="w-full bg-white">
                {activeSection === 'people' && <People folders={folders} onBack={() => setActiveSection('')} />}
                {activeSection === 'assignedProject' && <Stream auth={auth} user={user} folders={folders} onBack={() => setActiveSection('')} />}
            </div>


        </div>
    );
};

export default StudentViewClass;
