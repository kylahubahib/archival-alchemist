import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import axios from 'axios';
import eact from 'react';

const iconClasses = "text-xl pointer-events-none flex-shrink-0";

// Approve Icon (Green)
export const ApproveIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-green-500" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" fill="currentColor" />
    </svg>
);

// Decline Icon (Red)
export const DeclineIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-red-500" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41l-3.59 3.59L7 15l3.59-3.59L7 8l1.41-1.41L12 10.59l3.59-3.59L17 8l-3.59 3.59L17 15z" fill="currentColor" />
    </svg>
);

// Pending Icon (Yellow)
export const PendingIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-yellow-500" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15L17 15.47l-4-2.47V7z" fill="currentColor" />
    </svg>
);

// export const CopyIcon = (props) => (
//     <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-gray-500" {...props}>
//         <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm2 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h10v14z" fill="currentColor" />
//     </svg>
// );

// Download Icon (Neutral)
export const DownloadIcon = (props) => (
    <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-default-500" {...props}>
        <path d="M5 20h14v-2H5v2zM12 2l-5 5h3v7h4V7h3l-5-5z" fill="currentColor" />
    </svg>
);



const ClassDropdown = ({ ins_id, onUpdate }) => {
    const [filter, setFilter] = useState(''); // Start with an empty filter
    const [manuscripts, setManuscripts] = useState([]);

    // Fetch manuscripts whenever the filter or ins_id changes
    useEffect(() => {
        const fetchManuscripts = async () => {
            try {
                // Fetch the manuscripts based on the current filter and ins_id
                const response = await fetch(`http://127.0.0.1:8000/get-manuscripts?filter=${filter}&ins_id=${ins_id}`);
                const data = await response.json();

                // Update the manuscripts in the component state
                //thisssssssssssss
                //setManuscripts(data);

                // Notify the parent component that manuscripts have been updated
                if (onUpdate) {
                    onUpdate(); // You don’t need to pass the data here, just notify to refetch
                }
            } catch (error) {
                console.error("Error fetching manuscripts:", error);
            }
        };

        // Only fetch if there's a filter or it's the first load
        if (filter || manuscripts.length === 0) {
            fetchManuscripts();
        }
    }, [filter, ins_id]); // Run effect when filter or ins_id changes

    // Function to handle filter change
    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter); // Update the filter state
    };

    return (
        <div>
            <Dropdown>
                <DropdownTrigger>
                    <Button color="primary" variant="bordered">Filter by:</Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                    <DropdownItem
                        key="approved"
                        description="Display approved manuscripts"
                        startContent={<ApproveIcon className={iconClasses} />}
                        onClick={() => handleFilterChange('approved')}
                    >
                        Approved
                    </DropdownItem>
                    <DropdownItem
                        key="declined"
                        description="Display declined manuscripts"
                        startContent={<DeclineIcon className={iconClasses} />}
                        onClick={() => handleFilterChange('declined')}
                    >
                        Declined
                    </DropdownItem>
                    <DropdownItem
                        key="in_progress"
                        showDivider
                        description="Display To-check manuscripts"
                        startContent={<PendingIcon className={iconClasses} />}
                        onClick={() => handleFilterChange('in_progress')}
                    >
                        To Check
                    </DropdownItem>
                    <DropdownItem
                        key="pending"
                        showDivider
                        description="Display pending manuscripts"
                        startContent={<PendingIcon className={iconClasses} />}
                        onClick={() => handleFilterChange('pending')}
                    >
                        Pending
                    </DropdownItem>
                    {/* <DropdownItem
                        key="copy"
                        showDivider
                        description="Copy & share code"
                        startContent={<CopyIcon className={iconClasses} />}
                    >
                        Copy & share code
                    </DropdownItem> */}
                    <DropdownItem
                        key="download"
                        className="text-danger"
                        color="danger"
                        description="Download CSV"
                        startContent={<DownloadIcon className={iconClasses} />}
                    >
                        Download CSV
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            {/* Display Manuscripts */}
            <div>
                {manuscripts.map(manuscript => (
                    <div key={manuscript.id}>
                        <h3>{manuscript.man_doc_title}</h3>
                        <p>Status: {manuscript.man_doc_status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassDropdown;
