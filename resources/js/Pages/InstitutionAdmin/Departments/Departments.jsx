import { FiChevronRight } from "react-icons/fi"; 
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
import CreateCourse from "./CreateCourse";
import EditCourse from "./EditCourse";

export default function Departments({ auth, departments, uniBranch_id, courses, sections}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(departments.data);
    const [displayedData, setDisplayedData] = useState('Departments');
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [wordEntered, setWordEntered] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm({
        dept_name: '',
        uni_branch_id: ''
    });

    useEffect(() => {
        if (displayedData === 'Departments') {
            const deptFilter = departments.data.filter((value) => 
                value.dept_name.toLowerCase().startsWith(wordEntered.toLowerCase())
            );
            setFilteredData(deptFilter);
            setData('uni_branch_id', uniBranch_id);
        } else if (displayedData === 'Courses') {
            if (selectedId !== null) {
                const courseFilter = courses.data
                    .filter(course => course.department.id === selectedId) // Filter by department
                    .filter(course => course.course_name.toLowerCase().startsWith(wordEntered.toLowerCase())); // Filter by course name
    
                setFilteredData(courseFilter);
            } 
        }
    }, [wordEntered, departments.data, courses.data, displayedData, selectedId]);
    

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };

    const displayCourses = (item) => {

        if(displayedData != 'Sections'){
            setSelectedDept(item);
        }

        setCurrentPage(1);
        setSelectedId(item.id);
        setDisplayedData('Courses');
        setFilteredData(courses.data.filter(course => course.department.id === item.id));
    }

    const displayDepts = () => {
        setSelectedId(null);
        setDisplayedData('Departments');
        setFilteredData(departments.data);
        // console.log('Data:', filteredData);
    }

    const displaySections = (id) => {
        setDisplayedData('Sections');
        setFilteredData(sections.data.filter(section => section.course.id === id));
        setSelectedId(id);
        //console.log(filteredData);
    }

    const createSubmit = (e) => {
        e.preventDefault();
        post(route('manage-departments.store'), {
            onSuccess: () => {
                closeModal();
                alert('Success!');
                reset();
            },
        });
    };

    const editSubmit = (e) => {
        e.preventDefault();
        if(selectedDept){
            put(route('manage-departments.update', selectedDept.id), {
                onSuccess: () => {
                    closeModal();
                    alert('Success!');
                    setSelectedDept(null);
                    reset();
                },
            });
        }
    };

    const deleteDepartment = (id) => {
        if (confirm("Are you sure you want to delete this department?")) {
            router.delete(route('manage-departments.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Successfully deleted!');
                },
            });
        }
    };

    const closeClick = () => {
        reset(); 
        clearErrors(); 
        closeModal();
    };
    

    const deleteCourses = (id) => {
        if (confirm("Are you sure you want to delete this course?")) {
            router.delete(route('manage-courses.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Successfully deleted!');
                },
            });
        }
    };


    const openCreateModal = () => {
        setIsCreateModalOpen(true);
        // console.log(selectedId);
    };

    const openEditModal = (item) => {
        
        if(displayedData === 'Departments'){
            setSelectedDept(item);
            setData('dept_name', item.dept_name)
            setIsEditModalOpen(true);

        }
        else if(displayedData === 'Courses'){
            setSelectedCourse(item);
            setIsEditModalOpen(true);
        }
        else if(displayedData === 'Sections'){
            setSelectedDept(item);
            setData('dept_name', item.dept_name)
            setIsEditModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
    
        if(displayedData === 'Departments'){
            setFilteredData(departments.data);
            setWordEntered("");
            setData('dept_name', '');
            setSelectedDept(null);
        }
        else if(displayedData === 'Courses'){
            setFilteredData(courses.data.filter(course => course.department.id === selectedId));
            setWordEntered("");
            setSelectedCourse(null);
        }
        else if(displayedData === 'Sections'){
            setFilteredData(sections.data.filter(section => section.course.id === selectedId));
            setWordEntered("");
            setSelectedDept(null);
        }
    };



    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Department</h2>}
        >
        
            <Head title="Department" />

            <div className="py-8">

            {/* DEPARTMENTS TABLE */}
            {displayedData === 'Departments' && (   
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="text-gray-800 text-3xl font-bold mb-3">
                        <div className="flex flex-row space-x-2">
                            <button onClick={() => displayDepts()} className="flex items-center hover:text-customBlue"> <span>Departments</span></button>
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
                                        <FaPlus /><span>Add Department</span>
                                    </AddButton> 
                                </div> 
                            </div>

                           
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Department Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Added By
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((dept) => (
                                            <tr key={dept.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="pl-3">
                                                        <div className="text-base font-semibol max-w-44">{dept.dept_name}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4 max-w-60 truncate">{dept.added_by}</td>
                                                <td className="px-6 py-4 flex flex-row space-x-5">
                                                    <a onClick={() => displayCourses(dept)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View Courses</a>
                                                    <a onClick={() => openEditModal(dept)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                    <a onClick={() => deleteDepartment(dept.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
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
                        <div className="mt-auto">
                            <Pagination links={departments.links}/>
                        </div>
                    </div>
                </div>

            )}

            {/* COURSES TABLE */}
            {displayedData === 'Courses' && (
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="text-gray-800 text-3xl font-bold mb-3">
                        <div className="flex flex-row space-x-2">
                            <button onClick={() => displayDepts()} className="flex items-center hover:text-customBlue"> <span>Departments</span></button>
                            <button onClick={() => {}} className="flex items-center hover:text-customBlue"><FiChevronRight /><span>Courses</span></button>
                           
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
                                        <FaPlus /><span>Add Course</span>
                                    </AddButton> 
                                </div> 
                            </div>
                            
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Course Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Department
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((course) => (
                                            <tr key={course.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    <div className="pl-3">
                                                        <div className="text-base font-semibol max-w-44">{course.course_name}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4 max-w-60 truncate">{course.department.dept_name}</td>
                                                <td className="px-6 py-4 flex flex-row space-x-5">
                                                    <a onClick={() => displaySections(course.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View Sections</a>
                                                    <a onClick={() => openEditModal(course)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                    <a onClick={() => deleteCourses(course.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
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
                        <div className="mt-auto">
                            <Pagination links={courses.links}/>
                        </div>
                    </div>
                </div>
            
            )}

            {/* SECTIONS TABLE */}
            {displayedData === 'Sections' && (
                            
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
                                    {filteredData.length > 0 ? (
                                        filteredData.map((section) => (
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
                        <div className="mt-auto">
                            <Pagination links={sections.links}/>
                        </div>
                    </div>
			    </div>
            )} 

            </div>


            {/* CREATE MODAL FOR DEPARTMENT */}
            {displayedData === 'Departments' && (
                <Modal show={isCreateModalOpen} onClose={closeClick}>
                    <div className="bg-customBlue p-3" >
                        <h2 className="text-xl text-white font-bold">Add Department</h2>
                    </div>
                    <form onSubmit={createSubmit}>
                        <div className="p-6 space-y-5">
                            <div className='space-y-5'>
                                <div className="flex flex-col">
                                    <InputLabel htmlFor="dept_name" value="Department" />
                                    <TextInput
                                        id="dept_name"
                                        value={data.dept_name}
                                        onChange={(e) => setData('dept_name', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Department"
                                    />
                                    <InputError message={errors.dept_name} className="mt-2" />
                                </div>
                                <input type="hidden" value={data.uni_branch_id} />
                                <div className="mt-6 flex">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        Save
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                        <div className="bg-customBlue p-2 flex justify-end">
                            <button type="button" onClick={closeClick} className="text-white text-right mr-5">Close</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* EDIT MODAL FOR DEPARTMENT*/}
            {displayedData === 'Departments' && <Modal show={isEditModalOpen} onClose={closeModal}>
                <div className="bg-customBlue p-3" >
                    <h2 className="text-xl text-white font-bold">Add Department</h2>
                </div>

                <div className="p-6 space-y-5">
                    <form onSubmit={editSubmit}>
                        <div className='space-y-5'>
                            <div className="flex flex-col">
                                <InputLabel htmlFor="dept_name" value="Department" />
                                <TextInput
                                    id="dept_name"
                                    value={data.dept_name}
                                    onChange={(e) => {setData('dept_name', e.target.value)}}
                                    className="mt-1 block w-full"
                                    placeholder="Department"
                                />
                                <InputError message={errors.dept_name} className="mt-2" />
                            </div>
                                <input type="hidden" value={data.uni_branch_id} />

                            <div className="mt-6 flex">
                                <PrimaryButton type="submit" disabled={processing}>
                                    Save
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-customBlue p-2 flex justify-end" >
                    <button onClick={closeModal} className="text-white text-right mr-5">Close</button>
                </div>
            </Modal>}

            {displayedData === 'Courses' && <CreateCourse isOpen={isCreateModalOpen} onClose={closeModal} deptId={selectedId} setFilteredData={setFilteredData} courses={courses.data}/>}

            {displayedData === 'Courses' && selectedCourse && <EditCourse isOpen={isEditModalOpen} onClose={closeModal} deptId={selectedId} course={selectedCourse}/>}

        </AdminLayout>
    );
}
