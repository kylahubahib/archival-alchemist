import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import Modal from '@/Components/Modal';
import { MdMessage } from 'react-icons/md';
import Repository from './Partials/Repository';
import Posts from './Partials/Posts';
import SubscriptionForm from './Partials/SubscriptionForm';
import { Accordion, AccordionItem } from '@nextui-org/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import AdminLayout from '@/Layouts/AdminLayout';



export default function AdminProfile({auth, mustVerifyEmail, status}) {

    return (
        <AdminLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
    >
        <Head title="Profile" />

        <div className="m-10 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <UpdateProfileInformationForm
                mustVerifyEmail={mustVerifyEmail}
                status={status}
                className="max-w-xl bg-white shadow-sm p-8 rounded-lg"
            />

            <UpdatePasswordForm className="max-w-xl bg-white shadow-sm p-8 rounded-lg" />
        </div>




    </AdminLayout>
    );
}
