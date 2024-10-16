import { Button, Card, CardHeader, CardBody, CardFooter, Divider} from '@nextui-org/react';import { FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { formatDate } from '@/Components/FormatDate';
import Pagination from "@/Components/Pagination";
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react'; 
import AddButton from '@/Components/AddButton';
import { showToast } from "@/Components/Toast";
import { useEffect, useState } from 'react';
import Create from "./Create";
import Edit from "./Edit"; 
import AdvancedMenu from '../AdvancedMenu';


export default function ReportReason({ auth, reportReason = []}) {
    const [filteredData, setFilteredData] = useState(reportReason.data);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [wordEntered, setWordEntered] = useState("");
    const [type, setType] = useState(null);

    const openModal = (data) => {
        setType(data);
        setIsModalOpen(true);
    }

    useEffect(() => {
        const newFilter = reportReason.data.filter((value) => {
                return (
                    (value.report_type_content.toLowerCase().startsWith(wordEntered.toLowerCase()) ||
                    value.user.name.toLowerCase().startsWith(wordEntered.toLowerCase())))
        });
        setFilteredData(newFilter);
    }, [wordEntered, reportReason.data]);

    const handleFilter = (e) => {
        setWordEntered(e.target.value);
    };


    const closeModal = () => {
        setType(null);
        setIsModalOpen(false);
        setFilteredData(reportReason.data)
        setWordEntered("");
        setSelectedData(null);
    };

    const handleDelete = (id) => {
            router.delete(route('manage-report-reason.destroy', id), {
                preserveScroll: true,
                // onSuccess: () => {
                //     showToast('success', 'Successfully deleted!');
                // },
            });
    };



    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Report Reason</h2>}
        >

            <div className="py-8 select-none">

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-5">

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
                            
                            <div>
                        <AddButton onClick={() => {openModal('Create')}} className="text-customBlue hover:text-white space-x-1">
                            <FaPlus /><span>Add Reason</span>
                        </AddButton>
                    </div>
                        </div>





                        <div className="overflow-y-auto h-480">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Report Reason
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
                                {filteredData.length > 0 ? (filteredData.map((data) => (
                                    <tr key={data.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="pl-3">
                                                <div className="text-base font-semibol max-w-44 truncate">{data.report_type_content}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">{data.user.name}</td>
                                        <td className="px-6 py-4">{data.updated_at}</td>
                                        <td className="px-6 py-4 flex flex-row space-x-2">
                                            <a onClick={() => {openModal('Edit'); setSelectedData(data)}} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Edit">
                                                <FaPen />
                                            </a>
                                            <a onClick={() => handleDelete(data.id)} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Delete">
                                                <FaTrash />
                                            </a>
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
                        <Pagination links={reportReason.links} />
                    </div>
                </div>
               
            </div>

            </div>

            {type == 'Create' && <Create isOpen={isModalOpen} onClose={closeModal}/>}
            {type == 'Edit' && selectedData && <Edit isOpen={isModalOpen} onClose={closeModal} reportReason={selectedData} />}

        </AdminLayout>
    );
}
