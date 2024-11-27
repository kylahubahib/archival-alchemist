import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardFooter, Image, Button } from '@nextui-org/react';
import ViewClass from '@/Pages/Users/Class/Teacher/ViewClass';

const CreateClassSection = ({ userId }) => {
    const [folders, setFolders] = useState([]);
    const [classCourse, setCourse] = useState('');
    const [classSubjectName, setSubjectName] = useState('');
    const [classSection, setSection] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [isViewClassOpen, setIsViewClassOpen] = useState(false);

    // Add this to store the selected section data
    const [selectedFolder, setSelectedFolder] = useState(null);

    const userToken = localStorage.getItem('userToken');
    const DEFAULT_PROFILE_IMAGE = '/path/to/default/profile.jpg';

    useEffect(() => {
        // Retrieve CSRF token from the meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        console.log("CSRF Token Retrieved: ", csrfToken); // Log the CSRF token

        // Set default CSRF token for axios requests
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

        // Fetch classes
        fetch('/fetch-classes', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': csrfToken,  // CSRF token applied here
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

                console.log('FETCH CLASSES ',data);
            })
            .catch(error => {
                console.error("Error fetching folders:", error);
                setFetchError(true);
            });

        // Fetch courses
        fetch('/fetch-courses', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': csrfToken,  // CSRF token applied here
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json(); // Proceed to parse JSON if the response is OK
            })
            .then(data => setCourses(data))
            .catch(error => {
                console.error("Error fetching courses:", error);
                setFetchError(true);
            });


    }, [userId]);

    const handleCreateFolder = async () => {
        if (!classCourse || !classSubjectName || !classSection) {
            alert("Please fill out all fields.");
            return;
        }

        setIsCreating(true);

        // Retrieve CSRF token for POST request
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        console.log("CSRF Token Used for Folder Creation: ", csrfToken); // Log CSRF token used in the POST request

        try {
            // POST request to create a new class section
            const response = await axios.post('/store-sections', {
                course_id: classCourse,
                subject_name: classSubjectName,
                section_name: classSection,
                user_id: userId,
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,  // CSRF token applied here
                    'Authorization': `Bearer ${userToken}`,  // Optional: Add the user token if needed
                }
            });

            console.log('Success:', response.data.message);
            alert(response.data.message);

            const newFolder = {
                subject_name: classSubjectName,
                section_name: classSection,
                course_id: classCourse,
                instructor_picture: response.data.instructor_picture || DEFAULT_PROFILE_IMAGE,
            };

            setFolders((prevFolders) => [newFolder, ...prevFolders]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Failed to create folder.');
        } finally {
            setIsCreating(false);
        }
    };

    // Pass a parameter here
    const handleViewClass = (data) => {
        setSelectedFolder(data);
        setIsViewClassOpen(true); // Show the ViewClass component
    };

    const handleBack = () => {
        setIsViewClassOpen(false); // Function to go back to previous view
    };


    return (
        <div className="flex flex-col items-start justify-start min-h-screen my-5 bg-gray-100 mt-0 relative w-relative mx-8 px-10">
            {isViewClassOpen ? (
                // Pass the selected section or class
                <ViewClass folders={selectedFolder} onBack={handleBack} /> // Pass handleBack as a prop to ViewClass
            ) : (
                <>
                    {/* Display folders or empty folder with a plus sign */}
                   {/* <div className="flex bg-gray-200 justify-start items-start w-full ">
                    <p className="flex justify-start items-start my-2 mt-3 mx-5 w-full font-bold text-gray-400 text-2xl">Active Classes</p>
                    </div> */}
                    <div className="flex justify-start items-start w-full relative w-relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full m-10 mr-50">
                            {/* First the "Create Class" folder */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#dfe1e5] flex justify-center items-center h-44 rounded-lg border-2 border-[#c1c8d0] cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <div className="flex flex-col items-center text-center  mx-16">
                                    <div className="text-5xl text-[#4285f4]">+</div>
                                    <span className="mt-4 text-lg text-[#4285f4] font-semibold">Create Class</span>
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
                                            src="https://nextui.org/images/hero-card.jpeg"
                                            width={80}
                                        />
                                        {/* Text (Subject and Section) */}
                                        <div className="ml-4">
                                            <p className="text-lg font-semibold text-black">{folder.subject_name}</p>
                                            <p className="text-sm text-black">{folder.course_acronym} {folder.section_name}</p>
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
                                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create a New Folder</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Subject Name"
                                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={classSubjectName}
                                        onChange={(e) => setSubjectName(e.target.value)}
                                    />

                                    {/* Dropdown for Courses */}
                                    <select
                                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={classCourse}
                                        onChange={(e) => setCourse(e.target.value)}
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.course_name} - {course.course_acronym}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Section"
                                        className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                                        value={classSection}
                                        onChange={(e) => setSection(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleCreateFolder}
                                    className={`mt-6 w-full p-4 rounded-md text-white ${isCreating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creating...' : 'Create Folder'}
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

export default CreateClassSection;
