import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload } from 'react-icons/fa';
import axios from 'axios';
import { Button, Tooltip } from '@nextui-org/react';

const Manuscript = ({user}) => {
    const [manuscripts, setManuscripts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([
        { user: 'Commenter 1', text: 'This is a comment.' },
        { user: 'Commenter 2', text: 'This is another comment.' },
        { user: 'Commenter 3', text: 'This is yet another comment.' },
    ]);
    const [favorites, setFavorites] = useState(new Set());// State to manage favorites



    const handleRemoveFavorite = (manuscriptId) => {
        axios.delete('/api/favorites', {
            data: { man_doc_id: manuscriptId } // Send the manuscript ID in the request body
        })
        .then(response => {
            console.log(response.data.message);
            setFavorites((prev) => {
                const newFavorites = new Set(prev);
                newFavorites.delete(manuscriptId); // Remove from favorites
                return newFavorites;
            });
        })
        .catch(error => {
            console.error('Error removing favorite:', error);
        });
    };




    useEffect(() => {
        console.log('Fetching manuscripts...');
        axios.get('/api/my-approved-manuscripts')
        .then(response => {
            console.log('Fetched manuscripts with tags:', response.data);
            setManuscripts(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching manuscripts:', error);
            setError('An error occurred while fetching the data.');
            setLoading(false);
        });
    }, []);

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    // Function to handle bookmark click
    const handleBookmark = (manuscriptId) => {
        if (favorites.includes(manuscriptId)) {
            // If already favorited, remove from favorites
            setFavorites(favorites.filter(id => id !== manuscriptId));
        } else {
            // Otherwise, add to favorites
            setFavorites([...favorites, manuscriptId]);
        }
    };

    if (loading) {
        return <Button color="primary" isLoading>Loading</Button>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const manuscriptsToDisplay = searchResults.length > 0 ? searchResults : manuscripts;

    if (manuscriptsToDisplay.length === 0) {
        return <div>No manuscripts available.</div>;
    }

    return (
        <section className="w-full mx-auto my-4">
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
                        <div className="mt-2 flex flex-wrap gap-2">
                            <p className="text-gray-700 mt-1">Author:</p>
                            {manuscript.authors?.length > 0 ? (
                                <p className="text-gray-700 mt-1">
                                    {manuscript.authors.map(author => author.name).join(', ')}
                                </p>
                            ) : (
                                <p className="text-gray-700 mt-1">No authors available</p>
                            )}
                        </div>

                        <p className="text-gray-700 mt-1">Adviser: {manuscript.man_doc_adviser}</p>

                        <div className="mt-4 flex items-center gap-4">
                            <Tooltip content="Views">
                                <div className={`flex items-center ${manuscript.man_doc_view_count > 0 ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`}>
                                    <FaEye size={20} />
                                    <span className="ml-1">{manuscript.man_doc_view_count}</span>
                                </div>
                            </Tooltip>

                            <div className={`flex items-center ${comments.length > 0 ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`} onClick={toggleComments}>
                                <FaComment size={20} />
                                <span className="ml-1">
                                    {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? 's' : ''}` : 'No comments yet'}
                                </span>
                            </div>
                            <Tooltip content="Bookmark">
                                <button
                                    className="text-gray-600 hover:text-blue-500"
                                    onClick={() => handleRemoveFavorite(manuscript.id)}
                                >
                                    <FaBookmark size={20} color={favorites.has(manuscript.id) ? 'blue' : 'gray'} />
                                </button>
                            </Tooltip>

                            <Tooltip content="Download">
                                <button className="text-gray-600 hover:text-gray-900">
                                    <FaFileDownload size={20} />
                                </button>
                            </Tooltip>
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
