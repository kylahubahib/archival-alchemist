import React from 'react';

export default function NoDataPrompt({ leftIcon = null, textContent = '', rightIcon = null, iconSize = 40 }) {
    return (
        <div className='flex flex-col items-center justify-center gap-2 h-[40vh] py-5'>
            {leftIcon && React.cloneElement(leftIcon, { size: iconSize, className: "mr-3 text-gray-400" })}
            <span className='text-customGray text-lg tracking-wider'>
                {textContent}
            </span>
            {rightIcon && React.cloneElement(rightIcon, { size: iconSize, className: "text-gray-400" })}
        </div>
    );
}
