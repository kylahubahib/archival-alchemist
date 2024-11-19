import TextInput from '@/Components/TextInput';
import { Input, Button, Autocomplete, useCalendar } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaFileExcel, FaUser } from "react-icons/fa6";
import { IoMail, IoCheckmarkDone } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import { MdTextFields } from "react-icons/md";
import { MdRemoveDone } from "react-icons/md";
import { showToast } from '@/Components/Toast';
import Modal from '@/Components/Modal';
import { autocompleteInputProps, inputClassNames, onChangeHandler, renderAutocompleteItems } from '@/Components/Admins/Functions';
import { FaBuilding, FaHashtag, FaRemoveFormat } from 'react-icons/fa';
import axios from 'axios';
import FileUpload from '@/Components/Admins/FileUpload';


export default function Add({ isOpen, onClose }) {
    const [departmentsWithCoursesResponse, setDepartmentsWithCoursesResponse] = useState([]);
    const [autocomplete, setAutocomplete] = useState({
        department: [], course: [], plan: [], planStatus: []
    });

    const [isAutocompleteItemsLoading, setIsAutocompleteItemsLoading] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm(
        {
            student_id: null,
            department_id: null,
            course_id: null,
            name: '',
            department: { origText: '', acronym: '' },
            course: { origText: '', acronym: '' },
            email: '',
        }
    )

    useEffect(() => {
        fetchData();
    }, [])

    // useEffect(() => {
    //     console.log('departmentId', data.department_id);
    //     console.log('courseId', data.course_id);
    // })

    useEffect(() => {
        if (isOpen) {
            return;
        } else if (onClose) {
            // Add a delay so that resetting the default values will not be visible when the modal closes
            const counterModalCloseDelay = setTimeout(() => {
                reset();
                clearErrors();
            }, 300)

            return () => clearTimeout(counterModalCloseDelay);
        }

    }, [onClose])

    const fetchData = async () => {
        try {
            setIsAutocompleteItemsLoading(true);
            const response = await axios.get(route('institution.get-departments-with-courses'));
            console.log('deptcourses', response);

            // Extracting department names only
            const departmentNames = response.data.map(department => department.dept_name);

            setDepartmentsWithCoursesResponse(response.data);

            setAutocomplete({
                ...autocomplete,
                department: departmentNames,
            });
        }
        catch (error) {
            console.error("There was an error fetching the data!", error);
        } finally {
            setIsAutocompleteItemsLoading(false);
        }
    };

    const handleAddStudent = (e) => {
        e.preventDefault();

        post(route('institution-students.add'), {
            onSuccess: () => {
                setTimeout(() => {
                    showToast('success',
                        <div>
                            <strong>{data.name}</strong> has been successfully added as a student.
                        </div>,
                        {
                            autoClose: 6000,
                            className: 'min-w-[450px] max-w-sm'
                        }
                    );
                }, 300);
                onClose();
            },
            onError: (error) => {
                console.error('Error occurred while adding the student:', error);
                // showToast('error', 'An error occurred. Please try again.', {
                //     autoClose: 5000,
                //     className: 'min-w-[350px] max-w-sm'
                // });
            },
        });
    };

    const handleAutocompleteErrors = (category) => {
        if (category === 'Department') {
            return errors["department.origText"];
        } else if (category === 'Course' && data.department?.origText) {
            return errors["course.origText"];
        }
    }

    const handleClearFields = () => {
        reset();
        clearErrors();
    }

    const handleDepartmentClick = (deptName) => {
        // Find the courses for the selected department
        const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_name === deptName);
        setData('department_id', selectedDepartment.dept_id);


        console.log('selectedDepartment', selectedDepartment);

        // Get the courses through mapping
        const courses = selectedDepartment.course.map(c => c.course_name);

        setAutocomplete(prevState => ({
            ...prevState,
            course: courses,
        }));
    };

    const handleCourseClick = (courseName) => {
        const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_id === data.department_id);
        const selectedCourse = selectedDepartment.course.find(course => course.course_name === courseName);

        setData('course_id', selectedCourse.course_id);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    Add student
                </h2>
            </div>

            <form onSubmit={handleAddStudent}>
                <div className="text-customGray flex gap-9 p-6 overflow-auto tracking-wide">

                    {/* Single Add */}
                    <div className="flex flex-col w-[70%] gap-4">
                        <div className="pb-2">
                            <label className="font-bold text-md">Single Add</label>
                            <hr />
                        </div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                            <Input
                                type="number"
                                min={1}
                                radius="sm"
                                labelPlacement="outside"
                                label="Student ID"
                                startContent={<FaHashtag />}
                                isInvalid={errors.student_id}
                                errorMessage={errors.student_id}
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                classNames={inputClassNames()}
                            />
                            <Input
                                type="text"
                                radius="sm"
                                labelPlacement="outside"
                                label="Name"
                                startContent={<FaUser />}
                                isInvalid={errors.name}
                                errorMessage={errors.name}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                classNames={inputClassNames()}
                            />
                            {["Department", "Course"].map(category => (
                                <Autocomplete
                                    aria-label="Autocomplete Filter"
                                    radius="sm"
                                    label={category}
                                    labelPlacement="outside"
                                    placeholder=" "
                                    isLoading={isAutocompleteItemsLoading}
                                    errorMessage={handleAutocompleteErrors(category)}
                                    isInvalid={handleAutocompleteErrors(category)}
                                    autoFocus={false}
                                    isDisabled={category === 'Course' && data.department.acronym === ''}
                                    inputProps={autocompleteInputProps({}, { marginBottom: '0px' })}
                                    startContent={category === "Department" ? <FaBuilding size={25} /> : <GiGraduateCap size={43} />}
                                    defaultSelectedKey={""}
                                    onInputChange={(value) => onChangeHandler({ setter: setData, category, value, forOnInputChange: true })}
                                    onSelectionChange={(value) => onChangeHandler({ setter: setData, category, value, forOnSelectionChange: true })}
                                    className="min-w-1"
                                >
                                    {category === 'Department' && renderAutocompleteItems('Department', autocomplete.department, () => handleDepartmentClick(data.department.origText))}
                                    {category === 'Course' && renderAutocompleteItems('Course', autocomplete.course, () => handleCourseClick(data.course.origText))}
                                </Autocomplete>
                            ))
                            }
                            <Input
                                type="email"
                                radius="sm"
                                labelPlacement="outside"
                                label="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                startContent={<IoMail size={20} />}
                                isInvalid={errors.email}
                                errorMessage={errors.email}
                                classNames={inputClassNames({ base: "col-span-2" }, {})}
                            />
                        </div>
                        <div className="flex gap-3 justify-center items-center">
                            <Button
                                startContent={<MdTextFields size={22} />}
                                color="default"
                                size="md"
                                radius="sm"
                                className="p-2 mr-auto"
                                onClick={handleClearFields}
                            >
                                Clear fields
                            </Button>
                        </div>
                    </div>

                    {/* Bulk Add */}
                    <div className="w-[25%] flex flex-col gap-4">
                        <div className="flex flex-col h-full gap-2">
                            <div className="pb-2">
                                <label className="font-bold text-md">Bulk Add</label>
                                <hr />
                            </div>
                            <div className="pt-2 flex h-full">
                                <FileUpload
                                    fileFormat="CSV"
                                />
                            </div>

                        </div>
                        {/* <div className="flex justify-center items-center">
                            <Button
                                startContent={<FaFileExcel size={20} />}
                                color="default"
                                size="md"
                                radius="sm"
                                className="p-2 mr-auto w-full"
                            // isDisabled={data.access.length === 0}
                            // onClick={() => handleClearAll(setData, true, 'access')}
                            >
                                Remove
                            </Button>
                        </div> */}
                    </div>

                </div>


                <div className="bg-customBlue p-2 gap-2 flex justify-end">
                    <Button color="primary" size="sm" type="submit" isLoading={processing}>
                        {processing ? 'Adding...' : 'Add'}
                    </Button>
                    <Button color="danger" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>

        </Modal >
    );
}
