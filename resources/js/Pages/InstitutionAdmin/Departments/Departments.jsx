import { FaBuilding } from "react-icons/fa";
import { RiFolderUnknowFill } from "react-icons/ri";
import { FcFolder } from "react-icons/fc";
import { MdFolderDelete } from "react-icons/md";
import { FaEdit, FaFolder } from "react-icons/fa";
import { TbDotsVertical } from "react-icons/tb";
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
import { showToast } from "@/Components/Toast";
import CreateSections from "./CreateSection";
import { Button, Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import EditSections from "./EditSection";

import { formatDate, formatPrice } from '@/utils';
import RemoveDepartment from "./RemoveDepartment";
import AddExistingCourse from "./AddExistingCourse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "@/Components/Admins/SearchBar";

export default function Departments({ auth, departments, uniBranch_id, branch}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isAddCourseModal, setIsAddCourseModal] = useState(false);

    const [wordEntered, setWordEntered] = useState("");
    const [filteredData, setFilteredData] = useState(departments.data);
    const [displayedData, setDisplayedData] = useState('Departments');

    const [selectedDept, setSelectedDept] = useState(null); //Data for the selected department to update or delete
    const [selectedCourse, setSelectedCourse] = useState(null); //Data for the selected course to update or delete
    const [selectedSection, setSelectedSection] = useState(null); //Data for the selected section to update or delete
    const [selectedId, setSelectedId] = useState(null); //Id of the selected department or course

    const [courses, setCourses] = useState(null);
    const [sections, setSections] = useState(null);

    const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm({
        dept_name: '',
        dept_acronym: '',
        uni_branch_id: ''
    });

    // useEffect(() => {
    //     console.log(filteredData);
    //     console.log(selectedDept);
    // },[filteredData, selectedDept])

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
                    .filter(course => course.department.id === selectedId)
                    .filter(course => course.course_name.toLowerCase().startsWith(wordEntered.toLowerCase()));

                setFilteredData(courseFilter);
            }
        } else if (displayedData === 'Sections') {
            if (selectedId !== null) {
                const sectionFilter = sections.data
                    .filter(section => section.course.id === selectedId)
                    .filter(section => section.section_name.toLowerCase().startsWith(wordEntered.toLowerCase()));

                setFilteredData(sectionFilter);
            }
        }
    }, [wordEntered, departments.data,  displayedData, selectedId]);


    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };

    // Change the display to the department table
    const displayDepts = () => {
        setSelectedId(null);
        setDisplayedData('Departments');
        setFilteredData(departments.data);
        // console.log('Data:', filteredData);
    }

     // Change the display to the course table
    const displayCourses = (item) => {

        if(displayedData != 'Sections'){
            setSelectedDept(item);
        }
        axios.get('get-courses', {
            params: { id: item.id }
        }).then(response => {
            setSelectedId(item.id);
            setDisplayedData('Courses');
            setFilteredData(response.data.courses.data);
            setCourses(response.data.courses);
        });

    }

     // Change the display to the section table
    const displaySections = (item) => {

        //console.log("Id: ", id)

        setSelectedCourse(item);

        axios.get('get-sections', {
            params: { id: item.id }
        }).then(response => {
            setSelectedId(item.id);
            setDisplayedData('Sections');
            setFilteredData(response.data.sections.data);
            setSections(response.data.sections);
            //console.log('Sections: ', filteredData);
        })
    }

    //Creation of a new department
    const createSubmit = (e) => {
        e.preventDefault();
        post(route('manage-departments.store'), {
            onSuccess: () => {
                closeModal();
                showToast('success', 'Successfully created department!');
                reset();
            },
        });
    };

    //Updating of a certain department
    const editSubmit = (e) => {
        e.preventDefault();
        if(selectedDept){
            put(route('manage-departments.update', selectedDept.id), {
                onSuccess: () => {
                    closeModal();
                    showToast('success', 'Successfully updated department!');
                    setSelectedDept(null);
                    reset();
                },
            });
        }
    };


    const closeClick = () => {
        reset();
        clearErrors();
        closeModal();
    };

    //Deletion of a certain course
    const deleteCourses = (id) => {
            router.delete(route('manage-courses.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    displayCourses(selectedDept);
                    showToast('success', 'Successfully deleted course!');
                },

            });
    };

    const deleteSections = (id) => {
        router.delete(route('manage-sections.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                displaySections(selectedCourse);
                //showToast('success', 'Successfully deleted section!');
            },
        });
};


    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openEditModal = (data) => {

        //Open the edit modal for the department
        if(displayedData === 'Departments'){
            setSelectedDept(data);
            setData({
                dept_name: data.dept_name,
                dept_acronym: data.dept_acronym
            });

            setIsEditModalOpen(true);

        }
         //Open the edit modal for the course
        else if(displayedData === 'Courses'){
            setSelectedCourse(data);
            setIsEditModalOpen(true);
        }
         //Open the edit modal for the section
        else if(displayedData === 'Sections'){
            setSelectedSection(data)
            setIsEditModalOpen(true);
        }
    };

    const openDeleteProcessModal = (data) => {
        setSelectedDept(data);
        setIsAssignModalOpen(true);
        //console.log('deptin: ', data);
    };

    const assignCourseModal = (data) => {

        if(displayedData === 'Departments'){
            setSelectedDept(data);
            setIsAddCourseModal(true);

        }
        else if(displayedData === 'Courses'){
            setSelectedCourse(data);
            setIsAddCourseModal(true);
        }
    };

    const closeModal = () => {

        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setIsAssignModalOpen(false);
        setIsAddCourseModal(false);

        if(displayedData === 'Departments'){
            setFilteredData(departments.data);
            setWordEntered("");
            setSelectedDept(null);
            setData({
                dept_name: '',
                dept_acronym: ''
            });
        }
        else if(displayedData === 'Courses'){
            //setFilteredData(courses);
            displayCourses(selectedDept);
            setWordEntered("");
            setSelectedCourse(null);
        }
        else if(displayedData === 'Sections'){
            displaySections(selectedCourse);
            setWordEntered("");
            setSelectedSection(null);
        }
    };

    useEffect(() => {
        console.log('Branch:', branch);
    })

    return (

        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Department</h2>}
            university={branch?.university?.uni_name + ' - ' + branch?.uni_branch_name}
        >

            <Head title="Department" />

            <div className="mt-5">

            {/* DEPARTMENTS TABLE */}
            {displayedData === 'Departments' && (
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="text-customGray text-lg font-bold mb-3 mt-7">
                        <div className="flex flex-row space-x-2">
                            <button onClick={() => displayDepts()} className="flex items-center hover:text-customBlue"> <span>Departments</span></button>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col min-h-custom">
                        <div className="overflow-x-auto flex-grow px-5 pb-5 space-y-4 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 mt-4 md:space-y-0 bg-white">
                                {/* Search Filter */}
                                <div className="w-1/2">
                                    <SearchBar
                                        name='search'
                                        value={wordEntered}
                                        variant="bordered"
                                        onChange={handleFilter}
                                        placeholder="Search"
                                        className=" min-w-sm flex-1"
                                    />
                                </div>

                                {/* Adding a new department */}
                                <div>
                                    <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                        <FaPlus /><span>Add Department</span>
                                    </AddButton>
                                </div>
                            </div>

                            {/* Department List */}
                            <div className=" pt-1">
                            {filteredData.length > 0 ? (
                                filteredData.map((dept) => (
                                    <Card
                                    className="border-none hover:bg-gray-100 w-full my-5"
                                    shadow="sm"
                                    key={dept.id}
                                    >
                                    <CardBody  onClick={() => displayCourses(dept)} className="cursor-pointer">
                                        <div className="w-full flex flex-row justify-between">
                                            <div className=" text-gray-600 font-semibold text-lg">{dept.dept_name} ({dept.dept_acronym})</div>
                                            <div className="relative flex justify-end items-center gap-2">
                                                <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                    <TbDotsVertical />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu >
                                                    <DropdownItem onClick={() => openEditModal(dept)} showDivider startContent={<FaEdit className=" text-gray-600" />}>Edit</DropdownItem>
                                                    <DropdownItem onClick={() => openDeleteProcessModal(dept)} color="danger" startContent={<MdFolderDelete/>}>Delete</DropdownItem>
                                                </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-row space-x-3">
                                            <div  className=" text-gray-600 text-small">Added By: {dept.added_by}</div>
                                            <div  className=" text-gray-600 text-small">|</div>
                                            <div  className=" text-gray-600 text-small">Modified At: {formatDate(dept.updated_at)}</div>
                                        </div>

                                    </CardBody>
                                    </Card>
                                ))
                            ) : (
                                <div className="flex flex-col items-center pt-20 justify-centers">
                                    <FaBuilding size={100} color="#d1d5db" />
                                    <div className="mt-3 text-gray-400 font-semibold">No department found.</div>
                                </div>

                            )}
                            </div>

                        </div>

                    </div>
                </div>

            )}


            {/* COURSES TABLE */}
            {displayedData === 'Courses' && (
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="text-customGray text-lg font-bold mb-3 mt-7">
                        <div className="flex flex-row space-x-2">
                            <button onClick={() => displayDepts()} className="flex items-center hover:text-customBlue"> <span>{selectedDept.dept_name}</span></button>
                            <button onClick={() => {}} className="flex items-center hover:text-customBlue"><FiChevronRight /><span>Courses</span></button>

                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col min-h-custom">
                        <div className="overflow-x-auto flex-grow px-5 pb-5 space-y-4 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 mt-4 md:space-y-0 bg-white">
                                 {/* Search Filter */}
                                 <div className="w-1/2">
                                    <SearchBar
                                        name='search'
                                        value={wordEntered}
                                        variant="bordered"
                                        onChange={handleFilter}
                                        placeholder="Search"
                                        className=" min-w-sm flex-1"
                                    />
                                </div>

                                {/* <div className="relative">
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
                                </div> */}
                                <div className="flex flex-row items-center space-x-5">
                                    <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                        <FaPlus /><span>New Course</span>
                                    </AddButton>

                                    <AddButton onClick={() => {assignCourseModal(selectedDept)}} className="text-customBlue hover:text-white space-x-1">
                                        <FaPlus /><span>Unassigned Course</span>
                                    </AddButton>

                                    <AddExistingCourse isOpen={isAddCourseModal} onClose={closeModal} deptId={selectedDept.id}/>
                                </div>
                            </div>

                            <div className=" pt-1">

                            {filteredData.length > 0 ? (
                                filteredData.map((course) => (
                                    <Card
                                    className="border-none hover:bg-gray-100 w-full my-5"
                                    shadow="sm"
                                    key={course.id}
                                    >
                                    <CardBody  onClick={() =>  displaySections(course)} className="cursor-pointer">
                                        <div className="w-full flex flex-row justify-between">
                                            <div className=" text-gray-600 font-semibold text-lg">{course.course_name} ({course.course_acronym})</div>
                                            <div className="relative flex justify-end items-center gap-2">
                                                <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                    <TbDotsVertical />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu >
                                                    <DropdownItem onClick={() => openEditModal(course)} showDivider startContent={<FaEdit className=" text-gray-600" />}>Edit</DropdownItem>
                                                    <DropdownItem onClick={() => deleteCourses(course.id)} color="danger" startContent={<MdFolderDelete/>}>Delete</DropdownItem>
                                                </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-row space-x-3">
                                            <div  className=" text-gray-600 text-small">Added By: {course.added_by}</div>
                                            <div  className=" text-gray-600 text-small">|</div>
                                            <div  className=" text-gray-600 text-small">Modified At: {formatDate(course.updated_at)}</div>
                                        </div>

                                    </CardBody>
                                    </Card>
                                ))
                            ) : (
                                <div className="flex flex-col items-center pt-20 justify-centers">
                                    <FaBuilding size={100} color="#d1d5db" />
                                    <div className="mt-3 text-gray-400 font-semibold">No courses found.</div>
                                </div>
                            )}
                            </div>

                        </div>

                    </div>
                </div>

            )}

            {/* SECTIONS TABLE */}
            {displayedData === 'Sections' && (

                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                     <div className="text-customGray text-lg font-bold mb-3 mt-7">
                        <div className="flex flex-row space-x-2">
                            <button onClick={() => displayCourses(selectedDept)} className="flex items-center hover:text-customBlue"><span>{selectedCourse.course_name}</span></button>
                            <button onClick={() => {}} className="flex items-center  hover:text-customBlue"><FiChevronRight /><span>Sections</span></button>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col min-h-custom p-5">
                        <div className="overflow-x-auto flex-grow px-5 pb-5 space-y-4 sm:px-5">
                            {/* <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 mt-4 md:space-y-0 bg-white">
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
                            </div> */}
                            <div className="grid lg:grid-cols-3 gap-5 md:grid-cols-2 grid-cols-1 pt-4">
                                {filteredData.length > 0 ? (
                                    filteredData.map((section) => (
                                        <div
                                            key={section.id}
                                            className="border rounded-lg p-6 cursor-pointer shadow hover:bg-gray-100 transition-colors duration-200"
                                            onClick={() => {}}
                                        >
                                            <div className="flex justify-center">
                                                <FcFolder size={70} />
                                            </div>
                                            <div className="text-center text-xl font-semibold mb-4">{section.section_name}</div>

                                            <div className=" text-sm text-gray-600">
                                                <p><strong>Assigned Teacher:</strong> {section.user.name || 'N/A'}</p>
                                                <p><strong>Date Created:</strong> {new Date(section.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center align-middle justify-center text-gray-200">
                                        <RiFolderUnknowFill size={400} />
                                        <p className="mt-4 text-2xl font-semibold">No section found</p>
                                    </div>
                                 )}
                            </div>


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
                                <div className="flex flex-col">
                                    <InputLabel htmlFor="dept_acronym" value="Department Acronym" />
                                    <TextInput
                                        id="dept_acronym"
                                        value={data.dept_acronym}
                                        onChange={(e) => setData('dept_acronym', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Department Acronym"
                                    />
                                    <InputError message={errors.dept_acronym} className="mt-2" />
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
                            <div className="flex flex-col">
                                    <InputLabel htmlFor="dept_acronym" value="Department Acronym" />
                                    <TextInput
                                        id="dept_acronym"
                                        value={data.dept_acronym}
                                        onChange={(e) => setData('dept_acronym', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Department Acronym"
                                    />
                                    <InputError message={errors.dept_acronym} className="mt-2" />
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

            {displayedData === 'Departments' && (
               <RemoveDepartment isOpen={isAssignModalOpen} onClose={closeModal} selectedDept={selectedDept} departments={departments.data}/>
            )}


            {displayedData === 'Courses' && <CreateCourse isOpen={isCreateModalOpen} onClose={closeModal} deptId={selectedId} setFilteredData={setFilteredData} courses={courses.data}/>}

            {displayedData === 'Courses' && selectedCourse && <EditCourse isOpen={isEditModalOpen} onClose={closeModal} deptId={selectedId} course={selectedCourse}/>}


            {displayedData === 'Sections' && <CreateSections isOpen={isCreateModalOpen} onClose={closeModal} sections={sections.data} courseId={selectedId} /> }
            {displayedData === 'Sections' && selectedSection && <EditSections isOpen={isEditModalOpen} onClose={closeModal} section={selectedSection} sections={sections.data}/>}

        </AdminLayout>
    );
}
