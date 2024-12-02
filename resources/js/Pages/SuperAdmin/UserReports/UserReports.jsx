import { BsPersonFill } from "react-icons/bs";
import { BsPersonFillExclamation } from "react-icons/bs";
import { BsPersonFillCheck } from "react-icons/bs";
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ReportModal from "@/Components/ReportModal";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import Show from "./Show"; 
import { formatDate, formatPrice } from '@/utils';
import PageHeader from "@/Components/Admins/PageHeader";

export default function UserReports({ auth, userReports, pendingCount, solvedCount, allReportCount, reportLocation }) {
    const [filteredData, setFilteredData] = useState(userReports.data);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [filteredLocation, setFilteredLocation] = useState("All");
    const [filteredDate, setFilteredDate] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const[selectedData, setSelectedData] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);


    useEffect(() => {
        fetchFilteredReports();
    }, [filteredStatus, filteredDate, filteredLocation]);

    //FOR REPORT MODAL
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const openReportModal = () => {
        setIsReportModalOpen(true);
    }

    const closeModal = () => {
        setSelectedData(null);
        setSelectedContent(null);
        setIsReportModalOpen(false);
        setIsModalOpen(false);
        router.reload();
    }
    //FOR REPORT MODAL

    const fetchFilteredReports = async () => {
        try {
            //console.log('Fetching with:', { filteredStatus, filteredDate, filteredLocation });

            const response = await axios.get('/filter-user-reports', {
                params: {
                    report_status: filteredStatus,
                    report_date: filteredDate,
                    report_location: filteredLocation,
                },
            });

            //console.log('Response data:', response.data);
            setFilteredData(response.data);

        } catch (error) {
            console.error("Error fetching filtered reports:", error);
        }
    };

    const viewDetails = (data) => {
        //console.log(data);
        axios.get(route('user-reports.show', data.id)).then(response => {
            setSelectedData(response.data.report);
            setSelectedContent(response.data.content);
        });
        setIsModalOpen(true);
    }



    return (

        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Reports</h2>}
        >

            <Head title="User Reports" />

            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-row justify-between m-3">
                        <PageHeader>USER REPORTS</PageHeader> 
                    </div>
                    <div className="grid grid-cols-3 gap-5 space-x-3">
                        <div className="bg-white block max-w-sm p-4 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Reports Submitted</div>
                                <div className="flex flex-row justify-between pt-3">
                                    <span className="text-4xl text-gray-800 font-bold pr-10">{allReportCount}</span>
                                    <BsPersonFill size={40} color="#294996" />
                                </div>
                        </div>
                        <div className="bg-white block max-w-sm p-4 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Pending Reports</div>
                                <div className="flex flex-row justify-between pt-3">
                                    <span className="text-4xl text-gray-800 font-bold pr-10">{pendingCount}</span>
                                    <BsPersonFillExclamation size={40} color="#294996" />
                                </div>
                        </div>
                        <div className="bg-white block max-w-sm p-4 border rounded-lg shadow mb-3">
                                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Reports Solved</div>
                                <div className="flex flex-row justify-between pt-3">
                                    <span className="text-4xl text-gray-800 font-bold pr-10">{solvedCount}</span>
                                    <BsPersonFillCheck size={40} color="#294996" />
                                </div>
                        </div>

                        {/* <button onClick={openReportModal}>open report modal</button> */}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                <div className="flex flex-row items-center space-x-2">
                                    <label className="text-gray-600">Sort by location:</label>
                                    <select className="mt-1 block pl-3 pr-10 py-2 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={filteredLocation}
                                        onChange={(e) => setFilteredLocation(e.target.value)}
                                    >
                                    {reportLocation.map((location, index) => (
                                    <option key={index} value={location}>
                                        {location}
                                    </option>
                                    ))}
                                    </select>
                                </div>

                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-row items-center space-x-2">
                                        <label className="text-gray-600">Sort by Date:</label>
                                        <select className="mt-1 block pl-3 pr-10 py-2 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={filteredDate}
                                            onChange={(e) => setFilteredDate(e.target.value)}
                                        >
                                            <option value="All">All</option>
                                            <option value="Today">Today</option>
                                            <option value="This Week">This Week</option>
                                            <option value="This Month">This Month</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-row items-center space-x-2">
                                        <label className="text-gray-600">Sort by Status:</label>
                                        <select className="mt-1 block pl-3 pr-10 py-2 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            value={filteredStatus}
                                            onChange={(e) => setFilteredStatus(e.target.value)}
                                        >
                                            <option value="All">All</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Solved">Solved</option>
                                            <option value="Dropped">Dropped</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-y-auto h-480">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Reporter Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Reason for Reporting
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Reported At
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (filteredData.map((up) => (
                                        <tr key={up.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="pl-3">
                                                    <div className="text-base font-semibol max-w-44 truncate">{up.user.name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 max-w-60 truncate">{up.report_type}</td>
                                            <td className="px-6 py-4">{up.report_status}</td>
                                            <td className="px-6 py-4">{up.created_at}</td>
                                            <td className="px-6 py-4 flex flex-row space-x-2">
                                                <a onClick={() => {viewDetails(up)}} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="View Details">
                                                    <FaEye/>
                                                </a>
                                                <a onClick={() => {}} className="bg-customBlue text-white rounded p-1 hover:bg-transparent hover:text-customBlue cursor-pointer" title="Remove">
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




                        </div>
                    </div>
                </div>
            </div>

            <ReportModal isOpen={isReportModalOpen} onClose={closeModal} reportLocation={'Forum'} reportedID={2}/>
            {selectedData && selectedContent && (<Show isOpen={isModalOpen} onClose={closeModal} report={selectedData} content={selectedContent}/>)}
            </AdminLayout>
    );
}
