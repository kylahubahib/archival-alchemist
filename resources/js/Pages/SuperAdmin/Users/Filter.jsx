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

                setAutocompleteItems({
                    ...autocompleteItems,
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


    const setFilters = () => {
        router.get(
            route('users.filter', {
                ...params,
                hasStudentPremiumAccess,
                page: null,
                department: sanitizeURLParam(selectedAutocompleteItems.department),
                course: sanitizeURLParam(selectedAutocompleteItems.course),
                plan: sanitizeURLParam(selectedAutocompleteItems.plan),
                plan_status: sanitizeURLParam(selectedAutocompleteItems.planStatus),
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
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-center gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['University', 'Branch', 'Department', 'Course', 'Current Plan', 'Role', 'Status']
                    .filter(item => { // Show specific dropdowns based on userType
                        switch (userType) {
                            case 'student':
                                return !['Role'].includes(item);
                            case 'faculty':
                                return !['Course', 'Role'].includes(item);
                            case 'admin':
                                return !['Department', 'Course', 'Current Plan'].includes(item);
                            case 'superadmin':
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
                                        {category === 'University' && (
                                            renderAutocompleteList('University', autocompleteItems.university)
                                        )}
                                        {category === 'Branch' && (
                                            renderAutocompleteList('Branch', autocompleteItems.branch)
                                        )}
                                        {category === 'Department' && (
                                            renderAutocompleteList('Department', autocompleteItems.department)
                                        )}
                                        {category === 'Course' && (
                                            renderAutocompleteList('Course', autocompleteItems.course)
                                        )}
                                        {category === 'Current Plan' && (
                                            renderAutocompleteList('Current Plan', autocompleteItems.currentPlan)
                                        )}
                                        {category === 'Role' && (
                                            userType === 'institution_admin' ?
                                                renderAutocompleteList('Role', autocompleteItems.insAdminRole) :
                                                renderAutocompleteList('Role', autocompleteItems.superAdminRole)
                                        )}
                                        {category === 'Status' && (
                                            renderAutocompleteList('Status', autocompleteItems.status)
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