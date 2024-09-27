import AddButton from '@/Components/AddButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export default function Courses({ auth}) {


    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Courses</h2>}
        >
        
            <Head title="Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row justify-between m-3">
                            <div className="text-gray-800 text-3xl font-bold">Course</div>
                            <div>
                                <AddButton className="text-customBlue hover:text-white space-x-1">
                                    <FaPlus /><span>Add Course</span>
                                </AddButton>
                            </div> 
                        </div> 

                        <div className="overflow-x-auto shadow-md sm:rounded-lg px-5 sm:px-5">
                            <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white">
                                <select className="mt-1 block pl-3 pr-10 py-2 text-base text-gray-600 font-bold border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="">College of Computer Information and Communication Technology</option>
                                    <option value="">College of Engineering</option>
                                    <option value="">College of Education</option>
                                    <option value="">College of Technology</option>
                                </select>

                            </div>
                        </div> 
                        
                    </div>
                </div>
            </div>
            </AdminLayout>
    );
}
