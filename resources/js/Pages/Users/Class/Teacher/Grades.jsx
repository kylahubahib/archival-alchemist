import React, { useState } from 'react';
import { Card, Avatar, Button, Tooltip } from '@nextui-org/react';
import { motion } from 'framer-motion'; // For animations

const Grades = ({ onBack }) => {

    return (
        <div className="w-h-screen bg-gray-100 from-blue-500 mt-3">
            {/* Grades Section */}
            <div className="flex flex-col items-center justify-center h-full text-gray mb-0">
                <h3 className="text-6xl  font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-600 mb-6 animate__animated animate__fadeIn">
                    Grades Section
                </h3>

                {/* Display message when there are no grades available */}
                <div className="text-center text-lg sm:text-2xl">
                    {/* Avatar with smooth animation */}
                    <motion.div
                        className="mt-3"
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <Avatar
                            src="/images/img3.png"
                            alt="Teacher"
                            size="lg"  // Start with a larger size
                            style={{
                                width: '16vw',  // Adjust this to control the avatar width (40% of the viewport width)
                                height: '16vw', // Same for height
                                boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.1)', // Adding shadow
                            }}
                        />
                    </motion.div>
                    <p className="mt-8 text-2xl font-semibold">No grades available yet.</p>
                    <p className="text-lg mt-1">Add a new grade soon!</p>
                </div>
            </div>



        </div>
    );
};

export default Grades;
