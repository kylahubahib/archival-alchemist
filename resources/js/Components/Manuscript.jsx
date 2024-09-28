import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload } from 'react-icons/fa';
import axios from 'axios';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar'; // Import the LibrarySearchBar component
import { Tooltip } from '@nextui-org/react';

const Manuscript = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // State to hold search results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([
        { user: 'Commenter 1', text: 'This is a comment.' },
        { user: 'Commenter 2', text: 'This is another comment.' },
        { user: 'Commenter 3', text: 'This is yet another comment.' },
    ]);

    useEffect(() => {
        console.log('Fetching manuscripts...');
        axios.get('/api/approved-manuscripts')
            .then(response => {
                console.log('Fetched manuscripts:', response.data);
                const data = response.data;

                // Remove duplicates
                const uniqueManuscripts = Array.from(new Set(data.map(item => item.id)))
                    .map(id => data.find(item => item.id === id));

                console.log('Unique Manuscripts:', uniqueManuscripts);
                setManuscripts(uniqueManuscripts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching manuscripts:', error);
                setError('An error occurred while fetching the data.');
                setLoading(false);
            });
    }, []); // Empty dependency array ensures this runs only once

    // Function to update search results
    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const manuscriptsToDisplay = searchResults.length > 0 ? searchResults : manuscripts; // Use search results if available

    if (manuscriptsToDisplay.length === 0) {
        return <div>No manuscripts available.</div>;
    }

    return (
        <section className="w-full mx-auto my-4">
            <div className="mb-6"> {/* Add margin-bottom here */}
                <SearchBar onSearchResults={handleSearchResults} /> {/* Add the search bar */}
    </div>

            {manuscriptsToDisplay.map((manuscript) => (
                <div key={manuscript.id} className="w-full bg-white shadow-lg flex mb-4">
                    <div className="rounded w-40 h-full bg-gray-200 flex items-center justify-center">
                        <img
                            className="rounded w-36 h-46"
                            src="https://via.placeholder.com/150"
                            alt="Book"
                        />
                    </div>
                    <div className="flex-1 p-4">
                        <h2 className="text-xl font-bold text-gray-900">{manuscript.man_doc_title}</h2>
                        <p className="text-gray-700 mt-1">Author/s: {manuscript.man_doc_author}</p>
                        <p className="text-gray-700 mt-1">Adviser/s: {manuscript.man_doc_adviser}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="bg-gray-200 px-2 py-1 text-sm rounded">php</span>
                            <span className="bg-gray-200 px-2 py-1 text-sm rounded">react</span>
                            <span className="bg-gray-200 px-2 py-1 text-sm rounded">Laravel</span>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className={`flex items-center ${manuscript.man_doc_view_count > 0 ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`}>
                                <FaEye size={20} />
                                <span className="ml-1">{manuscript.man_doc_view_count}</span>
                            </div>
                            <div className={`flex items-center ${comments.length > 0 ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`} onClick={toggleComments}>
                                <FaComment size={20} />
                                <span className="ml-1">
                                    {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'No comments yet'}
                                </span>
                            </div>

                            {/* DAvid */}
                            <Tooltip content="Button">
                            <button className={`text-gray-600 hover:text-blue-500 ${false ? 'text-blue-500' : ''}`} onClick={() => { /* Handle bookmark */ }}>
                                <FaBookmark size={20} />
                            </button>
                            </Tooltip>

                            <button className="text-gray-600 hover:text-gray-900">
                                <FaFileDownload size={20} />
                            </button>
                        </div>
                        {showComments && (
                            <div className="mt-4 space-y-4">
                                {comments.map((comment, index) => (
                                    <div key={index} className="border p-2 rounded">
                                        <p className="font-bold">{comment.user}</p>
                                        <p>{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Manuscript;
