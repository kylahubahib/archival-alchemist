import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import { CgArrowsExchangeAltV } from "react-icons/cg"; 
import { router } from '@inertiajs/react';

export default function Show({ isOpen, onClose, subscriptionPlans, planFeatures }) {
    if (!subscriptionPlans) return null;

    
    const changeStatus = (id) => {
        router.put(route('manage-subscription-plans.change_status', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.error('Update failed', errors);
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth='5xl'>
            <div className="bg-customBlue p-3 text-white flex justify-between">
                <h2 className="text-xl text-white font-bold">View Subscription Plan</h2>
                <div className="flex items-center space-x-2">
                    <span>Status: <b>{subscriptionPlans.plan_status.toUpperCase()}</b></span>
                    <button onClick={() => {changeStatus(subscriptionPlans.id)}} title="Change status" className="focus:outline-none">
                    <CgArrowsExchangeAltV size={25} />
                    </button>
                </div>

            </div>

            <div className="p-6 space-y-5">
                <div className="flex flex-row space-x-8">
                    <div className='space-y-5 w-full'>
                        <div className="flex flex-row space-x-10">
                            <div className="flex flex-col">
                                <InputLabel value="Plan Name" />
                                <div className="mt-1 block w-full">
                                    {subscriptionPlans.plan_name}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <InputLabel value="Plan Type" />
                                <div className="mt-1 block w-full">
                                    {subscriptionPlans.plan_type}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <InputLabel value="Plan Description" />
                            <div className="mt-1 block w-full max-h-44">
                                {subscriptionPlans.plan_text}
                            </div>
                        </div>

                        <div className="flex flex-row space-x-10">
                            <div className="flex flex-col">
                                <InputLabel value="Plan Term" />
                                <div className="mt-1 block w-full">
                                    {subscriptionPlans.plan_term}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <InputLabel value="Plan Price" />
                                <div className="mt-1 block w-full">
                                    {subscriptionPlans.plan_price}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row space-x-10">
                            <div className="flex flex-col">
                                <InputLabel value="Default Number of Users (if applicable)" />
                                <div className="mt-1 block w-full">
                                     {subscriptionPlans.plan_user_num !== null ? subscriptionPlans.plan_user_num : 0}
                                </div>
                            </div>
                        </div>

                         <div className="flex flex-row space-x-10">
                            <div className="flex flex-col">
                                <InputLabel value="Number of days for free trial (if applicable)" />
                               <div className="mt-1 block w-full">
                                    {subscriptionPlans.free_trial_days !== null ? subscriptionPlans.free_trial_days : 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col border border-gray-300 p-4 rounded-md shadow-sm space-y-2 w-full">
                        <InputLabel value="Included Features" />
                        <ul role="list" className="mb-8 space-y-3 text-left">
                            {planFeatures && planFeatures.length > 0 ? (
                                planFeatures.map((featureName, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="text-base font-normal leading-tight text-gray-500 ml-3">
                                            {index + 1}. {featureName}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="flex items-center">
                                    <span className="text-base font-normal leading-tight text-gray-500 ml-3">
                                        No features available
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-customBlue p-2 flex justify-end">
                <button onClick={onClose} className="text-white text-right mr-5">Close</button>
            </div>
        </Modal>
    );
}
