import { Link } from '@inertiajs/inertia-react';
import { Divider, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';

export default function SuperAdminNotification({}) {
    const [notificationData, setNotificationData] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        const channel = window.Echo.channel('superadmin-notifications');
        channel.listen('.notification', (data) => {
            //setNotificationData((prev) => [...prev, data]);
            setNotifying(true);
        });
    }, []);

    const handleClick = () => {
        if (!dropdownOpen) {
            setLoading(true); 

            axios.get('/get-notifications')
                .then(response => {
                    setNotificationData(response.data.notificationData);
                    setLoading(false); 
                    setNotifying(false); 

                    axios.post('/mark-as-read');
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false); 
                });
        }

        setDropdownOpen(!dropdownOpen); 
    };

    const clearNotifications = () => {
        axios.post('/clear-notifications').then(response => {
            setNotificationData([]);
        })
        .catch(error => {
            console.error(error);
        });
    }

    // const markAsRead = () => {
    //     axios.post('/mark-as-read').then(response => {
            
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // }

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
                {notifying && (
                    <span className="absolute -top-0.5 right-1 z-1 h-2 w-2 rounded-full bg-meta-1">
                        <span className="absolute -z-1 inline-flex h-full w-full bg-red-500 rounded-full opacity-75"></span>
                    </span>
                )}

                <svg
                    className="fill-current duration-300 ease-in-out"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="currentColor" // Ensure this changes based on the current color
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
                    />
                </svg>
            </button>

            {dropdownOpen && (
                <div 
                    className="absolute -right-[108px] mt-2.5 flex max-h-[550px] min-w-[450px] flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-[320px]"
                >
                    <div className="px-8 pr-8 py-3 flex justify-between">
                        <h5 className="text-sm font-medium text-bodydark2">
                            Notification
                        </h5>
                        {/* <button onClick={markAsRead} className={`text-sm font-medium text-gray-500 hover:text-blue-500}`}>
                            Mark All As Read
                        </button> */}
                    </div>

                    {loading ? (
                        <>
                            <Divider />
                            <div className="text-gray-500 flex justify-center py-3">
                                <Spinner size='sm'/>
                            </div>
                        </>
                    ) : (
                        <ul className="flex h-auto flex-col  overflow-y-auto">
                            {notificationData.length > 0 ? (
                                notificationData.map((notif, index) => (
                                    <li key={index}>
                                        <div
                                            className={`flex px-5 flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4
                                            ${notif.read_at == null ? ' bg-gray-100' : 'bg-white'}`}
                                           >
                                            <p className="text-sm">
                                                <span className="text-black dark:text-white">
                                                    {notif.data.message}
                                                </span>
                                            </p>
                                            <p className="text-xs">{notif.created_at}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <Divider />
                                    <div className="text-gray-500 flex justify-center py-3">
                                        No notification yet.
                                    </div>
                                </>
                            )}
                        </ul>
                    )}

                    <div className="px-4.5">
                        <Divider/>
                        <button onClick={clearNotifications} disabled={notificationData ? true : false}  className={`text-sm font-medium p-2 ${!notificationData ? 'text-red-400 mt-2 hover:text-red-500' : 'text-gray-400'}`}>
                            Clear Notifications
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
