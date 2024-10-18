import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const iconClasses = "text-xl pointer-events-none flex-shrink-0";

// Approve Icon (Green)
export const ApproveIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        className="text-green-500" // Green color class for approved
        {...props}
    >
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"
            fill="currentColor"
        />
    </svg>
);

// Decline Icon (Red)
export const DeclineIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        className="text-red-500" // Red color class for decline
        {...props}
    >
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41l-3.59 3.59L7 15l3.59-3.59L7 8l1.41-1.41L12 10.59l3.59-3.59L17 8l-3.59 3.59L17 15z"
            fill="currentColor"
        />
    </svg>
);

// Pending Icon (Yellow)
export const PendingIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        className="text-yellow-500" // Yellow color class for pending
        {...props}
    >
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15L17 15.47l-4-2.47V7z"
            fill="currentColor"
        />
    </svg>
);

// Download Icon (Neutral)
export const DownloadIcon = (props) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        className="text-default-500" // Default/neutral color for download
        {...props}
    >
        <path
            d="M5 20h14v-2H5v2zM12 2l-5 5h3v7h4V7h3l-5-5z"
            fill="currentColor"
        />
    </svg>
);

const ClassDropdown = () => {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button color="primary" variant="bordered">Filter by:</Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                <DropdownItem
                    key="approved"
                    shortcut="⌘N"
                    description="Display approved manuscripts"
                    startContent={<ApproveIcon className={iconClasses} />}
                >
                    Approved
                </DropdownItem>
                <DropdownItem
                    key="decline"
                    shortcut="⌘C"
                    description="Display declined manuscripts"
                    startContent={<DeclineIcon className={iconClasses} />}
                >
                    Declined
                </DropdownItem>
                <DropdownItem
                    key="pending"
                    shortcut="⌘⇧E"
                    showDivider
                    description="Display pending manuscripts"
                    startContent={<PendingIcon className={iconClasses} />}
                >
                    Pending
                </DropdownItem>
                <DropdownItem
                    key="download"
                    className="text-danger"
                    color="danger"
                    shortcut="⌘⇧D"
                    description="Download CSV"
                    startContent={<DownloadIcon className={iconClasses} />}
                >
                    Download CSV
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default ClassDropdown;
