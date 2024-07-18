import Guest from '@/Layouts/GuestLayout';
import { Link, Head } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Home({auth}) {

    return (
        <>
        <GuestLayout user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2> }>
            <section id="home" className="h-full flex flex-col bg-cover bg-center bg-no-repeat bg-[url('/images/img1.png')]  bg-gray-700 bg-blend-multiply">
                <div className="flex-grow flex justify-center items-center mt-20 text-gray-50">
                    <div className="w-full mx-20 px-6 py-4 mb-16 text-center overflow-hidden sm:rounded-t-lg align-middle">
                        <div><h6>LOGO HERE</h6></div>
                        <h6 className="text-3xl md:text-5xl lg:text-7xl font-serif mt-6"> Transforming Capstone Into <br/><b>Discoverable Knowledge</b></h6>
                        <h4 className="mt-6">Our platform enable people to share, discover, collaborate and learn at any workplaces</h4>
                    </div>
                </div>
            </section>

            <section>
            <div className="flex flex-row justify-center">
                <div className="w-full text-center bg-white overflow-hidden align-middle">
                    <img src="/images/img1.png" alt="books" className="w-full h-full object-cover" />
                </div>

                <div className="w-full text-justify bg-white overflow-hidden sm:rounded-t-lg">
                    <p className="text-base md:text-lg p-10"> Archival Alchemist is a vibrant platform where users can seamlessly 
                    browse a diverse array of projects, upload their own creations, and connect with like-minded individuals. 
                    It serves as a dynamic hub for exploration and collaboration, offering users the opportunity to immerse 
                    themselves in a rich tapestry of creative endeavors spanning various disciplines. Through intuitive upload 
                    features, individuals can share their artistic expressions, research endeavors, or innovative solutions, 
                    fostering a vibrant community of creativity and collaboration. Additionally, the platform provides robust
                    networking tools and interactive features, facilitating meaningful connections and collaborations. 
                    Archival Alchemist is more than just a platform—it's a catalyst for creativity, innovation, and community, 
                    empowering individuals to unlock their full potential and embark on transformative journeys of discovery.</p>
                    </div>
                </div>
            </section>
        </GuestLayout>
        </>
    );
}
