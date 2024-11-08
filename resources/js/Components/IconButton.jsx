import React from 'react'

export default function IconButton({ onClick, leftIcon = null, textElement, rightIcon = null, iconSize = 20, className, disabled = false }) {
    return (
        <button
            id="triggerButton"
            className={`tracking-wide w-auto relative flex py-2 px-4 text-sm font-normal text-customGray border border-customLightGray rounded-lg
                ${disabled ?
                    'text-slate-400 bg-gray-100' :
                    ' focus:outline-none bg-white  hover:ring-1 hover:ring-customLightGray focus:ring-1 focus:ring-customBlue'} 
                ${className}`
            }
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {leftIcon && React.cloneElement(leftIcon, { size: iconSize, className: "mr-3 text-gray-400" })}
            {textElement && React.cloneElement(textElement, { className: `mr-2 ${disabled && 'text-gray-300'}` })}
            {rightIcon && React.cloneElement(rightIcon, { size: iconSize, className: `-mr-1 ml-auto text-customGray ${disabled && 'text-gray-400'}` })}
        </button>
    )
}
