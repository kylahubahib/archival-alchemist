import { Autocomplete, AutocompleteItem, Button, DatePicker, DateRangePicker } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { FaFilterCircleXmark, FaXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { autocompleteInputProps, capitalize, encodeParam, onChangeHandler, parseDateTime, renderAutocompleteItems, sanitizeParam, updateUrl } from "@/Components/Admins/Functions";
import { Link, router } from "@inertiajs/react";
import { motion } from 'framer-motion'; // Import Framer Motion

export default function Filter({ hasStudentPremiumAccess, selected, setSelected, autocomplete, setAutocomplete, isFilterOpen }) {
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
            const departmentNames = deptWithCourses.data.map(department => department.dept_name);

            // Extract course names from each department's course array
            const courseNames = deptWithCourses.data.flatMap(department =>
                department.course.map(course => course.course_name)
            );

            setAutocomplete({
                ...autocomplete,
                department: departmentNames,
                course: courseNames,
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
                department: sanitizeParam(selected.department?.origText),
                course: sanitizeParam(selected.course?.origText),
                plan: sanitizeParam(selected.plan),
                plan_status: sanitizeParam(selected.planStatus)?.toLowerCase(),
                date_created: selected.dateCreated ? parseDateTime(selected.dateCreated) : null,
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

        if (['Department', 'Course'].includes(category)) {
            return selected[field]?.acronym ?? '';
        }
        return selected[field] ?? (category === 'Date Created' ? null : '');
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
                                        value={handleInputValue(category)}
                                        onChange={(date) => onChangeHandler({ setter: setSelected, category: 'Date Created', value: date, forOnSelectionChange: true })}
                                    />
                                    {(selected.dateCreated?.start && selected.dateCreated?.end) && (
                                        <Button radius="sm" isIconOnly onClick={() => setSelected({ ...selected, dateCreated: null })} className="mb-auto h-[47.99px] bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#7f7f87]" >
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
                                        inputValue={handleInputValue(category)}
                                        defaultSelectedKey={
                                            category === 'Department' && decodeURIComponent(params.department) ||
                                            category === 'Course' && params.course ||
                                            category === 'Current Plan' && params.plan ||
                                            category === 'Plan Status' && params.plan_status ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => onChangeHandler({ setter: setSelected, category, value, forOnInputChange: true })}
                                        onSelectionChange={(value) => onChangeHandler({ setter: setSelected, category, value, forOnSelectionChange: true })}
                                        className="min-w-1"
                                    >
                                        {category === 'Department' && renderAutocompleteItems('Department', autocomplete.department)}
                                        {category === 'Course' && renderAutocompleteItems('Course', autocomplete.course)}
                                        {category === 'Current Plan' && renderAutocompleteItems('Current Plan', autocomplete.plan)}
                                        {category === 'Plan Status' && renderAutocompleteItems('Plan Status', autocomplete.planStatus)}
                                        {category === 'Date Created' && renderAutocompleteItems('Date Created', autocomplete.dateCreated)}
                                    </Autocomplete>
                                </div>
                            }
                        </div>
                    ))
            }
        </motion.div>
    )
}
