
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { GoDotFill } from "react-icons/go";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User, Skeleton, Chip, Tooltip } from "@nextui-org/react";
import { FaHandsHolding, FaPlus, FaRegCircleDot, FaTableList, FaFileCircleCheck, FaFileCircleMinus, FaEye, FaUser, FaFileInvoice, FaCircleXmark, FaXmark, FaFilterCircleXmark, } from "react-icons/fa6";
import { FaChevronDown, FaFilter, FaHandHolding, FaHands } from "react-icons/fa";
import PageHeader from '@/Components/Admin/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchBar from "@/Components/Admin/SearchBar";
import MainNav from "@/Components/MainNav";
import { HiDocumentCheck, HiDocumentMinus } from "react-icons/hi2";
import AddButton from "@/Components/Admin/AddButton";
import { format } from "date-fns";
import { MdOutlineMoneyOff } from "react-icons/md";
import axios from "axios";
import SetPlanStatus from "./SetPlanStatus";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import { encodeURLParam, updateURLParams } from '@/Utils/admin-utils';
// import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import Filter from "./Filter";
import { Link, router } from "@inertiajs/react";
import autoprefixer from "autoprefixer";
// import NoResultsFound from "@/Components/Admins/NoResultsFound";
import Add from "./Add";
// import FileUpload from "@/Components/FileUpload";
import TableSkeleton from "@/Components/Admin/TableSkeleton";
import StatusChip from "@/Components/Admin/StatusChip";

