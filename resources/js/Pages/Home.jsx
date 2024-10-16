import { BsGithub } from "react-icons/bs"; 
import { BsTwitter } from "react-icons/bs"; 
import { BsFacebook } from "react-icons/bs"; 
import GuestLayout from '@/Layouts/GuestLayout';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import axios from "axios";


export default function Home({ auth }) {
    // Refs to track each section
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const featuresRef = useRef(null);
    const teamRef = useRef(null);

    // Using useInView to trigger animations when sections come into view
    const isHeroInView = useInView(heroRef, { triggerOnce: true });
    const isServicesInView = useInView(servicesRef, { triggerOnce: true });
    const isFeaturesInView = useInView(featuresRef, { triggerOnce: true });
    const isTeamInView = useInView(teamRef, { triggerOnce: true });

    // Back to Top button visibility state
    const [showButton, setShowButton] = useState(false);


    const [serviceData, setServiceData] = useState([]);
    const [team, setTeam] = useState([]);
    const [hero, setHero] = useState([]);

    useEffect(() => {
        axios.get('/landing-page')
        .then(response => {
            setServiceData(response.data.servicesSection);
            setTeam(response.data.teamSection);
            setHero(response.data.heroSection);
            //console.log(response.data.teamSection);
        })
        .catch(error => {
            console.error('Error fetching services:', error);
        });

    }, []); 


    // Show or hide the button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll back to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className=" select-none">
            <GuestLayout user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}>

                            
                {/* // HERO SECTION */}
                <motion.section
                ref={heroRef}
                className="flex flex-col min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/img1.png')] bg-gray-700 bg-blend-multiply"
                >
                <div className="flex-grow flex justify-center items-center mt-20 text-gray-50">
                    <div className="mx-20 px-6 py-4 mb-16 text-center sm:rounded-t-lg align-middle">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    >
                        <h6 className="text-3xl md:text-5xl lg:text-7xl font-serif mt-6">
                        {hero.content_title}
                        </h6>
                        <h4 className="mt-6">{hero.subject}</h4>
                    </motion.div>

                    <motion.p
                        className="text-base md:text-lg p-10"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 2, delay: 1 }}
                    >
                        {hero.content_text}
                    </motion.p>
                    </div>
                </div>
                </motion.section>

                {/* // SERVICES SECTION */}
                <motion.section ref={servicesRef} className=" bg-customlightBlue py-20 min-h-screen">
                <div className="flex-grow flex flex-col space-y-10 justify-center items-center text-gray-700">
                    <motion.h1 className="text-5xl font-semibold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                    >
                    OUR SERVICES
                    </motion.h1>

                    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {serviceData.length > 0 && serviceData.map((service, index) => (
                        <motion.div  
                        initial={{ opacity: 0, y: -20 }}
                        animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: index * 0.3 }} 
                        key={service.id}
                        >
                        <div className="flex flex-col p-6 mx-auto min-w-80 max-w-md space-y-4">
                            <img src={service.subject} className="h-16 w-16" />
                            <p className="text-2xl font-semibold">{service.content_title}</p>
                            <p>{service.content_text}</p>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                </div>
                </motion.section>

                {/* // TEAM SECTION */}
                <motion.section ref={teamRef} className="bg-white py-20 min-h-screen">
                <div className="flex-grow flex flex-col justify-between items-center text-gray-700 space-y-16">
                    <motion.h1 className="text-5xl font-semibold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                    >
                    MEET OUR TEAM
                    </motion.h1>

                    <div className="space-y-8 lg:grid lg:grid-cols-4 sm:gap-5 xl:gap-7 lg:space-y-0">
                    {team.length > 0 && team.map((team, index) => (
                        <motion.div  
                        initial={{ opacity: 0, y: -20 }}
                        animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: index * 0.3 }}  
                        key={team.id}
                        >
                        <div className="flex flex-col p-6 mx-auto items-center min-w-80 max-w-md space-y-4">
                            <img className=" w-48 h-48 mb-3 rounded-full shadow-lg" src={team.subject}/>
                            <h5 className="mb-1 text-xl font-medium text-gray-900">{team.content_title}</h5>
                            <span className="text-sm text-gray-500 ">{team.content_text}</span>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                </div>
                </motion.section>

                {/* LEARN MORE ABOUT US
                <motion.section
                    ref={featuresRef}
                    className="h-[700px] bg-red-700">
                    <div className="flex-grow flex justify-center items-center mt-20 text-gray-50">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1, delay: 0.7 }}
                        >
                            Learn More About Us
                        </motion.h1>
                    </div>
                </motion.section> */}

              

               {/* FOOTER */}
                <motion.footer
                    className=" py-10 bg-customlightBlue shadow-inner">
                    <div className="flex flex-col justify-center items-center space-y-4 text-gray-700">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="text-2xl font-bold text-customBlue"
                        >
                            Archival Alchemist
                        </motion.h1>

                        {/* Social Media Icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.1 }}
                            className="flex space-x-6"
                        >
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <BsFacebook size={25} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <BsTwitter size={25} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <BsGithub size={25} />
                            </a>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.3 }}
                            className="text-sm"
                        >
                            <p>Email: info@archivalalchemist.com</p>
                            <p>Phone: +1 (123) 456-7890</p>
                        </motion.div>

                        {/* Copyright Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="text-xs"
                        >
                            <p>&copy; {new Date().getFullYear()} Archival Alchemist. All rights reserved.</p>
                        </motion.div>
                    </div>
                </motion.footer>


                {/* Back to Top Button */}
                {showButton && (
                    <motion.button
                        className="fixed bottom-10 right-10 bg-blue-500 text-white h-10 w-10 text-2xl rounded-full shadow-lg hover:bg-blue-700 transition-all"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        onClick={scrollToTop}
                    >
                        ↑
                    </motion.button>
                )}
            </GuestLayout>
        </div>
    );
}
