import AddButton from '@/Components/AddButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';


// export const displaySections = (id, setSelectedId, setDisplayedData, setFilteredData) => {

//     console.log("Id: ", id);
//     axios.get('get-sections', {
//         params: { id: id }
//     }).then(response => {
//         setSelectedId(id);
//         setDisplayedData('Sections');
//         setFilteredData(response.data.sections.data);
//         console.log('Sections: ', response.data.sections.data);
//     });
// };

export default function Sections({sections, displayDepts, displayCourses}) {
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, isLoading] = useState(true);

    return (
      <>
        <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                <div className="text-gray-800 text-3xl font-bold mb-3">
                    <div className="flex flex-row space-x-2">
                        <button onClick={() => displayDepts()} className="flex items-center hover:text-customBlue"> <span>Departments</span></button>
                        <button onClick={() => displayCourses(selectedDept)} className="flex items-center hover:text-customBlue"><FiChevronRight /><span>Courses</span></button>
                        <button onClick={() => {}} className="flex items-center  hover:text-customBlue"><FiChevronRight /><span>Sections</span></button>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col min-h-custom">
                    <div className="overflow-x-auto flex-grow px-5 pb-5 space-y-4 sm:px-5">
                        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 mt-4 md:space-y-0 bg-white">
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search-users"
                                    className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search"
                                    value={wordEntered}
                                    onChange={handleFilter}
                                />
                            </div>
                            <div>
                                <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add Section</span>
                                </AddButton>
                            </div>
                        </div>
                        <div className="overflow-y-auto h-480">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Section Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Course
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.length > 0 ? (
                                    sections.map((section) => (
                                        <tr key={section.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol max-w-44">{section.section_name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{section.course.course_name}</td>
                                            <td className="px-6 py-4 flex flex-row space-x-5">
                                                <a onClick={() => {}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View Member List</a>
                                                <a onClick={() => {}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                <a onClick={() => {}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <Pagination links={sections.links}/>
                    </div>
                </div>
        </div>
      </>
    );
}
