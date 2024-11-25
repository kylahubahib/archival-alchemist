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

import ReviewManuscript from '@/Pages/Users/Class/Teacher/ReviewManuscript';

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

    const [groupmembers, setgroupmembers] = useState([]);
    const [section, setSections] = useState([]);
    const [groups, setGroups] = useState([]);
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


console.log("These are the props in Student Work:", reviewManuscriptProps)
// Fetch members whenever hoveredClass changes
// useEffect(() => {
//     if (hoveredClass?.manuscript?.id) {
//         console.log("Fetching members for manuscript_id:", hoveredClass.members.stud_id);

//         const fetchMembers = async () => {
//             setIsMembersLoading(true);
//             try {
//                 const response = await axios.get(`/groupmembers/${hoveredClass.manuscript.id}`);
//                 console.log("Fetched Members:", response.data);  // Check the response
//                 setMembers(response.data);  // Set members state with fetched data
//             } catch (err) {
//                 console.error("Error fetching members:", err);  // Log errors
//                 setError('Failed to load members.');
//             } finally {
//                 setIsMembersLoading(false);
//             }
//         };

//         fetchMembers();  // Fetch members when hoveredClass changes
//     } else {
//         console.log("hoveredClass or manuscript_id is not available.");
//     }
// }, [hoveredClass]);  // Dependency array: only run when hoveredClass changes


useEffect(() => {
    if (hoveredClass) {
        console.log("HoveredClass updated:", hoveredClass);  // Log when hoveredClass is updated

        // Check if hoveredClass has a 'members' array
        if (hoveredClass.members) {
            console.log("HoveredClass Members:", hoveredClass.members);  // Log the members array

            // Extract stud_ids from members
            const studIds = hoveredClass.members
                .map(member => member.stud_id)  // Get stud_id from each member
                .join(',');  // Join the stud_ids into a string for API request

            console.log("Sending stud_ids:", studIds);  // Log the stud_ids being sent

            if (!studIds) {
                console.error("No stud_ids found!");
            }

            // Fetch members only if studIds exists
            if (studIds) {
                const fetchMembers = async () => {
                    setIsMembersLoading(true);
                    try {
                        const response = await axios.get(`/groupmembers/${studIds}`);
                        console.log("Backend Response:", response.data);

                        if (response.data && response.data.length > 0) {
                            setMembers(response.data);  // Update state with members
                        } else {
                            setMembers([]);  // No members found
                        }
                    } catch (err) {
                        console.error("Error fetching members:", err);
                        setError('Failed to load members.');
                    } finally {
                        setIsMembersLoading(false);
                    }
                };

                fetchMembers();
            }
        } else {
            console.log("No members in hoveredClass");
        }
    } else {
        console.log("HoveredClass is undefined or null.");
    }
}, [hoveredClass]);  // Re-run when hoveredClass changes


const handleMouseEnter = (group) => {
    console.log("Hovered over group:", group);  // Log the group data to confirm
    setHoveredClass(group);  // Set hoveredClass with the group data
    setIsShowMembersModalOpen(true);  // Open modal
};




// const handleMouseEnter = (group) => {
//     setHoveredClass(group);
//     setIsShowMembersModalOpen(true); // Open modal when hovering over a group
//   };


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

    console.log("Classes state:", classes);


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
                console.log("API Response:", response.data); // Log the full response to see the data structure
                console.log("Manuscripts:", response.data.manuscripts); // Log manuscripts data to check if it exists

                // Combine sections, groups, group members, and manuscripts
                const combinedClasses = response.data.classes.map((classItem) => {
                    // Find the corresponding groups for this class (section)
                    const matchingGroups = response.data.groups.find(group => group.section.id === classItem.id)?.groups || [];

                    // For each group, fetch the group members and manuscript data
                    const groupsWithMembersAndManuscript = matchingGroups.map(group => {
                        // Check if 'groupmembers' exists in the response, else fallback to empty array
                        const groupMembers = response.data.groupmembers
                            ? response.data.groupmembers.find(groupMemberData => groupMemberData.section.id === classItem.id)
                                ?.groups.find(g => g.group.id === group.id)?.members || []
                            : [];

                        // Find the corresponding manuscript for the group and section
                        const manuscript = response.data.manuscripts?.find(manuscriptData =>
                            manuscriptData?.section_id === classItem.id &&
                            manuscriptData?.group_id === group.id
                        ) || null; // Fallback to null if no manuscript is found

                        return {
                            ...group,  // Spread the group data
                            members: groupMembers,  // Add the group members (or empty array if not found)
                            manuscript: manuscript  // Add the manuscript data (or null if not found)
                        };
                    });

                    // Combine classItem (section) with the matching groups (and their members and manuscript)
                    return {
                        ...classItem,
                        groups: groupsWithMembersAndManuscript
                    };
                });

                // Set the combined data in the state
                setClasses(combinedClasses);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after the request completes
            });
    }, []); // Empty dependency array ensures this effect runs only once on mount



