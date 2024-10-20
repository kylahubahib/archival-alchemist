import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons'; // Import the three dots icon
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

// Ensure Axios includes the CSRF token in every request by default
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

export default function TeacherClass({ auth }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [className, setClassName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // For success/error messages
    const [classes, setClasses] = useState([]); // Add this line
    const [manuscripts, setManuscripts] = useState([]); // Add this line for manuscripts

    const handleStatusChange = async (id, status) => {
        console.log("Class Item ID:", id);  // Debugging line for classItem.id
        try {
            const response = await axios.put(`/manuscripts/${id}/update-status`, {
                status: status // 'Y' for Approve, 'X' for Decline
            });

            // Show success message or refresh data if needed
            setMessage(`Manuscript status updated: ${response.data.message}`);

            // Optionally reload manuscripts to reflect the updated status
            axios.get('/manuscripts/class', {
                params: {
                    ins_id: selectedClass.ins_id // Fetch updated manuscripts
                }
            }).then(response => {
                setClasses(response.data);
            });

        } catch (error) {
            // Handle error
            setMessage(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };
    // Handle form submission to create a new group class
    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/store-newGroupClass', {
                class_name: className, // Ensure this matches the controller's expected key
            });
            setMessage(`Group class created successfully: ${response.data.message}`);
        } catch (error) {
            // Improved error handling
            if (error.response) {
                setMessage(`Error creating new group class: ${error.response.data.message}`);
            } else {
                setMessage(`Error creating new group class: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        };
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
            case 'pending':
                return (
                    <Button
                        size="xs"
                        color="gray"
                        radius="full"
                        className="text-center text-[13px] p-1 h-auto min-h-0 bg-gray-500 text-white" // Gray background with white text
                        >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                );
            default:
                return null;
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

            <div className="h-screen bg-white rounded m-4 rounded-xl ">
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
                    <span className="text-sm">10 Members</span> {/* Adjust as needed */}
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
                                            <ClassDropdown />
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
  {classes.map((classItem) => {

console.log("Class Item ID:", classItem.id);  // Debugging line for classItem.id
  console.log('classItem:', classItem);
console.log('selectedClass:', selectedClass);

    return (
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
              <DropdownItem key="add">Add Student</DropdownItem>
              <DropdownItem key="approve" onClick={() => handleStatusChange(classItem.id, 'Y')}>Approve</DropdownItem>
              <DropdownItem key="decline" onClick={() => handleStatusChange(classItem.id, 'X')}>Decline</DropdownItem>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>




                                            </Table>
                                        </div>
                                    </div>
                                    {message && <div className={`text-${message.includes('success') ? 'green' : 'red'}-500`}>{message}</div>}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
