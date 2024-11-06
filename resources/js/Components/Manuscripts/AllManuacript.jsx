import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaComment, FaBookmark, FaFileDownload, FaFilter, FaStar, FaQuoteLeft } from 'react-icons/fa';
import RatingComponent from '@/Components/Ratings'
import Modal from '@/Components/Modal'
import axios from 'axios';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar'; // Import the LibrarySearchBar component
import { Tooltip, Button } from '@nextui-org/react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton

const Manuscript = ({user, choice}) => {
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCiteModalOpen, setIsCiteModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0); // Store the rating value
    const [selectedManuscript, setSelectedManuscript] = useState(null); // Track selected manuscript

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [titleInputValue, setTitleInputValue] = useState(''); // State for the title input
    const [selectedSearchField, setSelectedSearchField] = useState("Title"); // Track selected search field


    // Function to update search results
    // Handler to receive the search input value
    const handleSearch = (inputValue) => {
        setTitleInputValue(inputValue); // Update the input value for display
        fetchManuscripts(inputValue, selectedSearchField); // Perform the search
    };


    const resetRating = () => {
        setSelectedRating(0); // Reset the rating to 0 (or whatever your default is)
    };


     // Handle opening the modal and setting the title
     const handleRatings = (manuscript) => {
        setSelectedManuscript(manuscript); // Store the manuscript for later use
        setIsModalOpen(true);
    };


     // Handle opening the modal and setting the title
     const handleCitation = (manuscript) => {
        setSelectedManuscript(manuscript); // Store the manuscript for later use
        setIsCiteModalOpen(true);
    };


    // Handle the rating submission
    const handleSubmit = async () => {
        if (!selectedManuscript || selectedRating === 0) {
            toast.error('Please select a rating before submitting.');
            return;
        }

        try {
            const response = await fetch('/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    manuscript_id: selectedManuscript.id,
                    rating: selectedRating
                }),
            });

            if (response.status === 401) {
                toast.error('To submit a rating, please log in.');
                resetRating(); // Reset rating after successful submission
                return;
            }

            if (response.status === 409) {
                const data = await response.json();
                toast.error(data.message || 'You have already rated this manuscript.');
                resetRating(); // Reset rating after successful submission
                return;
            }

            if (response.status === 422) {
                const errorData = await response.json();
                resetRating(); // Reset rating after successful submission
                toast.error(errorData.message || 'Validation error.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to submit rating');
                resetRating(); // Reset rating after successful submission
                return;
            }

            const data = await response.json();
            toast.info('Rating submitted successfully!');
            resetRating(); // Reset rating after successful submission
            setIsModalOpen(false); // Close the modal after submission
        } catch (error) {
            console.error(error);
            toast.error('Error submitting rating: ' + error.message);
        }
    };


    const handleDownload = async (manuscriptId, title) => {
        console.log("Attempting to download manuscript ID:", manuscriptId); // Log manuscript ID
        try {
            const response = await axios.get(`/manuscript/${manuscriptId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            // Set the filename with .pdf extension
            const fileName = title ? `${title}.pdf` : 'file.pdf';
            link.href = url;
            link.setAttribute('download', fileName); // Use the title or a default file name
            document.body.appendChild(link);
            link.click();

            // Clean up: remove the link after clicking
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Optional: release memory
        } catch (error) {
            console.error('Error downloading the PDF:', error);
            alert('There was an error downloading the file. Please try again.'); // Optional: user feedback
        }
    };


    // Log the updated favorites whenever it changes
    useEffect(() => {
        console.log('Updated Favorites:', favorites);
    }, [favorites]);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Search By: Title"]));

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );


    // Log user to see if it's being passed correctdownloadly
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


    // useEffect to fetch manuscripts based on titleInputValue
     // useEffect to fetch all manuscripts on mount
    // Effect to fetch all manuscripts on component mount
    useEffect(() => {
        let isMounted = true; // flag to track if the component is mounted

        const fetchAllManuscripts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/published-manuscripts');
                if (isMounted) {
                    // Only set state if the component is still mounted
                    setManuscripts(response.data);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error('Error fetching manuscripts.'); // Show toast on error
                    setError('An error occurred while fetching the data.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllManuscripts();

        return () => {
            isMounted = false; // Cleanup flag when component unmounts
        };
    }, []);


    const fetchManuscripts = async (keyword, searchField) => {
        if (!keyword) return; // Exit early if no keyword input
        setLoading(true);
        try {
            // Construct the query with the selected search field
            const response = await axios.get(`/api/published-manuscripts`, {
                params: { keyword, searchField }
            });
            setManuscripts(response.data);
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            setError('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

// Update the dropdown selection handler
const handleDropdownChange = (selectedKey) => {
    setSelectedSearchField(selectedKey); // Set the selected key directly as a string
};


    const toggleComments = () => {
        setShowComments(!showComments);
    };




    if (loading) {
        return (
            <section className="w-full mx-auto my-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-full bg-white shadow-lg flex mb-4">
                        <div className="rounded w-40 h-full bg-gray-200 flex items-center justify-center">
                            <Skeleton className="w-36 h-46 rounded" />
                        </div>
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
        return <div>Error: {error}</div>;
    }

    const manuscriptsToDisplay = searchResults.length > 0 ? searchResults : manuscripts; // Use search results if available

    if (manuscriptsToDisplay.length === 0) {
        return <div>No manuscripts available.</div>;
    }

    return (
        <section className="w-full mx-auto my-4">
            <div className="mb-6 w-full flex items-center gap-4"> {/* Adjusted to use flex and gap */}
            <div className="flex-grow">
            <SearchBar onSearch={handleSearch} selectedSearchField={selectedSearchField} titleInputValue={titleInputValue} // Maintain the value here
    setTitleInputValue={setTitleInputValue} // Optionally, for managing the input state
/>

                {loading && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    <div>
                        {manuscriptsToDisplay.length === 0 ? (
                            <div>No manuscripts available.</div>
                        ) : (
                            manuscriptsToDisplay.map(manuscript => (
                                <div key={manuscript.id}>
                                    <h2>{manuscript.title}</h2>
                                    {/* Add other manuscript details here */}
                                </div>
                            ))
                        )}
                    </div>
            </div>
                <div className="w-[200px]"> {/* Set dropdown button width to 50px */}
                <Dropdown>
                    <DropdownTrigger className="w-full">
                        <Button variant="bordered" className="capitalize w-full flex justify-between items-center">
                            {selectedSearchField}
                            <FaFilter className="mr-2 text-gray-500" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Search Field Selection"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={new Set([selectedSearchField])}
                        onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys).join(""); // Convert Set to string
                            handleDropdownChange(selectedKey);
                        }}>
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
                <h2 className="text-xl font-bold text-gray-900">
                <a
                    href={`http://127.0.0.1:8000/${manuscript.man_doc_content}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer transition-all duration-300 ease-in-out"
                >
                    {manuscript.man_doc_title}
                </a>


                    </h2>
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
                                <button
                                    className="text-gray-600 hover:text-blue-500"
                                    onClick={() => handleDownload(manuscript.id, manuscript.man_doc_title)}
                                >
                                    <FaFileDownload size={20} />
                                </button>
                            </Tooltip>

                            <Tooltip content="Ratings">
                                <button
                                    className="text-gray-600 hover:text-blue-500"
                                    onClick={() => handleRatings(manuscript)}
                                >
                                    <FaStar size={20} />
                                </button>
                            </Tooltip>
                            <Tooltip content="Cite">
                                <button
                                    className="text-gray-600 hover:text-blue-500"
                                    onClick={() => handleCitation(manuscript)}
                                >
                                    <FaQuoteLeft size={20} />
                                </button>
                            </Tooltip>

                {/* Rendering the ratings modal */}
                {isModalOpen && (
                    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <button
                                Disable='true'
                                className="bg-gray-300 text-gray-500 py-4 px-4 font-bold rounded w-full"
                                // onClick={handleSubmit}
                            >
                                We systematically review all ratings to enhance our services, and we highly value them.
                            </button>
                        <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4  text-center text-gray-500">
                                {selectedManuscript ? selectedManuscript.man_doc_title : ''}
                            </h2>

                            {/* Ratings component */}
                            <RatingComponent
                                rating={selectedRating}
                                onRatingChange={(newRating) => {
                                    setSelectedRating(newRating);

                                }} // Capture rating
                            />

                            {/* Submit button */}
                            <button
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </Modal>
                )}


                {/* Rendering the citation modal */}
                {isCiteModalOpen && (
                    <Modal
                        show={isCiteModalOpen}
                        onClose={() => setIsCiteModalOpen(false)}
                        className="w-full bg-black bg-opacity-50"
                    >
                        <div className="rounded shadow-2xl p-8 w-full transform transition-all ease-in-out duration-300">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cite This Manuscript</h2>
                            <div className="flex flex-col items-start p-6 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-md">
                                <div className="w-full">
                                    <div className="bg-blue-100 p-4 rounded-md w-full relative">
                                        <p className="text-gray-800 text-sm">
                                            <strong>APA Citation:</strong>
                                        </p>
                                        <p className="text-gray-700 mt-1 text-sm italic">
                                            {selectedManuscript ? (() => {
                                                const authors = selectedManuscript.authors.map(author => author.name);
                                                const year = new Date(selectedManuscript.created_at).getFullYear();
                                                const title = selectedManuscript.man_doc_title;

                                                // Constructing the citation
                                                if (authors.length === 1) {
                                                    return `${authors[0]} (${year}). ${title}.`;
                                                } else if (authors.length === 2) {
                                                    return `${authors[0]} & ${authors[1]} (${year}). ${title}.`;
                                                } else if (authors.length >= 3) {
                                                    return `${authors[0]} et al. (${year}). ${title}.`;
                                                }
                                            })() : ''}
                                        </p>

                                        <Tooltip content="Copy Citation">
                                            <button
                                                className="absolute top-2 right-2 p-1 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                                onClick={() => {
                                                    const authors = selectedManuscript.authors.map(author => author.name).join(', ');
                                                    const citationText = `${authors}. (${new Date(selectedManuscript.created_at).getFullYear()}). ${selectedManuscript.man_doc_title}.`;
                                                    navigator.clipboard.writeText(citationText);
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    <path d="M16 1H8C6.9 1 6 1.9 6 3v2H5C3.9 5 3 5.9 3 7v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3V3c0-1.1-.9-2-2-2zm-8 2h8v2H8V3zm8 17H6V7h10v13zm2-3h-1V8h1v9z" />
                                                </svg>
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="mt-4 w-full">
                                    <p className="text-gray-700 mt-2 text-sm">
                                        <strong>Abstract:</strong> {selectedManuscript ? selectedManuscript.man_doc_description : 'Not available'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

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
            <ToastContainer // Include ToastContainer for displaying toasts
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </section>
    );
}

export default Manuscript;
