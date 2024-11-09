import React, { useEffect, useRef, useId } from 'react';
import { Dropdown as d } from 'flowbite';

export default function Dropdown({ triggerLeftIcon = null, triggerText, triggerRightIcon = null, menuItems, iconSize = 20, showDropdownMenu }) {
    const triggerButtonRef = useRef(null);
    const menuItemsRef = useRef(null);
    const uniqueId = useId();

    useEffect(() => {
        if (triggerButtonRef.current && menuItemsRef.current) {
            const dropdown = new d(menuItemsRef.current, triggerButtonRef.current, {
                placement: 'bottom',
                triggerType: 'click',
                delay: 500,
            });

            showDropdownMenu ? dropdown.show() : dropdown.hide();

            return () => {
                dropdown.destroy();
            };
        }

    });

    return (
        <>
            <button ref={triggerButtonRef} id={`triggerButton${uniqueId}`} data-dropdown-toggle={`dropdownMenus${uniqueId}`}
                className="tracking-wide w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-normal text-customGray focus:outline-none bg-white rounded-lg border border-customLightGray hover:ring-1 hover:ring-customLightGray focus:ring-1 focus:ring-customBlue"
                type="button">
                {triggerLeftIcon && React.cloneElement(triggerLeftIcon, { size: iconSize, className: "mr-3 text-gray-400" })}
                {triggerText}
                {triggerRightIcon && React.cloneElement(triggerRightIcon, { size: iconSize, className: "-mr-1 ml-1.5 text-customGray" })}
            </button>
            <div ref={menuItemsRef} id={`dropdownMenus${uniqueId}`}
                className="hidden z-10 px-3 py-2 bg-white shadow-md text-customGray">
                {menuItems}
            </div>
        </>
    )
}
