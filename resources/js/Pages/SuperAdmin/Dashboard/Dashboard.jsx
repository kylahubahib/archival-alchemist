import { FaUniversity, FaUsers } from "react-icons/fa"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

import { CategoryScale, Chart as ChartJS, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)


export default function Dashboard({ auth, topManuscripts = [], counts, chartData, revenue}) {
    const [revenueData, setRevenueData] = useState(chartData.monthlyRevenueData);
    const [manuscriptData, setManuscriptData] = useState(chartData.manuscriptCountWeekly);

   
    const handleRevenueFilter = (e) => {
        if(e.target.value === 'Monthly') {
            setRevenueData(chartData.monthlyRevenueData)
        } else if (e.target.value === 'Yearly') {
            axios.get('/get-yearly-revenue')
            .then(response => { 
                setRevenueData(response.data.yearlyRevenueData);
            })
            .catch(error => {
                console.error('Error fetching manuscript:', error);
            });
            
        }
    }

    const handleManuscriptFilter = (e) => {
        if(e.target.value === 'Weekly') {
           setManuscriptData(chartData.manuscriptCountWeekly);
           
        } else if (e.target.value === 'Monthly') {
            axios.get('/get-monthly-manuscript')
            .then(response => { 
                setManuscriptData(response.data.manuscriptCountMonthly)
            })
            .catch(error => {
                console.error('Error fetching manuscript:', error);
            });
        } else if (e.target.value === 'Yearly') {
            axios.get('/get-yearly-manuscript')
            .then(response => { 
                setManuscriptData(response.data.manuscriptCountYearly)
            })
            .catch(error => {
                console.error('Error fetching manuscript:', error);
            });
        }
    }

    const options = {
        responsive:true,
        plugins: {
            legend: {
                position: "bottom",
            }
        }
    }

    const statFilter = [
        {key: "Monthly", label: "Monthly"},
        {key: "Yearly", label: "Yearly"}
      ];

    return ( 
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
        
            <Head title="Dashboard" />
            <div className=" min-h-screen mx-auto sm:px-6 lg:px-8 py-8 m-5 space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"> 
                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                    <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Users</div>
                    <div className="flex flex-row justify-between pt-2">
                        <span className="text-3xl text-gray-800 font-bold">{counts.totalUsers}</span>
                        <FaUsers size={40} color="#294996" /> 
                    </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                    <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Active Users</div>
                    <div className="flex flex-row justify-between pt-2">
                        <span className="text-3xl text-gray-800 font-bold">{counts.totalActiveUsers}</span>
                        <FaUsers size={40} color="#294996" /> 
                    </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Inactive Users</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{counts.totalInactiveUsers}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Published Manuscripts</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{counts.manuscriptsCount}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

            </div>

            <div  className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left side div */}
                <div className="flex flex-col space-y-10 max-w-full">
                    <div  className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5">

                        <div className="bg-white p-5 space-y-3 shadow-sm sm:rounded-lg max-w-full">
                            <div className=" text-gray-700 font-semibold">Registered Users</div>
                            <div className="p-5">
                            <Doughnut data={chartData.usersData} options={options} />
                            </div> 
                        </div> 
                        <div className="bg-white p-5 space-y-3 shadow-sm sm:rounded-lg max-w-full">
                            <div className=" text-gray-700 font-semibold">Users Premium Status</div>
                            <div className="p-5">
                            <Doughnut data={chartData.subscriptionData} options={options} />
                            </div> 
                        </div>

                    </div>

                    <div className="bg-white overflow-hidden space-y-3 shadow-sm sm:rounded-lg p-7 max-w-full">
                        <div className="flex justify-between items-center">
                        <div className=" text-gray-700 font-semibold text-2xl">Manuscript Statistics</div>
                        <Select
                        labelPlacement="inside"
                        label="Filter Statistic"
                        className="max-w-52"
                        size="sm"
                        variant="bordered"
                        onChange={handleManuscriptFilter}
                        >
                            <SelectItem key={'Weekly'}>Weekly</SelectItem>
                            <SelectItem key={'Monthly'}>Monthly</SelectItem>
                            <SelectItem key={'Yearly'}>Yearly</SelectItem>
                        </Select>
                        </div>
                        <Bar options={options} data={manuscriptData}/>
                    </div>

                </div>

                {/* Right side div */}
                <div className="flex flex-col space-y-3 max-w-full">
                    <div className="bg-white overflow-hidden p-5 flex flex-row justify-between items-center shadow-sm sm:rounded-lg max-w-xl">
                    
                    <div className=" space-y-4">
                        <div className=" text-gray-700 font-semibold">Universities</div>
                        <span className="text-3xl text-gray-800 font-bold">{counts.uniCount}</span>
                        
                    </div>
                    <FaUniversity size={60} color="#294996" /> 
                    
                    </div>
                    <div className="bg-white shadow-sm p-5 space-y-2 sm:rounded-lg max-w-xl">
                        <div className=" text-gray-700 font-semibold text-2xl">Top Manuscripts</div>
                        <div>
                        {topManuscripts.length > 0 ? (
                            topManuscripts.map((data, index) => (
                                <div className="my-2">
                                <div key={data.id} className=" text-gray-700 text-lg">{index + 1}. <span className="font-semibold">{data.man_doc_title}</span></div>
                                <div className=" ml-5 text-sm mb-2">Views: {data.man_doc_view_count}</div>
                                <Divider />
                                </div>
                            ))
                        ) : (
                            <div>No top manuscript yet</div>
                        )}
                        </div>
                    </div>
                </div>
            </div>

            <div  className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Personal</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{counts.totalPerSub}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Institutional</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{counts.totalInSub}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Monthly Revenue</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{revenue.totalMontlyRevenue}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

                <div className="bg-white p-5 border rounded-lg shadow mb-3">
                <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Annual Revenue</div>
                <div className="flex flex-row justify-between pt-2">
                    <span className="text-3xl text-gray-800 font-bold">{revenue.totalAnnualRevenue}</span>
                    <FaUsers size={40} color="#294996" /> 
                </div>
                </div>

            </div>
            
            
            <div className="bg-white overflow-hidden space-y-3 shadow-sm sm:rounded-lg p-7 max-w-full">
                <div className="flex justify-between items-center">
                <div className=" text-gray-700 font-semibold text-2xl">Subscription Revenue Statistics</div>
                <Select
                labelPlacement="inside"
                label="Filter Statistic"
                className="max-w-52"
                size="sm"
                variant="bordered"
                onChange={handleRevenueFilter}
                >
                {statFilter.map((filter) => (
                    <SelectItem key={filter.key}> 
                    {filter.label}
                    </SelectItem>
                ))}
                </Select>
                </div>

                <Line data={revenueData} options={options} />
            </div>

            </div>

            </AdminLayout>
    );
}
