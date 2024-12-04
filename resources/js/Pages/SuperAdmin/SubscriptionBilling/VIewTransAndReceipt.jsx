import React, { useState, useEffect } from 'react';
import { Button, Link } from "@nextui-org/react";

import Modal from '@/Components/Modal';
import NoDataPrompt from '@/Components/Admin/NoDataPrompt';
import { capitalize } from '@/Utils/common-utils';
import { FaPhone } from 'react-icons/fa';
import { subISOWeekYears } from 'date-fns';
import { html2pdf } from 'html2pdf.js';

export default function View({ isOpen, onClose, subPlanName, subPlanTerm, personalSubscriber, insSubscriber, transaction, agreement, subscriptionType }) {

    const [navigationType, setNavigationType] = useState('history');
    const [refNumber, setRefNumber] = useState();
    const [transStatus, setTransStatus] = useState();

    console.log('transaction', transaction);
    console.log('agreement', agreement);

    // Clear the filter values when the modal is closed
    useEffect(() => {
        const counterModalAnimation = setTimeout(() => setNavigationType('history'), 300);

        return () => clearTimeout(counterModalAnimation);
    }, [isOpen]);

    const handleViewReceiptClick = (refNum, status) => {
        setNavigationType('receipt');
        setRefNumber(refNum);
        setTransStatus(status);
    }

    const handleDownloadReceiptClick = () => {
        const element = document.getElementById('receipt');
        html2pdf()
            .from(element)
            .save(`Receipt_${refNumber}.pdf`);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">

            <div className="flex bg-customBlue p-3">
                <h2 className="text-xl text-white inline-block font-bold tracking-widest">
                    {navigationType === 'history' && 'Transaction History'}
                    {navigationType === 'receipt' && 'Receipt'}
                    {navigationType === 'agreement' && 'Billing Agreement'}
                </h2>

                {/* Set view agreement visibility for intended view */}
                {(Array.isArray(transaction) && transaction.length > 0 && navigationType == 'history') && (
                    <Button className="ml-auto text-white" size="sm" variant="bordered" color="primary" onClick={() => setNavigationType('agreement')}>
                        View Billing Agreement
                    </Button>
                )}

            </div>

            <div className="p-4 overflow-y-auto">
                {navigationType === 'history' && (
                    Array.isArray(transaction) && transaction.length > 0 ? (
                        <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                            <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top">
                                <tr className="border border-gray">
                                    <th className="p-2 border border-gray">Transaction ID</th>
                                    <th className="p-2 border border-gray">Ref No</th>
                                    <th className="p-2 border border-gray">Amount</th>
                                    <th className="p-2 border border-gray">Method</th>
                                    <th className="p-2 border border-gray">Payment Date</th>
                                    <th className="p-2 border border-gray">Status</th>
                                    <th className="p-2 border border-gray">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.map((trans, index) => (
                                    <tr className="text-gray-400 border border-gray" key={index}>
                                        <td className="p-2 font-bold border border-gray">{trans.id}</td>
                                        <td className="p-2 border border-gray">{trans.reference_number}</td>
                                        <td className="p-2 border border-gray">{trans.trans_amount}</td>
                                        <td className="p-2 border border-gray">{capitalize(trans.payment_method)}</td>
                                        <td className="p-2 border border-gray">{trans.created_at}</td>
                                        <td className="p-2 border border-gray">{capitalize(trans.trans_status)}</td>
                                        <td className="p-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleViewReceiptClick(trans.reference_number, trans.trans_status)}
                                            >
                                                View Receipt
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) :
                        <>
                            <table className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide">
                                <thead className="text-xs sticky z-20 -top-[1px] pb-[20px] text-customGray uppercase align-top">
                                    <tr className="border border-gray">
                                        <th className="p-2 border border-gray">Transaction ID</th>
                                        <th className="p-2 border border-gray">Ref No</th>
                                        <th className="p-2 border border-gray">Amount</th>
                                        <th className="p-2 border border-gray">Method</th>
                                        <th className="p-2 border border-gray">Paid At</th>
                                        <th className="p-2 border border-gray">Status</th>
                                        <th className="p-2 border border-gray">Action</th>
                                    </tr>
                                </thead>
                            </table>
                            <NoDataPrompt />
                        </>
                )}

                {navigationType === 'receipt' && (
                    <div className="flex flex-col p-6 space-y-5 overflow-auto tracking-wide">
                        <Button className="mr-auto -mt-4" size="sm" variant="bordered" color="default" onClick={() => setNavigationType('history')}>
                            Back
                        </Button>
                        <div id="receipt">
                            <div className="flex justify-between">
                                <img src="/images/archival-alchemist-logo.png" className="h-20" alt="Archival Alchemist Logo" />
                                <p className="text-sm mt-2">
                                    M.J. Cuenco Ave, Cor R. Palma Street, 6000 Cebu<br />
                                    archival.alchemist@gmail.com<br />
                                    <FaPhone className="inline pr-2 flex-shrink-0 h-6 w-6" /> 0921231313
                                </p>
                            </div>
                            <hr className="h-1 mt-5 bg-slate-400" />
                            <div className="pt-5">
                                <p className="text-center font-bold tracking-widest text-lg">RECEIPT</p>
                                <div className="pt-10 flex">
                                    <div className="w-1/2">
                                        <p className="font-extrabold pb-2">INFO</p>
                                        <p><span className="font-semibold">Ref No:</span> {refNumber}</p>
                                        <p><span className="font-semibold">Plan:</span> {subPlanName}</p>
                                        <p><span className="font-semibold">Term:</span> {subPlanTerm}</p>
                                        <p><span className="font-semibold">Subscriber:</span> {subscriptionType === 'personal' ? personalSubscriber : insSubscriber}</p>
                                    </div>
                                    <div className="w-1/2">
                                        <p className="font-bold pb-2">STATUS</p>
                                        <p class="transform -rotate-12 text-center text-5xl font-bold">&#10524;{capitalize(transStatus)}&#10523;</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Button className="mt-12" color="primary" size="sm" onClick={handleDownloadReceiptClick}>Download</Button>
                    </div>
                )}

                {navigationType === 'agreement' && (
                    <div className="flex flex-col py-3 px-6 space-y-5 overflow-auto tracking-wide">
                        <Button className="mr-auto " size="sm" variant="bordered" color="default" onClick={() => setNavigationType('history')}>
                            Back
                        </Button>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pt-2">{agreement.content_text}</p>
                    </div>
                )}

            </div>
            <div className="bg-customBlue p-2 gap-2 flex justify-end">
                <Button color="default" size="sm" onClick={onClose}>Close</Button>

            </div>
        </Modal >
    );
}
