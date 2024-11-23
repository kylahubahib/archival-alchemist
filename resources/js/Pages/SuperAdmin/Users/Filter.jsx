import { Autocomplete, AutocompleteItem, Button, DatePicker } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { FaFilterCircleXmark, FaXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { toast } from 'react-toastify';
// import { getAcronymAndOrigText } from "@/Components/Admins/Functions";
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function Filter({ isOpen, onClose, userType, isUserTypeNavClicked, setIsUserTypeNavClicked, totalFilters, handleTotalFilters, handleClearFilters, fetchFilteredData }) {
    const [autocomplete, setAutocomplete] = useState(
        { university: [], branch: [], department: [], course: [], currentPlan: [], insAdminRole: [], superAdminRole: [], status: [] }
    );
    const [selected, setSelected] = useState(
        { // Set the default value of dateCreated to null to avoid date format errors, and keep the other default values as empty strings to prevent input null errors.
            university: { id: null, original: '', acronym: '' }, branch: { id: null, name: '' }, department: { id: null, original: '', acronym: '' }, course: { id: null, original: '', acronym: '' },
            currentPlan: '', insAdminRole: '', superAdminRole: '', dateCreated: null, status: ''
        });
    const [savedFilters, setSavedFilters] = useState([]);
    const [filterCount, setFilterCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const clearFilters = () => {
        setSelected(
            {
                university: { id: null, original: '', acronym: '' }, branch: { id: null, name: '' }, department: { id: null, original: '', acronym: '' }, course: { id: null, original: '', acronym: '' },
                currentPlan: '', insAdminRole: '', superAdminRole: '', dateCreated: null, status: ''
            });

        setFilterCount(0);
    }

    useEffect(() => {
        // console.log('selected university', selected.university);
        // console.log('selected branch', selected.branch);
        // console.log('selected date created', selected.dateCreated);
        // console.log('autocomplete university', autocomplete.university);
        // console.log('selected university', selected.university);
        console.log('autocomplete branch', autocomplete.branch);
        console.log('selected branch', selected.branch);
        console.log('autocomplete department', autocomplete.department);
        console.log('selected department', selected.department);
        console.log('autocomplete course', autocomplete.course);
        console.log('selected department', selected.course);
        console.log('selected.branch.id', selected.branch.id);

    },)

    // Handles the values in the filter modal
    useEffect(() => {
        setTimeout(() => {
            if (isUserTypeNavClicked || totalFilters === 0) {
                clearFilters();
                handleTotalFilters(0);
                setIsUserTypeNavClicked(false);
            }
        }, 200)

        if (isOpen && totalFilters > 0) {
            retrieveSavedFilters();
            setFilterCount(totalFilters);
            // Pass a function to the Users component by passing it as a parameter in this component.
            handleClearFilters(clearFilters, setFilters);
        }

    }, [isUserTypeNavClicked, isOpen]);

    // Fetches the data as dropdown menus data including universities, branches, departments, etc.  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [universitiesResponse, currentPlansResponse, statusResponse,
                    insAdminRolesResponse, superAdminRolesResponse] = await axios.all([
                        axios.get(route('fetch.universities')),
                        axios.get(route('fetch.current-plans')),
                        axios.get(route('fetch.status')),
                        axios.get(route('fetch.institution-admin-roles')),
                        axios.get(route('fetch.super-admin-roles'))
                    ]);

                setAutocomplete({
                    ...autocomplete,
                    university: universitiesResponse.data,
                    currentPlan: currentPlansResponse.data,
                    insAdminRole: insAdminRolesResponse.data,
                    superAdminRole: superAdminRolesResponse.data,
                    status: statusResponse.data
                });
            }
            catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchData();
    }, []);

    // Fetches the related branches, departments, and courses for the university 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(route('fetch.university-related-data'), {
                    params: { university: selected.university.original }
                });

                console.log("response", response);

                setAutocomplete(prevState => {

                    // Fetch branches and populate the branch autocomplete data with their IDs and names
                    // to be used when loading the corresponding departments.
                    const branches = response.data.map(branch => ({
                        branch_id: branch.uni_branch_id,
                        name: branch.uni_branch_name
                    }));

                    const departments = response.data.map(branch =>
                        branch.department.map(dept => ({
                            dept_id: dept.dept_id,          // Use dept_id for the department ID
                            name: dept.dept_name,     // Use dept_name for the department name
                            uni_branch_id: dept.uni_branch_id        // Use dept_id for the department ID
                        }))
                    ).flat(1);

                    const courses = response.data
                        .map(branch =>
                            branch.department
                                .map(dept =>
                                    dept.course.map(course => ({
                                        dept_id: course.course_id,
                                        name: course.course_name
                                    }))
                                )
                        ).flat(2);

                    return {
                        ...prevState,
                        branch: branches,
                        department: departments,
                        course: courses
                    };
                });

            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        if (selected.university) {
            fetchData();
        }
    }, [selected.university.original]);


    const setFilters = async () => {
        setSavedFilters(Object.values(selected));
        handleTotalFilters(filterCount);

        setIsLoading(true);

        try {
            await fetchFilteredData(selected.university, selected.branch, selected.department,
                selected.course, selected.currentPlan, selected.insAdminRole, selected.superAdminRole,
                selected.dateCreated, selected.status);

            setTimeout(() => {
                toast.success(
                    <div>
                        {filterCount === 0 ?
                            (<>All filters have been <strong>cleared</strong> successfully!</>) :
                            (<>
                                <strong>{filterCount}</strong>
                                &nbsp;{filterCount === 1 ? 'filter' : 'filters'}
                                &nbsp;{filterCount === 1 ? 'has' : 'have'} been set successfully!
                            </>)}
                    </div>
                );
            }, 500);

        } catch (error) {
            console.error("Error setting filters or fetching data:", error);
        } finally {
            // Sets the saved filters after clicking the save button
            setIsLoading(false);
            onClose();
        }
    };

    const getSelectedField = (category) => {
        switch (category) {
            case 'University':
                return 'university';
            case 'Branch':
                return 'branch';
            case 'Department':
                return 'department';
            case 'Course':
                return 'course';
            case 'Current Plan':
                return 'currentPlan';
            case 'Role':
                return userType === 'institution_admin' ? 'insAdminRole' : 'superAdminRole';
            case 'Date Created':
                return 'dateCreated';
            case 'Status':
                return 'status';
            default:
                return [];
        }

    }

    const handleFilterCount = (category, newValue) => {
        const field = getSelectedField(category);
        const prevValue = selected[field];
        const updatedNewValue = (field === 'university' || field === 'department' || field === 'course')
            ? getAcronymAndOrigText(newValue)
            : newValue;
        const decrementCount = (count) => setFilterCount(prevCount => prevCount - count);
        const incrementCount = () => setFilterCount(prevCount => prevCount + 1);

        const clearFields = (fields) => {
            setSelected(prev => ({
                ...prev,
                ...fields
            }));
        };

        // Handle university clearing and related fields
        if (field === 'university') {
            const shouldDecrement = prevValue.acronym && !updatedNewValue.acronym;

            if (shouldDecrement) {
                let decrementValue = 1; // Start by decrementing for university

                // Check if branch, department, or course are also selected
                selected.branch && decrementValue++;
                selected.department.acronym && decrementValue++;
                selected.course.acronym && decrementValue++;

                decrementCount(decrementValue); // Decrement based on filled fields

                clearFields({
                    branch: '',
                    department: { original: '', acronym: '' },
                    course: { original: '', acronym: '' }
                });
            } else if (!prevValue.acronym && updatedNewValue.acronym) {
                incrementCount();
            }
        }
        // Handle department clearing
        else if (field === 'department') {
            const shouldDecrement = prevValue.acronym && !updatedNewValue.acronym;

            if (shouldDecrement) {
                let decrementValue = 1; // Start by decrementing for department

                // Check if course is also selected
                if (selected.course.acronym) decrementValue++;

                decrementCount(decrementValue); // Decrement based on filled fields

                clearFields({
                    course: { original: '', acronym: '' }
                });
            } else if (!prevValue.acronym && updatedNewValue.acronym) {
                incrementCount();
            }
        }
        // Handle course clearing
        else if (field === 'course') {
            const shouldDecrement = prevValue.acronym && !updatedNewValue.acronym;

            if (shouldDecrement) {
                decrementCount(1); // Decrement for course
            } else if (!prevValue.acronym && updatedNewValue.acronym) {
                incrementCount();
            }
        }
        // Handle other fields
        else {
            const shouldDecrement = prevValue && !updatedNewValue;
            const shouldIncrement = !prevValue && updatedNewValue;

            if (shouldDecrement) {
                decrementCount(1); // Decrement for other non-university fields
            } else if (shouldIncrement) {
                incrementCount();
            }
        }
    };

    const handleInputValue = (category) => {
        // const field = getSelectedField(category);

        // // For categories with object values
        // if (['University', 'Department', 'Course'].includes(category)) {
        //     return selected[field].acronym ?? '';
        // } else {
        //     return selected[field] ?? (category === 'Date Created' ? null : '');
        // }
    };


    const onChangeHandler = ({ category, value, forOnSelectionChange = false, forOnInputChange = false }) => {

        console.log("Onchange Value", value);
        setSelected(prev => ({
            ...prev,
            // For values with an acronym, assigns only the acronym value for onInputChange handler   
            university: (category === 'University' && forOnInputChange)
                ? { ...prev.university, acronym: value ?? prev.university.acronym }
                : (category === 'University' ? getAcronymAndOrigText(null, value) : prev.university),

            branch: (category === 'Branch' && forOnInputChange)
                // Since onInputChange only gets the name, and onSelectionChange gets the key that stores the branch ID,
                // we combined them to use the ID for querying the database for the related department.
                ? { ...prev.branch, name: value ?? prev.branch.name }
                : { ...prev.branch, id: value ?? prev.branch.id },

            department: (category === 'Department' && forOnInputChange)
                ? { ...prev.department, acronym: value ?? prev.department.acronym }
                : (category === 'Department' ? getAcronymAndOrigText(value) : prev.department),

            course: (category === 'Course' && forOnInputChange)
                ? { ...prev.course, acronym: value ?? prev.course.acronym }
                : (category === 'Course' ? getAcronymAndOrigText(value) : prev.course),

            currentPlan: category === 'Current Plan' ? value : prev.currentPlan,

            insAdminRole: (category === 'Role' && userType === 'institution_admin')
                ? value
                : prev.insAdminRole,

            superAdminRole: (category === 'Role' && userType === 'super_admin')
                ? value
                : prev.superAdminRole,

            dateCreated: category === 'Date Created' ? value : prev.dateCreated,

            status: category === 'Status' ? value : prev.status
        }));

        if (forOnSelectionChange) {
            handleFilterCount(category, value);
        }
    }

    const handleClearDateCreated = () => {
        setSelected({ ...selected, dateCreated: null });
        setFilterCount(prevCount => prevCount - 1);
    }

    function retrieveSavedFilters() {
        const keys = Object.keys(selected);
        const updatedSelected = {};

        keys.map((key, index) => {
            // If there's no key present in the updatedSelected, it will add automatically as key with value from the savedFilters
            updatedSelected[key] = savedFilters[index];
        });

        setSelected(updatedSelected);
    }

    const loadFilterAutoCompleteItems = (category, autoComplete) => {
        let itemLabel;
        let itemKey;
        let itemObj;

        return autoComplete.map(item => {
            if (category === 'University') {
                itemObj = getAcronymAndOrigText(null, item);
                itemLabel = itemObj.acronym;
                itemKey = itemObj.original;
            }
            else if (category === 'Branch') {
                itemLabel = item.name;
                itemKey = item.branch_id;
            }
            else if (category === 'Department') {
                // Filter based on the selected branch's ID
                if (item.uni_branch_id === selected.branch.id) {
                    console.log('item.uni_branch_id', item.uni_branch_id);
                    itemObj = getAcronymAndOrigText(item.dept_id, item.name);
                    console.log('item.itemObj', itemObj);
                    itemLabel = itemObj.acronym;
                    itemKey = itemObj.id + itemObj.original;
                }

            }
            else if (category === 'Courses') {
                if (item.dept_id === selected.dept.id) {
                    itemObj = getAcronymAndOrigText(item.course_id, item.name);
                    itemLabel = itemObj.acronym;
                    itemKey = itemObj.original;
                }
            }
            else {
                itemLabel = item;
                itemKey = item;
            }

            return (
                <AutocompleteItem key={itemKey}>
                    {itemLabel}
                </AutocompleteItem>
            );
        });
    };


    return (


        <Modal show={isOpen} onClose={onClose} maxWidth={`${(userType === 'student' || userType === 'faculty') ? '2xl' : 'md'}`} >
            <div className="bg-customBlue p-3 tracking-widest" >
                <h2 className="text-xl text-white inline-block font-bold">
                    <span>
                        Filter <FaFilter size={17} className="inline mb-1" /> {filterCount}
                    </span>
                </h2>
            </div>
            <div className="p-6 space-y-5 overflow-auto tracking-wider">
                <form >
                    <div className='space-y-5'>
                        <div className={`grid ${(userType === 'student' || userType === 'faculty') ? 'grid-cols-3' : 'grid-cols-2'} gap-x-9 gap-y-2 text-customGray`}>
                            {
                                ['University', 'Branch', 'Department', 'Course', 'Current Plan', 'Role', 'Date Created', 'Status']
                                    .filter(item => { // Show specific dropdowns based on userType
                                        switch (userType) {
                                            case 'student':
                                                return !['Role'].includes(item);
                                            case 'faculty':
                                                return !['Course', 'Role'].includes(item);
                                            case 'institution_admin':
                                                return !['Department', 'Course', 'Current Plan'].includes(item);
                                            case 'super_admin':
                                                return !['University', 'Branch', 'Department', 'Course', 'Current Plan'].includes(item);
                                        }
                                    })
                                    .map((category, index, array) => (
                                        <div key={index} className={`flex flex-col ${index === array.length - 1 ? 'col-span-1' : ''}`}>
                                            {category === 'Date Created'
                                                ?
                                                <div className="flex gap-1">
                                                    <DatePicker
                                                        label="Date Created"
                                                        labelPlacement="outside"
                                                        radius="sm"
                                                        showMonthAndYearPickers
                                                        className="pb-2"
                                                        value={handleInputValue('Date Created')}
                                                        onChange={(date) => onChangeHandler({ category: 'Date Created', value: date, forOnSelectionChange: true })}
                                                    />
                                                    {selected.dateCreated &&
                                                        <FaXmark
                                                            size={50}
                                                            className="h-full hover:bg-gray-400 cursor-pointer rounded-md px-2 text-gray-500 transition duration-200"
                                                            onClick={handleClearDateCreated}
                                                        />
                                                    }
                                                </div>
                                                :
                                                <Autocomplete
                                                    aria-label="Autocomplete Filter"
                                                    radius="sm"
                                                    label={category}
                                                    labelPlacement="outside"
                                                    placeholder=" "
                                                    className="capitalize pb-2"
                                                    autoFocus={false}
                                                    inputProps={{
                                                        style: {
                                                            border: 'none',
                                                            boxShadow: 'none'
                                                        },
                                                    }}
                                                    isDisabled={
                                                        (category === 'Branch' && selected.university.acronym === '') ||
                                                        (category === 'Department' && selected.branch.name === '') ||
                                                        (category === 'Course' && selected.department.acronym === '')
                                                    }
                                                    inputValue={handleInputValue(category)}
                                                    onInputChange={(value) => onChangeHandler({ category, value, forOnInputChange: true })}
                                                    onSelectionChange={(value) => onChangeHandler({ category, value, forOnSelectionChange: true })}
                                                >
                                                    {category === 'University' && (
                                                        loadFilterAutoCompleteItems('University', autocomplete.university)
                                                    )}
                                                    {category === 'Branch' && (
                                                        loadFilterAutoCompleteItems('Branch', autocomplete.branch)
                                                    )}
                                                    {category === 'Department' && (
                                                        loadFilterAutoCompleteItems('Department', autocomplete.department)
                                                    )}
                                                    {category === 'Course' && (
                                                        loadFilterAutoCompleteItems('Course', autocomplete.course)
                                                    )}
                                                    {category === 'Current Plan' && (
                                                        loadFilterAutoCompleteItems('Current Plan', autocomplete.currentPlan)
                                                    )}
                                                    {category === 'Role' && (
                                                        userType === 'institution_admin' ?
                                                            loadFilterAutoCompleteItems('Role', autocomplete.insAdminRole) :
                                                            loadFilterAutoCompleteItems('Role', autocomplete.superAdminRole)
                                                    )}
                                                    {category === 'Status' && (
                                                        loadFilterAutoCompleteItems('Status', autocomplete.status)
                                                    )}
                                                </Autocomplete>
                                            }
                                        </div>
                                    ))
                            }
                        </div>

                        <div className="flex gap-5 justify-center items-center">
                            <Button
                                startContent={<FaFilterCircleXmark size={18} />}
                                color="default"
                                size="md"
                                radius="sm"
                                className='mr-auto p-2'
                                isDisabled={filterCount === 0}
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        </div>
                    </div>
                </form>
            </div >

            <div className="bg-customBlue p-2 gap-2 flex justify-end" >
                <Button
                    color="primary"
                    size='sm'
                    isLoading={isLoading}
                    isDisabled={filterCount === 0 && totalFilters === 0}
                    onClick={setFilters}>
                    Save
                </Button>
                <Button color="danger" size='sm' onClick={onClose}>Cancel</Button>
            </div>
        </Modal >
    );
}