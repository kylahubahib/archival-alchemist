import { FaTags } from "react-icons/fa"; 
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link} from '@inertiajs/react';
import AdvancedMenu from "./AdvancedMenu";

export default function Advanced({ auth }) {
    return (
        
        <AdminLayout
             user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Advanced</h2>}
        > 
            <Head title="Advanced" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg space-x-4 p-4">

                    <AdvancedMenu />

                        <h2>Forum</h2>
                        
                    </div>
                </div>
            </div>
            </AdminLayout>
    );
}
