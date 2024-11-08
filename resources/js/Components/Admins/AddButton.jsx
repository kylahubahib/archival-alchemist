import React from 'react';

export default function AddButton({ icon, iconSize = 18, className, children, ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex border-2 border-customBlue items-center ml-auto px-4 h-[34px] font-bold text-customBlue rounded-md text-xs uppercase tracking-widest hover:bg-blue-900
                 hover:text-white transition ease-in-out duration-150 ${className}`}
        >
            {icon && <span className="mr-2">{React.cloneElement(icon, { size: iconSize })}</span>}
            {children}
        </button>
    );
}
