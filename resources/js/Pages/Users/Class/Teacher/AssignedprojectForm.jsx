import React, { useState } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateRangePicker } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";
import axios from 'axios';  // Import Axios
import { DateTime } from 'luxon';

const AssignedprojectForm = ({ onBack, folders }) => {
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(true);

    // Handle date range change
    const handleDateChange = (value) => {
        console.log("DateRangePicker value:", value);

        if (value && value.start && value.end) {
            // Create Luxon DateTime objects
            const startDate = DateTime.fromObject({
                year: value.start.year,
                month: value.start.month,
                day: value.start.day,
                hour: value.start.hour,
                minute: value.start.minute,
            }).toFormat('yyyy-LL-dd HH:mm:ss');  // Format directly

            const dueDate = DateTime.fromObject({
                year: value.end.year,
                month: value.end.month,
                day: value.end.day,
                hour: value.end.hour,
                minute: value.end.minute,
            }).toFormat('yyyy-LL-dd HH:mm:ss');

            setStartDate(startDate);
            setDueDate(dueDate);

            console.log("Formatted Start Date:", startDate);
            console.log("Formatted Due Date:", dueDate);
        } else {
            console.log("Date Range not selected properly");
        }
    };


    const handleSave = async () => {
        const folder = folders;  // Or use a condition to select a specific folder
        console.log('Folder ID:', folder.id);  // Check if folder.id is valid

        // Log to check if startDate and dueDate are set correctly
        console.log("Start Date for Save:", startDate);
        console.log("Due Date for Save:", dueDate);

        const taskData = {
            title,
            instructions,
            startdate: startDate,  // This should now be in ISO format
            duedate: dueDate,      // This should now be in ISO format
        };

        try {
            // Correct the URL template literal

            const response = await axios.post(`/store-assignedTask/${folder.id}`, taskData);

            // Handle successful save
            console.log(response.data);
            setIsFormVisible(false);
            setTimeout(() => {
                onBack();  // Go back after successful save
            }, 500);

        } catch (error) {
            // Handle error
            console.error("Error saving project:", error);
        }
    };

    const handleSlideCloseToRight = () => {
        setIsFormVisible(false);
        setTimeout(() => {
            onBack();
        }, 500);
    };

    return (
        <div className="flex justify-end items-center">
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: '100%', x: '100%' }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            damping: 15,
                            duration: 0.5,
                        }}
                        className="w-1/2 bg-white rounded-lg p-6 shadow-2xl"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            height: '100vh',
                        }}
                    >
                        <div className="relative h-full flex flex-col justify-center items-center ">
                            <Button
                                onClick={handleSlideCloseToRight}
                                className="bg-transparent text-black border-none hover:bg-transparent absolute top-3 left-6 flex items-center "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="ml-2">Close</span>
                            </Button>

                            <h2 className="w-full text-xl t-0 font-bold  mb-6 mt-[-10%] text-gray-600 text-center">
                                Assign a New Project
                            </h2>

                            <h2 className="w-full px-11 text-gray-600">Project Title</h2>
                            <Input
                                className="w-full px-8 mb-4"
                                placeholder="Enter project title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <h2 className="w-full px-11 text-gray-600">Project Instructions</h2>
                            <Textarea
                                className="w-full px-8 mb-4"
                                placeholder="Instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                rows={6}
                            />

                            <h2 className="w-full px-11 text-gray-600">Due Date</h2>
                            <div className="w-full px-8 mb-4">
                                <DateRangePicker
                                    label="Event duration"
                                    hideTimeZone
                                    visibleMonths={2}
                                    onChange={handleDateChange}
                                    defaultValue={{
                                        start: parseZonedDateTime("2024-04-01T00:45[America/Los_Angeles]"),
                                        end: parseZonedDateTime("2024-04-08T11:15[America/Los_Angeles]"),
                                    }}
                                />
                            </div>
                            <div className="w-full px-8 mb-4">
                            <Button
                                onClick={handleSave}
                                className="w-full px-8 mt-4 bg-gray-300 hover:bg-blue-500"
                                color="gradient"
                                size="lg"
                                fullWidth
                            >
                                Save Project
                            </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssignedprojectForm;