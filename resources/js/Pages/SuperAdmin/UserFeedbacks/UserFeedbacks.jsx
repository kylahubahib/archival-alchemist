import { MdMessage } from "react-icons/md"; 
import { MdFeedback } from "react-icons/md"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Pagination from "@/Components/Pagination";
import StarRating from "@/Components/StarRating";
import { useEffect, useState } from "react";
import axios from "axios";
import { Progress, Select, SelectItem } from "@nextui-org/react";
import { dateFilters, ratingFilters } from "@/Components/data";

export default function UserFeedbacks({ auth, feedbacks, feedbackCount, averageRating, ratingCounts, AllRatingCount }) {
    const [filteredData, setFilteredData] = useState(feedbacks.data);
    const [filteredDate, setFilteredDate] = useState('All');
    const [filteredRating, setFilteredRating] = useState('All');

    useEffect(() => {
        fetchFilteredFeedbacks();
    }, [filteredRating, filteredDate]);

    const fetchFilteredFeedbacks = async () => {
        try {
            const response = await axios.get('/filter-feedbacks', {
                params: {
                    rating_value: filteredRating,
                    date_value: filteredDate,
                },
            });
            setFilteredData(response.data); 
        } catch (error) {
            console.error("Error fetching filtered reports:", error);
        }
    };

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

                <div className="flex flex-row space-x-4">
                    
                    <div className="w-1/3 space-y-4">
                        <div className="bg-white p-4 border rounded-lg shadow">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Total Feedbacks Received</div>
                            <div className="flex justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">{feedbackCount}</span>
                                <MdFeedback size={40} color="#294996" />
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 border rounded-lg shadow">
                            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">Average Ratings Received</div>
                            <div className="flex justify-between pt-2">
                                <span className="text-3xl text-gray-800 font-bold">{averageRating}</span>
                                <MdMessage size={40} color="#294996" />
                            </div>
                        </div>

                        <div>
                            <ul>
                            {Object.entries(ratingCounts).map(([rating, count]) => (
                                <li key={rating} className="flex items-center">
                                <span className=" w-16">{`${rating} star`} </span>
                                <Progress 
                                    aria-label="Loading..." 
                                    size="lg" 
                                    value={count} 
                                    maxValue={AllRatingCount}  
                                    classNames={{
                                        base: "max-w-md rounded-md overflow-hidden m-1",  
                                        track: "bg-white rounded-md",  
                                        indicator: "bg-yellow-300 rounded-sm",  
                                        label: "tracking-wider text-sm",
                                    }}
                                />

                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>


                    <div className="w-2/3 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-5">
                            <div className="flex justify-between mt-4 space-x-4">
                                <Select 
                                    label="Date Filter" 
                                    className="max-w-xs" 
                                    variant={'bordered'}
                                    selectedKeys={new Set([filteredDate])}
                                    onChange={(e) => setFilteredDate(e.target.value)}
                                >
                                    {dateFilters.map((date) => (
                                        <SelectItem key={date.key}>{date.label}</SelectItem>
                                    ))}
                                </Select>

                                <Select 
                                    label="Rating Filter" 
                                    className="max-w-xs" 
                                    variant={'bordered'}
                                    selectedKeys={new Set([filteredRating])}
                                    onChange={(e) => setFilteredRating(e.target.value)}
                                >
                                    {ratingFilters.map((rating) => (
                                        <SelectItem key={rating.key}>{rating.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="overflow-y-auto h-480 my-3">
                                {filteredData.length > 0 ? (
                                    filteredData.map((fb) => (
                                        <div key={fb.id} className="w-full p-3 my-3 border border-gray-200 rounded-lg shadow">
                                            <div className="flex justify-between">
                                                <div className="flex flex-row space-x-2 items-center">
                                                    <div className="relative items-center px-0 py-0 border border-transparent text-sm leading-4 font-medium rounded-full h-12 w-12 flex justify-center text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                                        <img src={fb.user.user_pic} className="w-full h-full rounded-full object-cover" />
                                                    </div>
                                                    <h3 className="mb-1 text-xl font-bold tracking-tight text-gray-700">{fb.user.name}</h3>
                                                </div>
                                                <div className="flex flex-row">
                                                    <StarRating interactive={false} initialRating={fb.feedback_rating} size={5} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="ml-14 font-normal text-lg text-gray-700">{fb.feedback_content}</span>
                                                <span className="ml-14 font-normal text-sm text-gray-600">Reviewed At: {fb.updated_at}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center m-5 overflow-hidden">
                                        <span className="px-6 py-4 text-center text-gray-600">No results found</span>
                                    </div>
                                )}
                            </div>

                            <div className="my-4">
                                <Pagination links={feedbacks.links} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
