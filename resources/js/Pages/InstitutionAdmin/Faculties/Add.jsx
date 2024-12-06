import TextInput from '@/Components/TextInput';
import { Input, Button, Autocomplete, useCalendar, DatePicker } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaFileExcel, FaUser } from "react-icons/fa6";
import { IoMail, IoCheckmarkDone } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import { MdTextFields } from "react-icons/md";
import { MdRemoveDone } from "react-icons/md";
import { showToast } from '@/Components/Toast';
import Modal from '@/Components/Modal';
import { autocompleteOnChangeHandler } from '@/Utils/admin-utils';
import { FaBuilding, FaHashtag, FaRemoveFormat } from 'react-icons/fa';
import axios from 'axios';
import FileUpload from '@/Components/Admin/FileUpload';
import { customAutocompleteInputProps, customInputClassNames, parseNextUIDate } from '@/Utils/common-utils';
import { renderAutocompleteList } from '@/Pages/SuperAdmin/Users/Filter';

export default function Add({ isOpen, onClose }) {

    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [departmentsWithCoursesResponse, setDepartmentsWithCoursesResponse] = useState([]);
    const [autocomplete, setAutocomplete] = useState({
        department: [], course: [], plan: [], planStatus: []
    });

    useEffect(() => {
        console.log('selectedFile', selectedFile);
    }, [selectedFile]);

    const [isAutocompleteItemsLoading, setIsAutocompleteItemsLoading] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm(
        {
            uni_id_num: null,
            department_id: null,
            course_id: null,
            name: '',
            department: '',
            course: '',
            email: '',
            date_of_birth: null,
        }
    )

    useEffect(() => {
        setData('date_of_birth', parseNextUIDate(dateOfBirth));
        console.log('data.date_of_birth', data.date_of_birth);
    }, [dateOfBirth]);

    // useEffect(() => {
    //     fetchData();
    // }, [])

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

    // const fetchData = async () => {
    //     try {
    //         setIsAutocompleteItemsLoading(true);
    //         const response = await axios.get(route('institution.get-departments-with-courses'));
    //         console.log('deptcourses', response);

    //         // Extracting department names only
    //         const departmentAcronyms = response.data.map(department => department.dept_acronym);

    //         setDepartmentsWithCoursesResponse(response.data);

    //         setAutocomplete({
    //             ...autocomplete,
    //             department: departmentAcronyms,
    //         });
    //     }
    //     catch (error) {
    //         console.error("There was an error fetching the data!", error);
    //     } finally {
    //         setIsAutocompleteItemsLoading(false);
    //     }
    // };

    const handleAddStudent = (e) => {
        e.preventDefault();

        if (selectedFile) {


        }

        post(route('institution-faculties.add'), {
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
                showToast('error', `${error}`);
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
            return errors["department"];
        } else if (category === 'Course' && data.department) {
            return errors["course"];
        }
    }

    const handleClearFields = () => {
        setDateOfBirth(null);
        reset();
        clearErrors();
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Validate the file type if it is a CSV or not
        if (file && file.type !== 'text/csv' && file.name.split('.').pop().toLowerCase() !== 'csv') {
            setErrorMessage('Please upload a valid CSV file.');
            setSelectedFile(null);
            return;
        }

        // Clear previous errors and set the selected file
        setErrorMessage('');
        setSelectedFile(file);
        //console.log("Selected file:", file);
    };

    // const handleDepartmentClick = (deptAcronym) => {
    //     // Find the courses for the selected department
    //     const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_acronym === deptAcronym);
    //     setData('department_id', selectedDepartment.dept_id);


    //     console.log('selectedDepartment', selectedDepartment);

    //     // Get the courses through mapping
    //     const courses = selectedDepartment.course.map(c => c.course_acronym);

    //     setAutocomplete(prevState => ({
    //         ...prevState,
    //         course: courses,
    //     }));
    // };

    // const handleCourseClick = (courseAcronym) => {
    //     const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_id === data.department_id);
    //     const selectedCourse = selectedDepartment.course.find(course => course.course_acronym === courseAcronym);

    //     setData('course_id', selectedCourse.course_id);
    // };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    Add faculty
                </h2>
            </div>

            <form onSubmit={handleAddStudent}>
                <div className="text-customGray flex gap-9 p-6 overflow-auto tracking-wide">

                    {/* Single Add */}
                    <div className="flex flex-col w-full gap-4">
                        {/* <div className="pb-1">
                            <label className="font-bold text-md">Single Add</label>
                            <hr />
                        </div> */}
                        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                            <Input
                                type="number"
                                min={1}
                                radius="sm"
                                labelPlacement="outside"
                                label="University ID"
                                startContent={<FaHashtag />}
                                isInvalid={errors.uni_id_num}
                                errorMessage={errors.uni_id_num}
                                value={data.uni_id_num}
                                onChange={(e) => setData('uni_id_num', e.target.value)}
                                classNames={customInputClassNames()}
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
                                classNames={customInputClassNames()}
                            />
                            {/* {["Department", "Course"].map(category => (
                                <Autocomplete
                                    key={category}
                                    aria-label="Autocomplete Filter"
                                    radius="sm"
                                    label={category}
                                    labelPlacement="outside"
                                    placeholder=" "
                                    isLoading={isAutocompleteItemsLoading}
                                    errorMessage={handleAutocompleteErrors(category)}
                                    isInvalid={handleAutocompleteErrors(category)}
                                    autoFocus={false}
                                    isDisabled={category === 'Course' && data.department === ''}
                                    inputProps={customAutocompleteInputProps({}, { marginBottom: '0px' })}
                                    startContent={category === "Department" ? <FaBuilding size={25} /> : <GiGraduateCap size={43} />}
                                    onInputChange={(value) => autocompleteOnChangeHandler(setData, category, value)}
                                    onSelectionChange={(value) => autocompleteOnChangeHandler(setData, category, value)}
                                    className="min-w-1"
                                >
                                    {category === 'Department' && renderAutocompleteList(autocomplete.department, () => handleDepartmentClick(data.department))}
                                    {category === 'Course' && renderAutocompleteList(autocomplete.course, () => handleCourseClick(data.course))}
                                </Autocomplete>
                            ))
                            } */}
                            <DatePicker
                                label="Birth date"
                                labelPlacement="outside"
                                placeholder=" "
                                radius="sm"
                                isInvalid={errors.date_of_birth}
                                errorMessage={errors.date_of_birth}
                                className="w-full"
                                classNames={customInputClassNames({ base: "col-span-2" }, {})}
                                value={dateOfBirth}
                                onChange={(value) => setDateOfBirth(value)}
                            />

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
                                classNames={customInputClassNames({ base: "col-span-2" }, {})}
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
                    {/* <div className="w-[25%] flex flex-col gap-4">
                        <div className="flex flex-col h-full gap-2">
                            <div className="pb-2">
                                <label className="font-bold text-md">Bulk Add</label>
                                <hr />
                            </div>
                            <div className="pt-2 flex h-full">
                                <FileUpload
                                    fileFormat="csv, xls, xlsx"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleFileChange}
                                />
                            </div>

                        </div>
                        <div className="flex justify-center items-center">
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
                        </div>
                    </div> */}

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
