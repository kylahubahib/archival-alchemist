import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Divider, Skeleton, useDisclosure } from '@nextui-org/react';
import AffiliateUniversity from './AffiliateUniversity';
import html2pdf from 'html2pdf.js';
import { showToast } from '@/Components/Toast';
import { formatDate, formatPrice } from '@/utils';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InquiryForm from '@/Pages/InquiryForm';



export default function SubscriptionForm({user}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [transactionHistory, setTransactionHistory] = useState(null);
    const [agreement, setAgreement] = useState(null)
    const [personalSubscription, setPersonalSubscription] = useState(null);
    const [isAffiliated, setIsAffiliated] = useState(user.is_affiliated);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [formData, setFormData] = useState({
        message: '',
    });
    const [message, setMessage] = useState(null);
    const [personalPlans, setPersonalPlans] = useState([]);
    const [planFeatures, setPlanFeatures] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        axios.post('/send-to-email', formData);
    }

    useEffect(() => {
        console.log(personalPlans);
        console.log(planFeatures);
        console.log(isAffiliated);
        axios.get('/user-subscription')
        .then(response => {
            if(response.data.per_sub){
                setPersonalSubscription(response.data.per_sub);
                setTransactionHistory(response.data.transactionHistory);
                setAgreement(response.data.agreement);
            } else {
                setPersonalSubscription(null);
                setAgreement(response.data.agreement);
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching subscription:', error);
        });
    }, [personalPlans, planFeatures, isAffiliated]);

    // useEffect(() => {
    //     console.log('Updated personalSubscription:', personalSubscription);
    // }, [personalSubscription]);

    const removeAffiliation = () => {
        setLoading(true);
        axios.post('/remove-affiliation')
        .then(response => {
            setIsAffiliated(response.data.is_affiliated);
            setLoading(false);
        });
    };

    const handleCheckout = async (planId) => {

        try {
            const response = await axios.post('/payment', { plan_id: planId });

            if (response.data.checkout_url) {

                // Redirect the user to PayMongo's checkout page
                window.location.href = response.data.checkout_url;
            }
        } catch (err) {
            console.error("Checkout session failed:", err);
            setError("Failed to create checkout session. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleRenewal = async (id) => {

        const currentDate = new Date();
        const subscriptionEndDate = new Date(personalSubscription.end_date);
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

    const downloadReceipt = () => {
        const element = document.getElementById('receipt');
        html2pdf()
            .from(element)
            .save(`Receipt_${transaction.reference_number}.pdf`);
    };

    const viewPlanList = async () => {

        try {
            const response = await axios.get('/get-plans');

            if (response.data) {
                console.log(response.data.personalPlans);
                setPersonalPlans(response.data.personalPlans);
                setPlanFeatures(response.data.planFeatures);
                setModalContent('pricing-list');
                setIsModalOpen(true);
            } else {
                console.error('No data returned');
            }
        } catch (error) {
            console.error('Error fetching plans:', error.response ? error.response.data : error);
        }
    };

    const getFeaturesByPlanId = (planId) => {
        return planFeatures
            .filter(planFeature => planFeature.plan.id === planId)
            .map(planFeature => planFeature.feature.feature_name);
    };

    const cancelSubscription = () => {
        console.log('ok');
        // axios.post('/cancel-subscription', {id: ins_sub.id})
        // .then(response => {
        //     setMessage(response.data.message);
        //     setTimeout(() => {
        //         closeModal();
        //         setMessage(null);
        //     }, 2000);
        // });
    }



    if (loading) return (
        <div className="space-y-3">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Subscription Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Manage the subscription and billing of your account
                </p>
            </header>
            <Skeleton className=" h-7 w-28 rounded-lg"/>
            <Skeleton className="h-3 w-40 rounded-lg"/>
            <Skeleton className="h-3 w-3/5 rounded-lg"/>
        </div>
    );

    return (
        <section className="space-y-3">
            <header className="flex  justify-between">
                <div>
                <h2 className="text-lg font-medium text-gray-900">Subscription Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Manage the subscription and billing of your account
                </p>
                </div>
                <div>
                    <button className="text-blue-600 text-sm  hover:text-customBlue" onClick={() => {openModal('agreement')}}>View Agreement</button>
                </div>
                {/* <div>
                    <button className="text-blue-600 text-sm  hover:text-customBlue" onClick={() => {openModal('inquiry')}}>Inquire</button>
                </div> */}
            </header>

            {personalSubscription ? (
                <>
                    <div className="flex justify-between">
                        <div className="text-gray-700 text-2xl font-bold">{personalSubscription.plan.plan_name}</div>
                        <Button radius="large" variant='bordered' size='sm' onClick={() => {openModal('transaction')}}>
                            View Transaction
                        </Button>
                    </div>
                    <div className="text-gray-600 text-base">
                        <span className="font-bold">Subscription expires at: </span> {formatDate(personalSubscription.end_date)}
                    </div>
                    <div className="flex space-x-3 justify-between">
                        <div className=" space-x-3">
                        <Button radius="large" variant='bordered' size='sm' className="border-customBlue text-customBlue shadow"
                         onClick={() => handleRenewal(personalSubscription.plan_id)} >
                            Renew Subscription
                        </Button>
                        <Button onClick={() => {openModal('popup')}} radius="large" variant='bordered' size='sm' className=" border-red-500 text-red-500 shadow">
                            Cancel Subscription
                        </Button>
                        </div>

                    </div>
                </>
            ) : (
                <>
                    {isAffiliated === 0 ? (
                        <>
                            <div className="text-gray-900">You are currently in the free plan.</div>
                            <div className="flex space-x-3">
                                <Button radius="large" variant='bordered' size='sm' className="border-customBlue text-customBlue shadow" onClick={viewPlanList}>
                                    Upgrade to Premium
                                </Button>

                                <Button radius="large" variant='bordered' size='sm' className=" border-blue-400 text-blue-400 shadow" onPress={onOpen}>
                                    Affiliate a university
                                </Button>

                                <AffiliateUniversity isOpen={isOpen} onOpenChange={onOpenChange} setIsAffiliated={setIsAffiliated}/>
                            </div>
                        </>
                    ) : (
                        <div className=" flex justify-between">
                            <div className="text-gray-900">You are currently affiliated with a university.</div>
                            <Button radius="large" variant='bordered' size='sm' className=" border-red-400 text-red-400 shadow" onClick={removeAffiliation}>
                                Remove Affiliation
                            </Button>
                        </div>
                    )}
                </>
            )}

             {/* Billing Agreement Modal */}
             {modalContent == 'agreement' &&
            <Modal show={isModalOpen} onClose={closeModal} maxWidth='2xl'>
                <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{agreement.content_title || ''}</h2>
                    <Divider/>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pt-2">{agreement.content_text || ''}</p>
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
                                                <button className="text-blue-600 text-sm font-semibold hover:underline cursor-pointer" onClick={() => viewReceipt(data)}>View Receipt</button>
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
                    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                        <div id="receipt" className="p-10">
                        <h2 className="text-2xl font-bold text-center mb-5">Subscription Receipt</h2>
                        <Divider  className="my-6" />
                        <div className="flex justify-between">
                            <div>
                                <div className="text-xl font-bold">Personal Subscription</div>
                                <div className="text-gray-500">{user.name}</div>
                                <div className="text-gray-500">{user.email}</div>
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

                )
                }
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

            {/* Choose subscription plan */}
            {modalContent == 'pricing-list' &&
                <Modal show={isModalOpen} onClose={closeModal} maxWidth="5xl">
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg relative">
        {/* Close Button */}
        <button
            onClick={closeModal}
            type="button"
            className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
        >
            <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
            </svg>
            <span className="sr-only">Close modal</span>
        </button>

        <div className="lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0 justify-center mt-8">
            {personalPlans.map((plan) => (
                <div
                    key={plan.id}
                    className={`flex flex-col p-6 mx-auto min-w-80 max-w-md text-center text-gray-900 bg-white rounded-lg border border-gray-100 cursor-pointer shadow`}>
                    <h3 className="mb-4 text-xl font-semibold">{plan.plan_name}</h3>

                    <p className="font-light text-gray-500 sm:text-md">
                        {plan.plan_text}
                    </p>

                    <div className="flex justify-center items-baseline my-8">
                        <span className="mr-2 text-2xl font-bold">
                            ₱ {formatPrice(plan.plan_price)}
                        </span>
                        <span className="text-gray-500">{plan.plan_term}</span>
                    </div>

                    {/* Plan Features */}
                    <ul role="list" className="mb-8 space-y-2 text-left">
                        {getFeaturesByPlanId(plan.id).map((featureName, index) => (
                            <li key={index} className="flex items-center">
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="text-sm font-normal leading-tight text-gray-500 ml-3">
                                    {featureName}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Subscribe Button */}
                    <div className="mt-auto">
                        <button
                            className={`w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleCheckout(plan.id)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Subscribe Now'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
</Modal>
            }

            {modalContent == 'inquiry' &&  <InquiryForm isOpen={isModalOpen} onClose={closeModal} />}





        </section>
    );
}
