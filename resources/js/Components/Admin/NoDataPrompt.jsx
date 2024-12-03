import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { AnimatePresence, motion } from 'framer-motion';
import { getAnimationProps } from '@/Utils/common-utils';

export default function NoDataPrompt({ imgSrc, title, message, className, type = 'default' }) {

    switch (type) {
        case 'filter':
            imgSrc = imgSrc || '/images/no-filtered-results.gif';
            title = "No results found";
            message = message || 'Try searching or adjusting filters again.';
            break;
        default:
            imgSrc = imgSrc || '/images/no-data-available.gif';
            title = "No data available";
            message = message || 'There\'s nothing to show here right now.';
            break;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                {...getAnimationProps({ animationType: 'fadeUp' })}
                exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                        delay: 0.3, // Delay before exit animation starts
                        duration: 0.5, // Exit animation duration
                    },
                }}
                className={`flex flex-col tracking-wider h-[45vh] justify-center items-center ${className}`}
            >
                <img className="h-[150px]" src={imgSrc} alt="No Results" />
                <p className="text-2xl font-bold animate-appearance-in duration-700 text-customGray">
                    {title}
                </p>
                <TypeAnimation
                    sequence={[
                        700, // Delay before animation starts
                        message,
                    ]}
                    speed={70}
                    wrapper="span"
                    repeat={1}
                    className="text-md"
                />
            </motion.div>
        </AnimatePresence>

    );
}
