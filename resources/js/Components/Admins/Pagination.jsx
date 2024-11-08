import React from 'react';
import { Link } from '@inertiajs/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ tableData, onClick, ...props }) {

    return (
        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0" aria-label="Table navigation">
            <span className="text-sm text-customGray">
                Showing&nbsp;
                <span className="font-bold text-customBlue">{tableData.from ?? 0}</span> to&nbsp;
                <span className="font-bold text-customBlue">{tableData.to ?? 0}</span> of&nbsp;
                <span className="font-bold text-customBlue">{tableData.total ?? 0}&nbsp;</span>
                entries
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
                {tableData.links.map((link, index) => {
                    const isPrevious = link.label === "&laquo; Previous";
                    const isNext = link.label === "Next &raquo;";
                    return link.url ? (
                        <Link
                            preserveState
                            preserveScroll
                            {...props}
                            href={link.url}
                            key={index}
                            onClick={link.active ? (e) => e.preventDefault() : onClick}
                            className={`flex items-center font-bold justify-center text-xs py-2 px-3 leading-tight border tracking-wide
                            ${link.active ? "bg-customBlue text-white border-customBlue font-bold cursor-default" : "text-customGray border-customLightGray bg-white hover:bg-customLightBlue"}`}
                        >
                            {isPrevious ? <FaChevronLeft /> : isNext ? <FaChevronRight /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                        </Link>
                    ) : (
                        <span
                            key={index}
                            className="bg-customLightGray text-gray-400 font-bold tracking-wide flex items-center justify-center text-xs py-2 px-3 leading-tight border border-gray-300"
                        >
                            {isPrevious ? <FaChevronLeft /> : isNext ? <FaChevronRight /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                        </span>
                    );
                })}
            </ul>
        </nav >
    );
}
