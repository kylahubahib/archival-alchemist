import Guest from '@/Layouts/GuestLayout';
import { Link, Head } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Home({auth}) {

    return (
        <GuestLayout user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2> }>

            <div className="flex-grow flex justify-center items-center mt-20">
                <div className="w-full h-96 mx-20 px-6 py-4 text-center bg-white overflow-hidden sm:rounded-t-lg align-middle">
                    <div><h6>LOGO HERE</h6></div>
                    <h6 className="text-7xl font-serif mt-6"> Transforming Capstone Into <br/><b>Discoverable Knowledge</b></h6>
                    <h4 className="mt-6">Our platform enable people to share, discover, <br/>collaborate and learn at any workplaces</h4>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
            <div className="w-full h-96 ml-20 text-center bg-white overflow-hidden align-middle">
                <img src="/images/img1.png" alt="books" className="w-full h-full object-cover" />
            </div>

                <div className="w-full h-96 mr-20 px-6 text-justify bg-white overflow-hidden sm:rounded-t-lg align-middle">
                    <p className="text-lg"> Archival Alchemist is a vibrant platform where users can seamlessly 
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
            </GuestLayout>
    );
}
