
import React, { useState, useEffect } from "react";
import { User, Chip, user, } from "@nextui-org/react";
import { FaPlus, FaFileCircleCheck, FaFileCircleMinus, FaFileInvoice } from "react-icons/fa6";
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
import Filter from "./Filter";
import Add from "@/Pages/SuperAdmin/Users/Add";
import AccessControl from "@/Pages/SuperAdmin/Users/AccessControl";

export default function CoAdmins({ auth, insAdminAffiliation, coAdmins, search, entries }) {
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
    const [coInsAdminId, setCoInsAdminId] = useState(null);
    const [coInsAdminName, setCoInsAdminName] = useState(null);


    // State variables to be passed to the Filter component
    const [autocompleteItems, setAutocompleteItems] = useState({ role: [], course: [], plan: [], status: [] });
    const [selectedAutocompleteItems, setSelectedAutocompleteItems] = useState({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: { start: null, end: null, } });

    const [{ university, uni_branch_name, id: uni_branch_id }] = insAdminAffiliation;
    console.log('uni_branch_id', uni_branch_id);
    const params = route().params;

    console.log('params', params);

    useEffect(() => {
        console.log('hasFilteredData', hasFilteredData);

    }, [hasFilteredData]);

    useEffect(() => {
        console.log('insAdminAffiliation', insAdminAffiliation);
    }, []);


    const filterParams = ['role', 'course', 'status', 'date_created'];

    const tableHeaders = {
        'admin': ['Name', 'User ID', 'Affiliated University', 'Role', 'Date Created', 'Status', 'Actions'],
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
            fetchSearchFilteredData('institution-coadmins.filter', null, params, searchTerm,
                setIsDataLoading, setCoAdminsToRender, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    const renderActionButtons = (userId, name, currentPlanName, currentPlanStatus) => {
        const actionText = currentPlanStatus.toLowerCase() === 'active' ? "Deactivate" : "Activate";

        return (
            <div className="p-2 flex gap-2">
                {currentPlanStatus && (
                    <ActionButton
                        icon={currentPlanStatus.toLowerCase() === 'active' ? <FaFileCircleMinus /> : <FaFileCircleCheck />}
                        tooltipContent={currentPlanStatus === 'Active' ? 'Deactivate plan' : 'Activate plan'}
                        onClick={() =>
                            handleUpdatePlanStatusModalClick(
                                userId,
                                name,
                                currentPlanName,
                                actionText,
                            )
                        }
                    />
                )}
            </div>
        )
    };

    const handleUpdatePlanStatusModalClick = (id, name, currentPlanName, actionText) => {
        setIsUpdatePlanStatusModalOpen(true);
        setUserId(id);
        setName(name);
        setCurrentPlanName(currentPlanName);
        setAction(actionText);
    }

    const handleClearFiltersClick = () => {
        setSelectedAutocompleteItems({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: null })
    }

    return (
        <AdminLayout
            user={auth.user}
            university={`${university.uni_name} - ${uni_branch_name}`}
        >
            <div className="p-4">
                <div className="flex">
                    <PageHeader>CO-ADMINS</PageHeader>
                    <PageHeader className="ml-auto mr-4 uppercase">{`${university.uni_name} - ${uni_branch_name}`}</PageHeader>
                </div>

                <div className="mx-auto sm:px-2 lg:px-4">
                    <div className="flex py-4  ml-auto">
                        <AddButton onClick={() => setIsAddInsAdminModalOpen(true)} icon={<FaPlus />}>
                            Add co-ins admin
                        </AddButton>

                    </div>
                    <div className="bg-white flex flex-col gap-4 h-[68dvh] relative shadow-md sm:rounded-lg overflow-hidden p-4">

                        {/* TABLE CONTROLS */}
                        {renderTableControls('institution-coadmins.filter', searchTerm, setSearchTerm, 'Search by name or student id...',
                            coAdmins.data.length === 0, totalFilters, handleClearFiltersClick, isFilterOpen, setIsFilterOpen,
                            handleSetEntriesPerPageClick, entriesPerPage, setEntriesPerPage, setCoAdminsToRender
                        )}

                        {/* FILTER COMPONENT PLACEMENT */}
                        <Filter
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
                                                const { id, uni_id_num, name, email, created_at, user_pic, student, personal_subscription } = coAdmin;

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
                uniBranchId={affiliatedUniBranchId}
            />
            <AccessControl
                isOpen={isAccessControlModalOpen}
                onClose={() => setIsAccessControlModalOpen(false)}
                userType='admin'
                userId={coInsAdminId}
                username={coInsAdminName}
            />
        </AdminLayout >
    );
}
