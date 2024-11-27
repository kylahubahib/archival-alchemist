import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AdvancedMenu from "../AdvancedMenu";
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, useDisclosure } from '@nextui-org/react';

import { useState } from 'react';
import { formatDate } from '@/Components/FormatDate';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import TeamSection from './TeamSection';

export default function CustomMessages({ auth, billingAgreement, hero, services, team }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState('');

    const openModal = (data) => {
        //console.log('ok')
        setType(data);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setType('');
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
                        <div className="space-y-5">
                            <div className="flex flex-row justify-between">
                                <div className="text-gray-800 text-2xl font-bold">Landing Page</div>
                            </div>

                            <Card className=" shadow-md">
                            <CardHeader className="flex gap-3">
                                <h2 className="text-lg font-medium text-gray-900">Hero Section</h2>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <p className="mt-1 text-medium text-gray-600">
                                The hero section of the page introduces Archival Alchemist as a transformative platform. It highlights the mission of turning capstone projects into discoverable knowledge, making it a hub for creativity, innovation, and collaboration. Users are invited to explore and participate in a community where sharing and discovering projects is seamless and intuitive.
                                </p>
                                <p className="mt-3 text-sm text-gray-600">Last Modified At: {formatDate(billingAgreement.updated_at)}</p>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <Button onClick={() => {openModal('hero')}} size='sm' variant='bordered' className=" border-customBlue text-customBlue">Edit Hero Section</Button>
                            </CardFooter>
                            </Card>

                            <Card className=" shadow-md">
                            <CardHeader className="flex gap-3">
                                <h2 className="text-lg font-medium text-gray-900">Services Section</h2>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <p className="mt-1 text-medium text-gray-600">
                                In this section, we showcase the core services Archival Alchemist offers. It outlines how users can upload their own work, explore a diverse range of projects across different fields, and connect with peers. The platform's features are designed to facilitate collaboration, learning, and networking, helping individuals unlock their potential and foster creative and academic growth.
                                </p>
                                <p className="mt-3 text-sm text-gray-600">Last Modified At: {formatDate(billingAgreement.updated_at)}</p>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <Button onClick={() => {openModal('services')}} size='sm' variant='bordered' className=" border-customBlue text-customBlue">Edit Services Section</Button>
                            </CardFooter>
                            </Card>

                            <Card className=" shadow-md">
                            <CardHeader className="flex gap-3">
                                <h2 className="text-lg font-medium text-gray-900">Team Section</h2>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <p className="mt-1 text-medium text-gray-600">
                                This section introduces the team behind Archival Alchemist. It provides a glimpse into the people who are driving the platform’s vision of innovation and community. The focus here is on the expertise and dedication of the team members, emphasizing their commitment to creating a vibrant, supportive space for students, professionals, and institutions alike.
                                </p>
                                <p className="mt-3 text-sm text-gray-600">Last Modified At: {formatDate(billingAgreement.updated_at)}</p>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <Button onClick={() => {openModal('team')}} size='sm' variant='bordered' className=" border-customBlue text-customBlue">Edit Team Section</Button>
                            </CardFooter>
                            </Card>

                        </div>

                    </div>
                </div>
            </div>

            {type === 'hero' && <HeroSection isOpen={isModalOpen} onClose={closeModal} heroSection={hero}/>}
            {type === 'services' && <ServicesSection isOpen={isModalOpen} onClose={closeModal} services={services}/>}
            {type === 'team' && <TeamSection isOpen={isModalOpen} onClose={closeModal} team={team}/>}

            </AdminLayout>
    );
}
