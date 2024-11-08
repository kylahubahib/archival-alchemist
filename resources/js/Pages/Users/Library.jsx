import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Library({ auth }) {
    const isAuthenticated = !!auth.user;  // !! Converts auth.user to true or false

    const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;  

    return (
        <MainLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Library</h2> }>
            <Head title="Library" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 h-96">Library</div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
