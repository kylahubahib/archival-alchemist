import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react';
import axios from 'axios';

const LibrarySearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [titleInputValue, setTitleInputValue] = useState('');
    const [users, setTitles] = useState([]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(titleInputValue); // Pass the query to the parent component
        // Do not clear titleInputValue here to keep the input value
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault(); // Prevent form submission on Enter
            setTitles([...users, e.target.value.trim()]); // Update title only
            // No need to clear titleInputValue here to retain input
            setTitleSuggestions([]); // Clear suggestions
        }
    };

    const handleTitleInputChange = (e) => {
        const { value } = e.target;
        setTitleInputValue(value);
        if (value.trim()) {
            fetchTitleSuggestions(value);
        } else {
            setTitleSuggestions([]);
        }
    };

    const fetchTitleSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/title/suggestions', {
                params: { query, users },
            });
            setTitleSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching title suggestions:', error.response?.data || error.message);
            setTitleSuggestions([]);
            setMessage('Unable to fetch title suggestions. Please try again later.');
        }
    };

    const handleTitleSuggestionSelect = (suggestion) => {
        setTitleInputValue(suggestion); // Set the input value to the selected suggestion
        setTitles([...users, suggestion]); // Optionally update titles if needed
        setTitleSuggestions([]); // Clear suggestions
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center relative">
            <input
                type="text"
                placeholder="Search..."
                className="w-96 px-4 py-2 rounded-l-full focus:outline-none flex-1"
                value={titleInputValue}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleKeyDown}
            />

            {titleSuggestions.length > 0 && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 rounded-b-lg shadow-md top-full">
                    {titleSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleTitleSuggestionSelect(suggestion.man_doc_title)}
                        >
                            {suggestion.man_doc_title}
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="submit"
                className="px-4 py-3 bg-gray-100 text-white font-semibold rounded-r-full hover:bg-gray-200 focus:outline-none focus:bg-customlightBlue flex items-center"
            >
                <FaSearch className="text-customBlue" size={20} />
            </button>
        </form>
    );
};

export default LibrarySearchBar;
