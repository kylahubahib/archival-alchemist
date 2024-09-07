import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faUsers } from '@fortawesome/free-solid-svg-icons';

const courseData = [
    { id: 1, name: 'BSIT', classes: ['BSIT III-1', 'BSIT III-A', 'BSIT III-B'] },
    { id: 2, name: 'BSIS', classes: ['BSIS III-1', 'BSIS III-A', 'BSIS III-B'] },
    { id: 3, name: 'BSCS', classes: ['BSCS III-1', 'BSCS III-A', 'BSCS III-B'] },
];

export default function TeacherClass({ auth }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groups, setGroups] = useState([]);

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
                    <form>
                        <div className="flex">
                            <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                            <button id="dropdown-button" data-dropdown-toggle="dropdown" className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">All categories <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg></button>
                            <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Shopping</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Images</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">News</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Finance</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative w-full">
                                <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search" required />
                                <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
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
                                <div className="text-xl">{selectedClass ? 'CLASS' : 'COURSE'}</div>
                            </div>
                            <hr className="mb-4" />

                            {!selectedCourse && (
                                <div className="grid grid-cols-3 gap-4">
                                    {courseData.map(course => (
                                        <div
                                            key={course.id}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">{course.classes.length} Section/s</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faFolder} size="4x" />
                                            </div>
                                            <div className="text-center">{course.name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedCourse && !selectedClass && (
                                <div className="grid grid-cols-3 gap-4">
                                    {selectedCourse.classes.map((className, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 cursor-pointer"
                                            onClick={() => setSelectedClass(className)}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm">10 Members</span>
                                            </div>
                                            <div className="flex justify-center mb-2">
                                                <FontAwesomeIcon icon={faUsers} size="4x" />
                                            </div>
                                            <div className="text-center">{className}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

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
                                                        <tr key={index}>
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
                    <div>
                        <label htmlFor="dateCreated" className="block text-sm font-medium text-gray-700">Date Created</label>
                        <input type="date" name="dateCreated" id="dateCreated" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="dateUpdated" className="block text-sm font-medium text-gray-700">Date Updated</label>
                        <input type="date" name="dateUpdated" id="dateUpdated" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="classCode" className="block text-sm font-medium text-gray-700">Group Class Code</label>
                        <input type="text" name="classCode" id="classCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Capstone Title</label>
                        <input type="text" name="title" id="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Group</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
