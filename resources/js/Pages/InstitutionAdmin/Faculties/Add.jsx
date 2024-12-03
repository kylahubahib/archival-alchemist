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
import { onChangeHandler, renderAutocompleteItems } from '@/Utils/admin-utils';
import { FaBuilding, FaHashtag, FaRemoveFormat } from 'react-icons/fa';
import axios from 'axios';
import FileUpload from '@/Components/Admin/FileUpload';
import AutocompleteList from '@/Components/Admins/AutocompleteList';
import { customAutocompleteInputProps, customInputClassNames } from '@/Utils/common-utils';


export default function Add({ isOpen, onClose }) {
    const [departmentsWithCoursesResponse, setDepartmentsWithCoursesResponse] = useState([]);
    const [autocomplete, setAutocomplete] = useState({
        department: [], plan: [], planStatus: []
    });

    const [isAutocompleteItemsLoading, setIsAutocompleteItemsLoading] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm(
        {
            faculty_id: null,
            department_id: null,
            course_id: null,
            name: '',
            department: '',
            email: '',
        }
    )

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        console.log('Faculty DepartmentId', data.department_id);
    })

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
            const departmentAcronyms = response.data.map(department => department.dept_acronym);

            setDepartmentsWithCoursesResponse(response.data);

            setAutocomplete({
                ...autocomplete,
                department: departmentAcronyms,
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

        post(route('institution-faculties.add'), {
            onSuccess: () => {
                setTimeout(() => {
                    showToast('success',
                        <div>
                            <strong>{data.name}</strong> has been successfully added as a faculty.
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
                console.error('Error occurred while adding the faculty:', error);
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
        reset();
        clearErrors();
    }

    const handleDepartmentClick = (deptAcronym) => {
        // Find the courses for the selected department
        const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_acronym === deptAcronym);
        setData('department_id', selectedDepartment.dept_id);


        console.log('selectedDepartment', selectedDepartment);

        // Get the courses through mapping
        const courseAcronyms = selectedDepartment.course.map(c => c.course_acronym);

        setAutocomplete(prevState => ({
            ...prevState,
            course: courseAcronyms,
        }));
    };

    // const handleCourseClick = (courseAcronyms) => {
    //     const selectedDepartment = departmentsWithCoursesResponse.find(department => department.dept_id === data.department_id);
    //     const selectedCourse = selectedDepartment.course.find(course => course.course_acronym === courseAcronyms);

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
                                label="Faculty ID"
                                startContent={<FaHashtag />}
                                isInvalid={errors.faculty_id}
                                errorMessage={errors.faculty_id}
                                value={data.faculty_id}
                                onChange={(e) => setData('faculty_id', e.target.value)}
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
                            <Autocomplete
                                aria-label="Autocomplete Filter"
                                radius="sm"
                                label="Department"
                                labelPlacement="outside"
                                placeholder=" "
                                isLoading={isAutocompleteItemsLoading}
                                errorMessage={handleAutocompleteErrors("Department")}
                                isInvalid={handleAutocompleteErrors("Department")}
                                autoFocus={false}
                                inputProps={autocompleteInputProps({}, { marginBottom: '0px' })}
                                startContent={<FaBuilding size={25} />}
                                defaultSelectedKey=""
                                onInputChange={(value) => onChangeHandler(setData, value, true)}
                                onSelectionChange={(value) => onChangeHandler(setData, value, true)}
                                className="col-span-2"
                            >
                                {renderAutocompleteItems(autocomplete.department, () => handleDepartmentClick(data.department))}
                            </Autocomplete>

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
