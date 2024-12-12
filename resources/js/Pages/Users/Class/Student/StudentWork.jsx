import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ShowMemersModal from '@/Components/Modal';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import CreateClassSection from '@/Pages/Users/Class/Teacher/CreateClassSection';
import ModifyManuscript from '@/Pages/Users/Class/Student/ModifyManuscript';
import ViewModal from '@/Components/studentworkModal';
import {Accordion, AccordionItem} from "@nextui-org/react";
//axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
// axios.defaults.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;


const StudentWork = ({auth, folders, onBack, task, taskID,  fileUrl,  }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [StudentsUsers, setStudentUser] = useState(null); // Declare the user state
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [className, setClassName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [classes, setClasses] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(true);
const [isShowMembersModalOpen, setIsShowMembersModalOpen] = useState(false);
const [hoveredClass, setHoveredClass] = useState(null);
const [members, setMembers] = useState([]);
const [error, setError] = useState('');
const [isMembersLoading, setIsMembersLoading] = useState(false);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [reviewManuscriptProps, setReviewManuscriptProps] = useState(null);
const [mygroupID, setmygroupID] = useState([]);
const [groupID, setgroupID] = useState([]);
const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
const [selectedClassItem, setSelectedClassItem] = useState(null);
const [selectedClassName, setSelectedClassName] = useState('');
const [selectedClassCode, setSelectedClassCode] = useState('');
const [users, setAuthors] = useState([]);
// Define state for form fields
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [adviser, setAdviser] = useState('');
// const [csrfToken, setCsrfToken] = useState(null);

console.log("StudentWork Folder: ", folders)
useEffect(() => {
    setIsLoading(true); // Set loading to true when the component mounts
    axios.get('/get-groupID', {
        params: {
            section_id: folders?.id,
            task_id: taskID
        }
    })
        .then(response => {
           // setCourses(response.data.courses);
           console.log("API Response for my group ID:", response.data); // Log the response to inspect the structure
            // Map the response to extract group IDs and store in state
            const groupIDs = response.data.map(item => item.group_id);
            setmygroupID(groupIDs); // Store the group IDs
            if (groupIDs.length > 0) {
                setgroupID(groupIDs[0]); // Use the first group ID as default or modify as needed
            }
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
        })
        .finally(() => {
            setIsLoading(false); // Set loading to false after data is fetched
        });
}, []);

console.log('group id:', groupID);

useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch group members and teacher data concurrently
            const groupResponse = await axios.get(`/fetch-mygroupmembers/${folders.id}`, {
                params: {  // Correctly pass group_id and task_id as query parameters

                section_id: folders?.id,
                    task_id: taskID,
                },
            });
            console.log('group id:', groupID);

            // Set data for students and teacher
            setStudentUser(groupResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false); // Set loading to false after data is fetched
        }
    };
    fetchData();
}, []);


const openModal = (className, classCode) => {
    setSelectedClassName(className);
    setSelectedClassCode(classCode);
    setIsModalOpen(true);
};


const submit = async (e, classItem) => {
    e.preventDefault(); // Prevent page refresh

    // Check if at least one field has changed or is filled
    if (!(title || description || adviser)) {
        toast.error('Please fill in at least one field.');  // Show error toast
        return;
    }

    // Collect the form data, but only include fields that were changed or filled
    const formData = {
        title: title || classItem.man_doc_title,  // Use existing value if not updated
        description: description || classItem.man_doc_description,  // Use existing value if not updated
        adviser: adviser || classItem.man_doc_adviser,  // Use existing value if not updated
    };

    // Set loading state to true
    setIsLoading(true);

    try {
        console.log("Submitting data:", formData);  // Debugging the formData
        const response = await axios.put(`/update-project/${classItem.id}`, formData);
        console.log('Project updated:', response.data);

        // Show success toast
        toast.success('Project updated successfully!');

        // Reset form data (optional)
        setTitle('');
        setDescription('');
        setAdviser('');
        axios.get('/get-manuscripts', {
            params: {
                section_id: folders?.id

            }
        })
        .then(response => {
            console.log(
                "These are the manuscripts:", response.data); // Log the response to check its structure
           setClasses(response.data); // Store the manuscripts data
        })
        .catch(error => {
            console.error("Error fetching manuscripts:", error);
        });

    } catch (error) {
        console.error('Error submitting the form:', error);
        toast.error('There was an error updating the project. Please try again.');  // Show error toast
    } finally {
        // Reset loading state after submission
        setIsLoading(false);
    }
};


const handleViewDetailsClick = () => {
    // setSelectedClassItem(classItem); // Store the clicked class item
    setIsViewDetailsOpen(true); // Open the ViewDetails modal or component
};

