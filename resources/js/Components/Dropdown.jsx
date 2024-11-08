import React, { useState, createContext, useContext, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const DropDownContext = createContext();

const Dropdown = ({ className, children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className={`relative ${className}`}>{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ className, children, }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen} className={className}>{children}</div>

            {open && <div className="fixed m-0 inset-0 z-40" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', position = 'top-full', zIndex = 'z-50', widthClasses = 'w-48', contentClasses = 'py-1 bg-white', openContent = false, children }) => {
    const { open, setOpen } = useContext(DropDownContext);
    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute mt-2 mb-2 rounded-md shadow-lg ${zIndex} ${position} ${alignmentClasses} ${widthClasses}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent onClick from closing dropdown immediately
                        if (openContent) {
                            setOpen(true);
                        } else {
                            setOpen(false);
                        }
                    }}
                >
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                        {children}
                    </div>
                </div>

            </Transition >
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ' +
                className
            }
        >
            {children}
        </Link>
    );
};

const DropdownList = ({ className = '', active = false, onClick, children, ...props }) => {
    return (
        <span
            {...props}
            className={`block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out 
                ${className} 
                ${active ? 'bg-customBlue !text-white hover:bg-customBlue cursor-default' : 'cursor-pointer hover:bg-gray-100'}`}
            onClick={active ? (e) => e.preventDefault() : onClick}
        >
            {children}
        </span >
    );
};


Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.List = DropdownList;

export default Dropdown;
