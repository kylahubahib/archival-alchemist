import React, { useState, useEffect } from 'react';

const Collapsible = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false);

    const toggle = () => {
        setIsOpen(prev => !prev);
    };

    // Trigger the animation class on load
    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div className={`border rounded-lg shadow-lg p-4 mb-5 bg-white hover:bg-gray-100 transition duration-300 ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <div onClick={toggle} className="flex justify-between items-center cursor-pointer" aria-expanded={isOpen}>
                <h2 className="text-lg font-semibold text-black">{question}</h2>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                        <span className="text-2xl text-customBlue">−</span> // Minus icon
                    ) : (
                        <span className="text-2xl text-customBlue">+</span> // Plus icon
                    )}
                </span>
            </div>
            <div
                className={`overflow-hidden transition-[max-height] duration-700 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <p className="mt-2 text-gray-900">{answer}</p>
            </div>
        </div>
    );
};

export default Collapsible;
