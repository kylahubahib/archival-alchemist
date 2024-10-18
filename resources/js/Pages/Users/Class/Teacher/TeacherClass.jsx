import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import ClassDropdown from "@/Components/ClassDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
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
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    const getHeaderTitle = () => {
        if (selectedClass) return 'COURSE | SECTION | GROUP CLASS';
        if (selectedCourse) return 'SECTION';
        return 'COURSES';
    };

    const staticData = [
        { id: 1, dateCreated: '2024-10-01', dateUpdated: '2024-10-02', status: 'approved', title: 'Capstone Project 1' },
        { id: 2, dateCreated: '2024-10-03', dateUpdated: '2024-10-04', status: 'declined', title: 'Capstone Project 2' },
        { id: 3, dateCreated: '2024-10-05', dateUpdated: '2024-10-06', status: 'pending', title: 'Capstone Project 3' },
    ];

    const getStatusButton = (status) => {
        switch (status) {
            case 'approved':
                return <Button size="xs" color="success" radius="full">{status.charAt(0).toUpperCase() + status.slice(1)}</Button>;
            case 'declined':
                return <Button size="xs" color="danger" radius="full">{status.charAt(0).toUpperCase() + status.slice(1)}</Button>;
            case 'pending':
                return <Button size="xs" color="warning" radius="full">{status.charAt(0).toUpperCase() + status.slice(1)}</Button>;
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
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
                                    {(selectedCourse.sections || []).map((section, index) => (
                                        <div
                                            key={section.id + index}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedClass(section)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">10 Members</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faUsers} size="4x" />
                                            </div>
                                            <div className="text-center">{section.section_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Render selected class information */}
                            {selectedClass && (
                                <>
<div className="flex items-center justify-between mb-4">
    <h1 className="whitespace-nowrap text-2xl font-bold">CCICT Department</h1>
    <div className="flex justify-end space-x-4">
        <ClassDropdown />
    </div>
</div>



                                    <hr className="mb-4" />

                                    <div className="flex">
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

                                        <div className="w-5/6">
                                            <Table>
                                                <TableHeader>
                                                    <TableColumn>Title</TableColumn>
                                                    <TableColumn>Status</TableColumn>
                                                    <TableColumn>Created</TableColumn>
                                                    <TableColumn>Updated</TableColumn>
                                                    <TableColumn>Actions</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {staticData.map((data) => (
                                                        <TableRow key={data.id}>
                                                            <TableCell>{data.title}</TableCell>
                                                            <TableCell>{getStatusButton(data.status)}</TableCell>
                                                            <TableCell>{data.dateCreated}</TableCell>
                                                            <TableCell>{data.dateUpdated}</TableCell>
                                                            <TableCell>
                                                                <Dropdown>
                                                                    <DropdownTrigger>
                                                                        <Button color="primary" auto flat>
                                                                            Actions
                                                                        </Button>
                                                                    </DropdownTrigger>
                                                                    <DropdownMenu aria-label="Actions">

                                                                        <DropdownItem key="add">Add Student</DropdownItem>
                                                                        <DropdownItem key="approve">Approve</DropdownItem>
                                                                        <DropdownItem key="decline">Decline</DropdownItem>
                                                                        <DropdownItem key="edit">Edit</DropdownItem>
                                                                        <DropdownItem key="delete" className="text-danger"  color="danger">Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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
