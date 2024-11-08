import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function PrivacyPolicy({ auth }) {
    return (
        <GuestLayout user={auth.user}>
            <Head title="Privacy Policy" />

            <div className="bg-customlightBlue min-h-screen">
                {/* Fixed Top Section */}
                <div className="bg-slate-100 pt-8 py-3 px-10 fixed w-full z-10">
                    <div className="max-w-5xl mx-auto ml-11">
                        {/* Back Button */}
                        <Link href="/" className="text-blue-600 text-sm hover:underline">
                            &larr; Back
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Privacy Policy</h1>
                        <p className="text-sm text-gray-500 mb-8">Last Updated: November 2024</p>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="text-gray-800 bg-white min-h-screen pt-36 relative flex flex-wrap">
                    {/* Main Content */}
                    <div className="flex-1 max-w-6xl py-20 px-10 ml-8 mr-6">

                        <p className="mb-6">
                            Welcome to the Archival Alchemist System! We are committed to protecting your privacy and ensuring that your personal information is handled responsibly. This privacy policy outlines how we collect, use, and safeguard your information when you use our system.
                        </p>
                        <h2 className="text-xl font-bold mb-4">Definitions</h2>
                        <ul className="list-disc list-inside mb-6">
                            <li><strong>The Archival Alchemist:</strong> Transforming Capstone into Discoverable Knowledge - It is a web-based system that serves as a central hub for students specifically for colleges in Cebu with courses related to computer and information technology where students and other researchers can share, explore, and preserve capstone projects.</li>
                            <li><strong>Archival Alchemist:</strong> An alchemist is someone who has historically aimed to transform elements into gold. Here, the archive system acts like the alchemist, but instead of physical elements, it "transforms" capstone projects.</li>
                            <li><strong>Transforming:</strong> This refers to taking the capstones, which might be in physical form or difficult to find digitally, and making them accessible and usable through the archiving system.</li>
                            <li><strong>Discoverable Knowledge:</strong> The capstones contain valuable knowledge and research. By archiving them effectively, the system makes this knowledge "discoverable" to future researchers, students, and anyone interested in the information.</li>
                            <li><strong>Capstone Projects:</strong> A culminating project undertaken by IT/IS students, typically in their third year second semester of study, that demonstrates their knowledge and skills acquired throughout their program.</li>
                        </ul>

                        <h2 className="text-xl font-bold mb-4">1. Information Collected:</h2>
                        <p className="mb-6">
                            We collect various types of information from users, including personal information provided during registration (such as name, email address, and affiliation), browsing data, and documents uploaded to the system.
                        </p>

                        <h2 className="text-xl font-bold mb-4">2. Use of Information:</h2>
                        <p className="mb-6">
                            The information collected is used to provide and improve our services, personalize your user experience, and enhance system functionality. We do not sell or share your personal information with third parties without your consent, except as required by law.
                        </p>

                        <h2 className="text-xl font-bold mb-4">3. User Control:</h2>
                        <p className="mb-6">
                            You have the right to access, edit, or delete your personal information stored in our system. You can also manage your privacy settings and preferences to control how your information is used.
                        </p>

                        <h2 className="text-xl font-bold mb-4">4. Security Measures:</h2>
                        <p className="mb-6">
                            We employ industry-standard security measures to protect your data from unauthorized access, misuse, or alteration. These measures include encryption, firewalls, and regular security audits.
                        </p>

                        <h2 className="text-xl font-bold mb-4">5. Third-Party Links:</h2>
                        <p className="mb-6">
                            Our system may contain links to third-party websites or services. Please note that we are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any personal information.
                        </p>

                        <h2 className="text-xl font-bold mb-4">6. Changes to Privacy Policy:</h2>
                        <p className="mb-6">
                            We may update this privacy policy periodically to reflect changes in our practices or legal requirements. Any updates will be posted on our website, and we may notify you via email or through the system.
                        </p>

                        <h2 className="text-xl font-bold mb-4">7. Contact Information:</h2>
                        <p className="mb-6">
                            If you have any questions, concerns, or requests regarding your privacy or this privacy policy, please contact us at <a href="mailto:aa_system@gmail.com" className="text-blue-600 hover:underline">aa_system@gmail.com</a>.
                        </p>
                    </div>

                    {/* Image Section */}
                    <div className="fixed top-80 right-10 w-1/3 mr-10 hidden md:block">
                        <img 
                            src="/images/privacypolicyimg.jpg" 
                            alt="Privacy Policy Visual" 
                            className="object-cover h-auto w-full"
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
