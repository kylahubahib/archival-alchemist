import React from 'react';
import { Skeleton } from '@nextui-org/react';
import { renderTableHeaders } from '@/Pages/SuperAdmin/Users/Users';

export default function TableSkeleton({ tableHeaders, tableHeaderType, ...props }) {
    // Validate tableHeaders and tableHeaderType
    if (!tableHeaders || !tableHeaderType || !Array.isArray(tableHeaders[tableHeaderType])) {
        console.warn(`Invalid tableHeaders or tableHeaderType: ${tableHeaderType}`);
        return null; // Return null to prevent rendering if invalid
    }

    return (
        <table
            className="w-full table-auto relative text-xs text-left border-current text-customGray tracking-wide"
            {...props}
        >
            {/* Render table headers */}
            {renderTableHeaders(tableHeaders, tableHeaderType)}

            <tbody>
                {/* Render rows */}
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="text-gray-400 border border-gray">
                        {tableHeaders[tableHeaderType].map((header, index) => (
                            <td
                                key={index}
                                className={`p-2 border ${header === 'Name' ? 'min-w-[150px]' : ''
                                    } border-gray`}
                            >
                                {/* Add a custom style for skeleton here based on the header */}
                                {header === 'Name' ? (
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <Skeleton className="flex rounded-full w-11 h-11" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <Skeleton className="h-4 w-3/5 rounded-lg" />
                                            <Skeleton className="h-3 w-4/5 rounded-lg" />
                                        </div>
                                    </div>
                                ) : (
                                    <Skeleton className="h-5 w-full rounded-lg" />
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}