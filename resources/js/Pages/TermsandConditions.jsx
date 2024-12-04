import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TermsandConditions({ auth, termsConditions = [], lastUpdated }) {
    return (
        <GuestLayout user={auth.user}>
            <Head title="Terms and Conditions" />

            <div className="bg-customlightBlue min-h-screen">
                {/* Fixed Top Section */}
                <div className="bg-slate-100 pt-8 py-3 px-10 fixed w-full z-10">
                    <div className="max-w-5xl mx-auto ml-11">
                        {/* Back Button */}
                        <Link href="/" className="text-blue-600 text-sm hover:underline">
                            &larr; Back
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Terms and Conditions</h1>
                        <p className="text-sm text-gray-500 mb-8">Last Updated: {lastUpdated}</p>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="text-gray-800 bg-white min-h-screen pt-36 relative flex flex-wrap">
                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl py-20 px-10 ml-8 mr-6">

                        <p className="mb-6">
                            Welcome to Archival Alchemist System! By using our system, you agree to abide by the following terms and conditions:
                        </p>

                        {/* Render terms conditions */}
                        {termsConditions.length > 0 ? (
                            termsConditions.map((term, index) => (
                                <div className="my-2" key={index}>
                                    <h2 className="text-xl font-bold mb-4">{term.content_title}</h2>
                                    <p className="mb-6">{term.content_text}</p>
                                </div>
                            ))
                        ) : (
                            <div>No terms and conditions available yet.</div>
                        )}
                    </div>

                    {/* Image Section */}
                    <div className="fixed top-70 right-10 w-1/3 mr-10 hidden md:block">
                        <img 
                            src="/images/termsandconditionsimg.jpg" 
                            alt="Terms and Conditions Visual" 
                            className="object-cover h-auto w-full"
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
