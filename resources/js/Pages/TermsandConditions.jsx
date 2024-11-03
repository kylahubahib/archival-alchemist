import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TermsandConditions({ auth }) {
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
                        <p className="text-sm text-gray-500 mb-8">Last Updated: November 2024</p>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="text-gray-800 bg-white min-h-screen pt-36 relative flex flex-wrap">
                    {/* Main Content */}
                    <div className="flex-1 max-w-6xl py-20 px-10 ml-8 mr-6">

                    <p className="mb-6">
                            Welcome to Archival Alchemist System! By using our system, you agree to abide by the following terms and conditions:
                        </p>

                        <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms:</h2>
                        <p className="mb-6">
                            By accessing or using our system, you agree to these terms of service. If you do not agree with any part of these terms, you may not use the system.
                        </p>

                        <h2 className="text-xl font-bold mb-4">2. User Responsibilities:</h2>
                        <p className="mb-6">
                            You are responsible for complying with all applicable laws and regulations when using our system. You must also respect the intellectual property rights of others and maintain the confidentiality of your login credentials.
                        </p>

                        <h2 className="text-xl font-bold mb-4">3. Use of Content:</h2>
                        <p className="mb-6">
                            You retain ownership of any content you upload to the system, such as theses or forum posts. By uploading content, you grant us a non-exclusive, royalty-free license to use, reproduce, and distribute that content as necessary to provide our services.
                        </p>

                        <h2 className="text-xl font-bold mb-4">4. Prohibited Activities:</h2>
                        <p className="mb-6">
                            You may not engage in any activities that are unlawful, harmful, or prohibited by these terms of service. This includes but is not limited to spamming, hacking, and distributing malware.
                        </p>

                        <h2 className="text-xl font-bold mb-4">5. Intellectual Property Rights:</h2>
                        <p className="mb-6">
                            All intellectual property rights related to the system and its content are owned by us or our licensors. You may not use or reproduce any content from the system without our permission.
                        </p>

                        <h2 className="text-xl font-bold mb-4">6. Limitation of Liability:</h2>
                        <p className="mb-6">
                            We are not liable for any damages incurred by users as a result of using our system, except where prohibited by law. In no event shall our liability exceed the amount paid by you, if any, for using the system.
                        </p>

                        <h2 className="text-xl font-bold mb-4">7. Changes to Terms:</h2>
                        <p className="mb-6">
                            We reserve the right to update these terms of service at any time without prior notice. Any changes will be effective immediately upon posting on our website, and your continued use of the system constitutes acceptance of the updated terms.
                        </p>

                        <h2 className="text-xl font-bold mb-4">8. Share your research, ideas, and experience:</h2>
                        <p className="mb-6">
                            The Service enables Members to share their own research-related work, knowledge, professional insights, and ideas by sharing their Member Submissions. Members can also use the Service to showcase their professional identity, including their education, work experience, credentials, skills, journal roles, expertise, and affiliations.
                        </p>
                        <p className="mb-6">
                            While we endeavor to make the Service available as constantly as possible, there may be disruptions or temporary suspension of the Service due to maintenance, security, capacity, or events beyond our control.
                        </p>

                        <h2 className="text-xl font-bold mb-4">9. Who can use the Service:</h2>
                        <p className="mb-6">
                            The Service is only available to individual natural persons acting in their professional capacity who are at least 18 years old. You cannot use the Service if you are on a sanctions-related list of designated persons maintained by the United Nations Security Council, European Union, or any governmental authority of the United States of America, or are prohibited from receiving the Service under laws applicable to you.
                        </p>
                        <p className="mb-6">
                            To register for an account, you must meet our registration criteria, which require you to either register using an email address with a domain of a research institution recognized by us or submit acceptable proof of otherwise being an active researcher. If you don’t meet our registration criteria at the time of registration, we may reject your registration or terminate your membership if we later learn that you successfully registered without meeting our criteria. If you have previously had your membership terminated by us, you may not register for the Service again.
                        </p>

                        <h2 className="text-xl font-bold mb-4">10. Our Service:</h2>
                        <p className="mb-6">
                            Archival Alchemist's mission is to connect students and researchers and make research open to all. To achieve this, the Service facilitates discovery, connection, and collaboration, and lets you showcase your research, ideas, and experience.
                        </p>

                        <h2 className="text-xl font-bold mb-4">11. Termination of Service:</h2>
                        <p className="mb-6">
                            We reserve the right to suspend or terminate your access to the system at any time for any reason, without prior notice or liability.
                        </p>

                        <h2 className="text-xl font-bold mb-4">12. Contact Information:</h2>
                        <p className="mb-6">
                            If you have any questions, concerns, or feedback regarding these terms of service, please contact us at <a href="mailto:aa_system@gmail.com" className="text-blue-600 hover:underline">aa_system@gmail.com</a>.
                        </p>

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
