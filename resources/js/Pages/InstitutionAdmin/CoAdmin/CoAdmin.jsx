
import React, { useState, useEffect } from "react";
import { User, Chip, user, Button, } from "@nextui-org/react";
import { FaPlus, FaFileCircleCheck, FaFileCircleMinus, FaFileInvoice, FaShieldHalved, FaFileLines } from "react-icons/fa6";
import { HiDocumentCheck, HiDocumentMinus } from "react-icons/hi2";
import { decodeURLParam, formatDateTime } from "@/Utils/common-utils";
import { renderTableControls, renderTableHeaders } from "@/Pages/SuperAdmin/Users/Users";
import { fetchSearchFilteredData, getTotalFilters, handleSetEntriesPerPageClick } from "@/Utils/admin-utils";
import PageHeader from '@/Components/Admin/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import MainNav from "@/Components/MainNav";
import AddButton from "@/Components/Admin/AddButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import TableSkeleton from "@/Components/Admin/TableSkeleton";
import StatusChip from "@/Components/Admin/StatusChip";
import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import Add from "@/Pages/SuperAdmin/Users/Add";
import AccessControl from "@/Pages/SuperAdmin/Users/AccessControl";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import Logs from "@/Pages/SuperAdmin/Users/Logs";
import UpdateStatus from "@/Pages/SuperAdmin/Users/UpdateStatus";
import { router } from "@inertiajs/react";
import Filter from "@/Pages/SuperAdmin/Users/Filter";

