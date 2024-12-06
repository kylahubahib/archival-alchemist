import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LibrarySearchBar = ({ onSearch, selectedSearchField, titleInputValue, setTitleInputValue }) => {
    const [message, setMessage] = useState('');
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false); // Start with suggestions hidden

    useEffect(() => {
        setInputValue(titleInputValue); // Sync with parent component's state
    }, [titleInputValue]);

    useEffect(() => {
        if (inputValue.trim() && showSuggestions) {
            if (selectedSearchField === 'Title') {
                fetchTitleSuggestions(inputValue);
            } else if (selectedSearchField === 'Tags') {
                fetchTagsSuggestions(inputValue);
            } else if (selectedSearchField === 'Authors') {
                fetchAuthorsSuggestions(inputValue);
            }
        } else {
            clearSuggestions(); // Clear suggestions if input is empty or not showing
        }
    }, [selectedSearchField, inputValue, showSuggestions]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (inputValue.trim()) {
            onSearch(inputValue); // Perform the search
            setShowSuggestions(false); // Hide suggestions after search
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value); // Update local input state
        setTitleInputValue(value); // Update parent component's state
        setShowSuggestions(true); // Show suggestions again when typing
    };

    const clearSuggestions = () => {
        setTitleSuggestions([]);
        setTagSuggestions([]);
        setAuthorSuggestions([]);
    };

    const fetchTitleSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/title/suggestions', { params: { query } });
            setTitleSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching title suggestions:', error);
            setMessage('Unable to fetch title suggestions. Please try again later.');
        }
    };

    const fetchTagsSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/tags/suggestions', { params: { query } });
            setTagSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching tag suggestions:', error);
            setMessage('Unable to fetch tag suggestions. Please try again later.');
        }
    };

    const fetchAuthorsSuggestions = async (query) => {
        try {
            const response = await axios.get('/api/authors/suggestions', { params: { query } });
            setAuthorSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching author suggestions:', error);
            setMessage('Unable to fetch author suggestions. Please try again later.');
        }
    };

    const handleSuggestionSelect = (suggestion) => {
        setInputValue(suggestion);
        clearSuggestions();
        setShowSuggestions(false); // Hide suggestions after selection
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center relative">
            <input
                type="text"
                placeholder={`Search manuscripts by ${selectedSearchField}...`}
                className="w-96 px-4 py-2 rounded-l-full focus:outline-none flex-1"
                value={inputValue} // Bind input value to state
                onChange={handleInputChange}
            />

            {showSuggestions && (titleSuggestions.length > 0 || tagSuggestions.length > 0 || authorSuggestions.length > 0) && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto z-10 rounded-b-lg shadow-md top-full">
                    {(selectedSearchField === 'Title' ? titleSuggestions : selectedSearchField === 'Tags' ? tagSuggestions : authorSuggestions).map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSuggestionSelect(
                                selectedSearchField === 'Title' ? suggestion.man_doc_title :
                                selectedSearchField === 'Tags' ? suggestion.tags_name :
                                suggestion.name
                            )}
                        >
                            {selectedSearchField === 'Title' ? suggestion.man_doc_title :
                             selectedSearchField === 'Tags' ? suggestion.tags_name :
                             suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
            <button type="submit" className="px-4 py-3 bg-gray-100 text-white font-semibold rounded-r-full hover:bg-gray-200 focus:outline-none flex items-center">
                <FaSearch className="text-customBlue" size={20} />
            </button>
        </form>
    );
};

export default LibrarySearchBar;