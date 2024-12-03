import React, { useEffect, useState, } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User, Tooltip } from "@nextui-org/react";
import { FaUserGraduate, FaUserSecret, FaUserTie, FaPlus, FaUserSlash, FaFileLines, FaShieldHalved, FaUserCheck, FaFilterCircleXmark } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime, encodeURLParam, updateURLParams, sanitizeURLParam } from "@/Utils/common-utils";
import { fetchSearchFilteredData, formatAdminRole, getTotalFilters, handleSetEntriesPerPageClick } from "@/Utils/admin-utils";
import PageHeader from "@/Components/Admin/PageHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import MainNav from "@/Components/MainNav";
import AddButton from "@/Components/Admin/AddButton";
import Pagination from "@/Components/Admin/Pagination";
import ActionButton from "@/Components/Admin/ActionButton";
import SearchBar from "@/Components/Admin/SearchBar";
import Add from "./Add";
import Filter from "./Filter";
import UpdateStatus from "./UpdateStatus";
import AccessControl from "./AccessControl";
import Logs from "./Logs";
import axios from "axios";
import StatusChip from "@/Components/Admin/StatusChip";
import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import TableSkeleton from "@/Components/Admin/TableSkeleton";

// Since the super admin is the highest admin level
// Below are the functions that render elements conditionally for use on other admin pages with the same structure
export const renderTableHeaders = (headers, headerType) => {
    if (!headers || !headers[headerType] || !Array.isArray(headers[headerType])) {
        console.warn(`Invalid headers or headerType: ${headerType}`);
        return null; // Return null to render nothing if invalid
    }

    return (
        <thead className="text-xs sticky z-10 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
            <tr>
                {/* Loads the tableHeader for a specific header type */}
                {headers[headerType].map((header, index) => (
                    <th key={index} scope="col" className="p-2">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};


export const renderTableControls = (routeName, searchVal, searchValSetter, searchBarPlaceholder, isDisabled, totalFilters,
    clearFiltersOnClick, isFilterOpen, isFilterOpenSetter, entriesPerPageOnClick, entriesPerPage, setEntriesPerPage, setEntriesResponseData) => {

    return (
        <div className="flex flex-col gap-3 min-[480px]:flex-row md:gap-20 w-full">
            <SearchBar
                name="search"
                value={searchVal}
                variant="bordered"
                onChange={(e) => searchValSetter(e.target.value)}
                placeholder={searchBarPlaceholder}
                isDisabled={isDisabled}
                className="min-w-sm flex-1"
            />

            <div className="flex w-full flex-1 gap-2 ml-auto min-h-[35px]">

                {/* FILTER */}
                <div className="flex flex-1 gap-1 justify-end">

                    {/* CLEAR FILTERS */}
                    <AnimatePresence>
                        {totalFilters > 0 && (
                            <motion.div
                                key="close-button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
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
                                        onClick={clearFiltersOnClick}
                                        className="border ml-auto flex border-red-500 bg-white"
                                    >
                                        <FaFilterCircleXmark size={19} className="text-red-500" />
                                    </Button>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* TOGGLE FILTER */}
                    <div>
                        <Button
                            className="text-customGray border min-w-[100px] border-customLightGray bg-white"
                            radius="sm"
                            disableRipple
                            startContent={<FaFilter size={16} />}
                            onClick={() => isFilterOpenSetter((prev) => !prev)}
                        >
                            <span className="tracking-wide">
                                {!isFilterOpen ? 'Filters' : 'Hide Filters'}
                                {totalFilters > 0 && <strong>: {totalFilters}</strong>}
                            </span>
                        </Button>
                    </div>
                </div>

                {/* ENTRIES PER PAGE */}
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            radius="sm"
                            disableRipple
                            endContent={<FaChevronDown size={14} className="text-customGray" />}
                            className="border w-[190px] max-sm:w-full border-customLightGray bg-white"
                        >
                            <span className="text-gray-500 tracking-wide">
                                Entries per page
                                <strong>: {entriesPerPage}</strong>
                            </span>
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu disabledKeys={[entriesPerPage.toString()]}>
                        {[10, 15, 20, 25, 30, 50, 100].map((entry) => (
                            <DropdownItem
                                key={entry}
                                className="!text-customGray"
                                onClick={() => entriesPerPageOnClick(routeName, entry, setEntriesPerPage, setEntriesResponseData)}
                            >
                                {entry}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div >
    )
};

export default function Users({ auth, users, userType, searchValue }) {
    console.log('users', users);
    console.log('auth', auth);

    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [action, setAction] = useState(null);
    const [usersToRender, setUsersToRender] = useState(users);
    const [totalFilters, setTotalFilters] = useState(0);
    const [searchTerm, setSearchTerm] = useState(searchValue || '');
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [isDataLoading, setIsDataLoading] = useState(false);

    // For modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSetStatusModalOpen, setIsSetStatusModalOpen] = useState(false);
    const [isAccessControlModalOpen, setIsAccessControlModalOpen] = useState(false);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [autocompleteItems, setAutocompleteItems] = useState(
        { university: [], branch: [], department: [], course: [], currentPlan: [], insAdminRole: [], superAdminRole: [], status: [] }
    );
    const [selectedAutocompleteItem, setSelectedAutocompleteItem] = useState(
        { // Set the default value of dateCreated to null to avoid date format errors, and keep the other default values as empty strings to prevent input null errors.
            university: '', branch: '', department: '', course: '', currentPlan: '', insAdminRole: '',
            superAdminRole: '', dateCreated: { start: null, end: null, }, status: ''
        });

    const params = route().params;
    const authAdminRole = auth.user.access_control.role;

    const filterParams = ['university', 'branch', 'department', 'course', 'currentPlan', 'role', 'dateCreated', 'status'];

    const navigations = [
        // The param values here are the same as the userType values
        { text: 'Students', icon: <FaUserGraduate />, param: 'student' },
        { text: 'Faculties', icon: <FaUserTie />, param: 'faculty' },
        { text: 'Institution Admins', icon: <RiShieldUserFill />, param: 'admin' },
        { text: 'Super Admins', icon: <FaUserSecret />, param: 'superadmin' }
    ];
    const tableHeaders = {
        'student': ['Name', 'User ID', 'University', 'Department', 'Course', 'Section', 'Current Plan', 'Date Created', 'Status', 'Actions'],
        'faculty': ['Name', 'User ID', 'University', 'Department', 'Current Plan', 'Position', 'Date Created', 'Status', 'Actions'],
        'admin': ['Name', 'User ID', 'Affiliated University', 'Role', 'Date Created', 'Status', 'Actions'],
        'superadmin': ['Name', 'User ID', 'Date Created', 'Role', 'Status', 'Actions']
    };

    useEffect(() => {
        console.log('usersToRender', usersToRender);
    }, [usersToRender]);

    // Get the total number of filters from the query parameters that have values
    useEffect(() => {
        setTotalFilters(getTotalFilters(params, filterParams));
    }, [params])

    // For inertia responses, it updates automatically when the page is refreshed
    useEffect(() => {
        setUsersToRender(users);
    }, [users])

    // For responses that receive JSON, like search filters
    useEffect(() => {
        setIsDataLoading(true);

        const debounce = setTimeout(() => {
            fetchSearchFilteredData('users.filter', { userType: userType }, params, searchTerm, setIsDataLoading, setUsersToRender, setHasFilteredData);
        }, 350);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    const handleUpdateStatusClick = (id, name, actionText) => {
        console.log('actionText', actionText);
        setIsSetStatusModalOpen(true);
        setUserId(id);
        setName(name);
        setAction(actionText);
    }

    const handleAccessControlClick = (id, name) => {
        setIsAccessControlModalOpen(true);
        setUserId(id);
        setName(name);
    }

    const handleLogsClick = (id, name) => {
        setIsLogsModalOpen(true);
        setUserId(id);
        setName(name);
    }

    const disableAuthtUserInTable = (user_id) => {
        return auth.user.user_id === user_id;
    }

    const handleClearFiltersClick = () => {
        setSelectedAutocompleteItem({
            university: '', branch: '', department: '', course: '', currentPlan: '', insAdminRole: '',
            superAdminRole: '', dateCreated: { start: null, end: null, }, status: ''
        })
    }

    const fetchSearchFilteredData2 = async () => {
        setIsDataLoading(true);

        try {
            const response = await axios.get(route('users.filter', { userType }), {
                params: {
                    ...params,
                    search: searchTerm.trim(),
                },
            });

            updateURLParams('search', encodeURLParam(searchTerm.trim()));
            updateURLParams('page', null);


            setUsersToRender(response.data);

            response.data.length > 0 ? setHasFilteredData(true) : setHasFilteredData(false)

        } catch (error) {
            console.error("Error fetching search results:", error);
        }
        finally {
            setIsDataLoading(false);
        }
    };

    const getAdminActionButtons = (authAdminRole, adminRole, userId, userStatus, name) => {
        let disableBtn = { accessControl: null, viewLogs: null, setStatus: null };

        // Manage access for the same and different admin levels for the visibililty of an action buttons
        if (authAdminRole === 'super_admin' && adminRole === 'super_admin') {
            disableBtn = { accessControl: true, viewLogs: false, setStatus: true };
        } else if (authAdminRole === 'super_admin' && adminRole === 'co_super_admin') {
            disableBtn = { accessControl: false, viewLogs: false, setStatus: false };
        } else if (authAdminRole === 'co_super_admin' && adminRole === 'super_admin') {
            disableBtn = { accessControl: true, viewLogs: false, setStatus: true };
        } else if (authAdminRole === 'co_super_admin' && adminRole === 'co_super_admin') {
            disableBtn = { accessControl: true, viewLogs: false, setStatus: true };
        }

        const actionText = userStatus.toLowerCase() === 'active' ? "Deactivate" : "Activate";

        return (
            <div className="p-2 flex gap-2">
                <ActionButton
                    icon={<FaShieldHalved />}
                    tooltipContent="Access control"
                    isDisabled={disableBtn.accessControl}
                    onClick={() => handleAccessControlClick(userId, name)}
                />
                <ActionButton
                    icon={<FaFileLines />}
                    tooltipContent="View logs"
                    isDisabled={disableBtn.viewLogs}
                    onClick={() => handleLogsClick(userId, name)}
                />
                <ActionButton
                    icon={userStatus === 'active' ? <FaUserSlash /> : <FaUserCheck />}
                    tooltipContent={actionText}
                    isDisabled={disableBtn.setStatus}
                    onClick={() => handleUpdateStatusClick(userId, name, actionText)}
                />
            </div>
        );
    };

    const getClientActionButtons = (userId, userStatus, name) => {

        const actionText = userStatus.toLowerCase() === 'active' ? "Deactivate" : "Activate";

        return (
            <div className="p-2 flex gap-2">
                <ActionButton
                    icon={<FaFileLines />}
                    tooltipContent="View logs"
                    onClick={() => handleLogsClick(userId, name)}
                />
                <ActionButton
                    icon={userStatus === 'active' ? <FaUserSlash /> : <FaUserCheck />}
                    tooltipContent={actionText}
                    onClick={() => handleUpdateStatusClick(userId, name, actionText)}
                />
            </div>
        );
    };

    return (
        <AdminLayout
            user={auth.user}
        >
            <div className="p-4">
                <PageHeader>USERS</PageHeader>

                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">
                    {/* MAIN NAVIGATION */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {navigations.map((nav, index) =>
                            <MainNav
                                key={index}
                                icon={nav.icon}
                                href={route('users.filter', nav.param)}
                                active={nav.param === 'student' ?
                                    route().current('users') :
                                    route().current('users.filter', nav.param)}
                            >
                                {nav.text}
                            </MainNav>
                        )}

                        {/* Handles the visibility and text of the add button*/}
                        {userType === 'superadmin' && (
                            <AddButton onClick={() => setIsCreateModalOpen(true)} icon={<FaPlus />}>
                                {userType === "institution_admin" ? "Add co-ins admin" : "Add co-super admin"}
                            </AddButton>
                        )}

                    </div>

                    <div className="flex-col gap-3 max-h-[65dvh] relative bg-white flex shadow-md sm:rounded-lg overflow-hidden p-4">
                        {renderTableControls('entries route', searchTerm, setSearchTerm, 'Search by name or user id...', users.data.length === 0,
                            totalFilters, handleClearFiltersClick, isFilterOpen, setIsFilterOpen, handleSetEntriesPerPageClick,
                            entriesPerPage, setEntriesPerPage, setUsersToRender)}

                        {/* STUDENT DATA */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isDataLoading ?
                                (usersToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeaders(tableHeaders, userType)}

                                        <tbody>
                                            {usersToRender.data.map((user, index) => {
                                                const { id, name, email, is_premium, user_pic, created_at, user_status, student, faculty, institution_admin, access_control } = user;

                                                // If the filtered data is for students, then the university is for students only.
                                                const universityAcronym = student?.university_branch?.university?.uni_acronym
                                                    ?? faculty?.university_branch?.university?.uni_acronym
                                                    ?? institution_admin?.institution_subscription?.university_branch?.university?.uni_acronym
                                                    ?? 'N/A';

                                                const studentId = student?.id;

                                                const facultyId = faculty?.id;

                                                const branch = student?.university_branch?.uni_branch_name
                                                    ?? faculty?.university_branch?.uni_branch_name
                                                    ?? institution_admin?.institution_subscription?.university_branch?.uni_branch_name
                                                    ?? 'N/A';

                                                const combinedUniAndBranch = universityAcronym + " - " + branch;

                                                const departmentAcronym = student?.section?.course?.department?.dept_acronym
                                                    ?? faculty?.section?.course?.department?.dept_acronym
                                                    ?? 'N/A';

                                                const courseAcronym = student?.section?.course.course_acronym
                                                    ?? 'N/A';

                                                const sectionName = student?.section?.section_name
                                                    ?? 'N/A';

                                                const facultyPosition = faculty?.fac_position ?? 'N/A';

                                                const adminRole = access_control?.role ?? 'N/A';

                                                const formattedDateCreated = formatDateTime(created_at);

                                                return (
                                                    <tr key={index} className="border-b border-customLightGray hover:bg-gray-100">

                                                        {/* Common columns */}
                                                        <td className="flex items-center content-center pl-3 p-2">
                                                            <User
                                                                name={name}
                                                                description={email}
                                                                avatarProps={{
                                                                    src: user_pic ? `/${user_pic}` : '/images/default-profile.png',
                                                                    alt: "profile-pic",
                                                                    isBordered: true
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="p-2">{id}</td>

                                                        {userType === 'student' && (
                                                            <>
                                                                {/* <td className="p-2">{studentId}</td> */}
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{departmentAcronym}</td>
                                                                <td className="p-2">{courseAcronym}</td>
                                                                <td className="p-2">{sectionName}</td>
                                                                <td className="p-2">{is_premium ? 'Premium' : 'Basic'}</td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2"><StatusChip status={user_status} /></td>
                                                                <td >{getClientActionButtons(id, user_status, name)} </td>
                                                            </>
                                                        )}

                                                        {userType === 'faculty' && (
                                                            <>
                                                                {/* <td className="p-2">{facultyId}</td> */}
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{departmentAcronym}</td>
                                                                <td className="p-2">{is_premium ? 'Premium' : 'Basic'}</td>
                                                                <td className="p-2 max-w-[150px]">{facultyPosition}</td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2"><StatusChip status={user_status} /></td>
                                                                <td >{getClientActionButtons(id, user_status, name)} </td>
                                                            </>
                                                        )}

                                                        {userType === 'admin' && (
                                                            <>
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{formatAdminRole(adminRole)} </td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2"><StatusChip status={user_status} /></td>
                                                                <td>{getAdminActionButtons(authAdminRole, adminRole, id, user_status, name)}</td>
                                                            </>
                                                        )}

                                                        {userType === 'superadmin' && (
                                                            <>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2">{formatAdminRole(adminRole)} </td>
                                                                <td className="p-2"><StatusChip status={user_status} /></td>
                                                                <td>{getAdminActionButtons(authAdminRole, adminRole, id, user_status, name)}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table >

                                )
                                    : (
                                        <>
                                            <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                                {renderTableHeaders(tableHeaders, userType)}
                                            </table>
                                            <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                                        </>
                                    )
                                )
                                : <TableSkeleton tableHeaders={tableHeaders} tableHeaderType={userType} />
                            }

                        </div>

                        {(!isDataLoading && usersToRender.data.length > 0) &&
                            <Pagination
                                tableData={usersToRender}
                            />
                        }

                    </div>
                </div>
            </div >

            {/* MODALS */}
            <Add
                isOpen={isCreateModalOpen}
                userType={userType}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <AccessControl
                userType={userType}
                userId={userId}
                name={name}
                isOpen={isAccessControlModalOpen}
                onClose={() => setIsAccessControlModalOpen(false)}
            />
            <Logs
                userId={userId}
                name={name}
                isOpen={isLogsModalOpen}
                onClose={() => setIsLogsModalOpen(false)}
            />
            <UpdateStatus
                userId={userId}
                name={name}
                action={action}
                isOpen={isSetStatusModalOpen}
                onClose={() => setIsSetStatusModalOpen(false)}
            />
        </AdminLayout >
    );
}