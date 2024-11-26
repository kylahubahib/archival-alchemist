
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { GoDotFill } from "react-icons/go";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User, Skeleton, Chip, Tooltip } from "@nextui-org/react";
import { FaHandsHolding, FaPlus, FaRegCircleDot, FaTableList, FaFileCircleCheck, FaFileCircleMinus, FaEye, FaUser, FaFileInvoice, FaCircleXmark, FaXmark, FaFilterCircleXmark, } from "react-icons/fa6";
import { FaChevronDown, FaFilter, FaHandHolding, FaHands } from "react-icons/fa";
import PageHeader from '@/Components/Admins/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchBar from "@/Components/Admins/SearchBar";
import MainNav from "@/Components/MainNav";
import { HiDocumentCheck, HiDocumentMinus } from "react-icons/hi2";
import AddButton from "@/Components/Admins/AddButton";
import { format } from "date-fns";
import { MdOutlineMoneyOff } from "react-icons/md";
import axios from "axios";
import SetPlanStatus from "./SetPlanStatus";
import ActionButton from "@/Components/Admins/ActionButton";
import Pagination from "@/Components/Admins/Pagination";
import { encodeParam, setStatusChip, updateUrl } from "@/Components/Admins/Functions";
import NoDataPrompt from "@/Components/Admins/NoDataPrompt";
import Filter from "./Filter";
import { Link, router } from "@inertiajs/react";
import autoprefixer from "autoprefixer";
import NoResultsFound from "@/Components/Admins/NoResultsFound";
import Add from "./Add";
import FileUpload from "@/Components/FileUpload";

