import { FaSearch } from "react-icons/fa"; 
import React, { useState } from 'react';

const SearchBar = ({ onSearch}) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className={`flex items-center ` }>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                className={` w-96 px-4 py-2 rounded-l-full focus:outline-none flex-1 `} 
            />
            <button
                type="submit"
                className=" px-4 py-3 bg-gray-100 text-white font-semibold rounded-r-full 
                hover:bg-gray-200 focus:outline-none focus:bg-customlightBlue flex items-center">
                <FaSearch className="text-customBlue" size={20} />
            </button>
        </form>
    );
};

export default SearchBar;