const handleCloseDetails = () => {
    setIsViewDetailsOpen(false); // Close the ViewDetails modal
    setSelectedClassItem(null); // Reset selected class item
};

console.log("These are the props in folder:", reviewManuscriptProps)
console.log("These are the props:", reviewManuscriptProps)
// Fetch members whenever hoveredClass changes
useEffect(() => {

    const fetchMembers = async () => {
        setIsMembersLoading(true); // Set loading state to true before fetching
        try {
            const response = await axios.get(`/groupmembers/${hoveredClass.id}`);
            setMembers(response.data);

    console.log("These are the hovered class:", hoveredClass);
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
    console.log("These are the setHoveredClass:", setHoveredClass);
    setIsShowMembersModalOpen(true);
};

const handleModalClose2 = () => {
    setIsShowMembersModalOpen(false);
    setHoveredClass(null);
};



   // Function to handle removing a student, could be linked to state later for dynamic removal
   const handleRemoveStudent = async (studentId) => {
    try {
        // Remove student from the UI immediately (Optimistic UI Update)
        setStudentUser(prevStudents => prevStudents.filter(student => student.id !== studentId));

                // Correct way to create the man_doc_id array
                const man_doc_id = myproject.map(classItem => classItem.id);
                console.log('Document IDs:', man_doc_id);
        // Send DELETE request to remove the student
        // await axios.delete(`/delete-mygroupmembers/${studentId}`, {
        //     man_doc_id: man_doc_id});
        // Send DELETE request to remove the student
        await axios.delete(`/delete-mygroupmembers/${studentId}`, {
            data: { man_doc_id: man_doc_id }  // Correct way to send the data in the body
        });


        // Refetch the students list from the server
            const response = await axios.get(`/fetch-mygroupmembers/${folders.id}`, {
    params: {  // Correctly pass group_id and task_id as query parameters
        section_id: folders?.id,
        task_id: taskID,
    },
 });
        setStudentUser(response.data);  // Update state with fresh student data
    } catch (error) {
        // Handle error (show message, etc.)
        console.error("Error removing student:", error);
        setErrorMessage("Failed to remove student. Please try again.");
    }
};


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
        const response = await axios.get('/students/search-in-class', {
            params: { query,
              section_id: folders?.id, users },
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



const handleAddStudent = async () => {
    const folder = folders;  // Or use a condition to select a specific folder
    console.log('Folder ID:', folder.id);  // Check if folder.id is valid


    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error message

    try {
        // Make sure we check for the correct data being passed into users
        console.log("Adding students:", users);

        if (!Array.isArray(users) || users.length === 0) {
            throw new Error("No students to add");
        }

                // Correct way to create the man_doc_id array
                const man_doc_id = myproject.map(classItem => classItem.id);
                console.log('Document IDs:', man_doc_id);
        console.log('SECTION ID', folder.id);

        // Send the POST request to add the student
        const response = await axios.post('/store-newGroupmembers', {
            man_doc_id: man_doc_id,
            section_id: folder.id,
            task_id: taskID,
            group_id: groupID,
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

        const groupResponse = await axios.get(`/fetch-mygroupmembers/${folders.id}`, {
            params: {  // Correctly pass group_id and task_id as query parameters
                section_id: folders?.id,
                task_id: taskID,
            },
         });
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

    const fetchUpdatedManuscripts = async () => {
        try {
            const response = await axios.get('/manuscripts/class', {
                params: { ins_id: selectedClass.ins_id }
            });
            console.log(response.data); // Check that the new data is correct
            setClasses(response.data); // Update the classes state

            console.log("Students Classes Response:", classes);
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




    // Filter the classes where group_id matches groupID
    const myproject = classes.filter((classItem) => classItem?.group_id === groupID);
    console.log("This is the student's project: ", myproject);


useEffect(() => {
    console.log('Selected Class:', selectedClass); // Debugging line

    axios.get('/get-manuscripts', {
        params: {
            section_id: folders?.id

        }
    })
    .then(response => {
        console.log(
            "These are the manuscripts:", response.data); // Log the response to check its structure
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
                case 'pending':
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

    const [messageShown, setMessageShown] = useState(false);
// Delay the display of the message for 1 second
useEffect(() => {
    if (myproject.length === 0 && !isLoading) {
        const timer = setTimeout(() => {
            setMessageShown(true);
        }, 1000); // Delay for 1 second

        return () => clearTimeout(timer); // Cleanup the timeout
    } else {
        setMessageShown(false); // Reset if there's data
    }
}, [myproject, isLoading]);

    return (

    <div className="mt-0 relative mb-10"

        // <div
            // className="relative bg-white px-6 mb-10 w-full items-center"
            style={{
                position: "relative",
                top: "-48px",
                zIndex: 10,
                paddingTop: "0",
            }}
        >
                                {/* <button
                                     onClick={() => handleViewDetailsClick()}
                                    className="mt-5 ml-10 rounded-lg p-2 px-5 text-white bg-gray-400 font-semibold hover:bg-blue-500"
                                >
                                    View Details
                                </button> */}
            <div className="relative w-relative mt-5 ml-10 mr-10 ">
            {isLoading ? (
                <div className="space-y-4">
                    {/* Render Skeleton for loading state */}
                <Table aria-label="Loading table">
                    <TableHeader>
                        <TableColumn className="w-[10%] text-left"><Skeleton className="w-20 h-5" /></TableColumn>
                        <TableColumn className="w-[60%] text-center"><Skeleton className="w-60 h-5" /></TableColumn>
                        <TableColumn className="text-center"><Skeleton className="w-24 h-5" /></TableColumn>
                        <TableColumn className="text-center"><Skeleton className="w-24 h-5" /></TableColumn>
                        <TableColumn className="text-center"><Skeleton className="w-24 h-5" /></TableColumn>
                        <TableColumn className="text-center"><Skeleton className="w-24 h-5" /></TableColumn>
                    </TableHeader>
                    <TableBody>
                        {/* Empty rows as placeholders */}
                        {[...Array(5)].map((_, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="w-[10%] text-left"><Skeleton className="w-20 h-5" /></TableCell>
                                <TableCell className="text-left"><Skeleton className="w-60 h-5" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="w-24 h-5" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="w-24 h-5" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="w-24 h-5" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="w-24 h-5" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


                </div>
            ) : myproject.length === 0 && messageShown ? (
                // Display message if no data is found
                <div className="text-center py-4">
                    <p className="text-l text-gray-400">No manuscript submission from the group.</p>
                </div>
            ) : (  <>
                <Table>
                    <TableHeader>
                        <TableColumn className="w-[10%] text-left">Group Name</TableColumn>
                        <TableColumn className="w-[60%] text-center">Title</TableColumn>
                        <TableColumn className="text-center">Created</TableColumn>
                        <TableColumn className="text-center">Updated</TableColumn>
                        <TableColumn className="text-center">Status</TableColumn>
                        <TableColumn className="text-center">Review Work</TableColumn>
                    </TableHeader>

                    {/* const myproject = classes.filter(classItem => classItem.group_id === groupID); */}
                    <TableBody>
                        {myproject.map((classItem) => (
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
                </Table></>
  )}

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

                            {console.log("reviewManuscriptProps.group_id:", reviewManuscriptProps.group_id)}
                            {/* Content of the Modal */}
                            <div className="w-full">
                                <ModifyManuscript
                                    groupId={groupID}
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

            <div className= "mt-10" >
           {/* Accordion to display and edit project details */}
           <div>
           {myproject.map((classItem) => (
    <Accordion key={classItem.id} variant="splitted">
        <AccordionItem
            key={classItem.id}
            aria-label={`Accordion ${classItem.id}`}
            title={`View / Edit Details`}
        >
            <div className="mb-5">
                <InputLabel htmlFor="title" value="Title" className="mt-5"/>
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={title || classItem.man_doc_title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        console.log("Title updated:", e.target.value);  // Check if the title is updating
                    }}
                    required
                    isFocused
                    autoComplete="title"
                />

                <InputLabel htmlFor="adviser" value="Adviser" className="mt-5"/>
                <TextInput
                    id="adviser"
                    className="mt-1 block w-full"
                    value={adviser || classItem.man_doc_adviser}
                    onChange={(e) => {
                        setAdviser(e.target.value);
                        console.log("Adviser updated:", e.target.value);  // Check if the adviser is updating
                    }}
                    required
                    isFocused
                    autoComplete="adviser"
                />

                <InputLabel htmlFor="description" value="Description" className="mt-5"/>
                <textarea
                    id="description"
                    className="mt-1 block w-full"
                    value={description || classItem.man_doc_description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        console.log("Description updated:", e.target.value);  // Check if the description is updating
                    }}
                    required
                    isFocused
                    autoComplete="description"
                    rows="3"
                    cols="50"
                />
            </div>
            <Button
                color="primary"
                auto
                onClick={(e) => submit(e, classItem)}  // Pass classItem as an argument
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
        </AccordionItem>

        <AccordionItem

title={`Members`}
>
{/* Students Section */}
<div className="relative w-relative bg-white rounded-md shadow ml-5 mr-5 mb-5">
<div className="flex items-center justify-between mb-4">
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
<p className="text-gray-500 p-3">No members yet.</p>
)}
</div>

</div>
</AccordionItem>
    </Accordion>
))}

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

<ToastContainer // Include ToastContainer for displaying toasts
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"/>
            </div>
          </div>
                {/* Add other modals if necessary */}
            </div>
        </div>
    );
};

export default StudentWork;
