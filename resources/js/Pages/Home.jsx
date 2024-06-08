import Guest from '@/Layouts/GuestLayout';
import { Link, Head } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';

export default function Home({auth}) {

    return (
        <>
           <div className="min-h-screen bg-customlightBlue flex flex-col">
            <nav className="bg-transparent border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-customBlue font-bold text-lg">Archival Alchemist</h1>
                        <div className="flex space-x-8 sm:space-x-10">
                            <NavLink href={route('home')} active={route().current('home')} className="text-customBlue">Home</NavLink>
                            <NavLink href="#" className="text-customBlue">Library</NavLink>
                            <NavLink href="#" className="text-customBlue">Forum</NavLink>
                            <NavLink href={route('tour')} className="text-customBlue">Tour</NavLink>
                            <NavLink href={route('pricing')} className="text-customBlue">Pricing</NavLink>
                        </div>
                        <div className="flex space-x-8 sm:space-x-10">
                        {auth.user ? (
                                    <>
                                    <NavLink to='/savedlist' active={route().current('savedlist')} className="text-customBlue">My Account</NavLink>
                                    </>
                                ) : (
                                    <>
                                    <NavLink href={route('login')} active={route().current('login')} className="text-customBlue">Login</NavLink>
                                    <NavLink href={route('register')} active={route().current('register')} className="text-customBlue">Register</NavLink>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </nav>

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
           </div>

        </>
    );
}
