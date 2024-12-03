import { Autocomplete, Button, DateRangePicker } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { FaFilterCircleXmark, FaXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { Link, router } from "@inertiajs/react";
import { motion } from 'framer-motion';
import { customAutocompleteInputProps, parseNextUIDateTime, sanitizeURLParam } from "@/Utils/common-utils";
import { autocompleteOnChangeHandler } from "@/Utils/admin-utils";
import { renderAutocompleteList } from "@/Pages/SuperAdmin/Users/Filter";

export default function Filter({ hasStudentPremiumAccess, selectedAutocompleteItems, setSelectedAutocompleteItems, autocompleteItems, setAutocompleteItems, isFilterOpen }) {
    const [isAutocompleteDataLoading, setIsAutocompleteDataLoading] = useState(false);
    const params = route().params;

    console.log('autocompleteItems', autocompleteItems);
    console.log('selectedAutocompleteItems', selectedAutocompleteItems);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setFilters();
        }, 300);

        return () => clearTimeout(debounce);
    }, [selectedAutocompleteItems]);

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

            setAutocompleteItems({
                ...autocompleteItems,
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
                department: sanitizeURLParam(selectedAutocompleteItems.department),
                course: sanitizeURLParam(selectedAutocompleteItems.course),
                plan: sanitizeURLParam(selectedAutocompleteItems.plan),
                plan_status: sanitizeURLParam(selectedAutocompleteItems.planStatus),
                date_created: selectedAutocompleteItems.dateCreated
                    ? parseNextUIDateTime(selectedAutocompleteItems.dateCreated)
                    : null,
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
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-between gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['Department', 'Course', 'Current Plan', 'Plan Status', 'Date Created']
                    .filter(item => {
                        switch (hasStudentPremiumAccess) {
                            case 'with-premium-access':
                                return !['Role'].includes(item);
                            case 'no-premium-access':
                                return !['Current Plan', 'Plan Status'].includes(item);
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
                                        onChange={(date) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, 'Date Created', date)}
                                    />
                                    {(selectedAutocompleteItems.dateCreated?.start && selectedAutocompleteItems.dateCreated?.end) && (
                                        <Button
                                            radius="sm"
                                            isIconOnly
                                            onClick={() => setSelectedAutocompleteItems({ ...selectedAutocompleteItems, dateCreated: null })}
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
                                            category === 'Department' && params.department ||
                                            category === 'Course' && params.course ||
                                            category === 'Current Plan' && params.plan ||
                                            category === 'Plan Status' && params.plan_status ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelectedAutocompleteItems, category, value)}
                                        className="min-w-1"
                                    >
                                        {category === 'Department' && renderAutocompleteList(autocompleteItems.department)}
                                        {category === 'Course' && renderAutocompleteList(autocompleteItems.course)}
                                        {category === 'Current Plan' && renderAutocompleteList(autocompleteItems.plan)}
                                        {category === 'Plan Status' && renderAutocompleteList(autocompleteItems.planStatus)}
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
