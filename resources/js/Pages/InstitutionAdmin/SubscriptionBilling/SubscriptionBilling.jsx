import DangerButton from '@/Components/DangerButton';
import FileUpload from '@/Components/FileUpload';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ViewCSV from './ViewCSV';

export default function InsAdminSubscriptionBilling({ auth, ins_sub }) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subscription and Billing</h2>}
        >
            <Head title="Subscription & Billing" />

            <div className="py-4 select-none">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-gray-700 text-3xl font-bold my-3">Subscription and Billing</div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 min-h-custom flex flex-col">
                        <div className="text-gray-700 text-3xl font-bold pb-2">Current Plan</div>
                        <div className="flex flex-row justify-between px-2">
                            <div className="flex flex-col">
                                <div className="text-gray-700 text-xl font-bold">{ins_sub.plan.plan_name}</div>
                                <div className="text-gray-600 text-base"><span className="font-bold">Date Started:</span>{ins_sub.start_date}</div>
                                <div className="text-gray-600 text-base"><span className="font-bold">Next Payment:</span> {ins_sub.end_date}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray-800 text-4xl font-bold">{ins_sub.plan.plan_price}</div>
                                <div className="text-gray-600 text-m font-bold pb-2 text-right">/{ins_sub.plan.plan_term}</div>
                            </div>
                        </div>
                        <div className="w-full border-1 border-gray-300 mt-8 mb-3"></div>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <div className="text-gray-700 text-xl font-bold">Institution Information</div>
                                <button className="text-blue-600 text-base hover:underline font-bold">Edit</button>
                            </div>
                            <div className="flex flex-col px-2">
                                <div className="text-gray-600 text-base">{ins_sub.university_branch.university.uni_name} {ins_sub.university_branch.uni_branch_name}</div>
                            </div>
                        </div>
                        <div className="w-full border-1 border-gray-300 mt-8 mb-3"></div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <div className="text-gray-700 text-xl font-bold">Access Information</div>
                                <a onClick={openModal} className="text-blue-600 text-sm font-bold hover:underline px-2">VIEW USER CSV</a>
                                <div className="text-gray-600 text-base px-2"><b>Number of User:</b> {ins_sub.insub_num_user}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray-700 text-xl font-bold">Billing Information</div>
                                <button className="text-blue-600 text-sm font-bold hover:underline px-2">View Transaction History</button>
                            </div>
                        </div>

                        <div className="flex flex-row justify-between mt-auto">
                            <button className="text-blue-600 font-bold hover:text-customBlue">View Agreement</button>
                            <div className="flex flex-row space-x-3">
                                <DangerButton>Cancel Subscription</DangerButton>
                                <PrimaryButton>Renew Subscription</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <ViewCSV isOpen={isModalOpen} onClose={closeModal} file={ins_sub.insub_content} ins_sub={ins_sub} />
        </AdminLayout>
    );
}
