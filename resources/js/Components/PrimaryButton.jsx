import React from 'react';

export default function PrimaryButton({ onClick, className = '', disabled, children, icon = null, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center px-4 py-2 bg-customBlue border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-900 focus:bg-customBlue active:bg-customBlue focus:outline-customBlue focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 
                ${disabled ? 'opacity-25' : ''} 
                ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
}