useEffect(() => {
    console.log('Selected Class:', selectedClass); // Debugging line

    axios.get('/manuscripts/class', {
        params: {
            ins_id: selectedClass?.ins_id // Safely access ins_id using optional chaining
        }
    })
    .then(response => {
        console.log(response.data); // Log the response to check its structure
       // setClasses(response.data); // Store the manuscripts data
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


    const handleViewClick = (group) => {
        console.log("Hovered over group:", group);  // Log the group data to confirm
        setReviewManuscriptProps(group);  // Set manuscript data

        console.log("These are the props:", group); // Log the props directly
        setIsViewModalOpen(true);  // Open modal
    };

    console.log("Hovered over group:", reviewManuscriptProps);  // Log the group data to confirm

    const closeViewModal = () => {
        setIsViewModalOpen(false); // Just close the modal, don't reset the data
    };




    return (

    <div className="mt-0 bg-gray-100 rounded-lg shadow-lg relative  mb-10"
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

            <div className="relative w-relative m-10">
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
  {classes.length > 0 && classes[0].groups && classes[0].groups.map((group) => (
    <TableRow key={group.id}>
      <TableCell className="w-[10%] text-left">
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onMouseEnter={() => handleMouseEnter(group)} // Pass the entire group object
        >
          {group.group_name || "No Name Available"}
        </span>
      </TableCell>
      <TableCell className="text-left">
        {group.manuscript
          ? group.manuscript.man_doc_title || "No manuscript submission from the group."
          : "No manuscript submission from the group."}
      </TableCell>
      <TableCell className="text-center">
        {group.manuscript?.created_at
          ? new Date(group.manuscript.created_at).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell className="text-center">
        {group.manuscript?.updated_at
          ? new Date(group.manuscript.updated_at).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell className="text-center">
        {console.log(group.manuscript?.man_doc_status)}
        {getStatusButton(group.manuscript?.man_doc_status || "norecords")}
      </TableCell>
      <TableCell className="text-center">
        <button
          onClick={() => handleViewClick(group)}
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
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium text-gray-500">
                    {reviewManuscriptProps.manuscript.man_doc_title || "No manuscript submission from the group."}
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
    {classes.flatMap(course => course.groups.map(group => (
        <option key={group.id} value={group.group_name}>
            {group.group_name}
        </option>
    )))}
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
                <ReviewManuscript
                    folders={folders}
                    onBack={onBack}
                    task={task}
                    taskID={taskID}
                    closeModal={closeModal}
                    classes={classes} // Pass the fetched data
                    manuscript = {reviewManuscriptProps}
                    {...reviewManuscriptProps}
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
                    {hoveredClass.manuscript ? hoveredClass.manuscript.man_doc_title : "No manuscript submission from the group."}
                </h5>

                {error && <p className="text-red-500">{error}</p>}

                {isMembersLoading ? (
                    <div className="flex flex-col space-y-2 w-full">
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                        <Skeleton className="mb-2 w-full h-6" />
                    </div>
                ) : members.length > 0 ? (
                    members.map((member, index) => (
                        <p key={index} className="mb-2 text-gray-600">
                            {member.name}
                        </p>
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
