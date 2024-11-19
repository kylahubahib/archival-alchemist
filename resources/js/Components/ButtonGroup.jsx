import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';

export default function ButtonGroup({children, icon, ...props}) {
    const [activeButton, setActiveButton] = useState(null);

    const buttons = ['Button 1', 'Button 2', 'Button 3'];

    const handleClick = (index) => {
        setActiveButton(index);
    };

    return (
        <div className="flex space-x-4">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`px-4 py-2 font-semibold rounded-md ${
                        activeButton === index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                >
                    {button}
                </button>
            ))}
        </div>
    );
}

