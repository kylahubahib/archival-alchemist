import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar } from "@nextui-org/react";

const UserProfileSearchBar = ({ onSearchResults, ...props }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]); // State to hold search results
    const [loading, setLoading] = useState(false); // Loading state for feedback
    const [error, setError] = useState(null); // Error state for error handling

    // Handle query changes
    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle search request
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous results and errors before making a new search
        setResults([]);
        setError(null);
        setLoading(true);

        // Make the API call to search
        try {
            const response = await axios.get('/search', {
                params: { query },
            });
            // Update the state with the search results
            setResults(response.data);
            // Optionally, call the onSearchResults prop with the response data
            // onSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('An error occurred while fetching the results.');
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to only search when query length > 2 to avoid unnecessary API calls
    useEffect(() => {
        if (query.length > 2) {
            handleSubmit(); // Trigger search after user types at least 3 characters
        } else {
            setResults([]); // Clear results when query is too short
        }
    }, [query]); // Runs whenever the query changes

    return (
        <div className="flex flex-col">
        
        <div className="relative bg-white rounded-b-lg rounded-t-[20px] shadow-md ">
            <form onSubmit={handleSubmit} className="flex w-full">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    className="w-96 px-4 py-2 rounded-l-full focus:outline-none"
                    placeholder="Search user profiles..."
                    {...props}
                />
                <button
                    type="submit"
                    className="px-4 py-3 bg-gray-100 text-white font-semibold rounded-r-full hover:bg-gray-200 flex ">
                    <FaSearch className="text-customBlue" size={16} />
                </button>
            </form>

            <div className="">
                {loading && <p>Loading...</p>} {/* Show loading indicator */}
                {error && <p className="text-red-500">{error}</p>} {/* Show error message */}

                {/* Display results if available */}
                {results.length > 0 && (
                    <ul className="max-h-64 overflow-auto">
                        {results.map((result, index) => (
                            <li key={index} className="border-b flex space-x-2">
                                <Avatar src={result.user_pic}/>
                                <div className="font-semibold">{result.name}</div>
                            </li>
                        ))}
                    </ul>
                )}

               
            </div>
            </div>
        </div>
    );
};

export default UserProfileSearchBar;
