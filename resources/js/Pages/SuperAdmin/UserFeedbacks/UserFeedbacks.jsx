import { AiTwotoneStar } from "react-icons/ai"; 
import { TbClockFilled } from "react-icons/tb"; 
import { MdFeedback } from "react-icons/md"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from "react";

export default function UserFeedbacks({ auth, feedbacks }) {
    return (
        <AdminLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Feedbacks</h2>}
        >
            <Head title="User Feedbacks" />

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-row justify-between m-3">
                        <div className="text-gray-800 text-3xl font-bold">User Feedbacks</div>
                    </div>
                    <div>
                        <div className="bg-white block max-w-sm p-4 border rounded-lg shadow mb-3">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Feedbacks Received</div>
                            <div className="flex flex-row justify-between pt-3 px-3">
                                <span className="text-5xl text-gray-800 font-bold">12345</span>
                                <MdFeedback size={60} color="#294996" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                <select className="mt-1 block pl-3 pr-10 py-2 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="">All</option>
                                    <option value="">Today</option>
                                    <option value="">This Week</option>
                                    <option value="">This Month</option>
                                </select>
                            </div>

                                {feedbacks.length > 0 ? (
                                    feedbacks.map((fb) => (
                                        <div key={fb.id} className="w-full p-5 my-5 border border-gray-200 rounded-lg shadow">
                                            <div className="flex justify-between">
                                                <div className="flex flex-row space-x-2">
                                                    <h3 className="mb-1 text-xl font-bold tracking-tight text-gray-700">{fb.user.name}</h3>
                                                </div>
                                                <div className="flex flex-row">
                                                    <AiTwotoneStar />
                                                    <AiTwotoneStar />
                                                    <AiTwotoneStar />
                                                    <AiTwotoneStar />
                                                    <AiTwotoneStar />
                                                </div>
                                            </div>
                                            <span className="font-normal text-lg text-gray-700">{fb.feedback_content}</span>
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
        </AdminLayout>
    );
}
