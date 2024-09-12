import { AiTwotoneStar } from "react-icons/ai"; 
import { MdFeedback } from "react-icons/md"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from "@inertiajs/inertia";
import Pagination from "@/Components/Pagination";

export default function UserFeedbacks({ auth, feedbacks }) {

    return (
        <AdminLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Feedbacks</h2>}
        >
            <Head title="User Feedbacks" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex flex-row justify-between my-3">
                    <div className="text-gray-800 text-3xl font-bold">User Feedbacks</div>
                </div>
                <div>
                    <div className="bg-white block max-w-sm px-2 p-2 border rounded-lg shadow mb-3">
                        <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Feedbacks Received</div>
                        <div className="flex flex-row justify-between pt-2 px-3">
                            <span className="text-3xl text-gray-800 font-bold">12345</span>
                            <MdFeedback size={40} color="#294996" />
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="px-5 sm:px-5">
                        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 pt-4 bg-white">
                            <select className="mt-1 block pl-3 pr-10 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">All</option>
                                <option value="">Today</option>
                                <option value="">This Week</option>
                                <option value="">This Month</option>
                            </select>
                        </div>
                        
                        <div className="overflow-y-auto h-400 my-3" >
                            {feedbacks.data.length > 0 ? (
                                feedbacks.data.map((fb) => (
                                    <div key={fb.id} className="w-full p-3 my-3 border border-gray-200 rounded-lg shadow">
                                        <div className="flex justify-between">
                                            <div className="flex flex-row space-x-2">
                                                <h3 className="mb-1 text-lg font-bold tracking-tight text-gray-700">{fb.user.name}</h3>
                                            </div>
                                            <div className="flex flex-row">
                                                <AiTwotoneStar />
                                                <AiTwotoneStar />
                                                <AiTwotoneStar />
                                                <AiTwotoneStar />
                                                <AiTwotoneStar />
                                            </div>
                                        </div>
                                        <span className="font-normal text-m text-gray-700">{fb.feedback_content}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center m-5 overflow-hidden">
                                    <span className="px-6 py-4 text-center text-gray-600">No results found</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    <Pagination links={feedbacks.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
