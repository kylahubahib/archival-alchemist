import { useState, useEffect } from 'react';
import { Autocomplete, Button, DateRangePicker } from "@nextui-org/react";
import { FaXmark } from "react-icons/fa6";
import { router } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { customAutocompleteInputProps, parseNextUIDateTime, sanitizeURLParam } from "@/Utils/common-utils";
import { autocompleteOnChangeHandler } from "@/Utils/admin-utils";
import { renderAutocompleteList } from "@/Pages/SuperAdmin/Users/Filter";
import axios from 'axios';

export default function Filter({ userType = 'student', filterRoute = 'institution-students.filter',
    hasUserPremiumAccess, selectedAutocompleteItems, setSelectedAutocompleteItems,
    autocompleteItems, setAutocompleteItems, isFilterOpen }) {

    const [isAutocompleteDataLoading, setIsAutocompleteDataLoading] = useState(false);
    const [departmentsRelatedData, setDepartmentsRelatedData] = useState(false);
    const [unfilteredCourses, setUnfilteredCourses] = useState([]);
    const [unfilteredSections, setUnfilteredSections] = useState([]);

    const params = route().params;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setFilters();
        }, 300);

        return () => clearTimeout(debounce);
    }, [selectedAutocompleteItems]);

    useEffect(() => {
        setUnfilteredAutocompleteItems();
        updateSelectedAutocompleteItems();
    }, [selectedAutocompleteItems.department, selectedAutocompleteItems.course]);

    const fetchData = async () => {
        try {
            setIsAutocompleteDataLoading(true);

            const departmentsWithCoursesAndSections = await axios.get(route('institution.get-departments-with-courses'));

            // Must link the .data for related function purposes
            setDepartmentsRelatedData(departmentsWithCoursesAndSections.data);

            // Extract department names
            const departmentAcronyms = departmentsWithCoursesAndSections?.data?.map(department => department.dept_acronym);

            // Extract course names from each department's course array
            const courseAcronyms = departmentsWithCoursesAndSections?.data?.flatMap(department =>
                department.course.map(course => course.course_acronym)
            );

            const sections = departmentsWithCoursesAndSections?.data?.flatMap(department =>
                department.course.flatMap(course =>
                    course.sections.map(section => section.section_name)
                )
            );

            // Store the unfiltered data
            setUnfilteredCourses(courseAcronyms);
            setUnfilteredSections(sections);

            setAutocompleteItems({
                ...autocompleteItems,
                department: departmentAcronyms,
                course: courseAcronyms,
                section: sections,
            });
        }
        catch (error) {
            console.error("There was an error fetching the data!", error);
        } finally {
            setIsAutocompleteDataLoading(false);
        }
    };

    const setFilters = () => {
        router.get(
            route(filterRoute, {
                ...params,
                hasUserPremiumAccess,
                page: null,
                department: sanitizeURLParam(selectedAutocompleteItems.department),
                course: sanitizeURLParam(selectedAutocompleteItems.course),
                section: sanitizeURLParam(selectedAutocompleteItems.section),
                date_created: selectedAutocompleteItems.dateCreated
                    ? parseNextUIDateTime(selectedAutocompleteItems.dateCreated)
                    : null,
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleInputValue = (category) => {
        const selectedWithCategories = {
            'Department': 'department',
            'Course': 'course',
            'Section': 'section',
            'Date Created': 'dateCreated'
        };

        const field = selectedWithCategories[category];

        if (category === 'Date Created') {
            return selectedAutocompleteItems[field] ?? null;
        } else {
            return selectedAutocompleteItems[field] ?? '';
        }
    };

    // Automatically set the courses and sections autocomplete items to unfiltered if there's no selected item for department and course
    const setUnfilteredAutocompleteItems = () => {
        if (!selectedAutocompleteItems.department) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                course: unfilteredCourses,
                section: unfilteredSections,
            }));
        }

        if (!selectedAutocompleteItems.course) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                section: unfilteredSections,
            }));
        }
    }

    // Clears the selected section if there's selected item for department and no selected item for course
    const updateSelectedAutocompleteItems = () => {
        if (selectedAutocompleteItems.department && !selectedAutocompleteItems.course) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                section: '',
            }))
        }
    }

    const handleDepartmentClick = () => {
        // Find the courses for the selected department
        const selectedDepartment = departmentsRelatedData?.find(department => department.dept_acronym === selectedAutocompleteItems.department);

        // Get the courses through mapping
        const courses = selectedDepartment.course.map(c => c.course_acronym);

        setAutocompleteItems(prevState => ({
            ...prevState,
            course: courses,
        }));

        // Clear the currently selected course and section in the autocomplete for department related data purposes
        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            course: '',
            section: '',
        }))
    };

    const handleCourseClick = () => {
        // Aggregate all courses from all departments
        const allCourses = departmentsRelatedData.flatMap(department => department.course);

        // Find the selected course based on the course acronym
        const selectedCourse = allCourses.find(course => course.course_acronym === selectedAutocompleteItems.course);

        // Get sections for the selected course, or leave empty if not found
        const sections = selectedCourse.sections.map(section => section.section_name);

        setAutocompleteItems(prevState => ({
            ...prevState,
            section: sections,
        }));

        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            section: '',
        }))
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} // Initial animation state
            animate={{ opacity: isFilterOpen ? 1 : 0, y: isFilterOpen ? 0 : -20 }} // Animates in based on `isFilterOpen`
            transition={{ duration: 0.3 }} // Sets the animation duration
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-between gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['Department', 'Course', 'Section', 'Date Created']
                    .filter(item => { // Show specific dropdowns based on userType
                        switch (userType) {
                            case 'student':
                                return !['Role'].includes(item);
                            case 'faculty':
                                return !['Course', 'Role'].includes(item);
                            case 'admin':
                                return !['Department', 'Course', 'Current Plan'].includes(item);
                        }
                    })
                    .map((category, index) => (
                        <div key={index} >
                            {category === 'Date Created'
                                ? <div className="flex items-center gap-1 w-full flex-1">
                                    <DateRangePicker
                                        aria-label="Date filter"
                                        size="sm"
                                        radius="sm"
                                        label="Date Created (Start Date - End Date)"
                                        placeholder=" "
                                        className="max-w-xl !text-white"
                                        granularity="minute"
                                        hideTimeZone
                                        visibleMonths={2}
                                        value={handleInputValue(category)}
                                        onChange={(date) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, 'Date Created', date)}
                                    />
                                    {(selectedAutocompleteItems.dateCreated?.start && selectedAutocompleteItems.dateCreated?.end) && (
                                        <Button
                                            radius="sm"
                                            isIconOnly
                                            onClick={() =>
                                                setSelectedAutocompleteItems(prevState => ({
                                                    ...prevState,
                                                    dateCreated: null,
                                                }))
                                            }
                                            className="mb-auto h-[47.99px] bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#7f7f87]"
                                        >
                                            <FaXmark size={20} />
                                        </Button>
                                    )}
                                </div>
                                : <div className="h-full w-full flex-1">
                                    <Autocomplete
                                        aria-label="Autocomplete Filter"
                                        size="sm"
                                        radius="sm"
                                        label={category}
                                        placeholder=" "
                                        isLoading={isAutocompleteDataLoading}
                                        autoFocus={false}
                                        inputProps={customAutocompleteInputProps()}
                                        isDisabled={
                                            // Disable section filter if there's a selected department and course is not yet selected
                                            category === 'Section' && (selectedAutocompleteItems.department && !selectedAutocompleteItems.course)
                                        }
                                        // defaultInputValue={handleInputValue(category)}
                                        inputValue={handleInputValue(category)}
                                        defaultSelectedKey={
                                            category === 'Department' && params.department ||
                                            category === 'Course' && params.course ||
                                            category === 'Section' && params.section ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        className="min-w-1"
                                    >
                                        {category === 'Department' && renderAutocompleteList(autocompleteItems.department, handleDepartmentClick)}

                                        {category === 'Course' && renderAutocompleteList(autocompleteItems.course, handleCourseClick)}

                                        {category === 'Section' && renderAutocompleteList(autocompleteItems.section)}

                                        {category === 'Date Created' && renderAutocompleteList(autocompleteItems.dateCreated)}
                                    </Autocomplete>
                                </div>
                            }
                        </div>
                    ))
            }
        </motion.div>
    )
}
