import React from 'react';
import { Card, Avatar, Button, Tooltip } from '@nextui-org/react';
import { AiOutlineUserAdd } from 'react-icons/ai'; // Human figure with a plus symbol icon

const People = ({ onBack }) => {
    // Function to handle removing a student, could be linked to state later for dynamic removal
    const handleRemoveStudent = (studentName) => {
        console.log(`Remove ${studentName}`);
    };

    return (
        <div className="w-full h-full bg-gray-100 p-6">
            {/* Teachers Section */}
            <div className="w-full bg-white p-4 rounded-md shadow mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Teachers</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
                        <Avatar
                            src="https://nextui.org/avatars/avatar-1.png"
                            alt="Teacher"
                            size="lg"
                        />
                        <div className="text-gray-800 font-medium">John Doe</div>
                    </div>
                    {/* Add more teachers here if needed */}
                </div>
            </div>

            {/* Students Section */}
            <div className="w-full bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                    {/* Add student icon with human and plus symbol */}
                    <Tooltip content="Add new student">
                        <Button
                            auto
                            icon={<AiOutlineUserAdd />}
                            color="primary"
                            size="sm"
                            onClick={() => console.log("Add student")}
                        />
                    </Tooltip>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src="https://nextui.org/avatars/avatar-1.png"
                                alt="Student"
                                size="lg"
                            />
                            <div className="text-gray-800 font-medium">Jane Smith</div>
                        </div>
                        {/* Remove button as text */}
                        <Button
                            auto
                            color="error"
                            size="sm"
                            onClick={() => handleRemoveStudent('Jane Smith')}
                            className="text-red-500"
                        >
                            Remove
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                src="https://nextui.org/avatars/avatar-1.png"
                                alt="Student"
                                size="lg"
                            />
                            <div className="text-gray-800 font-medium">Alex Johnson</div>
                        </div>
                        {/* Remove button as text */}
                        <Button
                            auto
                            color="error"
                            size="sm"
                            onClick={() => handleRemoveStudent('Alex Johnson')}
                            className="text-red-500"
                        >
                            Remove
                        </Button>
                    </div>
                    {/* Add more students here if needed */}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <Button auto color="error" onClick={onBack}>
                    Back
                </Button>
            </div>
        </div>
    );
};

export default People;
