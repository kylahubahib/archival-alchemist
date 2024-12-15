import React, { useState, useEffect } from 'react';
import { Button, DateRangePicker, Skeleton } from "@nextui-org/react";
import { FaFilter } from 'react-icons/fa';
import { FaFileLines, FaXmark } from 'react-icons/fa6';
import Modal from '@/Components/Modal';
import axios from 'axios';
import SearchBar from '@/Components/Admin/SearchBar';
import NoDataPrompt from '@/Components/Admin/NoDataPrompt';
import TableSkeleton from '@/Components/Admin/TableSkeleton';
import { renderTableHeaders } from './Users';

export default function Logs({ userId, name, isOpen, onClose }) {
    const [userLogs, setUserLogs] = useState([]);
    const [hasFilteredData, setHasFilteredData] = useState(false);
    const [searchActivity, setSearchActivity] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [date, setDate] = useState({
        start: null,
        end: null,
    });

    const tableHeaders = {
        'logs': ['Activity', 'Description', 'Date'],
    };

    // Fetch the logs for a specific user by their ID 
    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        fetchFilteredData();
    }, [searchActivity.trim()]);



    // Clear the filter values when the modal is closed
    useEffect(() => {
        const counterModalAnimation = setTimeout(() => {
            setDate(null);
            setSearchActivity('');
            setUserLogs([]);
        }, 300)

        return () => clearTimeout(counterModalAnimation);

    }, [onClose]);

    const fetchData = async () => {
        setIsDataLoading(true);

        try {
            const response = await axios.get(route('users.logs'), {
                params: {
                    user_id: userId,
                },
            });

            setUserLogs(response.data);
        } catch (error) {
            console.error("There was an error fetching the data", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    const fetchFilteredData = async () => {
        setIsDataLoading(true);

        try {
            const response = await axios.get(route('users.logs'), {
                params: {
                    search_activity: searchActivity.trim(),
                    start_date: date?.start
                        ? `${date.start.year}-${date.start.month}-${date.start.day} ${date.start.hour}:${date.start.minute}:00`
                        : null,
                    end_date: date?.end
                        ? `${date.end.year}-${date.end.month}-${date.end.day} ${date.end.hour}:${date.end.minute}:00`
                        : null,
                }
            })

            response.data.length > 0 ? setHasFilteredData(true) : setHasFilteredData(false);
        } catch (error) {
            console.error("There was an error fetching the data", error);
        } finally {
            setIsDataLoading(false);
        }
    }

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="flex justify-between bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    <strong>{name}'s</strong>  Logs
                </h2>
                <Button isIconOnly radius="full" color="default" size="sm" onClick={onClose}><FaXmark /></Button>
            </div>

            <form>
                <div className="flex flex-col p-6 space-y-5 overflow-auto tracking-wide">
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
                                    isDataLoading
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
                        {!isDataLoading ? (
                            userLogs?.data?.length > 0 ? (
                                <table className="w-full table-auto relative text-xs text-left text-customGray tracking-wide border-1">
                                    <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray bg-gray-300 uppercase align-top">
                                        <tr>
                                            <th className="p-2">Activity</th>
                                            <th className="p-2">Content</th>
                                            <th className="p-2">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userLogs.data.map((log) => (
                                            <tr className="text-gray-400 border-t-1 border-gray" key={log.log_id}>
                                                <td className="p-2 font-bold">{log.log_activity}</td>
                                                <td className="p-2">
                                                    <p dangerouslySetInnerHTML={{ __html: log.log_activity_content }}></p>
                                                </td>
                                                <td className="p-2">{log.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) :
                                <>
                                    <div className="border-1">
                                        <table className="w-full border-1">
                                            {renderTableHeaders(tableHeaders, 'logs')}
                                        </table>
                                        <NoDataPrompt type={hasFilteredData ? '' : 'filter'} />
                                    </div>
                                </>

                        ) :
                            <TableSkeleton tableHeaders={tableHeaders} tableHeaderType="logs" thClassName='bg-gray-300  ' />
                        }
                    </div>
                </div>
            </form >
        </Modal >
    );
}
