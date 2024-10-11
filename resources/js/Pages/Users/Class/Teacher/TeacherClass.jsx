import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function TeacherClass({ auth }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    // Fetch courses and sections for the current faculty member
    useEffect(() => {
        axios.get('/teacher-courses')
            .then(response => {
                const { courses } = response.data;
                setCourses(courses);
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
        if (selectedClass) return 'COURSE | SECTIONS | CLASS';
        if (selectedCourse) return 'COURSE | SECTIONS';
        return 'COURSE';
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
                    {/* Search Form */}
                    {/* Your existing search code */}
                </div>
            }
        >
            <Head title={getHeaderTitle()} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xl">{selectedClass ? 'CLASS' : 'COURSE'}</div>
                            </div>
                            <hr className="mb-4" />

                            {/* Display courses */}
                            {!selectedCourse && (
                                <div className="grid grid-cols-3 gap-4">
                                    {courses.map(course => (
                                        <div
                                            key={course.id}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">{course.sections.length} Sections</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faFolder} size="4x" />
                                            </div>
                                            <div className="text-center">{course.course_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Display sections when a course is selected */}
                            {selectedCourse && !selectedClass && (
                                <div className="grid grid-cols-3 gap-4">
                                    {selectedCourse.sections.map((section, index) => (
                                        <div
                                            key={index}
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

                            {/* When section is selected */}
                            {selectedClass && (
                                <>
                                    {/* Your existing section-related UI */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
                {/* Your modal form logic */}
            </Modal>
        </AuthenticatedLayout>
    );
}
