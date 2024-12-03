import React, { useEffect, useState, } from "react";
import { Divider, User } from "@nextui-org/react";
import { FaUserSlash, FaFileLines, FaShieldHalved, FaUserCheck } from "react-icons/fa6";
import { FaHands, FaUniversity } from "react-icons/fa";
import { capitalize, formatDateTime, titleCase } from "@/Utils/common-utils";
import { fetchSearchFilteredData, formatAdminRole, getTotalFilters, handleSetEntriesPerPageClick } from "@/Utils/admin-utils";
import PageHeader from "@/Components/Admin/PageHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import MainNav from "@/Components/MainNav";
import Pagination from "@/Components/Admin/Pagination";
import ActionButton from "@/Components/Admin/ActionButton";
import StatusChip from "@/Components/Admin/StatusChip";
import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import TableSkeleton from "@/Components/Admin/TableSkeleton";
import { renderTableControls, renderTableHeaders } from "../Users/Users";
import StatisticCard from "@/Components/Admin/StatisticCard";

export default function SubscriptionBilling({ auth, subscriptions, subscriptionType, searchValue }) {
    console.log('subscriptions', subscriptions);
    console.log('auth', auth);

    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [action, setAction] = useState(null);
    const [subscriptionsToRender, setSubscriptionsToRender] = useState(subscriptions);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [totalFilters, setTotalFilters] = useState(0);
    const [searchTerm, setSearchTerm] = useState(searchValue || '');
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [isDataLoading, setIsDataLoading] = useState(false);

    // For modals
    // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // const [isSetStatusModalOpen, setIsSetStatusModalOpen] = useState(false);
    // const [isAccessControlModalOpen, setIsAccessControlModalOpen] = useState(false);
    // const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    // const [isFilterOpen, setIsFilterOpen] = useState(false);

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
        // The param values here are the same as the subscriptionType values
        { text: 'Personal', icon: <FaHands />, param: 'personal' },
        { text: 'Institutional', icon: <FaUniversity />, param: 'institutional' },
    ];

    const tableHeaders = {
        'personal': ['Subscription ID', 'Plan Name', 'Customer Name', 'Start Date', 'End Date', 'Plan Status', 'Plan Term', 'Actions'],
        'institutional': ['Subscription ID', 'Plan Name', 'Institution Name', 'No. of Users', 'Start Date', 'End Date', 'Plan Term', 'Plan Status', 'Actions']
    };


    useEffect(() => {
        console.log('subscriptionsToRender', subscriptionsToRender);
    }, [subscriptionsToRender]);

    // Get the total number of filters from the query parameters that have values
    useEffect(() => {
        setTotalFilters(getTotalFilters(params, filterParams));
    }, [params])

    // For inertia responses, it updates automatically when the page is refreshed
    useEffect(() => {
        setSubscriptionsToRender(subscriptions);
    }, [subscriptions])

    // For responses that receive JSON, like search filters
    useEffect(() => {
        setIsDataLoading(true);

        const debounce = setTimeout(() => {
            fetchSearchFilteredData('subscription-billing.filter', { subscriptionType: subscriptionType }, params, searchTerm, setIsDataLoading, setSubscriptionsToRender, setHasFilteredData);
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

    const handleClearFiltersClick = () => {
        setSelectedAutocompleteItem({
            university: '', branch: '', department: '', course: '', currentPlan: '', insAdminRole: '',
            superAdminRole: '', dateCreated: { start: null, end: null, }, status: ''
        })
    }

    const renderPersonalSubActionButtons = (authAdminRole, adminRole, userId, userStatus, name) => {
        // let disableBtn = { accessControl: null, viewLogs: null, setStatus: null };

        // const actionText = userStatus.toLowerCase() === 'active' ? "Deactivate" : "Activate";

        // return (
        //     <div className="p-2 flex gap-2">
        //         <ActionButton
        //             icon={<FaShieldHalved />}
        //             tooltipContent="Access control"
        //             isDisabled={disableBtn.accessControl}
        //             onClick={() => handleAccessControlClick(userId, name)}
        //         />
        //         <ActionButton
        //             icon={<FaFileLines />}
        //             tooltipContent="View logs"
        //             isDisabled={disableBtn.viewLogs}
        //             onClick={() => handleLogsClick(userId, name)}
        //         />
        //         <ActionButton
        //             icon={userStatus === 'active' ? <FaUserSlash /> : <FaUserCheck />}
        //             tooltipContent={actionText}
        //             isDisabled={disableBtn.setStatus}
        //             onClick={() => handleUpdateStatusClick(userId, name, actionText)}
        //         />
        //     </div>
        // );
    };

    const renderInsSubActionButtons = (userId, userStatus, name) => {

        // const actionText = userStatus.toLowerCase() === 'active' ? "Deactivate" : "Activate";

        // return (
        //     <div className="p-2 flex gap-2">
        //         <ActionButton
        //             icon={<FaFileLines />}
        //             tooltipContent="View logs"
        //             onClick={() => handleLogsClick(userId, name)}
        //         />
        //         <ActionButton
        //             icon={userStatus === 'active' ? <FaUserSlash /> : <FaUserCheck />}
        //             tooltipContent={actionText}
        //             onClick={() => handleUpdateStatusClick(userId, name, actionText)}
        //         />
        //     </div>
        // );
    };

    return (
        <AdminLayout
            user={auth.user}
        >
            <div className="p-4">
                <PageHeader>SUSBSCRIPTION AND BILLING</PageHeader>

                <div className="max-w-7xl mx-auto sm:px-2 lg:px-4">
                    {/* MAIN NAVIGATION */}
                    <div className="MainNavContainer flex gap-3 py-4">
                        {navigations.map((nav, index) => (
                            <MainNav
                                key={nav.text}
                                icon={nav.icon}
                                href={route('subscription-billing.filter', { ...params, subscriptionType: nav.param })}
                                active={
                                    (route().current('subscription-billing') && nav.param === 'personal') ||
                                    route().current('subscription-billing.filter') === nav.param
                                }
                            >
                                {nav.text}
                            </MainNav>
                        ))}
                    </div>

                    <div className="flex gap-5 pb-4">
                        {/* <StatisticCard />
                        <StatisticCard /> */}


                    </div>


                    <div className="flex-col gap-3 max-h-[65dvh] relative bg-white flex shadow-md sm:rounded-lg overflow-hidden p-4">
                        {renderTableControls('entries route', searchTerm, setSearchTerm, 'Search by name or user id...', subscriptions.data.length === 0,
                            totalFilters, handleClearFiltersClick, isFilterOpen, setIsFilterOpen, handleSetEntriesPerPageClick,
                            entriesPerPage, setEntriesPerPage, setSubscriptionsToRender)}

                        {/* STUDENT DATA */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isDataLoading ?
                                (subscriptionsToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeaders(tableHeaders, subscriptionType)}

                                        <tbody>
                                            {subscriptionsToRender.data.map((user, index) => {
                                                // Extract the needed value and rename some of the keys
                                                const { id, name, email, is_premium, user_pic, created_at, user_status, personal_subscription, institution_admin } = user;

                                                const universityAcronym = institution_admin?.institution_subscription?.university_branch?.university.uni_acronym
                                                    ?? 'N/A';
                                                const branch = institution_admin?.institution_subscription?.university_branch?.uni_branch_acronym
                                                    ?? 'N/A';

                                                const institutionName = universityAcronym + " - " + branch;

                                                const numOfUsers = institution_admin?.institution_subscription?.insub_num_user;

                                                // Plan id for personal or institutional subscription
                                                const planId = personal_subscription?.id
                                                    ?? institution_admin?.institution_subscription?.id
                                                    ?? 'N/A';

                                                const planName = personal_subscription?.plan?.plan_name
                                                    ?? institution_admin?.institution_subscription?.plan?.plan_name
                                                    ?? 'N/A';

                                                const planTerm = personal_subscription?.plan?.plan_term
                                                    ?? institution_admin?.institution_subscription?.plan?.plan_term
                                                    ?? 'N/A';

                                                const planStartDate = personal_subscription?.start_date
                                                    ?? institution_admin?.institution_subscription?.start_date
                                                    ?? 'N/A';

                                                const planEndDate = personal_subscription?.end_date
                                                    ?? institution_admin?.institution_subscription?.end_date
                                                    ?? 'N/A';

                                                const planStatus = personal_subscription?.persub_status
                                                    ?? institution_admin?.institution_subscription?.insub_status
                                                    ?? 'N/A';

                                                return (
                                                    <tr key={index} className="border-b border-customLightGray hover:bg-gray-100">

                                                        <td className="p-2">{planId}</td>
                                                        <td className="p-2">{planName}</td>
                                                        {subscriptionType === 'personal' && (
                                                            <>
                                                                <td className="p-2">{name}</td>
                                                                <td className="p-2">{planStartDate}</td>
                                                                <td className="p-2">{planEndDate}</td>
                                                                <td className="p-2">{capitalize(planTerm)}</td>
                                                                <td className="p-2"><StatusChip status={planStatus} /></td>
                                                                <td >{renderPersonalSubActionButtons(id, user_status, name)} </td>
                                                            </>
                                                        )}

                                                        {subscriptionType === 'institutional' && (
                                                            <>
                                                                <td className="p-2">{institutionName}</td>
                                                                <td className="p-2">{planName}</td>
                                                                <td className="p-2">{planStartDate}</td>
                                                                <td className="p-2">{planEndDate}</td>
                                                                <td className="p-2">{capitalize(planTerm)}</td>
                                                                <td className="p-2"><StatusChip status={planStatus} /></td>
                                                                <td >{renderInsSubActionButtons(id, user_status, name)} </td>
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
                                                {renderTableHeaders(tableHeaders, subscriptionType)}
                                            </table>
                                            <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                                        </>
                                    )
                                )
                                : <TableSkeleton tableHeaders={tableHeaders} tableHeaderType={subscriptionType} />
                            }

                        </div>

                        {(!isDataLoading && subscriptionsToRender.data.length > 0) &&
                            <Pagination
                                tableData={subscriptionsToRender}
                            />
                        }

                    </div>
                </div>
            </div >

            {/* MODALS */}

        </AdminLayout >
    );
}