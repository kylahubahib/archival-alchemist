import React from 'react';

export default function StatisticCard({ key = null, icon, iconSize = 35, iconColor = '#294996', header, stat, className }) {
    return (
        <div className={`bg-white block max-w-sm p-4 border rounded-lg shadow mb-3 ${className}`}>
            <div className="border-b-2 pb-2 border-yellow-600 text-customBlue font-bold">{header}</div>
            <div className="flex flex-row justify-between pt-3">
                <span className="text-3xl text-gray-500 font-bold pr-10">{stat}</span>
                {icon && <span>{React.cloneElement(icon, { size: iconSize, color: iconColor })}</span>}
            </div>
        </div>
    );
}
