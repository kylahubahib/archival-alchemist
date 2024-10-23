import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload } from 'react-icons/fa';
import axios from 'axios';
import { Tooltip } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton';

const Manuscript = ({ user }) => {
    const [favorites, setFavorites] = useState(new Set());
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

    useEffect(() => {
        console.log('Updated Favorites:', favorites);
    }, [favorites]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) {
                console.log('No user available');
                return;
            }

            try {
                const response = await axios.get(`/user/${user.id}/favorites`);
                const favoritesData = response.data.map((favorite) => `${user.id}-${favorite.man_doc_id}`);
                setFavorites(new Set(favoritesData));
            } catch (error) {
                console.error('Error fetching user favorites:', error);
            }
        };

        fetchFavorites();
    }, [user]);

    const handleBookmark = async (manuscriptId) => {
        if (!user) {
            alert('You need to be logged in to bookmark.');
            return;
        }

        const favoriteKey = `${user.id}-${manuscriptId}`;
        const updatedFavorites = new Set(favorites);

        if (favorites.has(favoriteKey)) {
            // Optimistically remove the bookmark
            updatedFavorites.delete(favoriteKey);
            setFavorites(updatedFavorites);

            // Perform the backend removal
            await handleRemoveFavorite(manuscriptId);
        } else {
            // Optimistically add the bookmark
            updatedFavorites.add(favoriteKey);
            setFavorites(updatedFavorites);

            try {
                // Send the request to add the favorite to the backend
                await axios.post('/api/addfavorites', {
                    man_doc_id: manuscriptId,
                    user_id: user.id
                });
            } catch (error) {
                console.error('Error adding favorite:', error);
                // Revert the optimistic update on failure
                updatedFavorites.delete(favoriteKey);
                setFavorites(new Set(updatedFavorites));
            }
        }
    };


    const handleRemoveFavorite = async (manuscriptId) => {
        try {
            await axios.delete('/api/removefavorites', {
                data: { man_doc_id: manuscriptId }
            });

            const favoriteKey = `${user.id}-${manuscriptId}`;
            setFavorites((prev) => {
                const newFavorites = new Set(prev);
                newFavorites.delete(favoriteKey);
                return newFavorites;
            });

            // Optionally filter out the manuscript from the displayed list
            setManuscripts((prev) => prev.filter(manuscript => manuscript.id !== manuscriptId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    useEffect(() => {
        axios.get('/api/my-favorite-manuscripts')
            .then(response => {
                const data = response.data;

                const uniqueManuscripts = Array.from(new Set(data.map(item => item.id)))
                    .map(id => data.find(item => item.id === id));

                setManuscripts(uniqueManuscripts);
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

    if (loading) {
        return (
            <section className="w-full mx-auto my-4 mt-10 pt-10">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-full bg-white shadow-lg flex mb-4">
                        <Skeleton className="rounded w-40 h-full" />
                        <div className="flex-1 p-4">
                            <Skeleton className="h-6 mb-2" />
                            <Skeleton className="h-4 mb-2" />
                            <Skeleton className="h-4 mb-2" />
                            <Skeleton className="h-4 mb-4" />
                            <Skeleton className="h-6" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">Error: {error}</div>
        );
    }

    const manuscriptsToDisplay = searchResults.length > 0 ? searchResults : manuscripts;

    if (manuscriptsToDisplay.length === 0) {
        return                     <div className="max-w-7xl mx-auto bg-white shadow-lg flex justify-center h-screen items-center shadow-sm sm:rounded-lg sticky">
        <FaBookmark size={50} className="text-gray-500" />
        <p className="text-gray-500 mt-2">Favorite Manuscript Capstone will be added here.</p>
    </div>
    }

    return (
        <section className="w-full mx-auto my-4 mt-10 pt-10">
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
                        <p className="text-gray-700 mt-1">Author: {manuscript.authors?.map(author => author.name).join(', ') || 'No authors available'}</p>
                        <p className="text-gray-700 mt-1">Adviser: {manuscript.man_doc_adviser}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {manuscript.tags?.length > 0 ? (
                                manuscript.tags.map(tag => (
                                    <span key={tag.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                        {tag.tags_name}
                                    </span>
                                ))
                            ) : (
                                <p>No tags available</p>
                            )}
                        </div>

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
                                    className={`text-blue-500 ${favorites.has(`${user.id}-${manuscript.id}`) ? 'text-blur-500' : 'hover:text-gray-600'}`}
                                    onClick={() => handleBookmark(manuscript.id)}
                                >
                                    <FaBookmark size={20} />
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
