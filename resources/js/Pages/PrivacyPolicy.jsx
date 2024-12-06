import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function PrivacyPolicy({ auth, privacyPolicy }) {

    // console.log(privacyPolicy);

    function formatDate(dateString) {
        const dateObject = new Date(dateString);
      
        return dateObject.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      

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
                        <p className="text-sm text-gray-500 mb-8">Last Updated: {formatDate(privacyPolicy.updated_at)}</p>
                    </div>
                </div>

                <div className="grid col-span-2 gap-2">
                    {/* Scrollable Content Section */}
                    <div className="text-gray-800 bg-white min-h-screen pt-36 relative flex flex-wrap">
                        {/* Main Content */}
                        <div className="flex-1 max-w-4xl py-20 px-10 ml-8 mr-6">

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

                            <div
                            dangerouslySetInnerHTML={{ __html: privacyPolicy.content_text }}
                            className="prose prose-lg mx-auto text-gray-800 space-y-3"
                            ></div>
                        </div>

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
