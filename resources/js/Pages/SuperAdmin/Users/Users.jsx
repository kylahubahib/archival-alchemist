import React, { useContext, useEffect, useState, } from "react";
import { Head } from "@inertiajs/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Skeleton, Checkbox, Chip, Button, User } from "@nextui-org/react";
import { FaUserGraduate, FaUserSecret, FaUserTie, FaPlus, FaTableList, FaUserSlash, FaFileLines, FaShieldHalved, FaUserCheck, FaXmark } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaFilter, FaSearch } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { format } from "date-fns";
// import { getAcronymAndOrigText } from "@/Components/Admins/Functions";
import PageHeader from "@/Components/Admins/PageHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import MainNav from "@/Components/MainNav";
import AddButton from "@/Components/Admins/AddButton";
import Pagination from "@/Components/Admins/Pagination";
import ActionButton from "@/Components/Admins/ActionButton";
import NoDataPrompt from "@/Components/Admins/NoDataPrompt";
import SearchBar from "@/Components/Admins/SearchBar";
import axios from "axios";
import Add from "./Add";
import Filter from "./Filter";
import SetStatus from "./SetStatus";
import AccessControl from "./AccessControl";
import Logs from "./Logs";

export default function Users({ auth, users, userType }) {
    console.log('users', users);
    console.log('auth', auth);

    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [usersToRender, setUsersToRender] = useState(users);
    const [searchName, setSearchName] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [totalFilters, setTotalFilters] = useState(0);
    const [isEntriesPerPageClicked, setIsEntriesPerPageClicked] = useState(false);
    const [isUserTypeNavClicked, setIsUserTypeNavClicked] = useState(false);
    const [isPaginationLinkClicked, setIsPaginationLinkClicked] = useState(false);
    const [isDeactivatedButtonClicked, setIsDeactivatedButtonClicked] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSetStatusModalOpen, setIsSetStatusModalOpen] = useState(false);
    const [isAccessControlModalOpen, setIsAccessControlModalOpen] = useState(false);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    const [filterComponentDependencies, setFilterComponentDependencies] = useState({});
    // Get the authenticated admin's role
    const authAdminRole = auth.user.access_control.role;


    // const [loadingTableData, setLoadingTableData] = useState(false);

    const usersNavigation = [
        { userType: 'student', text: 'Students', icon: <FaUserGraduate /> },
        { userType: 'faculty', text: 'Faculties', icon: <FaUserTie /> },
        { userType: 'institution-admin', text: 'Institution Admins', icon: <RiShieldUserFill /> },
        { userType: 'super-admin', text: 'Super Admins', icon: <FaUserSecret /> }
    ];

    const tableHeaders = {
        student: ['', 'Name', 'Student ID', 'University', 'Department', 'Course', 'Current Plan', 'Date Created', 'Status', 'Actions'],
        faculty: ['', 'Name', 'Faculty ID', 'University', 'Department', 'Current Plan', 'Position', 'Date Created', 'Status', 'Actions'],
        institution_admin: ['', 'Name', 'Affiliated University', 'Role', 'Date Created', 'Status', 'Actions'],
        super_admin: ['', 'Name', 'Date Created', 'Role', 'Status', 'Actions']
    };

    // Set the entries_per_page and search_name values for the users prop to be updated when they are passed to this component.
    useEffect(() => {
        const setData = async () => {
            try {
                await axios.all([
                    axios.patch(route('users.set-entries-per-page'), {
                        entries_per_page: entriesPerPage
                    }),
                    axios.patch(route('users.set-searched-name'), {
                        search_name: searchName.trim()
                    })
                ]);
            }
            catch (error) {
                console.error("There was an error on setting the data!", error);
            }
        };

        setData();

    }, [searchName, entriesPerPage]);

    // Handle the table 
    useEffect(() => {
        // Change the userType value with hyphens to have a proper url name
        userType = userType.replace('_', '-');

        // Delay to reduce server calls
        const delay = setTimeout(() => {
            if (searchName !== null && searchName.trim() !== '' || isEntriesPerPageClicked) {
                fetchFilteredData();

            } else {
                setUsersToRender(users);
            }

        }, 300);

        return () => clearTimeout(delay); // Clean up the timeout on unmount or change

    }, [users, userType, searchName, entriesPerPage]);

    useEffect(() => {
        console.log("filterComponentDependencies", filterComponentDependencies);
    },);
    // Can be a call back function to be passed in the Filter.jsx
    const fetchFilteredData = async (selectedUniversity = null, selectedBranch = null, selectedDepartment = null,
        selectedCourse = null, selectedCurrentPlan = null, selectedInsAdminRole = null,
        selectedSuperAdminRole = null, selectedDateCreated = null, selectedStatus = null) => {

        // Fill in the filterComponentDependencies to be used as dependencies for the preceding useEffect above.
        setFilterComponentDependencies(selectedUniversity, selectedBranch, selectedDepartment, selectedCourse, selectedCurrentPlan,
            selectedInsAdminRole, selectedSuperAdminRole, selectedDateCreated, selectedStatus);



        try {
            const response = await axios.get(route('users.filter', userType), {
                params: {
                    search_name: searchName.trim(),
                    entries_per_page: entriesPerPage,
                    // Counter null value errors
                    selected_university: selectedUniversity && selectedUniversity.original ? selectedUniversity.original : '',
                    selected_branch: selectedBranch,
                    selected_department: selectedDepartment && selectedDepartment.original ? selectedDepartment.original : '',
                    selected_course: selectedCourse && selectedCourse.original ? selectedCourse.original : '',
                    selected_current_plan: selectedCurrentPlan,
                    selected_ins_admin_role: selectedInsAdminRole,
                    selected_super_admin_role: selectedSuperAdminRole,
                    selected_date_created: selectedDateCreated,
                    selected_status: selectedStatus,
                    is_json_response: true,
                }
            });

            if (isUserTypeNavClicked || isPaginationLinkClicked || isDeactivatedButtonClicked) { // For inertia responses
                setUsersToRender(users);
                setIsUserTypeNavClicked(false);
                setIsEntriesPerPageClicked(false);
                setIsPaginationLinkClicked(false);
                setIsDeactivatedButtonClicked(false);
                setTotalFilters(0);
            } else { // For json responses
                setUsersToRender(response.data);
            }
        } catch (error) {
            console.error("There was an error fetching the users!", error);
            throw error; // Rethrow the error to be caught in handleSetFilters or other caller for in this function
        }
    };

    const setStatus = (id, name, status) => {
        setIsSetStatusModalOpen(true);
        setUserId(id);
        setUsername(name);
        setUserStatus(status);
    }

    const accessControl = (id, name) => {
        setIsAccessControlModalOpen(true);
        setUserId(id);
        setUsername(name);
    }

    const logs = (id, name) => {
        setIsLogsModalOpen(true);
        setUserId(id);
        setUsername(name);
    }

    const disableAuthtUserInTable = (user_id) => {
        return auth.user.user_id === user_id;
    }

    const handleUpdateUsers = (updatedUsers) => {
        setUsersToRender(updatedUsers);
        setIsPaginationLinkClicked(true);
    };

    // Callback function to be passed to the SetStatus component
    const handleDeactivateBtnClicked = () => {
        setIsDeactivatedButtonClicked(true);
    };

    const handleTotalFilters = (value) => {
        setTotalFilters(value);
    }

    const handleClearFilters = (clearFilters, setFilters) => {
        // Function parameters that are filled in from the Filter component.
        clearFilters;
        setFilters;
        setTotalFilters(0);

    };

    return (
        <AdminLayout
            user={auth.user}
        >
            <div>

                <PageHeader>USERS</PageHeader>
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">

                    {/* Main Filter Navigation */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {usersNavigation.map((nav, index) =>
                            <MainNav
                                key={index}
                                icon={nav.icon}
                                href={route('users.filter', nav.userType)}
                                active={nav.userType === 'student' ?
                                    route().current('users') :
                                    route().current('users.filter', nav.userType)}
                                onClick={() => setIsUserTypeNavClicked(true)}
                            >
                                {nav.text}
                            </MainNav>
                        )}

                        {/* Handles the visibility and text of the add button*/}
                        {authAdminRole === 'super_admin' &&
                            <AddButton onClick={() => setIsCreateModalOpen(true)} icon={<FaPlus />}>
                                {userType === "institution_admin" ? "Add co-ins admin" : "Add co-super admin"}
                            </AddButton>
                        }
                        <Add // Modal
                            isOpen={isCreateModalOpen}
                            userType={userType}
                            onClose={() => setIsCreateModalOpen(false)}
                        />

                    </div>
                    <div className="bg-white flex flex-col gap-3 relative shadow-md sm:rounded-lg overflow-hidden p-4">
                        {/* Table Controls */}
                        <div className="TableControlsContainer flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
                            <SearchBar
                                name='searchName'
                                value={searchName}
                                variant="bordered"
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder={'Search by name...'}
                            />

                            <div className="DropdownContainer flex gap-3">
                                <Dropdown classNames={{ content: "max-w-2" }}>
                                    <DropdownTrigger>
                                        <Button
                                            className="border border-customLightGray bg-white"
                                            radius="sm"
                                            disableRipple
                                            startContent={<FaTableList size={18} className="text-customGray" />}
                                            endContent={<FaChevronDown size={14} className="text-customGray" />}
                                        >
                                            <p className='text-gray-500 tracking-wide'>Entries per page:&nbsp;
                                                <span className="font-bold text-customBlue">{entriesPerPage}</span>
                                            </p>
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu >
                                        {[1, 5, 10, 15, 20, 25, 30].map((entry) => (
                                            <DropdownItem
                                                key={entry}
                                                className="!text-customGray"
                                                onClick={() => {
                                                    setEntriesPerPage(entry);
                                                    setIsEntriesPerPageClicked(true);
                                                }}
                                            >
                                                {entry}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                                <div className="flex h-full gap-1">

                                    <Button
                                        className="border border-customLightGray bg-white"
                                        radius="sm"
                                        disableRipple
                                        startContent={<FaFilter size={16} className="text-gray-400" />}
                                        onClick={() => setIsFilterModalOpen(true)}
                                    >
                                        <p className='text-gray-500 tracking-wide'>Filter:&nbsp;
                                            <span className="font-bold text-customBlue">{totalFilters}</span>
                                        </p>
                                    </Button>
                                    {totalFilters > 0 &&
                                        <FaXmark
                                            size={33}
                                            className="h-full hover:bg-gray-400 cursor-pointer rounded-md px-2 text-gray-500 transition duration-200"
                                            onClick={handleClearFilters}
                                        />
                                    }
                                </div>

                                <Filter // Modal
                                    userType={userType}
                                    handleTotalFilters={handleTotalFilters}
                                    totalFilters={totalFilters}
                                    fetchFilteredData={fetchFilteredData}
                                    isUserTypeNavClicked={isUserTypeNavClicked}
                                    setIsUserTypeNavClicked={setIsUserTypeNavClicked}
                                    handleClearFilters={handleClearFilters}
                                    isOpen={isFilterModalOpen}
                                    onClose={() => setIsFilterModalOpen(false)}
                                />
                            </div>
                        </div>
                        {usersToRender.data.length > 0 ?
                            (<>
                                <div className="TableContainer border overflow-y-auto max-h-[45vh] ">
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top bg-customLightGray">
                                            <tr>
                                                {/* Loads the tableHeaders for a specific user type */}
                                                {tableHeaders[userType]?.map((header, index) => (
                                                    <th key={index} scope="col" className="p-2">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Loads the table data for a specific user type */}
                                            {usersToRender.data.map((user, index) => {
                                                const { user_id, name, email, is_premium, user_pic, created_at, user_status, student, faculty, institution_admin, access_control } = user;

                                                const university = getAcronymAndOrigText(student?.university_branch?.university?.uni_name
                                                    ?? faculty?.university_branch?.university.uni_name
                                                    ?? institution_admin?.institution_subscription?.university_branch?.university?.uni_name);

                                                const studentId = student?.stud_id ?? <Skeleton className="h-4 w-full rounded-full" />;

                                                const facultyId = faculty?.fac_id ?? <Skeleton className="h-4 w-full rounded-full" />;

                                                const branch = student?.university_branch?.uni_branch_name
                                                    ?? faculty?.university_branch?.uni_branch_name
                                                    ?? institution_admin?.institution_subscription?.university_branch?.uni_branch_name;

                                                const combinedUniAndBranch = branch === undefined
                                                    ? < Skeleton className="h-4 w-full rounded-full" />
                                                    : university.acronym + " - " + branch;

                                                const department = getAcronymAndOrigText(student?.university_branch?.department[0]?.dept_name
                                                    ?? faculty?.university_branch?.department[0]?.dept_name)
                                                    ?? < Skeleton className="h-4 w-full rounded-full" />;

                                                const course = getAcronymAndOrigText(student?.university_branch?.department[0]?.course[0]?.course_name)
                                                    ?? < Skeleton className="h-4 w-full rounded-full" />;

                                                department.acronym = department.acronym === ''
                                                    ? <Skeleton className="h-4 w-full rounded-full" />
                                                    : department.acronym;

                                                course.acronym = course.acronym === ''
                                                    ? <Skeleton className="h-4 w-full rounded-full" />
                                                    : course.acronym;

                                                const facultyPosition = faculty?.fac_position ?? <Skeleton className="h-4 w-full rounded-full" />;

                                                const adminRole = access_control?.role ?? <Skeleton className="h-4 w-full rounded-full" />;

                                                const formattedDateCreated = format(new Date(created_at), 'MMM d, yyyy')
                                                    ?? <Skeleton className="h-4 w-full rounded-full" />;

                                                const adminRoles = () => {
                                                    switch (adminRole) {
                                                        case 'institution_admin':
                                                            return 'Institution Admin';
                                                        case 'co_institution_admin':
                                                            return 'Co-Institution Admin';
                                                        case 'super_admin':
                                                            return 'Super Admin';
                                                        case 'co_super_admin':
                                                            return 'Co-Super Admin';
                                                    };
                                                }

                                                const userStatus = () => {
                                                    switch (user_status) {
                                                        case 'active':
                                                            return <Chip size='sm' color='success' variant='flat'>Active</Chip>;
                                                        case 'deactivated':
                                                            return <Chip size='sm' color='danger' variant='flat'>Deactivated</Chip>;
                                                        case 'pending':
                                                            return <Chip size='sm' color='warning' variant='flat'>Pending</Chip>;
                                                        default:
                                                            return <Skeleton className="h-4 w-full rounded-full" />;
                                                    }
                                                };

                                                const clientActionButtons = () => {
                                                    return (
                                                        <div className="p-2 flex gap-2">
                                                            <ActionButton
                                                                icon={<FaFileLines />}
                                                                tooltipContent="View logs"
                                                                onClick={() => logs(user_id, name)}
                                                            />
                                                            <ActionButton
                                                                icon={user_status === 'active' ? <FaUserSlash /> : <FaUserCheck />}
                                                                tooltipContent={user_status === 'active' ? "Deactivate" : "Activate"}
                                                                onClick={() => setStatus(user_id, name, user_status)}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                const adminActionButtons = () => {
                                                    let disableBtn = { accessControl: null, viewLogs: null, setStatus: null }; // Initialize disable button states
                                                    // console.log("authAdminRole", authAdminRole);
                                                    // console.log("adminRole", adminRole);

                                                    // Manage access for the same and different admin levels
                                                    // if (authAdminRole === 'super_admin' && adminRole === 'super_admin') {
                                                    //     disableBtn = { accessControl: true, viewLogs: false, setStatus: true };
                                                    // } else if (authAdminRole === 'super_admin' && adminRole === 'co_super_admin') {
                                                    //     disableBtn = { accessControl: false, viewLogs: false, setStatus: false };
                                                    // }
                                                    // else if (authAdminRole === 'co_super_admin' && adminRole === 'super_admin') {
                                                    //     disableBtn = { accessControl: true, viewLogs: false, setStatus: true };

                                                    // } else if (authAdminRole === 'co_super_admin' && adminRole === 'co_super_admin') {
                                                    //     disableBtn = { accessControl: true, viewLogs: false, setStatus: true };
                                                    // }


                                                    return (
                                                        <div className="p-2 flex gap-2">
                                                            <ActionButton
                                                                icon={<FaShieldHalved />}
                                                                tooltipContent="Access control"
                                                                isDisabled={disableBtn.accessControl}
                                                                onClick={() => accessControl(user_id, name)}
                                                            />
                                                            <ActionButton
                                                                icon={<FaFileLines />}
                                                                tooltipContent="View logs"
                                                                isDisabled={disableBtn.viewLogs}
                                                                onClick={() => logs(user_id, name)}
                                                            />
                                                            <ActionButton
                                                                icon={user_status === 'active' ? <FaUserSlash /> : <FaUserCheck />}
                                                                tooltipContent={user_status === 'active' ? "Deactivate" : "Activate"}
                                                                isDisabled={disableBtn.setStatus}
                                                                onClick={() => setStatus(user_id, name, user_status)}
                                                            />
                                                        </div>
                                                    )
                                                };

                                                // Displaying the rows..
                                                return (
                                                    <tr key={index} className="border-b border-customGray hover:bg-gray-100">
                                                        <td className="p-3">
                                                            <div className="flex items-center">
                                                                <Checkbox></Checkbox>
                                                            </div>
                                                        </td>
                                                        <td className="flex items-center content-center py-2">
                                                            <User
                                                                name={name}
                                                                description={email}
                                                                avatarProps={{
                                                                    src: user_pic ? `/storage/${user_pic}` : '/images/default-profile.png',
                                                                    alt: "profile-pic",
                                                                    isBordered: true
                                                                }}
                                                            />
                                                        </td>

                                                        {userType === 'student' && (
                                                            <>
                                                                <td className="p-2">{studentId}</td>
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{department.acronym}</td>
                                                                <td className="p-2">{course.acronym}</td>
                                                                <td className="p-2">{is_premium ? 'Premium' : 'Basic'}</td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2">{userStatus()}</td>
                                                                <td >{clientActionButtons()} </td>
                                                            </>
                                                        )}

                                                        {userType === 'faculty' && (
                                                            <>
                                                                <td className="p-2">{facultyId}</td>
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{department.acronym}</td>
                                                                <td className="p-2">{is_premium ? 'Premium' : 'Basic'}</td>
                                                                <td className="p-2 max-w-[150px]">{facultyPosition}</td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2">{userStatus()}</td>
                                                                <td >{clientActionButtons()} </td>
                                                            </>
                                                        )}

                                                        {userType === 'institution_admin' && (
                                                            <>
                                                                <td className="p-2">{combinedUniAndBranch}</td>
                                                                <td className="p-2">{adminRoles()} </td>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2">{userStatus()}</td>
                                                                <td>{adminActionButtons()}</td>
                                                            </>
                                                        )}

                                                        {userType === 'super_admin' && (
                                                            <>
                                                                <td className="p-2">{formattedDateCreated}</td>
                                                                <td className="p-2">{adminRoles()} </td>
                                                                <td className="p-2">{userStatus()}</td>
                                                                <td>{adminActionButtons()}</td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}

                                            {/* Modals */}
                                            <AccessControl
                                                userType={userType}
                                                userId={userId}
                                                username={username}
                                                isOpen={isAccessControlModalOpen}
                                                onClose={() => setIsAccessControlModalOpen(false)}
                                            />
                                            <Logs
                                                userId={userId}
                                                username={username}
                                                isOpen={isLogsModalOpen}
                                                onClose={() => setIsLogsModalOpen(false)}
                                            />
                                            <SetStatus
                                                userId={userId}
                                                username={username}
                                                userStatus={userStatus}
                                                isOpen={isSetStatusModalOpen}
                                                setStatusBtnClicked={handleDeactivateBtnClicked}
                                                onClose={() => setIsSetStatusModalOpen(false)}
                                            />
                                        </tbody>
                                    </table >
                                </div>
                                <Pagination
                                    tableData={usersToRender}
                                    onClick={() => handleUpdateUsers(usersToRender)}
                                />
                            </>) :
                            <NoDataPrompt
                                leftIcon={FaSearch}
                                textContent="No users found"
                            />
                        }
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
}



