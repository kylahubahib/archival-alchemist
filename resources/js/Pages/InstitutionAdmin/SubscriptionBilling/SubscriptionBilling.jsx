import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, React } from 'react';
import ViewCSV from './ViewCSV';
import axios from 'axios';
import SubscriptionPlansList from './SubscriptionPlansList';
import Modal from '@/Components/Modal';
import { Divider } from '@nextui-org/react';
import html2pdf from 'html2pdf.js';
import { showToast } from '@/Components/Toast';
import { formatDate, formatPrice } from '@/utils';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function InsAdminSubscriptionBilling({ auth, ins_sub, transactionHistory, agreement }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [institutionalPlans, setInstitutionalPlans] = useState([]);
    const [planFeatures, setPlanFeatures] = useState([]); 
    const [viewPlans, setViewPlans] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [message, setMessage] = useState(null);

    const handleRenewal = async (id) => {

        const currentDate = new Date();
        const subscriptionEndDate = new Date(ins_sub.end_date); 
        console.log(currentDate, ' and ', subscriptionEndDate  );
      
        if(currentDate < subscriptionEndDate){
            console.log('You still have an active subscription');
            showToast('success', 'You still have an active subscription!');
        }
        else
        {
            try {
                const response = await axios.post('/payment', { plan_id: id });
    
                if (response.data.checkout_url) {
                    window.open(response.data.checkout_url, '_blank');
                }
            } catch (err) {
                console.error("Checkout session failed:", err);
                setError("Failed to create checkout session. Please try again.");
            } 
        }
    }

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    } 

    const closeModal = () => {
        setModalContent(null);
        setIsModalOpen(false);
        setTransaction(null);
    }

    const returnToTransaction = () => {
        setTransaction(null)
    }

    const viewReceipt = (data) => {
        setTransaction(data);
    }

    const cancelSubscription = () => {
        axios.post('/cancel-subscription', {id: ins_sub.id})
        .then(response => {
            setMessage(response.data.message);
            setTimeout(() => {
                closeModal();
                setMessage(null);
            }, 2000);   
        });
    }

    const viewPlanList = async () => {
        try {
            const response = await axios.get('/institution/get-plans');

            if (response.data) {
                setInstitutionalPlans(response.data.institutionalPlans);
                setPlanFeatures(response.data.planFeatures);
                setViewPlans(true);
            } else {
                console.error('No data returned');
            }
        } catch (error) {
            console.error('Error fetching plans:', error.response ? error.response.data : error);
        }
    };

    

    const downloadReceipt = () => {
        console.log('download')
        const element = document.getElementById('receipt');
        html2pdf()
            .from(element)
            .save(`Receipt_${transaction.reference_number}.pdf`);
    };

    
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Subscription and Billing</h2>}
        >
            <Head title="Subscription & Billing" />

            {!viewPlans ? (
            <div className="py-4 select-none">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="text-gray-700 text-3xl font-bold my-3">Subscription and Billing</div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 min-h-custom flex flex-col">
                        <div className="text-gray-700 text-3xl font-bold pb-2">Current Plan</div>
                        <div className="flex flex-row justify-between px-2">
                            <div className="flex flex-col">
                                <div className="text-gray-700 text-xl font-bold">{ins_sub.plan.plan_name}</div>
                                <div className="text-gray-600 text-base mt-3"><span className="font-bold">Your next bill is on</span> {formatDate(ins_sub.end_date)}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray-800 text-4xl font-bold">{formatPrice(ins_sub.plan.plan_price)}</div>
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
                                <a onClick={() => {openModal('csv')}} className="text-blue-600 text-sm font-bold hover:underline px-2 cursor-pointer">VIEW USER CSV</a>
                                <div className="text-gray-600 text-base px-2"><b>Number of User:</b> {ins_sub.insub_num_user}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray-700 text-xl font-bold">Billing Information</div>
                                <button className="text-blue-600 text-sm font-bold hover:underline px-2" onClick={() => {openModal('transaction')}}>View Transaction History</button>
                            </div>
                        </div>

                        <div className="flex flex-row justify-between mt-auto">
                            <div className="flex flex-row space-x-3">
                                { ins_sub.plan_id != 6 ? (
                                    <>
                                    <PrimaryButton onClick={() => handleRenewal(ins_sub.plan_id)}>Renew Subscription</PrimaryButton>
                                    <DangerButton onClick={() => {openModal('popup')}}>Cancel Subscription</DangerButton>
                                    </>
                                    ) : (
                                        <>
                                            <PrimaryButton onClick={viewPlanList}>UPGRADE TO PREMIUM PLANS</PrimaryButton>
                                        </>
                                    )
                                }
                            </div>
                            <button className="text-blue-600 font-bold hover:text-customBlue" onClick={() => {openModal('agreement')}}>View Agreement</button>
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <SubscriptionPlansList plans={institutionalPlans} planFeatures={planFeatures}/>
            )
            }

            {modalContent == 'csv' && <ViewCSV isOpen={isModalOpen} onClose={closeModal} file={ins_sub.insub_content} ins_sub={ins_sub} />}
            
            {/* Billing Agreement Modal */}
            {modalContent == 'agreement' &&
            <Modal show={isModalOpen} onClose={closeModal} maxWidth='2xl'>
                <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{agreement.content_title}</h2>
                    <Divider/>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pt-2">{agreement.content_text}</p>
                </div>
            </Modal>}

            {/* Transaction History Modal */}
            {modalContent == 'transaction' &&
            <Modal show={isModalOpen} onClose={closeModal} maxWidth='4xl'>
                <div>
                {!transaction ? (
                    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 select-none">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Account Name</th>
                                    <th scope="col" className="px-6 py-3">Payment Method</th>
                                    <th scope="col" className="px-6 py-3">Plan Name</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Paid At</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionHistory.map((trans) => (
                                    <tr key={trans.id} className="bg-white border-b hover:bg-gray-100">
                                        <td className="px-6 py-3">{auth.user.name}</td>
                                        <td className="px-6 py-3">{trans.payment_method}</td>
                                        <td className="px-6 py-3">{trans.plan.plan_name}</td>
                                        <td className="px-6 py-3">{formatPrice(trans.trans_amount)}</td>
                                        <td className="px-6 py-3">{formatDate(trans.created_at)}</td>
                                        <td className="px-6 py-3">
                                            <button className="text-blue-600 text-sm font-bold hover:underline cursor-pointer" onClick={() => viewReceipt(trans)}>View Receipt</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                        <div id="receipt" className="p-10">
                        <h2 className="text-2xl font-bold text-center mb-5">Subscription Receipt</h2>
                        <Divider  className="my-6" />
                        <div className="flex justify-between">
                            <div>
                                <div className="text-xl font-bold">Institution Subscription</div>
                                <div className="text-gray-500">{auth.user.name}</div>
                                <div className="text-gray-500">{auth.user.email}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold">Amount Paid</div>
                                <div className="text-3xl text-green-600">{formatPrice(transaction.trans_amount)}</div>
                            </div>
                        </div>
                        <Divider className="my-6" />
                        <div className="text-gray-600">
                            <div><strong>Plan:</strong> {transaction.plan.plan_name}</div>
                            <div><strong>Reference Number:</strong> {transaction.reference_number}</div>
                            <div><strong>Paid At:</strong> {formatDate(transaction.created_at)}</div>
                        </div>
                        </div>
                        <Divider className="my-6" />
                        <div className="text-center">
                            <PrimaryButton onClick={downloadReceipt} className="mx-auto">Download Receipt</PrimaryButton>
                            <button className="text-blue-600 font-bold ml-4" onClick={returnToTransaction}>Back to Transactions</button>
                        </div>
                    </div>
                )}
                </div>
            </Modal>}
            
            {/* Cancel Subscription Confirmation */}
            {modalContent == 'popup' &&
            <Modal show={isModalOpen} onClose={closeModal} maxWidth='lg'>
                <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                <button onClick={closeModal} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    
                    <h3 className="my-5 text-lg  text-gray-700 font-semibold dark:text-gray-600">Are you sure you want to proceed?</h3>
                    
                    <p className="mb-5 text-md font-normal text-gray-500 dark:text-gray-600">
                        You are about to cancel your subscription. Since it is non-recurring, you will no longer receive expiration notifications. 
                    </p>

                    {!message ? (
                        <>
                        <div className="flex justify-center">
                            <button onClick={cancelSubscription} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5">
                                Yes, I'm sure
                            </button>
                            <button onClick={closeModal} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                No, cancel
                            </button>
                        </div>
                        </>
                    ) : (
                        <>
                        <h3 className="my-5 text-lg text-green-500 font-medium dark:text-gray-600">{message}</h3>
                        </>
                    )}
                    
                </div>
                </div>
            </Modal>}

        </AdminLayout>
    );
}
