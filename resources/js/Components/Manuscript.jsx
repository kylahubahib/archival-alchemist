import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload, FaFilter  } from 'react-icons/fa';
import axios from 'axios';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar'; // Import the LibrarySearchBar component
import { Tooltip, Button } from '@nextui-org/react';
// import {Button} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
const Manuscript = ({user}) => {
    const [favorites, setFavorites] = useState(new Set());
     const [userId, setUserId] = useState(null); // Store the current logged-in user ID
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

    // Log the updated favorites whenever it changes
    useEffect(() => {
        console.log('Updated Favorites:', favorites);
    }, [favorites]);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Search By"]));

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );


    // Log user to see if it's being passed correctly
     // Fetch user favorites and store them in state
     useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) {
                console.log('No user available');
                return;
            }

            console.log(`Fetching favorites for user: ${user.id}`);

            try {
                const response = await axios.get(`/user/${user.id}/favorites`);
                const favoritesData = response.data.map((favorite) => `${user.id}-${favorite.man_doc_id}`);
                setFavorites(new Set(favoritesData));
                console.log(`Fetched favorites for user ${user.id}:`, favoritesData);
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
        if (favorites.has(favoriteKey)) {
            // Manuscript is already favorited by the current user, remove it
            await handleRemoveFavorite(manuscriptId);
        } else {
            // Manuscript is not favorited by the current user, add it
            await handleAddFavorite(manuscriptId);
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
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const handleAddFavorite = async (manuscriptId) => {
        try {
            await axios.post('/api/addfavorites', { man_doc_id: manuscriptId });

            const favoriteKey = `${user.id}-${manuscriptId}`;
            setFavorites((prev) => {
                const newFavorites = new Set(prev);
                newFavorites.add(favoriteKey);
                return newFavorites;
            });
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };




    useEffect(() => {
        console.log('Fetching manuscripts...');
        axios.get('/api/approved-manuscripts')
        .then(response => {
            console.log('Fetched manuscripts with tags:', response.data);
            const data = response.data;

            response.data.forEach(manuscript => {
                console.log('Manuscript Tags:', manuscript.tags); // Log tags for each manuscript
            });


            response.data.forEach(manuscript => {
                console.log('Manuscript Author:', manuscript.authors); // Log users for each manuscript
            });

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
        return (
            <Button color="primary" isLoading>
              Loading
            </Button>
          );
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
            <div className="mb-6 w-full flex items-center gap-4"> {/* Adjusted to use flex and gap */}
                <div className="flex-grow"> {/* SearchBar will take up the remaining space */}
                    <SearchBar onSearchResults={handleSearchResults} /> {/* Add the search bar */}
                </div>
                <div className="w-[200px]"> {/* Set dropdown button width to 50px */}
                    <Dropdown>
                        <DropdownTrigger className="w-full">
                            <Button
                                variant="bordered"
                                className="capitalize w-full flex justify-between items-center" // Flex to align text and icon
                            >
                                {selectedValue} {/* Default value displayed */}
                                <FaFilter className="mr-2 text-gray-500" /> {/* Filter icon */}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            {/* Remove the "Search by" option from the choices */}
                            <DropdownItem key="Title">Title</DropdownItem>
                            <DropdownItem key="Tags">Tags</DropdownItem>
                            <DropdownItem key="Authors">Authors</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
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
                {/* <p className="text-gray-700 mt-1">Author: {user.name}</p> */}

                {/* Display the users here */}
                <div className="mt-2 flex flex-wrap gap-2">
                    <p className="text-gray-700 mt-1">Author:</p>
                    {manuscript.authors?.length > 0 ? (
                        <p className="text-gray-700 mt-1">
                            {manuscript.authors.map(author => author.name).join(', ')}
                        </p>
                    ) : (
                        <p className="text-gray-700 mt-1">No authors Avialable</p>
                    )}
                </div>

                <p className="text-gray-700 mt-1">Adviser: {manuscript.man_doc_adviser}</p>

                {/* Display the tags here */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {manuscript.tags && manuscript.tags.length > 0 ? ( // Check if tags exist and if the length is greater than 0
                        manuscript.tags.map(tag => ( // Map through the tags array
                            <span key={tag.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                                {tag.tags_name} {/* Display the tag name */}
                            </span>
                        ))
                    ) : (
                        <p>No tags available</p> // Display message if no tags are found
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
                                        className="text-gray-600 hover:text-blue-500"
                                        onClick={() => handleBookmark(manuscript.id)}
                                    >
                                        <FaBookmark size={20} />
                                    </button>
                                </Tooltip>

                    <Tooltip content="Download">
                    <button className="text-gray-600 hover:text-gray-900">
                        <FaFileDownload size={20} />
                    </button></Tooltip>
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
