import { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { router } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { autocompleteOnChangeHandler } from '@/Utils/admin-utils';
import { parseNextUIDateTime, sanitizeURLParam } from '@/Utils/common-utils';
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

export default function Filter({ userType, selected, setSelected, autocomplete, setAutocomplete, isFilterOpen }) {
    const [isAutocompleteDataLoading, setIsAutocompleteDataLoading] = useState(false);
    const params = route().params;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setFilters();
        }, 300);

        return () => clearTimeout(debounce);
    }, [selected]);

    const fetchData = async () => {
        try {
            setIsAutocompleteDataLoading(true);

            const [deptWithCourses, plansWithPlanStatus] = await axios.all([
                axios.get(route('institution.get-departments-with-courses')),
                axios.get(route('institution.get-plans-with-plan-status')),
            ]);

            // Extract department names
            const departmentAcronyms = deptWithCourses.data.map(department => department.dept_acronym);

            // Extract course names from each department's course array
            const courseAcronyms = deptWithCourses.data.flatMap(department =>
                department.course.map(course => course.course_acronym)
            );

            setAutocomplete({
                ...autocomplete,
                department: departmentAcronyms,
                course: courseAcronyms,
                plan: plansWithPlanStatus.data.plans,
                planStatus: plansWithPlanStatus.data.planStatus,
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
            route('institution-students.filter', {
                ...params,
                hasStudentPremiumAccess,
                page: null,
                department: sanitizeURLParam(selected.department),
                course: sanitizeURLParam(selected.course),
                plan: sanitizeURLParam(selected.plan),
                plan_status: sanitizeURLParam(selected.planStatus),
                date_created: selected.dateCreated ? parseNextUIDateTime(selected.dateCreated) : null,
            }),
            {}, // Additional data (if any)
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleInputValue = (category) => {
        const selectedWithCategories = {
            'Department': 'department',
            'Course': 'course',
            'Current Plan': 'plan',
            'Plan Status': 'planStatus',
            'Date Created': 'dateCreated'
        };

        const field = selectedWithCategories[category];

        if (category === 'Date Created') {
            return selected[field] ?? null;
        } else {
            return selected[field] ?? '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} // Initial animation state
            animate={{ opacity: isFilterOpen ? 1 : 0, y: isFilterOpen ? 0 : -20 }} // Animates in based on `isFilterOpen`
            transition={{ duration: 0.3 }} // Sets the animation duration
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-between gap-2 text-sm items-center text-customGray -my-2`}
        >
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
                    .map((category, index) => (
                        <div key={index} >
                            {category === 'Date Created'
                                ? <div className="flex items-center gap-1 w-full flex-1">
                                    <DateRangePicker
                                        aria-label="Date filter"
                                        size="sm"
                                        radius="sm"
                                        label="Date Created"
                                        placeholder=" "
                                        className="max-w-xl !text-white"
                                        granularity="minute"
                                        hideTimeZone
                                        visibleMonths={2}
                                        // defaultValue={handleInputValue(category)}
                                        onChange={(date) => autocompleteOnChangeHandler(setSelected, 'Date Created', date)}
                                    />
                                    {(selected.dateCreated?.start && selected.dateCreated?.end) && (
                                        <Button
                                            radius="sm"
                                            isIconOnly
                                            onClick={() => setSelected({ ...selected, dateCreated: null })}
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
                                        inputProps={autocompleteInputProps()}
                                        // defaultInputValue={handleInputValue(category)}
                                        inputValue={handleInputValue(category)}
                                        defaultSelectedKey={
                                            category === 'Department' && params.department ||
                                            category === 'Course' && params.course ||
                                            category === 'Current Plan' && params.plan ||
                                            category === 'Plan Status' && params.plan_status ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelected, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelected, category, value)}
                                        className="min-w-1"
                                    >
                                        {category === 'Department' && renderAutocompleteList(autocomplete.department)}
                                        {category === 'Course' && renderAutocompleteList(autocomplete.course)}
                                        {category === 'Current Plan' && renderAutocompleteList(autocomplete.plan)}
                                        {category === 'Plan Status' && renderAutocompleteList(autocomplete.planStatus)}
                                        {category === 'Date Created' && renderAutocompleteList(autocomplete.dateCreated)}
                                    </Autocomplete>
                                </div>
                            }
                        </div>
                    ))
            }
        </motion.div>
    )
}