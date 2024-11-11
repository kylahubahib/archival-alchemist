import React from 'react';
import { Button } from '@nextui-org/react';

const Grades = ({ onBack }) => {
    return (
        <div className="w-full h-full bg-gray-100 p-6">
            {/* Grades Section */}
            <div className="flex flex-col items-center justify-center h-full">
                <h3 className="text-gray-800 font-semibold text-xl mb-4">Grades Section</h3>
                {/* Display message when there are no grades available */}
                <div className="text-center text-gray-600">
                    <p>No grades available yet.</p>
                    {/* You could add an animated icon, here I am using a simple example */}
                    <div className="mt-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </div>
                    <p className="mt-4">Add a new grade soon!</p>
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

export default Grades;
