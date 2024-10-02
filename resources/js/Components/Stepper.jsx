import React from 'react';

export default function Stepper({ steps, currentStep }) {
    return (
        <ul className="flex items-center w-full ml-10">
            {steps.map((step, index) => (
                <li key={index} className={`flex w-full items-center ${index < steps.length - 1 ? 
                'after:content-[""] after:w-full after:h-1 after:border-4 after:inline-block' : ''} ${index < currentStep - 1 ? 
                'after:border-customBlue' : 'after:border-blue-100'}`}>

                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0
                    ${index + 1 <= currentStep ? 'bg-customBlue text-white' : 'bg-blue-100'}`}>
                    {index + 1}
                </span>
                </li>
                
            ))}
        </ul>
    );
}
