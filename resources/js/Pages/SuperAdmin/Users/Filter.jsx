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

export default function Filter({ userType, selectedAutocompleteItems, setSelectedAutocompleteItems,
    autocompleteItems, setAutocompleteItems, isFilterOpen }) {

    const [isAutocompleteDataLoading, setIsAutocompleteDataLoading] = useState(false);
    const [universitiesRelatedData, setUniversitiesRelatedData] = useState(false);
    const [unfilteredBranches, setUnfilteredBranches] = useState([]);
    const [unfilteredDepartments, setUnfilteredDepartments] = useState([]);
    const [unfilteredCourses, setUnfilteredCourses] = useState([]);
    const [unfilteredSections, setUnfilteredSections] = useState([]);

    const params = route().params;

    // useEffect(() => {
    //     fetchData();
    // }, []);

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


            const universityAcronyms = universitiesResponse?.data?.map(university => university.uni_acronym);

            const branches = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.map(branch => branch.uni_branch_name)
            );

            const departmentAcronyms = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.map(department => department.dept_acronym))
            );

            const courseAcronyms = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.flatMap(department =>
                        department.course.map(course => course.course_acronym)))
            );

            const sections = universitiesResponse?.data?.flatMap(universiy =>
                universiy.university_branch.flatMap(branch =>
                    branch.department.flatMap(department =>
                        department.course.flatMap(course =>
                            course.sections.map(section => section.section_name))))
            );


            setUnfilteredBranches(branches);
            setUnfilteredDepartments(departmentAcronyms);
            setUnfilteredCourses(courseAcronyms);
            setUnfilteredSections(sections);

            console.log('universityAcronyms', universityAcronyms);
            console.log('branches', branches);
            console.log('departmentAcronyms', departmentAcronyms);
            console.log('courseAcronyms', courseAcronyms);
            console.log('sections', sections);
            console.log('insAdminRolesResponse', insAdminRolesResponse);
            console.log('superAdminRolesResponse', superAdminRolesResponse);

            console.log('universitiesResponse.data', universitiesResponse.data);


            setAutocompleteItems({
                ...autocompleteItems,
                university: universityAcronyms,
                branch: branches,
                department: departmentAcronyms,
                course: courseAcronyms,
                section: sections,
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


    const setFilters = () => {
        router.get(
            route('users.filter', {
                ...params,
                userType,
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

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} // Initial animation state
            animate={{ opacity: isFilterOpen ? 1 : 0, y: isFilterOpen ? 0 : -20 }} // Animates in based on `isFilterOpen`
            transition={{ duration: 0.3 }} // Sets the animation duration
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-center gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Super Admin Role', 'Institution Admin Role', 'Date Created', 'Status']
                    .filter(item => { // Show specific dropdowns based on userType
                        switch (userType) {
                            case 'student':
                                return !['Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'teacher':
                                return !['Course', 'Section', 'Super Admin Role', 'Institution Admin Role'].includes(item);
                            case 'admin':
                                return !['Department', 'Course', 'Section', 'Current Plan', 'Super Admin Role'].includes(item);
                            case 'superadmin':
                                return !['University', 'Branch', 'Department', 'Course', 'Section', 'Current Plan', 'Institution Admin Role'].includes(item);
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
                                        inputValue={handleInputValue(category)}
                                        defaultSelectedKey={
                                            category === 'University' && params.university ||
                                            category === 'Branch' && params.branch ||
                                            category === 'Department' && params.department ||
                                            category === 'Course' && params.course ||
                                            category === 'Section' && params.section ||
                                            category === 'Current Plan' && params.plan ||
                                            category === 'Plan Status' && params.plan_status ||
                                            category === 'Status' && params.status ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        className="min-w-11"
                                    >
                                        {category === 'University' && (
                                            renderAutocompleteList(autocompleteItems.university)
                                        )}
                                        {category === 'Branch' && (
                                            renderAutocompleteList(autocompleteItems.branch)
                                        )}
                                        {category === 'Department' && (
                                            renderAutocompleteList(autocompleteItems.department)
                                        )}
                                        {category === 'Course' && (
                                            renderAutocompleteList(autocompleteItems.course)
                                        )}
                                        {category === 'Section' && (
                                            renderAutocompleteList(autocompleteItems.section)
                                        )}
                                        {category === 'Current Plan' && (
                                            renderAutocompleteList(autocompleteItems.currentPlan)
                                        )}
                                        {category === 'Role' && (
                                            userType === 'institution_admin' ?
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
        </motion.div>
    )
}       