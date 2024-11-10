import { AiFillEdit } from "react-icons/ai"; 
import { FaTrash } from "react-icons/fa"; 
import { CgArrowsExchangeAltV } from "react-icons/cg"; 
import { FaPlus } from "react-icons/fa";  
import AddButton from '@/Components/AddButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "@/Components/Pagination";

export default function FrequentlyAskedQuestion({ auth, faqs }) {
    const [filteredData, setFilteredData] = useState(faqs.data);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [wordEntered, setWordEntered] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const newFilter = faqs.data.filter((value) => {
            if (filteredStatus === "All") {
                return (
                    (value.content_title.toLowerCase().includes(wordEntered.toLowerCase()) ||
                    value.user.name.toLowerCase().includes(wordEntered.toLowerCase()))
                );
            } else {
                return (
                    value.content_status === filteredStatus.toLowerCase() &&
                    (value.content_title.toLowerCase().includes(wordEntered.toLowerCase()) ||
                    value.user.name.toLowerCase().includes(wordEntered.toLowerCase()))
                );
            }
        });
        setFilteredData(newFilter);
    }, [filteredStatus, wordEntered, faqs.data]);

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };


    const filterStatus = (status) => {
        setFilteredStatus(status);
    };

    const openEditModal = (faq) => {
        setSelectedQuestion(faq);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setFilteredData(faqs.data);
        setFilteredStatus("All");
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

    const changeStatus = (id) => {
        router.put(route('manage-faqs.change_status', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setFilteredData(faqs.data);
                setFilteredStatus("All");
                setWordEntered("");
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };


    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Frequently Asked Questions</h2>}
        >
            <Head title="Frequently Asked Questions" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-row justify-between my-5">
                        <div className="text-gray-800 text-3xl font-bold">Frequently Asked Questions</div>
                        <div>
                            <AddButton onClick={() => setIsCreateModalOpen(true)} className="text-customBlue hover:text-white space-x-1">
                                <FaPlus /><span>Add FAQ</span>
                            </AddButton>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        

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
                                        id="search-users" 
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
                                        Posted
                                    </button>

                                    <button onClick={() => {filterStatus("Unavailable")}} 
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${filteredStatus === "Unavailable" ? "bg-customBlue text-white": "hover:bg-gray-100"} sm:text-sm`}>
                                        Not Posted
                                    </button>
                                </div>
                            </div>

                            
                            <div className=" min-h-[480px]">

                            {filteredData.length > 0 ? (
                                filteredData.map((faq) => (
                                    <div key={faq.id} className="block w-full p-6 my-5 bg-white border border-gray-200 rounded-lg shadow">
                                        <div className="flex justify-between">
                                            <div className="flex flex-row space-x-2">
                                                <h3 className="mb-1 text-xl font-bold tracking-tight text-gray-700">{faq.content_title}</h3>
                                                <div><p className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded 
                                                    ${faq.content_status === "available" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                                                    {faq.content_status === "available" ? "Posted" : "Not Posted"}
                                                </p></div>
                                            </div>
                                            <div className="flex flex-row space-x-2 items-center">
                                                <a onClick={() => changeStatus(faq.id)} className="font-medium text-customBlue hover:text-blue-950 cursor-pointer" title="Change Status"><CgArrowsExchangeAltV size={22}/></a>
                                                <a onClick={() => openEditModal(faq)} className="font-medium  text-customBlue hover:text-blue-950 cursor-pointer" title="Edit"><AiFillEdit size={20} color="#294996"/></a>
                                                <a onClick={() => deleteQuestion(faq.id)} className="font-medium  text-customBlue hover:text-blue-950 cursor-pointer" title="Delete"><FaTrash color="#294996" /></a>
                                            </div>
                                        </div>
                                        <span className="font-normal text-lg text-gray-700">{faq.content_text}</span>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span>Modified By: {faq.user.name}</span>
                                            <span>Modified At: {faq.updated_at}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center m-5 overflow-hidden">
                                    <span className="px-6 py-4 text-center text-gray-600">No results found</span>
                                </div>
                            )}

                            </div>

                            <Pagination links={faqs.links}/>
                        </div>
                    </div>
                </div>

            <Create isOpen={isCreateModalOpen} onClose={closeModal}/>
            {selectedQuestion && <Edit isOpen={isEditModalOpen} onClose={closeModal} faq={selectedQuestion} />}
        </AdminLayout>
    );
}