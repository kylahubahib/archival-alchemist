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

export default function InsAdminSubscriptionBilling({ auth, ins_sub, transactionHistory, agreement }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [institutionalPlans, setInstitutionalPlans] = useState([]);
    const [planFeatures, setPlanFeatures] = useState([]);  formatPrice
    const [viewPlans, setViewPlans] = useState(null);
    const [transaction, setTransaction] = useState(null);

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
                    
                    // Redirect the user to PayMongo's checkout page
                    //window.location.href = response.data.checkout_url;
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

    // useEffect(() =>{
    //     console.log(transactionHistory[0]);
    //     console.log(agreement);
    // })

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
                                    <DangerButton>Cancel Subscription</DangerButton>
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
                                    <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionHistory.length > 0 ? (
                                    transactionHistory.map((data, index) => (
                                        <tr key={index} className="hover:bg-gray-50"> 
                                            <td className="px-6 py-4">{data.user.name}</td>
                                            <td className="px-6 py-4">{data.payment_method}</td>
                                            <td className="px-6 py-4">{data.plan.plan_name}</td>
                                            <td className="px-6 py-4">{data.trans_amount}</td>
                                            <td className="px-6 py-4">{data.created_at}</td>
                                            <td className="px-6 py-4">
                                                <button className=" text-customBlue" onClick={() => viewReceipt(data)}>View Receipt</button>
                                            </td>
                                            
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="m-3">
                        <div id="receipt" className="p-6 bg-white">
                            <h2 className="text-2xl font-bold text-center mb-4">Receipt</h2>
                            <p className="mb-2"><strong>Reference Number:</strong> {transaction.reference_number}</p>
                            <p className="mb-4"><strong>Transaction Date:</strong> {transaction.created_at}</p>
                            <p className="mb-2"><strong>Account Name:</strong> {transaction.user.name}</p>
                            <p className="mb-4"><strong>Payment Method:</strong> {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}</p>

                            <table className="min-w-full border-collapse border border-gray-300 mb-4">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 text-left">Plan Name</th>
                                        <th className="border border-gray-300 p-2 text-left">Amount</th>
                                        <th className="border border-gray-300 p-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-2">{transaction.plan.plan_name}</td>
                                        <td className="border border-gray-300 p-2">{formatPrice(transaction.trans_amount)}</td>
                                        <td className="border border-gray-300 p-2">{transaction.trans_status.charAt(0).toUpperCase() + transaction.trans_status.slice(1)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="font-semibold"><strong>Discount:</strong> {transaction.plan.plan_discount}</p>
                            <p className="font-semibold"><strong>Total Amount:</strong> {formatPrice(transaction.trans_amount)}</p>
                        </div>
                        <PrimaryButton onClick={downloadReceipt} className='ml-4'>Download Receipt</PrimaryButton>
                        <PrimaryButton onClick={returnToTransaction} className='ml-4'>Go Back</PrimaryButton>
                    </div>
                )
                }
                </div>
                
            </Modal>}

         

        </AdminLayout>
    );
}
