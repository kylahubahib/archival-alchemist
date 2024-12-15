import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import StudentViewClass from '@/Pages/Users/Class/Student/StudentViewClass';
import { router } from '@inertiajs/react';

const JoinClassSection = ({ auth, user, userId, }) => {
    const [folders, setFolders] = useState([]);
    const [classCourse, setCourse] = useState('');
    const [ClassCode, setClassCode] = useState('');
    const [classSection, setSection] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [isViewClassOpen, setIsViewClassOpen] = useState(false);

    const userToken = localStorage.getItem('userToken');
    const DEFAULT_PROFILE_IMAGE = '/images/class.jpg';

    useEffect(() => {
        // Retrieve CSRF token from the meta tag
        // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        // console.log("CSRF Token Retrieved: ", csrfToken); // Log the CSRF token

        // Set default CSRF token for axios requests
        // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        // Fetch classes
        fetch('/fetch-studentClasses', {
            method: 'GET',
            headers: {
                // 'X-CSRF-TOKEN': csrfToken,  // CSRF token applied here
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    setFetchError(true);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setFolders(data);
                setFetchError(false);
            })
            .catch(error => {
                console.error("Error fetching folders:", error);
                setFetchError(true);
            });


    }, [userId]);

    const handleJoinClass = async () => {
        if (!ClassCode) {
            alert("Please fill out the field.");
            return;
        }

        setIsJoining(true);

        try {
            // Check if the user is premium
            const premiumResponse = await axios.post('/check-user-premium-status');
            const { is_premium } = premiumResponse.data;

            console.log('Premium status:', is_premium);

            if (is_premium) {
                // Check if the class code exists
                const classResponse = await axios.post('/check-class-code', { class_code: ClassCode });

                if (classResponse.data.exists) {
                    console.log('Class details:', classResponse.data.classDetails);

                    // Join the class
                    await axios.post('/store-student-class', { class_code: ClassCode });
                    setClassCode('');
                    // alert('Successfully joined the class!');
                    router.reload();
                    setIsModalOpen(false); // Close modal
                } else {
                    alert('Class code not found. Please try again.');
                }
            } else {
                alert('You need to be a premium user to join the class.');
            }

            fetch('/fetch-studentClasses')
    .then(response => {
        if (!response.ok) {
            setFetchError(true);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        setFolders(data);
        setFetchError(false);
    })
    .catch(error => {
        console.error("Error fetching folders:", error);
        setFetchError(true);
    })
    .finally(() => {
        setIsJoining(false); // Always reset loading state
    });

        } catch (error) {
            console.error('Error joining class:', error);
            alert('An error occurred while joining the class.');
        } finally {
            setIsJoining(false); // Always reset loading state
        }
    };

    const handleViewClass = (data) => {
        setFolders(data)
        setIsViewClassOpen(true); // Show the ViewClass component
    };

    const handleBack = () => {
        setIsViewClassOpen(false); // Function to go back to previous view
    };

    return (
        <div className="flex flex-col items-start justify-start mx-8 bg-gray-100 mt-0 relative min-h-screen px-10">
            {isViewClassOpen ? (
                <StudentViewClass auth={auth} user={user} folders={folders} onBack={handleBack} /> // Pass handleBack as a prop to ViewClass
            ) : (
                <>
                    {/* Display folders or empty folder with a plus sign */}
                   {/* <div className="flex bg-gray-200 justify-start items-start w-full ">
                    <p className="flex justify-start items-start my-2 mt-3 mx-5 w-full font-bold text-gray-400 text-2xl">Active Classes</p>
                    </div> */}
                    <div className="flex justify-start items-start relative w-relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full m-10 mr-50">
                            {/* First the "Create Class" folder */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#dfe1e5] flex justify-center items-center h-44 rounded-lg border-2 border-[#c1c8d0] cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <div className="flex flex-col items-center text-center mx-16">
                                    <div className="text-5xl text-[#4285f4]">+</div>
                                    <span className="mt-4 text-lg text-[#4285f4] font-semibold">Join Class</span>
                                </div>
                            </div>

                            {/* Other folders */}
                            {folders.map((folder, index) => (
                                <Card key={index} isFooterBlurred radius="lg" className="border-none">
                                    <div className="flex items-center p-4">
                                        {/* Image of the class (Instructor's profile picture or static placeholder) */}
                                        <Image
                                            alt="Instructor"
                                            className="object-cover"
                                            height={80}
                                            src="images/class.png"
                                            width={80}
                                        />
                                        {/* Text (Subject and Section) */}
                                        <div className="ml-4">
                                            <p className="text-lg font-semibold text-black">{folder.subject_name}</p>
                                            <p className="text-sm text-black">{folder.course?.course_acronym} {folder.section_name}</p>
                                        </div>
                                    </div>
                                    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                        <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm"
                                        onClick={() => handleViewClass(folder)}>
                                            View Class
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Modal for Creating a Folder */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-700 bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Join a class</h2>
                                <div className="space-y-4">
                                    <p>Ask your teacher for the class code, then enter it here.</p>
                                    <input
                                        type="text"
                                        placeholder="Class Code"
                                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={ClassCode}
                                        onChange={(e) => setClassCode(e.target.value)}
                                    />

                                </div>
                                <button
                                    onClick={handleJoinClass}
                                    className={`mt-6 w-full p-4 rounded-md text-white ${isJoining ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={isJoining}
                                >
                                    {isJoining ? 'Joining...' : 'Join Class'}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-2 w-full p-4 rounded-md text-gray-800 border border-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JoinClassSection;
