import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Tooltip } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// import { AiOutlineUserAdd } from 'react-icons/ai'; // Human figure with a plus symbol icon
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton


const People = ({auth, user, onBack, folders }) => {
    const [profilePic, setProfilePic] = useState(auth.user.user_pic);
    const [FacultyUser, setFacultyUser] = useState(null); // Declare the user state
    const [StudentsUsers, setStudentUser] = useState(null); // Declare the user state
    const [isLoading, setIsLoading] = useState(false);

    // const [csrfToken, setCsrfToken] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
    const [errors, setErrors] = useState({});
    const [isCreating, setIsCreating] = useState(true);
    const [className, setClassName] = useState("");
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [users, setAuthors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClassName, setSelectedClassName] = useState('');
const [selectedClassCode, setSelectedClassCode] = useState('');
useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch group members and teacher data concurrently
            const [groupResponse, userResponse] = await Promise.all([
                axios.get(`/fetch-groupmembers/${folders.id}`),
                axios.get("/fetch-currentuser")
            ]);

            // Set data for students and teacher
            setStudentUser(groupResponse.data);
            setFacultyUser(userResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false); // Set loading to false after data is fetched
        }
    };

    fetchData();
}, []);


    // Function to handle removing a student, could be linked to state later for dynamic removal
    const handleRemoveStudent = async (studentId) => {
        try {
            // Remove student from the UI immediately (Optimistic UI Update)
            setStudentUser(prevStudents => prevStudents.filter(student => student.id !== studentId));

            // Send DELETE request to remove the student
            await axios.delete(`/delete-groupmembers/${studentId}`);

            // Refetch the students list from the server
            const response = await axios.get(`/fetch-groupmembers/${folders.id}`);
            setStudentUser(response.data);  // Update state with fresh student data
        } catch (error) {
            // Handle error (show message, etc.)
            console.error("Error removing student:", error);
            setErrorMessage("Failed to remove student. Please try again.");
        }
    };


    const handleModalClose = () => {
        setIsGroupModalOpen(false);
        setClassName(''); // Reset the class name
    };

    const openModal = (className, classCode) => {
        setSelectedClassName(className);
        setSelectedClassCode(classCode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAuthors([]); // Clear authors when closing modal
        setAuthorInputValue(''); // Clear input when closing modal
    };
    // Other functions (handleAuthorKeyDown, fetchAuthorSuggestions, etc.) remain unchanged

    const handleAuthorKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault(); // Prevent form submission on Enter
            setAuthors([...users, e.target.value.trim()]);  // Update authors
            setAuthorInputValue('');  // Clear input after adding author
            setAuthorSuggestions([]); // Clear suggestions
        }
    };

    const handleAuthorsRemove = (index) => {
        setAuthors(users.filter((_, i) => i !== index));
    };

    const handleAuthorInputChange = (e) => {
        const { value } = e.target;
        setAuthorInputValue(value);
        if (value.trim()) {
            fetchAuthorSuggestions(value);
        } else {
            setAuthorSuggestions([]);
        }
    };


    const fetchAuthorSuggestions = async (query) => {
        try {
            const response = await axios.get('/students/search', {
                params: { name: query },
            });
            setAuthorSuggestions(response.data); // response.data should be an array of { id, name }
        } catch (error) {
            console.error('Error fetching Author suggestions:', error);
            setAuthorSuggestions([]);
        }
    };

    const handleAuthorSuggestionSelect = (suggestion) => {
        setAuthors([...users, suggestion]);
        setAuthorInputValue('');
        setAuthorSuggestions([]);
    };

    // Fetch the CSRF token and set it in axios defaults
    // useEffect(() => {
    //     const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    //     if (csrfToken) {
    //         setCsrfToken(csrfToken);
    //         axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    //         axios.defaults.headers.common['Content-Type'] = 'application/json';
    //     }
    // }, []);




    const handleAddStudent = async () => {
        const folder = folders;  // Or use a condition to select a specific folder
        console.log('Folder ID:', folder.id);  // Check if folder.id is valid

        // if (!csrfToken) {
        //     setErrorMessage('CSRF token not found. Please try again.');
        //     return;
        // }

        setIsLoading(true);
        setErrorMessage(''); // Clear any previous error message

        try {
            // Make sure we check for the correct data being passed into users
            console.log("Adding students:", users);

            if (!Array.isArray(users) || users.length === 0) {
                throw new Error("No students to add");
            }

            console.log('SECTION ID', folder.id);

            // Send the POST request to add the student
            const response = await axios.post('/store-groupmembers', {
                section_id: folder.id,
                students: users, // Assuming users is an array of student names
            }, {
                headers: {
                    // 'X-CSRF-TOKEN': csrfToken,  // CSRF token applied here
                    'Content-Type': 'application/json',
                }
            });

            // Check the response from the API
            console.log("API Response:", response.data)

            // Refetch the students list from the server after the student has been added
            const groupResponse = await axios.get(`/fetch-groupmembers/${folders.id}`);

            if (groupResponse.data) {
                setStudentUser(groupResponse.data);  // Update the students state with the fresh data
            } else {
                console.error("No students returned from the server.");
                setErrorMessage('Failed to refresh student list.');
            }

            // Optionally, clear the authors list after adding
            setAuthors([]);
            setAuthorInputValue(''); // Clear input after adding

            // Close the modal
            closeModal();

        } catch (error) {
            // Handle error (show error message)
            console.error('Error adding students:', error);

            // Check if error response exists and set the error message accordingly
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Set error message from the API
            } else {
                setErrorMessage('Failed to add students. Please try again.'); // Fallback error message
            }
        } finally {
            setIsLoading(false);
        }
    };



    console.log('Folders in People:', folders);  // Check the folders prop
    return (
        <div className="pl-10 bg-gray-100 pt-5 w-full pb-20">
            {/* Teachers Section */}
            <div className="relative w-relative h-48 mb-5 bg-white p-10 rounded-md shadow ml-5 mr-20">
                <h3 className="text-lg font-semibold text-gray-600 mb-4">Teachers</h3>
                <div className="space-y-4">
                {isLoading ? (
                        // Display Skeleton loader for teacher
                        <Skeleton height={40} width="100%" />
                    ) : (
                        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
                            {/* <Avatar
                                src="https://nextui.org/avatars/avatar-1.png"
                                alt="Teacher"
                                size="lg"
                            /> */}
                                                                <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={ profilePic || "/images/default_user_pic.png"
                                        }
                                        alt="Profile Picture"
                                    />
                            {FacultyUser && <div className="text-gray-800 font-medium">{FacultyUser.name}</div>}
                        </div>
                    )}
                    {/* Add more teachers here if needed */}
                </div>
            </div>

            {/* Students Section */}
            <div className="relative w-relative bg-white p-4 rounded-md shadow ml-5 mr-20">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-600">Students</h3>
                    {/* Add student icon with human and plus symbol */}
                    <Button
                        onClick={() => openModal(true)}
                        color="blue"
                        startContent={<FontAwesomeIcon icon={faUser} className="text-blue-500 text-xl" />}
                        className="w-5 h-20 rounded-full flex justify-center p-0 items-center hover:bg-gray-100">
                        <p className="text-blue-500 text-xl p-0">+</p>
                    </Button>
                </div>

                <div className="space-y-4">
                {isLoading ? (
                        // Display Skeleton loader for students if loading
                        <Skeleton height={40} width="100%" />
                    ) : StudentsUsers && StudentsUsers.length > 0 ? (
                        StudentsUsers.map((student, index) => (
                            <div key={student.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-4">
                                    {/* <Avatar
                                        src="https://nextui.org/avatars/avatar-1.png"
                                        alt="Student"
                                        size="lg"
                                    /> */}
                                                                        <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src={
                                            student.user_id === auth.user.id
                                                ? profilePic
                                                : student.user?.user_pic || "/images/default_user_pic.png"
                                        }
                                        alt="Profile Picture"
                                    />
                                    <div className="text-gray-800 font-medium">
                                        {student.user.name}
                                    </div>
                                </div>
                                <Button
                                    auto
                                    color="error"
                                    size="sm"
                                    onClick={() => handleRemoveStudent(student.stud_id)}  // Adjust to remove based on specific student
                                    className="text-red-500"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No students enrolled.</p>
                    )}
                </div>

            </div>

            {/* Modal for Adding Authors */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalContent>
                    <ModalHeader>Add Student</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Enter authors name and press Enter"
                                className="w-full p-2 border rounded mb-2"
                                value={authorInputValue}
                                onChange={handleAuthorInputChange}
                                onKeyDown={handleAuthorKeyDown}
                            />
                            {errors.users && <div className="text-red-600 text-sm mb-2">{errors.users}</div>}
{errorMessage && <div className="text-red-600 text-sm mb-2">{errorMessage}</div>} {/* Error message display */}

                            {authorSuggestions.length > 0 && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 w-full">
                                    {authorSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleAuthorSuggestionSelect(suggestion.name)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="tags-container flex flex-wrap mt-2">
                                {users.map((author, index) => (
                                    <div key={index} className="tag bg-gray-200 p-1 rounded mr-2 mb-2 flex items-center">
                                        {author}
                                        <button
                                            type="button"
                                            className="ml-1 text-red-600"
                                            onClick={() => handleAuthorsRemove(index)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" auto onClick={handleAddStudent} disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add'}
                        </Button>
                        <Button auto onClick={closeModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    );
};

export default People;