export default function Students({ auth, insAdminAffiliation, retrievedStudents, hasStudentPremiumAccess, retrievedSearchName, retrievedEntriesPerPage }) {
    console.log('retrievedStudents', retrievedStudents);
    const [studentsToRender, setStudentsToRender] = useState(retrievedStudents);
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
        department: [], course: [], plan: [], planStatus: []
    });
    const [selected, setSelected] = useState({
        department: { origText: null, acronym: null }, course: { origText: null, acronym: null },
        plan: null, planStatus: null, dateCreated: { start: null, end: null, }
    });

    const [{ university, uni_branch_name }] = insAdminAffiliation;
    const params = route().params;

    const filterParams = ['department', 'course', 'plan', 'plan_status', 'date_created'];
    const studentsNavigation = [
        { text: 'Premium Access', icon: <HiDocumentCheck />, routeParam: 'with-premium-access' },
        { text: 'No Premium Access', icon: <HiDocumentMinus />, routeParam: 'no-premium-access' },
    ];
    const tableHeaders = {
        'with-premium-access': ['Name', 'Student ID', 'Department', 'Course', 'Section', 'Date Created', 'Current Plan', 'Plan Status', 'Action'],
        'no-premium-access': ['Name', 'Student ID', 'Department', 'Course', 'Section', 'Date Created', 'Current Plan'],
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
        setStudentsToRender(retrievedStudents);
    }, [retrievedStudents])

    // For json responses
    useEffect(() => {
        setIsLoading(true);

        // Remove the search parameter if there is no search input
        if (search.trim() === '') {
            setIsLoading(false);
            updateUrl('search', null);
            router.reload({ preserveState: true, preserveScroll: true })
            return;
        }

        const debounce = setTimeout(() => {
            updateUrl('search', encodeParam(search));
            updateUrl('page', null);
            handleSearchFilter();

        }, 300);

        return () => clearTimeout(debounce);

    }, [search.trim()]);

    const handleSearchFilter = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(route('institution-students.filter', { hasStudentPremiumAccess }), {
                params: {
                    search: search.trim(),
                    // Include entries param to retain the current entries state upon page reload.
                    entries: params.entries,
                },
            });
            setStudentsToRender(response.data);
            // // Remove the page parameter whenever search changes
            updateUrl('page', null);

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
            const response = await axios.get(route('institution-students.filter', { hasStudentPremiumAccess }), {
                params: {
                    entries: entries,
                    search: params.search,
                }
            });
            setStudentsToRender(response.data);
            updateUrl('entries', entries);
            updateUrl('page', null);

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
        setSelected(
            {
                department: { origText: null, acronym: null }, course: { origText: null, acronym: null },
                plan: null, planStatus: null, dateCreated: null
            })
    }

    const renderTableHeader = () => {
        return <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
            <tr>
                {/* Loads the tableHeader for a specific user type */}
                {tableHeaders[hasStudentPremiumAccess]?.map((header, index) => (
                    <th key={index} scope="col" className="p-2">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    }

    return (
        <AdminLayout
            user={auth.user}
            university={`${university.uni_name} - ${uni_branch_name}`}
        >
            <div className="p-4">
                <div className="flex">
                    <PageHeader>STUDENTS</PageHeader>
                    <PageHeader className="ml-auto mr-4 uppercase">{`${university.uni_name} - ${uni_branch_name}`}</PageHeader>
                </div>

                <div className="mx-auto sm:px-2 lg:px-4">
                    {/* Main Filter Navigation */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {studentsNavigation.map(nav => (
                            <MainNav
                                key={nav.text}
                                icon={nav.icon}
                                href={route('institution-students.filter', { ...params, hasStudentPremiumAccess: nav.routeParam })}
                                active={
                                    (route().current('institution-students') && nav.routeParam === 'with-premium-access')
                                    || route().current('institution-students.filter', nav.routeParam)
                                }>
                                {nav.text}
                            </MainNav>))

                        }
                        <AddButton onClick={() => setIsAddStudentModalOpen(true)} icon={<FaPlus />}>
                            Add Student
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
                                placeholder="Search by name, student id..."
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
                            hasStudentPremiumAccess={hasStudentPremiumAccess}
                            autocomplete={autocomplete}
                            setAutocomplete={setAutocomplete}
                            selected={selected}
                            setSelected={setSelected}
                            isFilterOpen={isFilterOpen}
                        />

                        {/* Table */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isLoading ?
                                (studentsToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeader()}
                                        <tbody>
                                            {studentsToRender.data.map((student, index) => {
                                                const formattedDateCreated = format(new Date(student.created_at), 'MM/dd/yyyy HH:mm aa');

                                                const actionButtons = () => {
                                                    return (
                                                        <div className="p-2 flex gap-2">
                                                            {student.persub_status &&
                                                                (<ActionButton
                                                                    icon={student.persub_status === 'Active' ? <FaFileCircleMinus /> : <FaFileCircleCheck />}
                                                                    tooltipContent={student.persub_status === 'Active' ? 'Deactivate plan' : 'Acitvate plan'}
                                                                    onClick={() =>
                                                                        handleSetStatusModal(
                                                                            student.user_id,
                                                                            student.name,
                                                                            student.plan_type,
                                                                            student.persub_status
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
                                                                name={student.name}
                                                                description={student.email}
                                                                avatarProps={{
                                                                    src: student.user_pic ? `/storage/${student.user_pic}` : '/images/default-profile.png',
                                                                    alt: "profile-pic",
                                                                    isBordered: true
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="p-2">{student.id}</td>
                                                        <td className="p-2">{student.dept_acronym ?? 'N/A'}</td>
                                                        <td className="p-2">{student.course_acronym ?? 'N/A'}</td>
                                                        <td className="p-2">{student.section_name ?? 'N/A'}</td>
                                                        <td className="p-2">{formattedDateCreated}</td>
                                                        <td className="p-2">
                                                            <Chip startContent={<FaFileInvoice size={16} />} size="sm" className="text-customGray h-full p-1 text-wrap flex" variant='faded'>
                                                                {student.plan_name ?? 'Free Plan'}
                                                            </Chip>
                                                        </td>

                                                        {hasStudentPremiumAccess === 'with-premium-access' &&
                                                            <>
                                                                <td className="p-2">{setStatusChip(student.persub_status)}</td>
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
                                            {renderTableHeader()}
                                        </table>
                                        <NoResultsFound />
                                    </>
                                )

                                // Skeleton loading
                                : <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                    {renderTableHeader()}
                                    <tbody>
                                        {Array.from({ length: 4 }).map((_, rowIndex) => (
                                            <tr key={rowIndex} className="text-gray-400 border border-gray">
                                                {tableHeaders[hasStudentPremiumAccess].map((header, index) => (
                                                    <td
                                                        key={index}
                                                        className={`p-2 border ${header === 'Name' ? 'min-w-[150px]' : ''} border-gray`}
                                                    >
                                                        {header === 'Name' ?
                                                            <div className="flex items-center gap-3">
                                                                <div>
                                                                    <Skeleton className="flex rounded-full w-11 h-11" />
                                                                </div>
                                                                <div className="w-full flex flex-col gap-2">
                                                                    <Skeleton className="h-4 w-3/5 rounded-lg" />
                                                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                                                </div>
                                                            </div>
                                                            : <Skeleton className="h-5 w-full rounded-lg" />
                                                        }
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }

                        </div>
                        {(!isLoading && studentsToRender.data.length > 0) &&
                            <Pagination
                                tableData={studentsToRender}
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
                hasStudentPremiumAccess={hasStudentPremiumAccess}
                userId={userId}
                name={name}
                currentPlan={currentPlan}
                currentPlanStatus={currentPlanStatus}
                setStudentsToRender={setStudentsToRender}
                isOpen={isSetPlanStatusModalOpen}
                onClose={() => setIsSetPlanStatusModalOpen(false)}
            />
        </AdminLayout >
    );
}
