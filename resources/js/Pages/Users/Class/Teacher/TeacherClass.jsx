import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export default function TeacherClass({ auth }) {
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
            const response = await axios.get('/api/authors/suggestions', {
                params: { query, users },
            });
            setAuthorSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching Author suggestions:', error.response?.data || error.message);
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


    const handleAddStudent = () => {
        setIsLoading(true);
        // Reset error message
        setErrorMessage('');

        console.log('Checking user premium status...'); // Added log

        // Check if the current user is premium
        axios.post('/check-user-premium-status')
            .then(response => {
                const { is_premium } = response.data;

                console.log('is_premium status:', is_premium); // Log the is_premium value

                if (is_premium) {
                    console.log('User is premium, checking class code...'); // Added log
                    // Proceed to check the class code
                    axios.post('/check-class-code', { class_code: classCode })
                        .then(response => {
                            if (response.data.exists) {
                                const { class_name, ins_id } = response.data.classDetails;

                                console.log('Class details found:', { class_name, ins_id }); // Added log

                                // Perform insertion with class details
                                axios.post('/store-student-class', { class_code: classCode, class_name, ins_id })
                                    .then(() => {
                                        setJoinedClass(true);
                                        setActiveTab('track');  // Set active tab to 'upload'
                                        console.log('Student added successfully'); // Added log
                                        closeModal();
                                    })
                                    .catch(error => {
                                        console.error('Error adding student:', error); // Log the error
                                        setErrorMessage('An error occurred while adding the student');
                                    });
                            } else {
                                setErrorMessage('Class code not found. Please try again.');
                            }
                        })
                        .catch(error => {
                            console.error('Error checking class code:', error); // Log the error
                            setErrorMessage('An error occurred while checking the class code.');
                        });
                } else {
                    setErrorMessage('Student must need to be a premium user.');
                }
            })
            .catch(error => {
                console.error('Error checking user premium status:', error); // Log the error
                setErrorMessage('An error occurred while checking students premium status.');
            })
            .finally(() => {
                setIsLoading(false); // Ensure loading state is reset
            });
    };



    const handleModalClose = () => {
        setIsGroupModalOpen(false);
        setClassName(''); // Reset the class name
    };

    useEffect(() => {
        axios.get('/teacher/class')
            .then(response => {
                setCourses(response.data.courses);
                // Assuming you want to handle classes as well
                setClasses(response.data.classes); // Store the classes if you need them
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
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
            <Head title={getHeaderTitle()} />

            <div className="h-screen bg-white rounded m-4 rounded-xl">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 w-full">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xl">
                                    {selectedClass ? 'GROUP CLASS' : selectedCourse ? 'SECTIONS' : 'COURSES'}
                                </div>
                            </div>
                            <hr className="mb-4" />

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

                            {/* Render sections for selected course */}
                            {selectedCourse && !selectedClass && (
                                <div className="grid grid-cols-3 gap-4">
                                    {classes.map((classItem) => (
                                        <div
                                            key={classItem.id}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedClass(classItem)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">10 Members</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faUsers} size="4x" />
                                            </div>
                                            <div className="text-center">{classItem.class_name}</div>
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
                                                            <TableCell className="w-[10%] text-left">{classItem.class_name}</TableCell>
                                                            <TableCell className="w-[60%] text-left">{classItem.man_doc_title || "No manuscripts uploaded yet."}</TableCell>
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
                                                                <Dropdown>
                                                                    <DropdownTrigger>
                                                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white">
                                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                                        </div>
                                                                    </DropdownTrigger>
                                                                    <DropdownMenu aria-label="Actions">
                                                                        <DropdownItem key="add" onClick={openModal}>Add Student</DropdownItem>
                                                                        <DropdownItem key="approve" onClick={() => handleStatusChange(classItem.id, 'Y')}>Approve</DropdownItem>
                                                                        <DropdownItem key="decline" onClick={() => handleStatusChange(classItem.id, 'X')}>Decline</DropdownItem>
                                                                        <DropdownItem key="edit">Edit</DropdownItem>
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
                                                        <Button color="primary" auto onClick={handleCreate} disabled={isLoading}>
                                                            {isLoading ? 'Adding...' : 'Add'}
                                                        </Button>
                                                        <Button auto onClick={closeModal}>Close</Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
