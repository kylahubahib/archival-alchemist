import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, useDisclosure } from '@nextui-org/react';

import BillingAgreement from './BillingAgreement';
import { useState } from 'react';
import { formatDate } from '@/Components/FormatDate';

export default function CustomMessages({ auth, billingAgreement }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        //console.log('ok')
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }


    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advanced</h2>}
        > 
            <Head title="Advanced" />

            <div className="py-8 select-none">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className=" space-x-4 pb-4">
                        <AdvancedMenu />
                    </div>

                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3">
                            <div className="text-gray-800 text-2xl font-bold">Custom Messages</div>
                            <div className="relative">
                                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="table-search-users" 
                                        className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                                        placeholder="Search" 
                                       
                                    />
                                </div>

                                
                        </div>
                       
                       <div className="pt-5 space-y-7">
                            {/* BILLING AGREEMENT */}
                            <Card className=" shadow-md">
                            <CardHeader className="flex gap-3">
                                <h2 className="text-lg font-medium text-gray-900">Billing Agreement</h2>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <p className="mt-1 text-medium text-gray-600">
                                This Billing Agreement is a binding contract between Archival Alchemist and any user or subscriber who 
                                enrolls in a subscription-based service offered.
                                </p>
                                <p className="mt-3 text-sm text-gray-600">Last Modified At: {formatDate(billingAgreement.updated_at)}</p>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <Button onClick={openModal} size='sm' variant='bordered' className=" border-customBlue text-customBlue">Edit Billing Agreement</Button>
                            </CardFooter>
                            </Card>    
                            
                            {/* PRIVACY POLICY */}
                            <Card className=" shadow-md">
                                <CardHeader className="flex gap-3">
                                    <h2 className="text-lg font-medium text-gray-900">Privacy Policy</h2>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p className="mt-1 text-medium text-gray-600">
                                        This Privacy Policy outlines how Archival Alchemist collects, uses, discloses, and protects personal information and archival data from users and subscribers while using our platform.
                                    </p>
                                    <p className="mt-3 text-sm text-gray-600">Last Modified At: {formatDate(billingAgreement.updated_at)}</p>
                                </CardBody>
                                <Divider/>
                                <CardFooter>
                                    <Button onClick={openModal} size='sm' variant='bordered' className=" border-customBlue text-customBlue">Edit Privacy Policy </Button>
                                </CardFooter>
                            </Card>

                            

                        </div>
                    </div>
                </div>
            </div>

            <BillingAgreement isOpen={isModalOpen} onClose={closeModal} billAgreement={billingAgreement} />
            </AdminLayout>
    );
}
