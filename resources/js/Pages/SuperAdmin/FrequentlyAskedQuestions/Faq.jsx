import { FaPlus } from "react-icons/fa";  
import AddButton from '@/Components/AddButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Create from "./Create";
import Edit from "./Edit";

export default function FrequentlyAskedQuestion({ auth, faqs}) {
    const [filteredData, setFilteredData] = useState(faqs);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [filteredStatus, setfilteredStatus] = useState("All");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (e) => {
        const searchWord = e.target.value;
        setWordEntered(searchWord);
        const newFilter = faqs.filter((value) => {
            return (
                value.content_title.toLowerCase().includes(searchWord.toLowerCase()) ||
                value.user.name.toLowerCase().includes(searchWord.toLowerCase())
            );
        });
        setFilteredData(newFilter);
    };

    const filterStatus = (status) => {
        setfilteredStatus(status);

        if(status === "All"){
            setFilteredData(faqs);
        } else {
            setFilteredData(faqs.filter(faq => faq.content_status.toLowerCase() === status.toLowerCase()));
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };


    const openEditModal = (faq) => {
        setSelectedQuestion(faq);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setFilteredData(faqs);
        console.log(faqs)
        setfilteredStatus("All");
        setWordEntered("");
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedQuestion(null);
    };

    const deleteQuestion = (id) => {
        if (confirm("Are you sure you want to delete this question?")) {
            router.delete(route('manage-faqs.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Successfully deleted!');
                },
            });
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Frequently Asked Questions</h2>}
        >
            <Head title="Frequently Asked Questions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3">
                            <div className="text-gray-900">Frequently Asked Questions</div>
                            <div>
                                <AddButton onClick={openCreateModal} className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add FAQ</span>
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
                                            Question
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Answer
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
                                    {filteredData.length > 0 ? ((wordEntered || filteredStatus != "All" ? filteredData : faqs).map((faq) => (
                                        <tr key={faq.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol max-w-44 truncate">{faq.content_title}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{faq.content_text}</td>
                                            <td className="px-6 py-4">{faq.user.name}</td>
                                            <td className="px-6 py-4">{faq.updated_at}</td>
                                            <td className="px-6 py-4 flex flex-col space-y-1">
                                                {/* <a onClick={() => openIndexModal(faq)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">View</a> */}
                                                <a onClick={() => openEditModal(faq)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Edit</a>
                                                <a onClick={() => deleteQuestion(faq.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">Delete</a>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-600">No results found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Create isOpen={isCreateModalOpen} onClose={closeModal}/>
            {selectedQuestion && <Edit isOpen={isEditModalOpen} onClose={closeModal} faq={selectedQuestion} />}
        </AdminLayout>
    );
}