export default function CoAdmins({ auth, insAdminAffiliation, coAdmins, planUserLimit, totalAffiliatedPremiumUsers, search, entries }) {
    console.log('coAdmins', coAdmins);
    console.log('insAdminAffiliation', insAdminAffiliation);
    const [coAdminsToRender, setCoAdminsToRender] = useState(coAdmins);
    const [userId, setUserId] = useState(null);
    const [affiliatedUniBranchId, setAffiliatedUniBranchId] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [name, setName] = useState('');
    const [searchTerm, setSearchTerm] = useState(search ? decodeURLParam(search) : '');
    const [currentPlanName, setCurrentPlanName] = useState('');
    const [action, setAction] = useState(null);
    const [entriesPerPage, setEntriesPerPage] = useState(entries || 10);
    const [totalFilters, setTotalFilters] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddInsAdminModalOpen, setIsAddInsAdminModalOpen] = useState(false);
    const [isAccessControlModalOpen, setIsAccessControlModalOpen] = useState(false);
    const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState();
    const [coInsAdminId, setCoInsAdminId] = useState(null);
    const [coInsAdminName, setCoInsAdminName] = useState(null);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

    const authAdminRole = auth.user.access_control;

    console.log('authAdminRole', authAdminRole);

    // const authAdminRole = auth.user.access_control.role;

    // State variables to be passed to the Filter component
    const [autocompleteItems, setAutocompleteItems] = useState({ role: [], course: [], plan: [], status: [] });
    const [selectedAutocompleteItems, setSelectedAutocompleteItems] = useState({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: { start: null, end: null, } });

    const [{ id, university, uni_branch_name }] = insAdminAffiliation;
    const remainingUserSlots = planUserLimit - totalAffiliatedPremiumUsers;
    const params = route().params;

    useEffect(() => {
        console.log('hasFilteredData', hasFilteredData);

    }, [hasFilteredData]);

    useEffect(() => {
        console.log('insAdminAffiliation', insAdminAffiliation);
    }, []);


    const filterParams = ['role', 'course', 'status', 'date_created'];

    const tableHeaders = {
        'admin': ['Name', 'User ID', 'Date Created', 'Status', 'Actions'],
    };

    // Get the total number of filters from the query parameters that have values
    useEffect(() => {
        setTotalFilters(getTotalFilters(params, filterParams));
    }, [params])

    // For inertia responses, it updates automatically when the page is refreshed
    useEffect(() => {
        setCoAdminsToRender(coAdmins);
    }, [coAdmins])

    // For responses that receive JSON, like search filters
    useEffect(() => {
        setIsDataLoading(true);

        const debounce = setTimeout(() => {
            fetchSearchFilteredData('institution-coadmins', null, params, searchTerm,
                setIsDataLoading, setCoAdminsToRender, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);


    const handleClearFiltersClick = () => {
        setSelectedAutocompleteItems({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: null })
    }

    const handleUpdateStatusClick = (id, name, actionText) => {
        console.log('actionText', actionText);
        setIsUpdateStatusModalOpen(true);
        setCoInsAdminId(id);
        setCoInsAdminName(name);
        setAction(actionText);
    }

    const handleAccessControlClick = (id, name) => {
        setIsAccessControlModalOpen(true);
        setCoInsAdminId(id);
        setCoInsAdminName(name);
    }

    const handleLogsClick = (id, name) => {
        setIsLogsModalOpen(true);
        setCoInsAdminId(id);
        setCoInsAdminName(name);
    }

    const handleSampleUpdate = () => {
        router.patch(route('sample-update'));

    }

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
                    onClick={() => handleAccessControlClick(userId, name, actionText)}
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



    return (
        <AdminLayout
            user={auth.user}
            university={`${university.uni_name} - ${uni_branch_name}`}
        >
            <div className="p-4">
                <div className="flex">
                    <PageHeader>CO-ADMINS</PageHeader>
                    {/* <PageHeader className="ml-auto mr-4 uppercase">{`${university.uni_name} - ${uni_branch_name}`}</PageHeader> */}
                    <div className="flex pb-4 mr-4 ml-auto">
                        <AddButton onClick={() => setIsAddInsAdminModalOpen(true)} icon={<FaPlus />}>
                            Add co-ins admin
                        </AddButton>
                    </div>
                </div>

                <div className="mx-auto sm:px-2 lg:px-4">
                    <div className="bg-white flex flex-col gap-4 h-[68dvh] relative shadow-md sm:rounded-lg overflow-hidden p-4">

                        {/* TABLE CONTROLS */}
                        {renderTableControls({
                            routeName: 'institution-coadmins',
                            searchVal: searchTerm,
                            searchValSetter: setSearchTerm,
                            searchBarPlaceholder: 'Search by name, email, user id...',
                            isDisabled: coAdmins.data.length === 0,
                            totalFilters: totalFilters,
                            clearFiltersOnClick: handleClearFiltersClick,
                            isFilterOpen: isFilterOpen,
                            isFilterOpenSetter: setIsFilterOpen,
                            entriesPerPage: entriesPerPage,
                            setEntriesPerPage: setEntriesPerPage,
                            setEntriesResponseData: setCoAdminsToRender,
                            params: null
                        })}

                        {/* FILTER COMPONENT PLACEMENT */}
                        <Filter
                            uniBranchId={id}
                            filterRoute="institution-coadmins"
                            type="ins-coadmin"
                            params={{ ...params }}
                            autocompleteItems={autocompleteItems}
                            setAutocompleteItems={setAutocompleteItems}
                            selectedAutocompleteItems={selectedAutocompleteItems}
                            setSelectedAutocompleteItems={setSelectedAutocompleteItems}
                            isFilterOpen={isFilterOpen}
                        />

                        {/* STUDENT DATA */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isDataLoading ?
                                (coAdminsToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeaders(tableHeaders, 'admin')}
                                        <tbody>
                                            {coAdminsToRender.data.map((coAdmin, index) => {
                                                const { id, uni_id_num, name, email, created_at, user_pic, user_status, student, accessControl, personal_subscription } = coAdmin;

                                                return (
                                                    <tr key={index} className="border-b border-customLightGray hover:bg-gray-100">
                                                        <td className="flex items-center content-center pl-3 p-2">
                                                            <User
                                                                name={name}
                                                                description={email}
                                                                avatarProps={{
                                                                    src: user_pic ? `/${user_pic}` : '/images/default-profile.png',
                                                                    alt: "Profile Picture",
                                                                    isBordered: true
                                                                }}
                                                            />
                                                        </td>
                                                        {/* <td className="p-2">{uni_id_num}</td> */}
                                                        <td className="p-2">{id}</td>
                                                        <td className="p-2">{formatDateTime(created_at)}</td>
                                                        <td className="p-2"><StatusChip status={user_status} /></td>
                                                        <td>{getAdminActionButtons(authAdminRole, accessControl?.role || 'N/A', id, user_status, name)}</td>

                                                        <td className="p-2">
                                                            {/* <Chip startContent={<FaFileInvoice size={16} />} size="sm" className="text-customGray h-full p-1 text-wrap flex text-center" variant='faded'>
                                                                {planName}
                                                            </Chip> */}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table >
                                )
                                    : <>
                                        <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                            {renderTableHeaders(tableHeaders, 'admin')}
                                        </table>
                                        <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                                    </>
                                )
                                : <TableSkeleton tableHeaders={tableHeaders} tableHeaderType={'admin'} />
                            }

                        </div>

                        {(!isDataLoading && coAdminsToRender.data.length > 0) &&
                            <Pagination
                                tableData={coAdminsToRender}
                            />
                        }

                    </div>
                </div>
            </div >
            {/* Modals */}
            <Add
                isOpen={isAddInsAdminModalOpen}
                onClose={() => setIsAddInsAdminModalOpen(false)}
                routeName="institution-coadmins.send-registration"
                userType='admin'
                uniBranchId={id}
                planUserLimit={planUserLimit}
                remainingUserSlots={remainingUserSlots}
            />
            <AccessControl
                fetchAdminAccessRouteName='institution-coadmins.admin-access'
                updateAdminAccessRouteName='institution-coadmins.update-admin-access'
                isOpen={isAccessControlModalOpen}
                onClose={() => setIsAccessControlModalOpen(false)}
                userType='admin'
                userId={coInsAdminId}
                username={coInsAdminName}
            />
            <Logs
                isOpen={isLogsModalOpen}
                onClose={() => setIsLogsModalOpen(false)}
                userId={coInsAdminId}
                username={coInsAdminName}
            />
            <UpdateStatus
                routeName="institution-coadmins.update-status"
                isOpen={isUpdateStatusModalOpen}
                onClose={() => setIsUpdateStatusModalOpen(false)}
                action={action}
                userId={coInsAdminId}
                name={coInsAdminName}
            />
        </AdminLayout >
    );
}
