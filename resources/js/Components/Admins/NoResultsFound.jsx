import React from 'react';
import { TypeAnimation } from 'react-type-animation';

export default function NoResultsFound({ title = "No results found", message = "Try searching or adjusting filters again." }) {
    return (
        <div className="flex flex-col tracking-wider h-[45vh] justify-center items-center">
            <img className="h-[150px]" src="/images/no-search-results.gif" alt="No Results" />
            <p className="text-2xl font-bold animate-appearance-in duration-700 text-customGray">
                {title}
            </p>
            <TypeAnimation
                sequence={[
                    700, // Delay before animation starts
                    message,
                ]}
                speed={70}
                wrapper="span"
                repeat={1}
                className="text-md"
            />
        </div>
    );
}
