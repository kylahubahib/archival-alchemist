import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa'; // Correct import path for Font Awesome

export default function AlertLabel({ alertType, message, className = '', iconSize = 20 }) {
    // Mapping for different alert icons
    const icon = {
        error: <FaExclamationCircle size={iconSize} className="text-white mr-2" />,
        warning: <FaExclamationTriangle size={iconSize} className="text-white mr-2" />,
        info: <FaInfoCircle size={iconSize} className="text-white mr-2" />,
        success: <FaCheckCircle size={iconSize} className="text-white mr-2" />
    };

    // Mapping for background colors based on alert type
    const bg = {
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
        success: 'bg-green-500'
    };

    // Determine the correct icon and background color
    const alertIcon = icon[alertType] || null;
    const bgColor = bg[alertType] || 'bg-gray-500'; // Fallback color if no valid type

    return (
        <span className={`text-xs tracking-wider text-white w-full p-3 flex items-center rounded ${bgColor} ${className}`}>
            {alertIcon}
            <span>{message}</span>
        </span>
    );
}
