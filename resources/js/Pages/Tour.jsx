import { Link, Head } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Tour({auth}) {

    return (
        <GuestLayout user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tour</h2> }>
            <Head title="Tour" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 h-96">Tour</div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
