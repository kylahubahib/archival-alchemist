import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAnimationProps } from '@/Utils/common-utils';

export default function ErrorPage(
    {
        errorCode = "404",
        errorMessage = "Page not found",
        description = "Sorry, the page you are looking for doesn't exist.",
        showHomePageLink = false,
        heightClass = ''

    }) {

    return (
        <section className="bg-customLightBlue">
            <div className={`container ${heightClass} min-h-screen px-12 py-12 mx-auto lg:flex lg:items-center lg:gap-12`} >
                <motion.div className="w-full lg:w-1/2">
                    <p className="text-6xl md:text-8xl font-medium text-blue-500">{errorCode}</p>
                    <h1 className="mt-3 text-3xl font-semibold text-gray-700 md:text-4xl">{errorMessage}</h1>
                    <p className="mt-4 text-gray-500">{description}</p>
                    <div className="flex items-center mt-6 gap-x-3">
                        {showHomePageLink &&
                            <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600">
                                Take me home
                            </button>
                        }
                    </div>
                </motion.div>

                <AnimatePresence >
                    <motion.div
                        {...getAnimationProps({ animationType: 'fadeUp', duration: 1 })}
                        className="relative w-full mt-12 lg:w-1/3 lg:mt-0"
                    >
                        <img className="w-full max-w-lg lg:mx-auto" src="/images/sad-owl.png" alt="Sad Owl" />
                    </motion.div>
                </AnimatePresence>

            </div>
        </section>
    );
}
