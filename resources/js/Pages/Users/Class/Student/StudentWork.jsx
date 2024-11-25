import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import ShowMemersModal from '@/Components/Modal';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import CreateClassSection from '@/Pages/Users/Class/Teacher/CreateClassSection';
import ModifyManuscript from '@/Pages/Users/Class/Student/ModifyManuscript';
import ViewModal from '@/Components/studentworkModal';

//axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
axios.defaults.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;


const StudentWork = ({folders, onBack, task, taskID,  fileUrl,  }) => {
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
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [reviewManuscriptProps, setReviewManuscriptProps] = useState(null);
const [groupNames, setgroupNames] = useState(null);


console.log("These are the props in folder:", reviewManuscriptProps)
console.log("These are the props:", reviewManuscriptProps)
// Fetch members whenever hoveredClass changes
useEffect(() => {

    const fetchMembers = async () => {
        setIsMembersLoading(true); // Set loading state to true before fetching
        try {
            const response = await axios.get(`/groupmembers/${hoveredClass.id}`);
            setMembers(response.data);

    console.log(hoveredClass);
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
    console.log(setHoveredClass);
    setIsShowMembersModalOpen(true);
};

const handleModalClose2 = () => {
    setIsShowMembersModalOpen(false);
    setHoveredClass(null);
};



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
               // setCourses(response.data.courses);
               console.log("API Response:", response.data); // Log the response to inspect the structure
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
    console.log('Selected Class:', selectedClass); // Debugging line

    axios.get('/get-manuscripts', {
        params: {
            section_id: folders?.id
        }
    })
    .then(response => {
        console.log(response.data); // Log the response to check its structure
       setClasses(response.data); // Store the manuscripts data
    })
    .catch(error => {
        console.error("Error fetching manuscripts:", error);
    });
}, [selectedClass]);


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
            case 'to-review':
                return (
                    <Button
                        size="xs"
                        color="primary"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );

                case 'missing':
                    <Button
                        size="xs"
                        color="danger"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0"
                        >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>

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

    const [activeSection, setActiveSection] = useState('');

const handleShowStudentWork = () => {
    console.log('Button clicked, setting modal to open');
    setActiveSection('reviewManuscript');
    setIsModalOpen(true); // Open the modal when selecting 'reviewManuscript'
};


    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setActiveSection(''); // Reset the active section
    };


    const handleViewClick = (classItem) => {
        setReviewManuscriptProps(classItem); // Set manuscript data
        console.log("These are the props:", setReviewManuscriptProps);
        setIsViewModalOpen(true); // Open modal
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false); // Just close the modal, don't reset the data
    };




    return (

    <div className="mt-0 relative  mb-10"
        // <div
            // className="relative bg-white px-6 mb-10 w-full items-center"
            style={{
                position: "relative",
                top: "-48px",
                zIndex: 10,
                paddingTop: "0",
            }}
        >
            <header className="w-full bg-white text-gray-800 py-2 shadow-md border-t border-b border-gray-300">
                <div className="flex justify-end space-x-4 mr-8">
                    <ClassDropdown className="flex" />
                </div>
            </header>

            <div className="relative w-relative m-10 ">
                <Table>
                    <TableHeader>
                        <TableColumn className="w-[10%] text-left">Class Name</TableColumn>
                        <TableColumn className="w-[60%] text-center">Title</TableColumn>
                        <TableColumn className="text-center">Created</TableColumn>
                        <TableColumn className="text-center">Updated</TableColumn>
                        <TableColumn className="text-center">Status</TableColumn>
                        <TableColumn className="text-center">Review Work</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {classes.map((classItem) => (
                            <TableRow key={classItem.id}>
                                <TableCell className="w-[10%] text-left">
                                    <span
                                        className="cursor-pointer text-blue-500 hover:underline"
                                        onMouseEnter={() => handleMouseEnter(classItem)}
                                    >
                                        {classItem.group?.group_name || "No Name Available"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-left">
                                    {classItem.man_doc_title || "No manuscript submission from the group."}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Date(classItem.created_at).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Date(classItem.updated_at).toLocaleDateString() || "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {console.log(classItem.man_doc_status)} {/* Log to check status value */}
                                    {getStatusButton(classItem.man_doc_status || "norecords")}
                                </TableCell>
                                <TableCell className="text-center">
                                <button
                                    onClick={() => handleViewClick(classItem)}
                                    className="text-gray-600 font-semibold hover:text-blue-500"
                                >
                                    View
                                </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <ViewModal show={isViewModalOpen} onClose={closeViewModal}>
                    {reviewManuscriptProps && (
                        <div className="relative bg-white w-full items-center flex flex-col">
                            {/* Header */}
                            <header
                                className="w-full bg-white text-gray-800 py-4 px-6 shadow-md border-t border-b border-gray-300"
                                style={{ zIndex: 100 }}
                            >
                                <div className="flex justify-between w-full items-center">
                                    <h1 className="text-lg font-medium text-gray-500">
                                    {reviewManuscriptProps.man_doc_title || "No manuscript submission from the group."}
                                    </h1>

                                    {/* Filter Options */}
                                    <div className="flex space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor="filter" className="text-sm">
                                                Filter:
                                            </label>
                                            <select
                                                id="filter"
                                                defaultValue="all"
                                                className="p-2 rounded border border-gray-300 text-sm w-56"
                                            >
                                                <option value="all" disabled>Group names</option>
                                                {/* Dynamically render group names */}
                                                {classes.map((item) => (
                                                    <option key={item.group?.id} value={item.group?.group_name}>
                                                        {item.group?.group_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {/* <label htmlFor="search" className="text-sm">
                                                Search:
                                            </label>
                                            <input
                                                id="search"
                                                type="text"
                                                className="p-2 rounded border border-gray-300 text-sm"
                                                placeholder="Search work..."
                                            /> */}
                                            <div className="pl-5 flex items-center">
                                                <Button
                                                    auto
                                                    bordered
                                                    color="error"
                                                    className="text-gray-600 font-semibold hover:text-blue-500 flex items-center"
                                                    onClick={closeViewModal}
                                                >
                                                    Close
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 transform rotate-180 group-hover:text-blue-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 19l-7-7 7-7"
                                                        />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Content of the Modal */}
                            <div className="w-full">
                                <ModifyManuscript
                                    folders={folders}
                                    onBack={onBack}
                                    task={task}
                                    taskID={taskID}
                                    closeModal={closeModal}
                                    classes={classes} // Pass the fetched data
                                    manuscript = {reviewManuscriptProps}
                                    {...reviewManuscriptProps}
                                    fileUrl={reviewManuscriptProps.man_doc_content}
                                />
                            </div>
                        </div>
                    )}
                </ViewModal>


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

                {/* Add other modals if necessary */}
            </div>
        </div>
    );
};

export default StudentWork;
