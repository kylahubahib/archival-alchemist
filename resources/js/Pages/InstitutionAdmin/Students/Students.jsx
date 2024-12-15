import React, { useState, useEffect } from "react";
import { User } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { HiDocumentCheck, HiDocumentMinus } from "react-icons/hi2";
import { decodeURLParam, formatDateTime } from "@/Utils/common-utils";
import { renderTableControls, renderTableHeaders } from "@/Pages/SuperAdmin/Users/Users";
import { fetchSearchFilteredData, getTotalFilters } from "@/Utils/admin-utils";
import PageHeader from '@/Components/Admin/PageHeader';
import AdminLayout from '@/Layouts/AdminLayout';
import MainNav from "@/Components/MainNav";
import AddButton from "@/Components/Admin/AddButton";
import ActionButton from "@/Components/Admin/ActionButton";
import Pagination from "@/Components/Admin/Pagination";
import TableSkeleton from "@/Components/Admin/TableSkeleton";
import NoDataPrompt from "@/Components/Admin/NoDataPrompt";
import Filter from "./Filter";
import Add from "./Add";
import UpdatePremiumAccess from "./UpdatePremiumAccess";

export default function Students({ auth, insAdminAffiliation, students, hasStudentPremiumAccess,
    planUserLimit, totalAffiliatedPremiumUsers, search, entries }) {

    const [studentsToRender, setStudentsToRender] = useState(students);
    const [userId, setUserId] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [name, setName] = useState('');
    const [searchTerm, setSearchTerm] = useState(search ? decodeURLParam(search) : '');
    const [action, setAction] = useState(null);
    const [entriesPerPage, setEntriesPerPage] = useState(entries || 10);
    const [totalFilters, setTotalFilters] = useState(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isUpdatePremiumAccessModalOpen, setIsUpdatePremiumAccessModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State variables to be passed to the Filter component
    const [autocompleteItems, setAutocompleteItems] = useState({
        department: [], course: [], section: []
    });
    const [selectedAutocompleteItems, setSelectedAutocompleteItems] = useState({
        department: '', course: '', section: '', dateCreated: { start: null, end: null, }
    });

    const [{ university, uni_branch_name }] = insAdminAffiliation;
    const remainingUserSlots = planUserLimit - totalAffiliatedPremiumUsers;
    const params = route().params;

    useEffect(() => {
        console.log('insAdminAffiliation', insAdminAffiliation);
    }, []);

    const filterParams = ['department', 'course', 'section', 'date_created'];
    const navigations = [
        { text: 'Premium Access', icon: <HiDocumentCheck />, param: 'with-premium-access' },
        { text: 'No Premium Access', icon: <HiDocumentMinus />, param: 'no-premium-access' },
    ];
    const tableHeaders = {
        'with-premium-access': ['Name', 'Email', 'Student University ID', 'Department', 'Course', 'Section', 'Date Created', 'Action'],
        'no-premium-access': ['Name', 'Email', 'Student University ID', 'Department', 'Course', 'Section', 'Date Created', 'Action'],
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
            fetchSearchFilteredData('institution-students.filter', { hasStudentPremiumAccess: hasStudentPremiumAccess }, params, searchTerm,
                setIsDataLoading, setStudentsToRender, setHasFilteredData);
        }, 300);

        return () => clearTimeout(debounce);

    }, [searchTerm.trim()]);

    const renderActionButtons = (userId, name, hasStudentPremiumAccess) => {
        return (
            <div className="flex gap-2">
                {hasStudentPremiumAccess ? (
                    <ActionButton
                        icon={<HiDocumentMinus />}
                        tooltipContent={'Remove institution premium access'}
                        onClick={() =>
                            handleUpdateStudentPremiumAccess(
                                userId,
                                name,
                                "Remove",
                            )
                        }
                    />)
                    : (
                        <ActionButton
                            icon={<HiDocumentCheck />}
                            tooltipContent={'Grant institution premium access'}
                            onClick={() =>
                                handleUpdateStudentPremiumAccess(
                                    userId,
                                    name,
                                    "Grant",
                                )
                            }
                        />
                    )}
            </div>
        )
    };

    const handleUpdateStudentPremiumAccess = (id, name, actionText) => {
        setIsUpdatePremiumAccessModalOpen(true);
        setUserId(id);
        setName(name);
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
                    <PageHeader>STUDENTS</PageHeader>
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

                    <div className="bg-white flex flex-col gap-4 min-h-[68dvh]  relative shadow-md sm:rounded-lg overflow-hidden p-4">

                        {/* TABLE CONTROLS */}
                        {renderTableControls({
                            routeName: 'institution-students.filter',
                            searchVal: searchTerm,
                            searchValSetter: setSearchTerm,
                            searchBarPlaceholder: 'Search by name, email, student university id...',
                            isDisabled: students.data.length === 0,
                            totalFilters: totalFilters,
                            clearFiltersOnClick: handleClearFiltersClick,
                            isFilterOpen: isFilterOpen,
                            isFilterOpenSetter: setIsFilterOpen,
                            entriesPerPage: entriesPerPage,
                            setEntriesPerPage: setEntriesPerPage,
                            setEntriesResponseData: setStudentsToRender,
                            params: { ...params, hasStudentPremiumAccess: hasStudentPremiumAccess },
                        })}

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
                                                const { id, uni_id_num, name, email, created_at, user_pic, student, is_premium } = stud;

                                                const departmentAcronym = student?.section?.course?.department?.dept_acronym || 'N/A';
                                                const courseAcronym = student?.section?.course?.course_acronym || 'N/A';
                                                const sectionName = student?.section?.section_name || 'N/A';
                                                const formattedDateCreated = formatDateTime(created_at) || 'N/A';

                                                return (
                                                    <tr key={index} className="border-b border-customLightGray hover:bg-gray-100">
                                                        <td className="flex items-center content-center pl-3 p-2">
                                                            <User
                                                                name={name}
                                                                avatarProps={{
                                                                    src: user_pic ? `/${user_pic}` : '/images/default-profile.png',
                                                                    alt: "Profile Picture",
                                                                    isBordered: true,
                                                                    className: "flex h-7 w-7 mr-1 flex-shrink-0 text",
                                                                }}
                                                                classNames={
                                                                    { name: "text-xs", }
                                                                }
                                                            />
                                                        </td>
                                                        <td className="p-2 tracking-wider">{email}</td>
                                                        <td className="p-2">{uni_id_num}</td>
                                                        <td className="p-2">{departmentAcronym ?? 'N/A'}</td>
                                                        <td className="p-2">{courseAcronym ?? 'N/A'}</td>
                                                        <td className="p-2">{sectionName ?? 'N/A'}</td>
                                                        <td className="p-2">{formattedDateCreated}</td>
                                                        <td className="p-2">{renderActionButtons(id, name, is_premium)}</td>
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
                                : <TableSkeleton tableHeaders={tableHeaders} tableHeaderType={hasStudentPremiumAccess} trClassName="border-none" />
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
                planUserLimit={planUserLimit}
                remainingUserSlots={remainingUserSlots}
            />
            <UpdatePre
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            miumAccess
                hasStudentPremiumAccess={hasStudentPremiumAccess}
                planUserLimit={planUserLimit}
                remainingUserSlots={remainingUserSlots}
                userId={userId}
                name={name}
                action={action}
                setStudentsToRender={setStudentsToRender}
                isOpen={isUpdatePremiumAccessModalOpen}
                onClose={() => setIsUpdatePremiumAccessModalOpen(false)}
            />
        </AdminLayout >
    );
}
