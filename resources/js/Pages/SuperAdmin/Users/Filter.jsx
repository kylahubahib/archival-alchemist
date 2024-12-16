import { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem, Button, DateRangePicker } from "@nextui-org/react";
import { router } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { autocompleteOnChangeHandler } from '@/Utils/admin-utils';
import { customAutocompleteInputProps, parseNextUIDateTime, sanitizeURLParam } from '@/Utils/common-utils';
import axios from 'axios';

// Since the users page is the first page in super admin so we export some functions here in filter part intended for this page to be used to another filter to another pages
export const renderAutocompleteList = (items, onClick = null) => {
    if (!Array.isArray(items) || items.length === 0) {
        return null; // Return `null` to avoid rendering anything
    }

    return items.map(item => (
        <AutocompleteItem onClick={onClick} key={item}>
            {item}
        </AutocompleteItem>
    ));
};

export default function Filter({ filterRoute = 'users.filter', type, params, uniBranchId, selectedAutocompleteItems, setSelectedAutocompleteItems,
    autocompleteItems, setAutocompleteItems, isFilterOpen }) {

    const [isAutocompleteDataLoading, setIsAutocompleteDataLoading] = useState(false);
    // Main data
    const [universitiesRelatedData, setUniversitiesRelatedData] = useState([]);

    // Can be filtered  when its dependent automplete is selected
    const [unfilteredBranchesRelatedData, setUnfilteredBranchesRelatedData] = useState([]);
    const [unfilteredDepartmentsRelatedData, setUnfilteredDepartmentsRelatedData] = useState([]);
    const [unfilteredCoursesRelatedData, setUnfilteredCoursesRelatedData] = useState([]);
    const [unfilteredSectionsRelatedData, setUnfilteredSectionsRelatedData] = useState([]);

    // Items for autocomplete
    const [unfilteredBranchesArray, setUnfilteredBranchesArray] = useState([]);
    const [unfilteredDepartmentsArray, setUnfilteredDepartmentsArray] = useState([]);
    const [unfilteredCoursesArray, setUnfilteredCoursesArray] = useState([]);
    const [unfilteredSectionsArray, setUnfilteredSectionsArray] = useState([]);


    // useEffect(() => {
    //     fetchData();
    // }, []);

    useEffect(() => {
        console.log('universitiesRelatedData', universitiesRelatedData);
    }, [universitiesRelatedData]);


    useEffect(() => {
        console.log('unfilteredBranchesRelatedData:', unfilteredBranchesRelatedData);

    }, [unfilteredBranchesRelatedData]);


    useEffect(() => {
        setUnfilteredAutocompleteItems();
        updateSelectedAutocompleteItems();
    }, [selectedAutocompleteItems.university, selectedAutocompleteItems.branch, selectedAutocompleteItems.department, selectedAutocompleteItems.course]);


    useEffect(() => {
        const debounce = setTimeout(() => {
            setFilters();
        }, 300);

        return () => clearTimeout(debounce);
    }, [selectedAutocompleteItems]);

    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        setIsAutocompleteDataLoading(true);

        try {
            const [universitiesResponse, currentPlansResponse, statusResponse,
                insAdminRolesResponse, superAdminRolesResponse] = await axios.all([
                    axios.get(route('fetch.university-related-data')),
                    axios.get(route('fetch.current-plans')),
                    axios.get(route('fetch.status')),
                    axios.get(route('fetch.institution-admin-roles')),
                    axios.get(route('fetch.super-admin-roles'))
                ]);

            setUniversitiesRelatedData(universitiesResponse.data);

            // Used for display as autocomplete items
            const universitiesArray = universitiesResponse?.data?.map(university => university.uni_acronym);

            // Used for displaying the related data when its dependent automplete is selected
            const branchesRelatedData = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.map(branch => ({
                    uni_branch_name: branch.uni_branch_name,
                    department: branch.department // Add department here for it to be accessible whenever there's a selected university
                }))
            );

            const branchesArray = branchesRelatedData.map(branch => branch.uni_branch_name);

            const departmentsRelatedData = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.map(department => ({
                        uni_branch_id: department.uni_branch_id,
                        dept_acronym: department.dept_acronym,
                        course: department.course
                    })))
            );

            let departmentsArray;

            // For ins admin students filter setup intended for the ins admin university branch
            if (uniBranchId) {
                departmentsArray = departmentsRelatedData
                    .filter(department => department.uni_branch_id === uniBranchId) // filter by uniBranchId
                    .map(department => department.dept_acronym);
            } else {
                departmentsArray = departmentsRelatedData.map(department => department.dept_acronym);
            }


            const coursesRelatedData = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.flatMap(department =>
                        department.course.map(course => ({
                            course_acronym: course.course_acronym,
                            sections: course.sections
                        }))))
            );

            const coursesArray = coursesRelatedData.map(course => course.course_acronym);

            const sectionsArray = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.flatMap(department =>
                        department.course.flatMap(course =>
                            course.sections.map(section => section.section_name))))
            );

            // Store the related data to the unfiltered data except to the last which is the section
            setUnfilteredBranchesRelatedData(branchesRelatedData);
            setUnfilteredDepartmentsRelatedData(departmentsRelatedData);
            setUnfilteredCoursesRelatedData(coursesRelatedData);
            setUnfilteredSectionsRelatedData(sectionsArray);

            // Store the unfiltered arrays
            setUnfilteredBranchesArray(branchesArray);
            setUnfilteredDepartmentsArray(departmentsArray);
            setUnfilteredCoursesArray(coursesArray);
            setUnfilteredSectionsArray(sectionsArray);

            setAutocompleteItems({
                ...autocompleteItems,
                university: universitiesArray,
                branch: branchesArray,
                department: departmentsArray,
                course: coursesArray,
                section: sectionsArray,
                currentPlan: currentPlansResponse.data,
                insAdminRole: insAdminRolesResponse.data,
                superAdminRole: superAdminRolesResponse.data,
                status: statusResponse.data
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
                page: null,
                university: sanitizeURLParam(selectedAutocompleteItems.university),
                branch: sanitizeURLParam(selectedAutocompleteItems.branch),
                department: sanitizeURLParam(selectedAutocompleteItems.department),
                course: sanitizeURLParam(selectedAutocompleteItems.course),
                section: sanitizeURLParam(selectedAutocompleteItems.section),
                plan: sanitizeURLParam(selectedAutocompleteItems.plan),
                plan_status: sanitizeURLParam(selectedAutocompleteItems.planStatus),
                super_admin_role: sanitizeURLParam(selectedAutocompleteItems.superAdminRole),
                ins_admin_role: sanitizeURLParam(selectedAutocompleteItems.insAdminRole),
                date_created: sanitizeURLParam(selectedAutocompleteItems.dateCreated),
                status: sanitizeURLParam(selectedAutocompleteItems.status),
            }),
            {}, // Additional data (if any)
            { preserveScroll: true, preserveState: true }
        );
    };


    const setUnfilteredAutocompleteItems = () => {
        if (!selectedAutocompleteItems.university) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                branch: unfilteredBranchesArray,
                department: unfilteredDepartmentsArray,
                course: unfilteredCoursesArray,
                section: unfilteredSectionsArray,
            }));
        }

        if (!selectedAutocompleteItems.branch) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                department: unfilteredDepartmentsArray,
                course: unfilteredCoursesArray,
                section: unfilteredSectionsArray,
            }));
        }

        if (!selectedAutocompleteItems.department) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                course: unfilteredCoursesArray,
                section: unfilteredSectionsArray,
            }));
        }

        if (!selectedAutocompleteItems.course) {
            setAutocompleteItems(prevState => ({
                ...prevState,
                section: unfilteredSectionsArray,
            }));
        }
    }

    // Clears the selected item for the related autocomplete item
    const updateSelectedAutocompleteItems = () => {

        // If no university or branch is selected but a department, course, and section are selected, reset department, course, and section.
        if (!selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && !selectedAutocompleteItems.course && !selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                department: '',
            }));
        }

        // If no university is selected but a branch, department, course, and section are selected, reset all values.
        else if (!selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && selectedAutocompleteItems.course && selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                branch: '',
                department: '',
                course: '',
                section: '',
            }));
        }

        else if (!selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && !selectedAutocompleteItems.course && !selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                branch: '',
                department: '',
            }));
        }

        // If no university or branch is selected but a department, course, and section are selected, reset department, course, and section.
        else if (!selectedAutocompleteItems.university && !selectedAutocompleteItems.branch && selectedAutocompleteItems.department && selectedAutocompleteItems.course && selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                department: '',
                course: '',
                section: '',
            }));
        }

        // If no university, branch, or department is selected but a course and section are selected, reset course and section.
        else if (!selectedAutocompleteItems.university && !selectedAutocompleteItems.branch && !selectedAutocompleteItems.department && selectedAutocompleteItems.course && selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                course: '',
                section: '',
            }));
        }

        // If a university is selected but no branch is selected, clear department, course, and section selections.
        else if (selectedAutocompleteItems.university && !selectedAutocompleteItems.branch) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                department: '',
                course: '',
                section: '',
            }));
        }

        // If both a university and a branch are selected, but no department is selected, clear course and section selections.
        else if (selectedAutocompleteItems.university && selectedAutocompleteItems.branch && !selectedAutocompleteItems.department) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                course: '',
                section: '',
            }));
        }

        // If a university, branch, and department are selected, but no course is selected, clear the section selection.
        else if (selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && !selectedAutocompleteItems.course) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                section: '',
            }));
        }

        // If all required data for a course is selected but no course is found, reset section.
        else if (selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && selectedAutocompleteItems.course && !selectedAutocompleteItems.section) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                section: '',
            }));
        }

        // If university is cleared, reset the branch, department, course, and section to empty.
        else if (!selectedAutocompleteItems.university && selectedAutocompleteItems.branch) {
            setSelectedAutocompleteItems(prevState => ({
                ...prevState,
                department: '',
                course: '',
                section: '',
            }));
        }
    }

    const handleInputValue = (category) => {
        const selectedWithCategories = {
            'University': 'university',
            'Branch': 'branch',
            'Department': 'department',
            'Course': 'course',
            'Section': 'section',
            'Current Plan': 'plan',
            'Plan Status': 'planStatus',
            'Date Created': 'dateCreated',
            'Status': 'status',
            'Super Admin Role': 'superAdminRole',
            'Institution Admin Role': 'insAdminRole',
        };

        const field = selectedWithCategories[category];

        if (category === 'Date Created') {
            return selectedAutocompleteItems[field] ?? null;
        } else {
            return selectedAutocompleteItems[field] ?? '';
        }
    };

    const handleUniversityClick = () => {
        // Find the selected university using the university acronym from the selected items
        const selectedUniversity = universitiesRelatedData?.find(university => university.uni_acronym === selectedAutocompleteItems.university);

        // Get the related branches for the selected university
        const branches = selectedUniversity?.university_branch.map(branch => branch.uni_branch_name);

        // Update the autocomplete items state with the branches for the selected university
        setAutocompleteItems(prevState => ({
            ...prevState,
            branch: branches,
        }));

        // Clear the currently selected branch, department, course, and section
        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            branch: '',
            department: '',
            course: '',
            section: '',
        }));
    };

    const handleBranchClick = () => {
        // Find the selected branch based on the branch name from the selected items
        const selectedBranch = unfilteredBranchesRelatedData.find(branch => branch.uni_branch_name === selectedAutocompleteItems.branch);

        // Get the departments related to the selected branch (or an empty array if none)
        const departments = selectedBranch?.department?.map(department => department.dept_acronym) || [];

        // Update the autocomplete items state with the departments for the selected branch
        setAutocompleteItems(prevState => ({
            ...prevState,
            department: departments, // Safely update with departments or an empty array
        }));

        // Clear the currently selected department, course, and section
        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            department: '',
            course: '',
            section: '',
        }));
    };

    const handleDepartmentClick = () => {
        // Find the selected department based on the department acronym from the selected items
        const selectedDepartment = unfilteredDepartmentsRelatedData.find(department => department.dept_acronym === selectedAutocompleteItems.department);

        // Get the courses related to the selected department
        const courses = selectedDepartment?.course.map(course => course.course_acronym) || [];

        // Update the autocomplete items state with the courses for the selected department
        setAutocompleteItems(prevState => ({
            ...prevState,
            course: courses,
        }));

        // Clear the currently selected course and section
        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            course: '',
            section: '',
        }));
    };

    const handleCourseClick = () => {
        // Find the selected course based on the course acronym from the selected items
        const selectedCourse = unfilteredCoursesRelatedData.find(course => course.course_acronym === selectedAutocompleteItems.course);

        // Get the sections related to the selected course
        const sections = selectedCourse?.sections.map(section => section.section_name) || [];

        // Update the autocomplete items state with the sections for the selected course
        setAutocompleteItems(prevState => ({
            ...prevState,
            section: sections,
        }));

        // Clear the currently selected section
        setSelectedAutocompleteItems(prevState => ({
            ...prevState,
            section: '',
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} // Initial animation state
            animate={{ opacity: isFilterOpen ? 1 : 0, y: isFilterOpen ? 0 : -20 }} // Animates in based on `isFilterOpen`
            transition={{ duration: 0.3 }} // Sets the animation duration
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-center gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Super Admin Role', 'Institution Admin Role', 'Status']
                    .filter(item => { // Show specific dropdowns based on type
                        switch (type) {
                            case 'student':
                                return !['Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'teacher':
                                return !['Course', 'Section', 'Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'admin':
                                return !['Department', 'Course', 'Section', 'Current Plan', 'Super Admin Role'].includes(item);
                            case 'superadmin':
                                return !['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Institution Admin Role'].includes(item);
                            case 'superadmin-subscription-billing':
                                return !['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Institution Admin Role'].includes(item);
                            case 'ins-student':
                                return !['University', 'Branch', 'Current Plan', 'Status', 'Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'ins-teacher':
                                return !['Course', 'Section', 'Current Plan', 'Status', 'University', 'Branch', 'Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'ins-coadmin':
                                return !['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Super Admin Role'].includes(item);
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
                                        // defaultInputValue={handleInputValue(category)}
                                        isDisabled={
                                            // Disable department, course, and section filters if a university is selected but no branch is selected.
                                            (category === 'Department' && selectedAutocompleteItems.university && !selectedAutocompleteItems.branch) ||
                                            (category === 'Course' && selectedAutocompleteItems.university && !selectedAutocompleteItems.branch) ||
                                            (category === 'Course' && !selectedAutocompleteItems.university && selectedAutocompleteItems.branch && !selectedAutocompleteItems.department) ||

                                            // Disable section filter if a university is selected but no branch is selected.
                                            (category === 'Section' && selectedAutocompleteItems.university && !selectedAutocompleteItems.branch) ||

                                            // Disable section filter if university and branch are selected but no department and no course are selected.
                                            (category === 'Section' && !selectedAutocompleteItems.university && selectedAutocompleteItems.branch && !selectedAutocompleteItems.department && !selectedAutocompleteItems.course) ||

                                            // Disable section filter if university is not selected, branch is not selected, but department is selected without a course.
                                            (category === 'Section' && !selectedAutocompleteItems.university && !selectedAutocompleteItems.branch && selectedAutocompleteItems.department && !selectedAutocompleteItems.course) ||

                                            // Disable course filter if both university and branch are selected but no department is selected.
                                            (category === 'Course' && selectedAutocompleteItems.university && selectedAutocompleteItems.branch && !selectedAutocompleteItems.department) ||

                                            // Disable section filter if university, branch, and department are selected but no course is selected.
                                            (category === 'Section' && selectedAutocompleteItems.university && selectedAutocompleteItems.branch && selectedAutocompleteItems.department && !selectedAutocompleteItems.course) ||

                                            // Disable section filter if university and branch are selected, but no department and no course are selected.
                                            (category === 'Section' && selectedAutocompleteItems.university && selectedAutocompleteItems.branch && !selectedAutocompleteItems.department && !selectedAutocompleteItems.course)
                                        }



                                        inputValue={handleInputValue(category)}
                                        // defaultSelectedKey={
                                        //     category === 'University' && params.university ||
                                        //     category === 'Branch' && params.branch ||
                                        //     category === 'Department' && params.department ||
                                        //     category === 'Course' && params.course ||
                                        //     category === 'Section' && params.section ||
                                        //     category === 'Current Plan' && params.plan ||
                                        //     category === 'Plan Status' && params.plan_status ||
                                        //     category === 'Status' && params.status ||
                                        //     category === 'Date Created' && params.date_created
                                        // }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        className="min-w-11"
                                    >
                                        {category === 'University' && (
                                            renderAutocompleteList(autocompleteItems.university, handleUniversityClick)
                                        )}
                                        {category === 'Branch' && (
                                            renderAutocompleteList(autocompleteItems.branch, handleBranchClick)
                                        )}
                                        {category === 'Department' && (
                                            renderAutocompleteList(autocompleteItems.department, handleDepartmentClick)
                                        )}
                                        {category === 'Course' && (
                                            renderAutocompleteList(autocompleteItems.course, handleCourseClick)
                                        )}
                                        {category === 'Section' && (
                                            renderAutocompleteList(autocompleteItems.section)
                                        )}
                                        {category === 'Current Plan' && (
                                            renderAutocompleteList(autocompleteItems.currentPlan)
                                        )}
                                        {category === 'Role' && (
                                            type === 'institution_admin' ?
                                                renderAutocompleteList(autocompleteItems.insAdminRole) :
                                                renderAutocompleteList(autocompleteItems.superAdminRole)
                                        )}
                                        {category === 'Status' && (
                                            renderAutocompleteList(autocompleteItems.status)
                                        )}
                                    </Autocomplete>
                                </div>
                            }
                        </div>
                    ))
            }
        </motion.div >
    )
}       