import React, { useState, useEffect } from 'react';
import { Button, DateRangePicker, Skeleton } from "@nextui-org/react";
import { FaFilter } from 'react-icons/fa';
import { FaFileLines, FaXmark } from 'react-icons/fa6';
import Modal from '@/Components/Modal';
import axios from 'axios';
import SearchBar from '@/Components/Admin/SearchBar';
import NoDataPrompt from '@/Components/Admin/NoDataPrompt';

export default function Logs({ userId, username, isOpen, onClose }) {
    const [userLogs, setUserLogs] = useState([]);
    // const [userLogsToRender, setUserLogsToRender] = useState([]);
    const [searchActivity, setSearchActivity] = useState('');
    const [date, setDate] = useState({
        start: null,
        end: null,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("date", date);
        console.log("userLogs", userLogs);
    },)

    // Fetches the logs for a specific user by their ID and by all the filters
    useEffect(() => {
        setIsLoading(true);

        const debounce = setTimeout(() => {
            if (userId !== null) fetchData();
        }, 300);

        return () => clearTimeout(debounce);
    }, [userId, searchActivity, date]);


    // Clear the filter values when the modal is closed
    useEffect(() => {
        const counterModalAnimation = setTimeout(() => {
            setDate(null);
            setSearchActivity('');
        }, 300)

        return () => clearTimeout(counterModalAnimation);

    }, [!isOpen]);


    const fetchData = async () => {
        if (!userId) {
            console.error("userId is missing");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(route('users.logs'), {
                params: {
                    user_id: userId,
                    search_activity: searchActivity.trim(),
                    start_date: date?.start
                        ? `${date.start.year}-${date.start.month}-${date.start.day} ${date.start.hour}:${date.start.minute}:00`
                        : null,
                    end_date: date?.end
                        ? `${date.end.year}-${date.end.month}-${date.end.day} ${date.end.hour}:${date.end.minute}:00`
                        : null,
                },
            });

            setUserLogs(response.data);
        } catch (error) {
            console.error("There was an error fetching the data", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="3xl">
            <div className="bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    Logs
                </h2>
            </div>

            <form>
                <div className="flex flex-col p-6 space-y-5 overflow-auto tracking-wide">
                    <label className="text-customGray text-center -mb-3 -mt-3"><strong>{username}'s</strong> Logs</label>
                    <div className="TableControlsContainer flex gap-0 h-full md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
                        <SearchBar
                            name="searchName"
                            classNames={{
                                inputWrapper: "border-none"
                            }}
                            value={searchActivity}
                            placeholder="Search by activity..."
                            isDisabled={userLogs.length === 0 && !searchActivity}
                            onChange={(e) => setSearchActivity(e.target.value)}
                        />
                        <div className="flex gap-1">
                            <DateRangePicker
                                aria-label="Date filter"
                                radius="sm"
                                className="max-w-xl !text-white"
                                isDisabled={
                                    (userLogs.length === 0 && !searchActivity) ||
                                    (userLogs.length === 0 && searchActivity) ||
                                    isLoading
                                }
                                startContent={<FaFilter size={33} />}
                                granularity="minute"
                                hideTimeZone
                                visibleMonths={2}
                                value={date}
                                onChange={setDate}
                            />
                            {date &&
                                <FaXmark
                                    size={33}
                                    className="h-full hover:bg-gray-400 cursor-pointer rounded-md px-2 text-gray-500 transition duration-200"
                                    onClick={() => setDate(null)}
                                />
                            }
                        </div>

                    </div>
                    <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] xl:max-h-[800px]">
                        {!isLoading ? (
                            userLogs.length > 0 ? (
                                <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                    <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top">
                                        <tr className="border border-gray">
                                            <th className="p-2 border border-gray">Activity</th>
                                            <th className="p-2 border border-gray">Content</th>
                                            <th className="p-2 border border-gray">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userLogs.map((log) => (
                                            <tr className="text-gray-400 border border-gray" key={log.log_id}>
                                                <td className="p-2 font-bold border border-gray">{log.log_activity}</td>
                                                <td className="p-2 border border-gray">{log.log_activity_content}</td>
                                                <td className="p-2 border border-gray">{log.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) :
                                <>
                                    <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                        <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top">
                                            <tr className="border border-gray">
                                                <th className="p-2 border border-gray">Activity</th>
                                                <th className="p-2 border border-gray">Content</th>
                                                <th className="p-2 border border-gray">Date</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <NoDataPrompt />
                                </>

                        ) :
                            <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top">
                                    <tr className="border border-gray">
                                        <th className="p-2 border border-gray"><Skeleton className="h-4 w-full rounded-lg" /></th>
                                        <th className="p-2 border border-gray"><Skeleton className="h-4 w-full rounded-lg" /></th>
                                        <th className="p-2 border border-gray"><Skeleton className="h-4 w-full rounded-lg" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-gray-400 border border-gray">
                                        <td className="p-2 font-bold border border-gray"><Skeleton className="h-3 w-full rounded-lg" /></td>
                                        <td className="p-2 border border-gray"><Skeleton className="h-3 w-full rounded-lg" /></td>
                                        <td className="p-2 border border-gray"><Skeleton className="h-3 w-full rounded-lg" /></td>
                                    </tr>
                                </tbody>
                            </table>}
                    </div>
                </div>
            </form >

            <div className="bg-customBlue p-2 gap-2 flex justify-end">
                <Button color="default" size="sm" onClick={onClose}>Close</Button>
            </div>
        </Modal >
    );
}
