import { FaUsers } from "react-icons/fa"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return ( 
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
        
            <Head title="Dashboard" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-row space-x-3">
                        <div className="bg-white block min-w-sm w-64 px-2 p-2 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Users</div>
                            <div className="flex flex-row justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">12345</span>
                                <FaUsers size={40} color="#294996" /> 
                            </div>
                        </div>
                        <div className="bg-white block min-w-sm w-64 px-2 p-2 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Subscribers</div>
                            <div className="flex flex-row justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">12345</span>
                                <FaUsers size={40} color="#294996" /> 
                            </div>
                        </div>
                        <div className="bg-white block min-w-sm w-64 px-2 p-2 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Students</div>
                            <div className="flex flex-row justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">12345</span>
                                <FaUsers size={40} color="#294996" /> 
                            </div>
                        </div>
                        <div className="bg-white block min-w-sm w-64 px-2 p-2 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Teachers</div>
                            <div className="flex flex-row justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">12345</span>
                                <FaUsers size={40} color="#294996" /> 
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row space-x-3 justify-between mt-8">
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-row space-x-3">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900">Dashboard</div>
                                </div>
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900">Dashboard</div>
                                </div>
                            </div>
                            
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">Dashboard</div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">Dashboard</div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">Dashboard</div>
                            </div>
                        </div>
                    </div>
                    
                     
                </div>
            </AdminLayout>
    );
}
