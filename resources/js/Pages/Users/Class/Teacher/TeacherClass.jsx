import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function TeacherClass({ auth }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // Fetch courses data from the server
        axios.get('/teacher/class')
            .then(response => {
                setCourses(response.data.courses);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    const handleAddGroup = (group) => {
        setGroups([...groups, group]);
        setIsGroupModalOpen(false);
    };

    const getHeaderTitle = () => {
        if (selectedClass) return 'COURSE | SECTION | GROUP CLASS'; // Title when a class is selected
        if (selectedCourse) return 'SECTION'; // Changed to SECTION when a course is selected
        return 'COURSES'; // Default title when no course is selected
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{getHeaderTitle()}</h2>
                    {selectedCourse && !selectedClass && (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Add Section
                        </button>
                    )}
                    <form>
                        {/* Search form code */}
                    </form>
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
                                {selectedClass
                                    ? 'GROUP CLASS'
                                    : selectedCourse
                                        ? 'SECTIONS'
                                        : 'COURSES'}
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
                                                <span className="text-sm">{(course.sections || []).length} Sections</span> {/* Safeguard with empty array */}
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
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex space-x-4">
                                            <button className="border rounded px-4 py-2">Members</button>
                                            <button className="border rounded px-4 py-2">Queue</button>
                                            <button className="border rounded px-4 py-2">Records</button>
                                        </div>
                                    </div>
                                    <hr className="mb-4" />

                                    <div className="flex">
                                        <div className="w-1/6">
                                            <button
                                                className="border rounded-lg w-50 px-4 py-2 mb-4"
                                                onClick={() => setIsGroupModalOpen(true)}
                                            >
                                                Add Groups
                                            </button>
                                        </div>
                                        <div className="w-3/4">
                                            <table className="w-full border">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-4 py-2">Date Created</th>
                                                        <th className="border px-4 py-2">Date Updated</th>
                                                        <th className="border px-4 py-2">Group Class Code</th>
                                                        <th className="border px-4 py-2">Capstone Title</th>
                                                        <th className="border px-4 py-2">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groups.map((group, index) => (
                                                        <tr key={group.classCode + index}>
                                                            <td className="border px-4 py-2">{group.dateCreated}</td>
                                                            <td className="border px-4 py-2">{group.dateUpdated}</td>
                                                            <td className="border px-4 py-2">{group.classCode}</td>
                                                            <td className="border px-4 py-2">{group.title}</td>
                                                            <td className="border px-4 py-2">
                                                                <button className="bg-green-500 text-white px-2 py-1 rounded">Edit</button>
                                                                <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Group Modal */}
            <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const newGroup = {
                        dateCreated: formData.get('dateCreated'),
                        dateUpdated: formData.get('dateUpdated'),
                        classCode: formData.get('classCode'),
                        title: formData.get('title'),
                    };
                    handleAddGroup(newGroup);
                }}>
                    {/* Modal form fields */}
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
