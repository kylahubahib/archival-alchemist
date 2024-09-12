import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Edit from './Edit.jsx';
import { Head } from '@inertiajs/react';

export default function profile() {
    return (
        <AuthenticatedLayout

            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <img
                            className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
                            src="https://tailwindcss.com/img/erin-lindford.jpg"
                            alt="Woman's Face"
                        />
                        <div className="text-center space-y-2 sm:text-left">
                            <div className="space-y-0.5">
                                <p className="text-lg text-black font-semibold">
                                    jIS-lEE HAHAHA
                                </p>
                                <p className="text-slate-500 font-medium">
                                    Product Engineer
                                </p>
                            </div>
                            <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                                Message
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <Edit className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
