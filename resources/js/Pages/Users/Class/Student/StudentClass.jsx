import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import UploadCapstone from '@/Pages/Users/Class/Student/UploadCapstone';
import Track from '@/Pages/Users/Class/Student/Track';
import Approve from '@/Pages/Users/Class/Student/Approved';

export default function StudentClass({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [joinedClass, setJoinedClass] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const handleJoinClass = () => {
        // Reset error message
        setErrorMessage('');

        // Check if the current user is premium
        axios.post('/check-user-premium-status')
            .then(response => {
                const { is_premium } = response.data;

                // Log the is_premium value to the console
                console.log('is_premium status:', is_premium);

                if (is_premium === true) {
                    // Proceed to check the class code
                    axios.post('/check-class-code', { class_code: classCode })
                        .then(response => {
                            if (response.data.exists) {
                                // Extract class details
                                const { class_name, ins_id } = response.data.classDetails;

                                // Perform insertion with class details
                                axios.post('/store-student-class', { class_code: classCode, class_name, ins_id })
                                    .then(() => {
                                        setJoinedClass(true);
                                        setActiveTab('track');  // Set active tab to 'upload'
                                        closeModal();
                                    })
                                    .catch(() => {
                                        setErrorMessage('An error occurred while joining the class.');
                                    });
                            } else {
                                setErrorMessage('Class code not found. Please try again.');
                            }
                        })
                        .catch(() => {
                            setErrorMessage('An error occurred while checking the class code.');
                        });
                } else {
                    setErrorMessage('You need to be a premium user to join the class.');
                }
            })
            .catch(() => {
                setErrorMessage('An error occurred while checking your premium status.');
            });
    };


    const handleLeaveClass = () => {
        openConfirmModal();
    };

    const confirmLeaveClass = () => {
        setJoinedClass(false);
        setActiveTab(null);
        closeConfirmModal();
    };

    const cancelLeaveClass = () => {
        closeConfirmModal();
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const buttonStyle = (tab) => `px-4 py-2 font-semibold rounded-t-lg border ${activeTab === tab ? 'bg-gray-200 border-b-2 border-b-blue-500 text-blue-500' : 'border-transparent text-gray-700 hover:text-blue-500'}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Class</h2>}
            className="h-screen flex flex-col"  // Ensure full height for parent layout
        >
            <Head title="Class for Student" />

            <div className="bg-white rounded m-4 min-h-screen"> {/* Use flex-grow to take available space */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 min-h-screen"> {/* Adjust height to flex container */}
                            {!joinedClass ? (
                                <div className="flex flex-col items-center justify-center m-20">
                                    <BookOpenIcon className="h-32 w-32 text-blue-500" />
                                    <button
                                        onClick={openModal}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
                                    >
                                        Join Class
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="flex">
                                            <button
                                                onClick={() => handleTabClick('upload')}
                                                className={buttonStyle('upload')}
                                            >
                                                Upload
                                            </button>
                                            <button
                                                onClick={() => handleTabClick('track')}
                                                className={buttonStyle('track')}
                                            >
                                                Track
                                            </button>
                                            <button
                                                onClick={() => handleTabClick('approve')}
                                                className={buttonStyle('approve')}
                                            >
                                                Approve
                                            </button>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={handleLeaveClass}
                                                className="px-4 py-2 bg-red-400 text-white font-semibold rounded-md"
                                            >
                                                Leave Class
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-300 w-full"></div> {/* Gray Divider Below Buttons */}

                                    {/* Section with background color */}

                                    <div className="bg-gray-100 flex-grow rounded-b-lg w-full"> {/* Ensure this section grows */}
                                        {/* Conditionally Render Active Tab Component */}
                                        <div className="mt-6">
                                            {activeTab === 'upload' && <UploadCapstone />}
                                            {activeTab === 'track' && <Track />}
                                            {activeTab === 'approve' && <Approve />}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Enter Class Code</h3>
                    <div className="mt-2">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                        />
                    </div>
                    {errorMessage && (  // Display error message if any
                        <div className="mt-2 text-red-500">
                            <ul className="list-disc pl-5">
                                <li>{errorMessage}</li>
                            </ul>
                        </div>
                    )}
                    <div className="mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
                            onClick={handleJoinClass}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Enter Class Code</h3>
                    <div className="mt-2">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                        />
                    </div>
                    {errorMessage && (
                        <div className="mt-2 text-red-500">
                            <ul className="list-disc pl-5">
                                <li>{errorMessage}</li>
                            </ul>
                        </div>
                    )}
                    <div className="mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md"
                            onClick={handleJoinClass}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
