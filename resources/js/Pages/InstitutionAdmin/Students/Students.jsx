
import React, { useState, useEffect } from "react";
import { User, Chip, } from "@nextui-org/react";
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
import Add from "./Add";
import UpdatePlanStatus from "./UpdatePlanStatus";

export default function Students({ auth, insAdminAffiliation, students, hasStudentPremiumAccess, search, entries }) {
    console.log('students', students);
    const [studentsToRender, setStudentsToRender] = useState(students);
    const [userId, setUserId] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [name, setName] = useState('');
    const [searchTerm, setSearchTerm] = useState(search ? decodeURLParam(search) : '');
    const [currentPlanName, setCurrentPlanName] = useState('');
    const [currentPlanStatus, setCurrentPlanStatus] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(entries || 10);
    const [totalFilters, setTotalFilters] = useState(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isUpdatePlanStatusModalOpen, setIsUpdatePlanStatusModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State variables to be passed to the Filter component
    const [autocompleteItems, setAutocompleteItems] = useState({ department: [], course: [], plan: [], currentPlanStatus: [] });
    const [selectedAutocompleteItems, setSelectedAutocompleteItems] = useState({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: { start: null, end: null, } });

    const [{ university, uni_branch_name }] = insAdminAffiliation;
    const params = route().params;

    console.log('params', params);

    useEffect(() => {
        console.log('hasFilteredData', hasFilteredData);

    }, [hasFilteredData]);

    useEffect(() => {
        console.log('insAdminAffiliation', insAdminAffiliation);
    }, []);


    const filterParams = ['department', 'course', 'plan', 'plan_status', 'date_created'];
    const navigations = [
        { text: 'Premium Access', icon: <HiDocumentCheck />, param: 'with-premium-access' },
        { text: 'No Premium Access', icon: <HiDocumentMinus />, param: 'no-premium-access' },
    ];

    const tableHeaders = {
        'with-premium-access': ['Name', 'Student ID', 'Department', 'Course', 'Section', 'Date Created', 'Current Plan', 'Plan Status', 'Action'],
        'no-premium-access': ['Name', 'Student ID', 'Department', 'Course', 'Section', 'Date Created', 'Current Plan'],
    };

    // Get the total number of filters from the query parameters that have values
    useEffect(() => {
        setTotalFilters(getTotalFilters(params, filterParams));
    }, [params])

    // For inertia responses, it updates automatically when the page is refreshed
    useEffect(() => {
        setStudentsToRender(students);
    }, [students])

    // For responses that receive JSON, like search filters
    useEffect(() => {
        setIsDataLoading(true);

        const debounce = setTimeout(() => {
            fetchSearchFilteredData('institution-students.filter', params, searchTerm,
                setIsDataLoading, setStudentsToRender, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    const renderActionButtons = (userId, name, currentPlanName, currentPlanStatus) => (
        <div className="p-2 flex gap-2">
            {currentPlanStatus && (
                <ActionButton
                    icon={currentPlanStatus === 'Active' ? <FaFileCircleMinus /> : <FaFileCircleCheck />}
                    tooltipContent={currentPlanStatus === 'Active' ? 'Deactivate plan' : 'Activate plan'}
                    onClick={() =>
                        handleUpdatePlanStatusModalClick(
                            userId,
                            name,
                            currentPlanName,
                            currentPlanStatus,
                        )
                    }
                />
            )}
        </div>
    );

    const handleUpdatePlanStatusModalClick = (id, name, currentPlanName, currentPlanType, currentPlanStatus) => {
        setIsUpdatePlanStatusModalOpen(true);
        setUserId(id);
        setName(name);
        setCurrentPlanName(currentPlanName);
        setCurrentPlanStatus(currentPlanStatus);
    }

    const handleClearFiltersClick = () => {
        setSelectedAutocompleteItems({ department: '', course: '', plan: '', currentPlanStatus: '', dateCreated: null })
    }

    return (
        <AdminLayout
            user={auth.user}
        >
            <div className="p-4">
                <div className="flex">
                    <PageHeader>STUDENTS</PageHeader>
                    <PageHeader className="ml-auto mr-4 uppercase">{`${university.uni_name} - ${uni_branch_name}`}</PageHeader>
                </div>

                <div className="mx-auto sm:px-2 lg:px-4">
                    <div className="MainNavContainer flex gap-3 py-4">
                        {navigations.map(nav => (
                            <MainNav
                                key={nav.text}
                                icon={nav.icon}
                                href={route('institution-students.filter', { ...params, hasStudentPremiumAccess: nav.param })}
                                active={
                                    (route().current('institution-students') && nav.param === 'with-premium-access')
                                    || route().current('institution-students.filter', nav.param)
                                }>
                                {nav.text}
                            </MainNav>))

                        }
                        <AddButton onClick={() => setIsAddStudentModalOpen(true)} icon={<FaPlus />}>
                            Add Student
                        </AddButton>
                    </div>

                    <div className="bg-white flex flex-col gap-4 h-[68dvh] relative shadow-md sm:rounded-lg overflow-hidden p-4">

                        {/* TABLE CONTROLS */}
                        {renderTableControls('institution-students.filter', searchTerm, setSearchTerm, 'Search by name or student id...',
                            students.data.length === 0, totalFilters, handleClearFiltersClick, isFilterOpen, setIsFilterOpen,
                            handleSetEntriesPerPageClick, entriesPerPage, setEntriesPerPage, setStudentsToRender
                        )}

                        {/* FILTER COMPONENT PLACEMENT */}
                        <Filter
                            hasStudentPremiumAccess={hasStudentPremiumAccess}
                            autocompleteItems={autocompleteItems}
                            setAutocompleteItems={setAutocompleteItems}
                            selectedAutocompleteItems={selectedAutocompleteItems}
                            setSelectedAutocompleteItems={setSelectedAutocompleteItems}
                            isFilterOpen={isFilterOpen}
                        />

                        {/* STUDENT DATA */}
                        <div className="TableContainer border overflow-y-auto  max-h-[50vh] ">
                            {!isDataLoading ?
                                (studentsToRender.data.length > 0 ? (
                                    <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide">
                                        {renderTableHeaders(tableHeaders, hasStudentPremiumAccess)}
                                        <tbody>
                                            {studentsToRender.data.map((stud, index) => {
                                                const { id, uni_id_num, name, email, created_at, user_pic, student, personal_subscription } = stud;

                                                const studentId = student?.id || 'N/A';
                                                const departmentAcronym = student?.section?.course?.department?.dept_acronym || 'N/A';
                                                const courseAcronym = student?.section?.course?.course_acronym || 'N/A';
                                                const sectionName = student?.section?.section_name || 'N/A';
                                                const planName = personal_subscription?.plan?.plan_name || 'Basic Plan';
                                                const planStatus = personal_subscription?.persub_status || 'N/A';
                                                const formattedDateCreated = formatDateTime(created_at) || 'N/A';

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
                                                        <td className="p-2">{studentId}</td>
                                                        <td className="p-2">{departmentAcronym ?? 'N/A'}</td>
                                                        <td className="p-2">{courseAcronym ?? 'N/A'}</td>
                                                        <td className="p-2">{sectionName ?? 'N/A'}</td>
                                                        <td className="p-2">{formattedDateCreated}</td>
                                                        <td className="p-2">
                                                            <Chip startContent={<FaFileInvoice size={16} />} size="sm" className="text-customGray h-full p-1 text-wrap flex text-center" variant='faded'>
                                                                {planName}
                                                            </Chip>
                                                        </td>

                                                        {hasStudentPremiumAccess === 'with-premium-access' && (
                                                            <>
                                                                <td className="p-2">{<StatusChip status={currentPlanStatus} />}</td>
                                                                <td className="p-2">{renderActionButtons(id, name, planName, planStatus)}</td>
                                                            </>
                                                        )

                                                        }

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table >
                                )
                                    : <>
                                        <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                            {renderTableHeaders(tableHeaders, hasStudentPremiumAccess)}
                                        </table>
                                        <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                                    </>
                                )
                                : <TableSkeleton tableHeaders={tableHeaders} tableHeaderType={hasStudentPremiumAccess} />
                            }

                        </div>

                        {(!isDataLoading && studentsToRender.data.length > 0) &&
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
            <UpdatePlanStatus
                hasStudentPremiumAccess={hasStudentPremiumAccess}
                userId={userId}
                name={name}
                currentPlanName={currentPlanName}
                currentPlanStatus={currentPlanStatus}
                setStudentsToRender={setStudentsToRender}
                isOpen={isUpdatePlanStatusModalOpen}
                onClose={() => setIsUpdatePlanStatusModalOpen(false)}
            />
        </AdminLayout >
    );
}
