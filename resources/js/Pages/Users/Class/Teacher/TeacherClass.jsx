import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ShowMemersModal from '@/Components/Modal';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import CreateClassView from '@/Pages/Users/Class/Teacher/CreateClassView ';


//axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
axios.defaults.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;

export default function TeacherClass({ auth }) {
    const [isCreating, setIsCreating] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [className, setClassName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [classes, setClasses] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [users, setAuthors] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedClassName, setSelectedClassName] = useState('');
const [selectedClassCode, setSelectedClassCode] = useState('');
const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
const [hoveredClass, setHoveredClass] = useState(null);
const [members, setMembers] = useState([]);
const [error, setError] = useState('');
const [isMembersLoading, setIsMembersLoading] = useState(false);



// useEffect(() => {
//     if (isShowMembersModalOpen && hoveredClass?.id) {
//         const fetchMembers = async () => {
//             try {
//                 const response = await axios.get(`/groupmembers/${hoveredClass.id}`);
//                 setMembers(response.data);
//                 setError(''); // Clear any previous error
//             } catch (err) {
//                 setError('Failed to load members.'); // Handle error
//             }
//         };
//         fetchMembers();
//     }
// }, [isShowMembersModalOpen, hoveredClass]);


// Fetch members whenever hoveredClass changes
useEffect(() => {
    const fetchMembers = async () => {
        setIsMembersLoading(true); // Set loading state to true before fetching
        try {
            const response = await axios.get(`/groupmembers/${hoveredClass.id}`);
            setMembers(response.data);
            // setError(''); // Clear any previous error
        } catch (err) {
            // setError('Failed to load members.'); // Handle error
        } finally {
            setIsMembersLoading(false); // Set loading state to false after fetching
        }
    };

    if (hoveredClass) {
        fetchMembers();
    }
}, [hoveredClass]); // Only depend on hoveredClass

const handleMouseEnter = (classItem) => {
    setHoveredClass(classItem);
    setIsShowMembersModalOpen(true);
};

const handleModalClose2 = () => {
    setIsShowMembersModalOpen(false);
    setHoveredClass(null);
};

const renderSkeleton = () => (
    <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 cursor-not-allowed">
                <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex justify-center mb-2">
                    <Skeleton className="h-20 w-20" />
                </div>
                <div className="text-center">
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

useEffect(() => {
    // Fetch students from the database to display suggestions when typing
    if (authorInputValue.length > 2) {
        axios.get(`/students/search?name=${authorInputValue}`)
            .then((response) => {
                setAuthorSuggestions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }
}, [authorInputValue]);

const handleAddStudent = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error message

    try {
        const response = await axios.post('/classes/add-students', {
            class_name: selectedClassName,
            class_code: selectedClassCode,
            ins_id: 32, // Pass the appropriate ins_id
            students: users, // Assuming users is an array of student names
        });

        // Handle success response (e.g., close modal, refresh data)
        closeModal();
        setAuthors([]); // Clear authors after adding
        setAuthorInputValue(''); // Clear input after adding

        // You can also refresh the classes or show a success message
    } catch (error) {
        // Handle error (e.g., show error message)
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


    const fetchUpdatedManuscripts = async () => {
        try {
            const response = await axios.get('/manuscripts/class', {
                params: { ins_id: selectedClass.ins_id }
            });
            console.log(response.data); // Check that the new data is correct
            setClasses(response.data); // Update the classes state
        } catch (error) {
            console.error("Error fetching updated manuscripts:", error);
            setMessage("Failed to fetch updated manuscripts.");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const response = await axios.put(`/manuscripts/${id}/update-status`, {
                status: status // 'Y' for Approve, 'X' for Decline
            });

            // Show success message or refresh data if needed
            setMessage(`Manuscript status updated: ${response.data.message}`);

            // Call the fetch function to update the table
            await fetchUpdatedManuscripts(); // Fetch updated data
        } catch (error) {
            setMessage(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/store-newGroupClass', {
                class_name: className, // Ensure this matches the controller's expected key
            });
            setMessage(`Group class created successfully: ${response.data.message}`);

            // Fetch the updated classes after creating a new one
            const classesResponse = await axios.get('/manuscripts/class', {
                params: {
                    ins_id: selectedClass.ins_id // Ensure this matches your class's property
                }
            });
            setClasses(classesResponse.data); // Update classes state with new data
            console.log('Classes:', classes); // Check the structure of classes to ensure ins_id exists

            // Close the modal and reset class name field after successful creation
            setIsGroupModalOpen(false);
            setClassName('');
        } catch (error) {
            // Improved error handling
            if (error.response) {
                setMessage(`Error creating new group class: ${error.response.data.message}`);
            } else {
                setMessage(`Error creating new group class: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/check-student-in-class') // Make sure the URL is correct
        .then(response => {
            if (response.data.class) {
                setClassCode(response.data.class);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching student class info:', error);
            setLoading(false); // Ensure loading is stopped even on error
        });
    }, []);



    const handleModalClose = () => {
        setIsGroupModalOpen(false);
        setClassName(''); // Reset the class name
    };

    useEffect(() => {
        setIsLoading(true); // Set loading to true when the component mounts
        axios.get('/teacher/class')
            .then(response => {
                setCourses(response.data.courses);
                setClasses(response.data.classes); // Store the classes if you need them
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after data is fetched
            });
    }, []);


    useEffect(() => {
        if (selectedClass) {
            console.log('Selected Class:', selectedClass); // Debugging line
            axios.get('/manuscripts/class', {
                params: {
                    ins_id: selectedClass.ins_id // Ensure this matches your class's property
                }
            })
            .then(response => {
                console.log(response.data); // Log the response to check its structure
                setClasses(response.data); // Store the manuscripts data
            })
            .catch(error => {
                console.error("Error fetching manuscripts:", error);
            });
        } else {
            console.warn('selectedClass is undefined or null'); // Debugging line
        }
    }, [selectedClass]);

    const getHeaderTitle = () => {
        if (selectedClass) return 'COURSE | SECTION | GROUP CLASS';
        if (selectedCourse) return 'SECTION';
        return 'COURSES';
    };

    const staticData = [
        { id: 1, dateCreated: '2024-10-01', dateUpdated: '2024-10-02', status: 'approved', title: 'ByteBuddies' },
        { id: 2, dateCreated: '2024-10-03', dateUpdated: '2024-10-04', status: 'declined', title: 'GentleMatch' },
        { id: 3, dateCreated: '2024-10-05', dateUpdated: '2024-10-06', status: 'in progress', title: 'ITMan' },
        { id: 4, dateCreated: '2024-10-07', dateUpdated: '2024-10-08', status: 'norecords', title: 'New ITMan' },
    ];

    const getStatusButton = (status) => {
        switch (status.toLowerCase()) {  // Make sure to handle case sensitivity
            case 'approved':
                return (
                    <Button
                        size="xs"
                        color="success"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );
            case 'declined':
                return (
                    <Button
                        size="xs"
                        color="danger"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );
            case 'in progress':
                return (
                    <Button
                        size="xs"
                        color="warning"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );
            default:
                return (
                    <Button
                        size="xs"
                        color="default"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{getHeaderTitle()}</h2>
                    {selectedCourse && !selectedClass && (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsGroupModalOpen(true)}>
                            Add Section
                        </button>
                    )}
                </div>
            }
        >
            <Head title={getHeaderTitle()} />            {isCreating ? (
    <CreateClassView onCreate={handleCreate} />
) : (
    <div>
        {/* Render courses or other main content here */}
        {courses.map((course, index) => (
            <div key={index}>
                <h3>{course.name}</h3>
                {/* Add more course details and actions as needed */}
            </div>
        ))}
    </div>
)}


            {/* <div className="h-screen bg-white rounded m-4 rounded-xl"> */}
                {/* <div className="w-full mx-auto sm:px-6 lg:px-8"> */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 w-full">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xl">
                                    {selectedClass ? 'GROUP CLASS' : selectedCourse ? 'SECTIONS' : 'COURSES'}
                                </div>
                            </div>
                            <hr className="mb-4" />
                            {isLoading ? (
                            renderSkeleton()  // Call the skeleton function here
                        ) : (
                            <>
                            {/* Render course options */}
                            {!selectedCourse && (

                                <div className="grid grid-cols-3 gap-4">
                                    {courses.map(course => (
                                        <div
                                            key={course.id}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">{(course.sections || []).length} Sections</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faFolder} size="4x" />
                                            </div>
                                            <div className="text-center">{course.course_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Render selected class information */}
                            {selectedClass && (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-1/6">
                                            <Button
                                                color="primary"
                                                variant="bordered"
                                                onClick={() => setIsGroupModalOpen(true)}
                                                startContent={<FontAwesomeIcon icon={faUser} />}
                                            >
                                                New Group Class
                                            </Button>

                                            <Modal
                                                backdrop="opaque"
                                                isOpen={isGroupModalOpen}
                                                onOpenChange={handleModalClose}
                                                classNames={{
                                                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                                                }}
                                            >
                                                <ModalContent>
                                                    {(onClose) => (
                                                        <>
                                                            <ModalHeader className="flex flex-col gap-1">New Class Group</ModalHeader>
                                                            <ModalBody>
                                                                <div className="flex flex-col gap-4">
                                                                    <input
                                                                        id="className"
                                                                        type="text"
                                                                        className={`border p-2 rounded-md ${!className ? 'border-red-500' : 'border-gray-300'}`}
                                                                        placeholder="Enter class group name"
                                                                        onChange={(e) => setClassName(e.target.value)}
                                                                        value={className}
                                                                    />
                                                                </div>
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button
                                                                    color="primary"
                                                                    auto
                                                                    flat
                                                                    onClick={handleCreate}
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? 'Creating...' : 'Create'}
                                                                </Button>
                                                                <Button auto flat onClick={handleModalClose}>
                                                                    Close
                                                                </Button>
                                                            </ModalFooter>
                                                        </>
                                                    )}
                                                </ModalContent>
                                            </Modal>


                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <ClassDropdown ins_id={selectedClass.ins_id} onUpdate={fetchUpdatedManuscripts} />
                                        </div>
                                    </div>
                                    <hr className="mb-4" />

                                    <div className="flex">
                                        <div className="w-full">
                                            <Table>
                                                <TableHeader>
                                                    <TableColumn className="w-[10%] text-left">Class Name</TableColumn>
                                                    <TableColumn className="w-[60%] text-center">Title</TableColumn>
                                                    <TableColumn className="text-center">Created</TableColumn>
                                                    <TableColumn className="text-center">Updated</TableColumn>
                                                    <TableColumn className="text-center">Status</TableColumn>
                                                    <TableColumn className="text-center">Actions</TableColumn>
                                                </TableHeader>

                                                <TableBody>
                                                    {classes.map((classItem) => (
                                                        <TableRow key={classItem.id}>
                                                    <TableCell className="w-[10%] text-left">
                                <span
                                    className="cursor-pointer text-blue-500 hover:underline"
                                    onMouseEnter={() => handleMouseEnter(classItem)}
                                >
                                    {classItem.class_name}
                                </span>
                            </TableCell>
                            <TableCell className="text-left">
                                                                {classItem.man_doc_title|| "No manuscript submission from the group."}
                                                            </TableCell>
                                                                                 <TableCell className="text-center">
                                                                {new Date(classItem.created_at).toLocaleDateString() || "N/A"}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {new Date(classItem.updated_at).toLocaleDateString() || "N/A"}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {getStatusButton(classItem.man_doc_status || "norecords")}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Dropdown >
                                                                    <DropdownTrigger>
                                                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white">
                                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                                        </div>
                                                                    </DropdownTrigger>
                                                                    <DropdownMenu aria-label="Actions" >
                                                                        <DropdownItem key="code" onClick={() => handleStatusChange(classItem.id, 'X')}>Copy group code</DropdownItem>
                                                                        <DropdownItem key="add" onClick={() => openModal(classItem.class_name, classItem.class_code)}>Add student</DropdownItem>
                                                                        <DropdownItem key="approve" onClick={() => handleStatusChange(classItem.id, 'Y')}>Approve</DropdownItem>
                                                                        <DropdownItem key="decline" onClick={() => handleStatusChange(classItem.id, 'X')}>Decline</DropdownItem>
                                                                        <DropdownItem key="delete" className="text-danger" color="danger">Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

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


                                            {isShowMembersModalOpen && hoveredClass && (
    <Modal isOpen={isShowMembersModalOpen} onClose={handleModalClose2}>
        <ModalContent>
            <button
                disabled={true}
                className="bg-gray-300 text-gray py-2 text-gray-500 px-4 font-bold rounded w-full"
            >
                Members
            </button>
            <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
                <h5 className="mb-4 text-center font-bold text-gray-500">
                    {hoveredClass.man_doc_title || "No manuscript submission from the group."}
                </h5>
                {error && <p className="text-red-500">{error}</p>}
                {isMembersLoading ? (
                    // Customized Skeleton
                    <div className="flex flex-col space-y-2 w-full">
                        {/* Title Skeleton */}
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                    </div>
                ) : members.length > 0 ? (
                    members.map(member => (
                        <p key={member.user.id} className="mb-2 text-gray-600">{member.user.name}</p>
                    ))
                ) : (
                    <p className="mb-2 text-gray-600">No members found.</p>
                )}
            </div>
        </ModalContent>
    </Modal>
)}


                                        </div>
                                    </div></>
                            )}
                                </>
                            )}
                        </div>
                    </div>
                {/* </div> */}
            {/* </div> */}
        </AuthenticatedLayout>
    );
}
