import React from 'react'

export default function TertiaryButton({ onClick, type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center text-customGray hover:text-black p-2 transition ease-in-out duration-150 
                ${disabled ? 'opacity-25' : ''} 
                ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
