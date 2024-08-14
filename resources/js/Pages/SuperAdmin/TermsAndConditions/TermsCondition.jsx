import { FaPlus } from "react-icons/fa";  
import AddButton from '@/Components/AddButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Create from "./Create";
import Show from "./Show";
import Edit from "./Edit"; 
import Pagination from "@/Components/Pagination";

export default function TermsCondition({ auth, termsConditions = [] }) {
    const [filteredData, setFilteredData] = useState(termsConditions);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [selectedTerms, setSelectedTerms] = useState(null);
    const [wordEntered, setWordEntered] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const newFilter = termsConditions.filter((value) => {
            if (filteredStatus === "All") {
                return (
                    (value.content_title.toLowerCase().startsWith(wordEntered.toLowerCase()) ||
                    value.user.name.toLowerCase().startsWith(wordEntered.toLowerCase()))
                );
            } else {
                return ( 
                    value.content_status === filteredStatus.toLowerCase() &&
                    (value.content_title.toLowerCase().startsWith(wordEntered.toLowerCase()) ||
                    value.user.name.toLowerCase().startsWith(wordEntered.toLowerCase()))
                );
            }
        });
        setFilteredData(newFilter);
    }, [filteredStatus, wordEntered, termsConditions]);

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };

    const filterStatus = (status) => {
        setCurrentPage(1)
        setFilteredStatus(status);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openIndexModal = (tc) => {
        setSelectedTerms(tc);
        setIsShowModalOpen(true);
    };

    const openEditModal = (tc) => {
        setSelectedTerms(tc);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setFilteredData(termsConditions)
        setFilteredStatus("All");
        setWordEntered("");
        setIsCreateModalOpen(false);
        setIsShowModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedTerms(null);
    };

    const deleteTermCondition = (id) => {
        if (confirm("Are you sure you want to delete this term and condition?")) {
            router.delete(route('manage-terms-and-conditions.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Successfully deleted!');
                },
            });
        }
    };

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Terms And Conditions</h2>}
        >
            <Head title="Terms Condition" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3">
                            <div className="text-gray-800 text-3xl font-bold">Terms and Conditions</div>
                            <div>
                                <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add T&Cs</span>
                                </AddButton> 
                            </div> 
                        </div>  

                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                <label className="sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="table-search-users" 
                                        className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Search" 
                                        value={wordEntered}
                                        onChange={handleFilter}
                                    />
                                </div>

                                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse">
                                    <button onClick={() => {filterStatus("All")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "All" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        View all
                                    </button>

                                    <button onClick={() => {filterStatus("Available")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "Available" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        Available
                                    </button>

                                    <button onClick={() => {filterStatus("Unavailable")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "Unavailable" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        Unavailable
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Content
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Modified By
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Date Modified
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (currentItems.map((tc) => (
                                        <tr key={tc.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol max-w-44 truncate">{tc.content_title}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{tc.content_text}</td>
                                            <td className="px-6 py-4">{tc.user.name}</td>
                                            <td className="px-6 py-4">{tc.updated_at}</td>
                                            <td className="px-6 py-4 flex flex-col space-y-1">
                                                <a onClick={() => openIndexModal(tc)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View</a>
                                                <a onClick={() => openEditModal(tc)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                <a onClick={() => deleteTermCondition(tc.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Pagination
                                totalItems={filteredData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={handlePagination}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Create isOpen={isCreateModalOpen} onClose={closeModal}/>
            {selectedTerms && <Show isOpen={isShowModalOpen} onClose={closeModal} termConditions={selectedTerms} />}
            {selectedTerms && <Edit isOpen={isEditModalOpen} onClose={closeModal} termConditions={selectedTerms} />}
        </AdminLayout>
    );
}