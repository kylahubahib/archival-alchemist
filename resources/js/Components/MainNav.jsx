// MainNav component
import { Link } from '@inertiajs/react';
import React from 'react';

export default function MainNav({ href, onClick, active = false, icon = null, iconSize = 18, children, ...props }) {

    return (
        <Link
            preserveState
            preserveScroll
            {...props}
            href={href}
            className={`inline-flex items-center px-4 py-2 rounded-md font-semibold text-xs text-white uppercase tracking-widest transition ease-in-out duration-150
                ${active
                    ? 'bg-customDarkBlue hover:none focus:outline-none focus:ring-0 cursor-default'
                    : 'bg-customBlue hover:bg-blue-900 focus:bg-customBlue focus:outline-customBlue focus:ring-indigo-500 focus:ring-offset-2'
                }
             `}
            onClick={active ? (e) => e.preventDefault() : onClick}
        >
            {icon && <span className="mr-2">{React.cloneElement(icon, { size: iconSize })}</span>}
            {children}
        </Link>
    );
}
