import React from 'react';
import { Tooltip } from '@nextui-org/react';

export default function ActionButton({ icon, iconSize = 15, className = '', onClick, isDisabled, children, tooltipContent = 'Tooltip content', ...props }) {
    return (
        <>
            {isDisabled ? ( // Conditionally render tooltip only when not disabled
                <button
                    {...props}
                    className={`bg-gray-400 flex text-nowrap font-bold rounded-sm gap-1 py-[7px] px-2 `}
                    onClick={null} // Disable click
                    disabled={true} // Ensure button is visually disabled
                >
                    {icon && <span>{React.cloneElement(icon, { size: iconSize })}</span>}
                    {children}
                </button>
            ) : (
                <Tooltip
                    content={tooltipContent}
                    className="text-customGray"
                    size="sm"
                    closeDelay={150}
                >
                    <button
                        {...props}
                        data-tooltip-target="tooltip-animation"
                        className={`bg-customBlue text-white flex text-nowrap font-bold hover:bg-white hover:text-customBlue hover:outline hover:outline-2 rounded-sm gap-1 py-[7px] px-2 transition-all ease-in-out duration-400 
                            ${className}`}
                        onClick={onClick}
                    >
                        {icon && <span>{React.cloneElement(icon, { size: iconSize })}</span>}
                        {children}
                    </button>
                </Tooltip>
            )}
        </>
    );
}