export default function Faculties({ auth, insAdminAffiliation, retrievedFaculties, hasFacultyPremiumAccess, retrievedSearchName, retrievedEntriesPerPage }) {

    const [facultiesToRender, setFacultiesToRender] = useState(retrievedFaculties);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [search, setSearch] = useState(retrievedSearchName ? decodeURIComponent(retrievedSearchName) : '');
    const [currentPlan, setCurrentPlan] = useState('');
    const [currentPlanStatus, setCurrentPlanStatus] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(retrievedEntriesPerPage ?? 10);
    const [totalFilters, setTotalFilters] = useState(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isSetPlanStatusModalOpen, setIsSetPlanStatusModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(() => {
        return localStorage.getItem('filterOpen') === 'true';
    });

    // State variables to be passed to the Filter component
    const [autocomplete, setAutocomplete] = useState({
        department: [], plan: [], planStatus: []
    });
    const [selected, setSelected] = useState({
        department: '', plan: null, planStatus: null, dateCreated: { start: null, end: null, }
    });

    const [{ university, uni_branch_name }] = insAdminAffiliation;
    const params = route().params;

    const filterParams = ['department', 'course', 'plan', 'plan_status', 'date_created'];
    const facultiesNavigation = [
        { text: 'Premium Access', icon: <HiDocumentCheck />, routeParam: 'with-premium-access' },
        { text: 'No Premium Access', icon: <HiDocumentMinus />, routeParam: 'no-premium-access' },
    ];
    const facultyTableHeaders = {
        'with-premium-access': ['Name', 'Faculty ID', 'Department', 'Position', 'Date Created', 'Current Plan', 'Plan Status', 'Action'],
        'no-premium-access': ['Name', 'Faculty ID', 'Department', 'Position', 'Date Created', 'Current Plan'],
    };

    useEffect(() => {
        localStorage.setItem('filterOpen', isFilterOpen);
    }, [isFilterOpen]);

    // Get the total filters
    useEffect(() => {
        let count = 0;

        filterParams.filter(param => param in params)
            .forEach(_ => count++)

        setTotalFilters(count);
    }, [params])

    // For inertia responses
    useEffect(() => {
        setFacultiesToRender(retrievedFaculties);
    }, [retrievedFaculties])

    // For json responses
    useEffect(() => {
        setIsLoading(true);

        // Remove the search parameter if there is no search input
        if (search.trim() === '') {
            setIsLoading(false);
            updateURLParams('search', null);
            router.reload({ preserveState: true, preserveScroll: true })
            return;
        }

        const debounce = setTimeout(() => {
            updateURLParams('search', encodeURLParam(search));
            updateURLParams('page', null);
            handleSearchFilter();

        }, 300);

        return () => clearTimeout(debounce);

    }, [search.trim()]);

    const handleSearchFilter = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(route('institution-faculties.filter', { hasFacultyPremiumAccess }), {
                params: {
                    search: search.trim(),
                    // Include entries param to retain the current entries state upon page reload.
                    entries: params.entries,
                },
            });
            setFacultiesToRender(response.data);
            // // Remove the page parameter whenever search changes
            updateURLParams('page', null);

        } catch (error) {
            console.error("Error fetching students:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleSetEntriesPerPage = async (entries) => {
        setEntriesPerPage(entries);

        try {
            const response = await axios.get(route('institution-faculties.filter', { hasFacultyPremiumAccess }), {
                params: {
                    entries: entries,
                    search: params.search,
                }
            });
            setFacultiesToRender(response.data);
            updateURLParams('entries', entries);
            updateURLParams('page', null);

        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const handleSetStatusModal = (id, name, currentPlan, planStatus) => {
        setIsSetPlanStatusModalOpen(true);
        setUserId(id);
        setName(name);
        setCurrentPlan(currentPlan);
        setCurrentPlanStatus(planStatus);
    }

    const handleClearFilters = () => {
        setSelected({ department: '', course: '', plan: null, planStatus: null, dateCreated: null })
    }

    return (
        <AdminLayout
            user={auth.user}
        >
            <div className="p-4">
                <div className="flex">
                    <PageHeader>FACULTIES</PageHeader>
                    <PageHeader className="ml-auto mr-4 uppercase">{`${university.uni_name} - ${uni_branch_name}`}</PageHeader>
                </div>

                <div className="mx-auto sm:px-2 lg:px-4">
                    {/* Main Filter Navigation */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {facultiesNavigation.map(nav => (
                            <MainNav
                                key={nav.text}
                                icon={nav.icon}
                                href={route('institution-faculties.filter', { ...params, hasFacultyPremiumAccess: nav.routeParam })}
                                active={
                                    (route().current('institution-faculties') && nav.routeParam === 'with-premium-access')
                                    || route().current('institution-faculties.filter', nav.routeParam)
                                }
                            >
                                {nav.text}
                            </MainNav>))
                        }
                        <AddButton onClick={() => setIsAddStudentModalOpen(true)} icon={<FaPlus />}>
                            Add Faculty
                        </AddButton>
                    </div>

                    <div className="bg-white flex flex-col gap-4 relative shadow-md sm:rounded-lg overflow-hidden p-4">
                        {/* Table Controls */}
                        <div className="flex flex-col gap-3 min-[480px]:flex-row md:gap-20 w-full">
                            <SearchBar
                                name='search'
                                value={search}
                                variant="bordered"
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, faculty id..."
                                className="min-w-sm flex-1"
                            />

                            <div className="flex w-full flex-1 gap-2 ml-auto min-h-[35px]">
                                {/* Filter */}
                                <div className="flex flex-1 gap-1 justify-end">
                                    {/* Clear filters */}
                                    <AnimatePresence>
                                        {totalFilters > 0 && (
                                            <motion.div
                                                key="close-button" // Ensure a unique key for AnimatePresence to track
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }} // Exit animation when it disappears
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Tooltip
                                                    color="danger"
                                                    size="sm"
                                                    closeDelay={180}
                                                    content="Clear filters"
                                                >
                                                    <Button
                                                        preserveScroll
                                                        preserveState
                                                        isIconOnly
                                                        radius="sm"
                                                        variant="bordered"
                                                        onClick={handleClearFilters}
                                                        className="border ml-auto flex border-red-500 bg-white"
                                                    >
                                                        <FaFilterCircleXmark size={19} className="text-red-500" />
                                                    </Button>
                                                </Tooltip>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <Button
                                            className="text-customGray border min-w-[100px] border-customLightGray bg-white"
                                            radius="sm"
                                            disableRipple
                                            startContent={<FaFilter size={16} />}
                                            onClick={() => setIsFilterOpen(prev => !prev)}
                                        >
                                            <span className='tracking-wide'>
                                                {!isFilterOpen ? 'Filters' : 'Hide Filters'}
                                                {totalFilters > 0 && <strong>: {totalFilters}</strong>}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Entries per page */}
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            radius="sm"
                                            disableRipple
                                            endContent={<FaChevronDown size={14} className="text-customGray" />}
                                            className="border w-[190px] max-sm:w-full border-customLightGray bg-white"
                                        >
                                            <span className='text-gray-500 tracking-wide'>Entries per page
                                                <strong>: {entriesPerPage}</strong>
                                            </span>
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu
                                        disabledKeys={[entriesPerPage.toString()]}
                                    >
                                        {[1, 5, 10, 15, 20, 25, 30, 50].map((entry) => (
                                            <DropdownItem
                                                key={entry}
                                                className="!text-customGray"
                                                onClick={() => handleSetEntriesPerPage(entry)}
                                            >
                                                {entry}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Filters shows here */}
                        <Filter
                            hasFacultyPremiumAccess={hasFacultyPremiumAccess}
                            autocomplete={autocomplete}
                            setAutocomplete={setAutocomplete}
                            selected={selected}
                            setSelected={setSelected}
                            isFilterOpen={isFilterOpen}
                        />

                        {/* Table */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isLoading ?
                                (facultiesToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeaders(facultyTableHeaders, hasFacultyPremiumAccess)}
                                        <tbody>
                                            {facultiesToRender.data.map((faculty, index) => {
                                                const formattedDateCreated = format(new Date(faculty.created_at), 'MM/dd/yyyy HH:mm aa');

                                                const actionButtons = () => {
                                                    return (
                                                        <div className="p-2 flex gap-2">
                                                            {faculty.persub_status &&
                                                                (<ActionButton
                                                                    icon={faculty.persub_status === 'active' ? <FaFileCircleMinus /> : <FaFileCircleCheck />}
                                                                    tooltipContent={faculty.persub_status === 'active' ? 'Deactivate plan' : 'Acitvate plan'}
                                                                    onClick={() =>
                                                                        handleSetStatusModal(
                                                                            faculty.user_id,
                                                                            faculty.name,
                                                                            faculty.plan_type,
                                                                            faculty.persub_status
                                                                        )}
                                                                />)
                                                            }

                                                        </div>
                                                    );

                                                }

                                                return (
                                                    <tr key={index} className="border-b border-customLightGray hover:bg-gray-100">
                                                        <td className="flex items-center content-center pl-3 p-2">
                                                            <User
                                                                name={faculty.name}
                                                                description={faculty.email}
                                                                avatarProps={{
                                                                    src: faculty.user_pic ? `/storage/${faculty.user_pic}` : '/images/default-profile.png',
                                                                    alt: "profile-pic",
                                                                    isBordered: true
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="p-2">{faculty.fac_id}</td>
                                                        <td className="p-2">{faculty.dept_acronym}</td>
                                                        <td className="p-2">{faculty.fac_position}</td>
                                                        <td className="p-2">{formattedDateCreated}</td>
                                                        <td className="p-2">
                                                            <Chip startContent={<FaFileInvoice size={16} />} size="sm" className="text-customGray h-full p-1 text-wrap flex" variant='faded'>
                                                                {faculty.plan_name ?? 'Free Plan'}
                                                            </Chip>
                                                        </td>

                                                        {hasFacultyPremiumAccess === 'with-premium-access' &&
                                                            <>
                                                                <td className="p-2">{<StatusChip status={faculty.persub_status} />}</td>
                                                                <td className="p-2">{actionButtons()}</td>
                                                            </>
                                                        }

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table >
                                )
                                    : <>
                                        <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                            {renderTableHeaders(facultyTableHeaders, hasFacultyPremiumAccess)}
                                        </table>
                                        {/* <NoResultsFound /> */}
                                    </>
                                )
                                : <TableSkeleton headers={facultyTableHeaders} headerType={hasFacultyPremiumAccess} />
                            }

                        </div>
                        {(!isLoading && facultiesToRender.data.length > 0) &&
                            <Pagination
                                tableData={facultiesToRender}
                            />
                        }

                    </div>
                </div>
            </div >
            {/* Modals */}
            <Add
                isOpen={isAddStudentModalOpen}
                onClose={() => setIsAddStudentModalOpen(false)}
            />
            <SetPlanStatus
                hasFacultyPremiumAccess={hasFacultyPremiumAccess}
                userId={userId}
                name={name}
                currentPlan={currentPlan}
                currentPlanStatus={currentPlanStatus}
                setFacultiesToRender={setFacultiesToRender}
                isOpen={isSetPlanStatusModalOpen}
                onClose={() => setIsSetPlanStatusModalOpen(false)}
            />
        </AdminLayout >
    );
}



import { Autocomplete, AutocompleteItem, Button, DatePicker, DateRangePicker } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { FaFilterCircleXmark, FaXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { router } from "@inertiajs/react";
import { motion } from 'framer-motion'; // Import Framer Motion
import { customAutocompleteInputProps, parseNextUIDateTime, sanitizeURLParam } from "@/Utils/common-utils";
import { autocompleteOnChangeHandler } from "@/Utils/admin-utils";
import { renderAutocompleteList } from "@/Pages/SuperAdmin/Users/Filter";

export default function Filter({ hasFacultyPremiumAccess, selected, setSelected, autocomplete, setAutocomplete, isFilterOpen }) {
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

            setAutocomplete({
                ...autocomplete,
                department: departmentAcronyms,
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
                hasFacultyPremiumAccess,
                page: null,
                department: sanitizeURLParam(selected.department),
                plan: sanitizeURLParam(selected.plan),
                plan_status: sanitizeURLParam(selected.planStatus)?.toLowerCase(),
                date_created: selected.dateCreated ? parseNextUIDateTime(selected.dateCreated) : null,
            }),
            {}, // Additional data (if any)
            { preserveScroll: true, preserveState: true }
        );
    };


    const handleInputValue = (category) => {
        const selectedWithCategories = {
            'Department': 'department',
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
            className={`${isFilterOpen ? 'flex' : 'hidden'} justify-evenly gap-2 text-sm items-center text-customGray -my-2`}
        >
            {
                ['Department', 'Current Plan', 'Plan Status', 'Date Created']
                    .filter(item => {
                        switch (hasFacultyPremiumAccess) {
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
                                        onChange={(date) => autocompleteOnChangeHandler({ setter: setSelected, category: 'Date Created', value: date, forOnSelectionChange: true })}
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
                                        inputProps={customAutocompleteInputProps()}
                                        inputValue={handleInputValue(category)}
                                        defaultSelectedKey={
                                            category === 'Department' && decodeURIComponent(params.department) ||
                                            category === 'Current Plan' && params.plan ||
                                            category === 'Plan Status' && params.plan_status ||
                                            category === 'Date Created' && params.date_created
                                        }
                                        onInputChange={(value) => autocompleteOnChangeHandler(setSelected, category, value)}
                                        onSelectionChange={(value) => autocompleteOnChangeHandler(setSelected, category, value)}
                                        className="min-w-1"
                                    >
                                        {category === 'Department' && renderAutocompleteList(autocomplete.department)}
                                        {category === 'Current Plan' && renderAutocompleteList(autocomplete.plan)}
                                        {category === 'Plan Status' && renderAutocompleteList(autocomplete.planStatus)}
                                        {category === 'Date Created' && renderAutocompleteList(autocomplete.dateCreated)}
                                    </Autocomplete>
                                </div>
                            }
                        </div>
                    ))
            }
        </motion.div >
    )
}

