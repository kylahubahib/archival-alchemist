import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload, FaFilter, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Tooltip } from '@nextui-org/react';
import { Button } from "@nextui-org/react";
import RatingComponent from '@/Components/Ratings'
import Modal from '@/Components/Modal'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import PdfViewer from '@/Components/PdfViewer'
import Sidebar from '@/Components/ToggleComments'

const Manuscript = ({ user }) => {
    const [favorites, setFavorites] = useState(new Set());
    const [manuscripts, setManuscripts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCiteModalOpen, setIsCiteModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0); // Store the rating value
    const [selectedManuscript, setSelectedManuscript] = useState(null); // Track selected manuscript
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar visibility

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState); // Toggle sidebar visibility
    };
    const [isMaximized, setIsMaximized] = useState(false); // State to track if maximized or not

    // Function to toggle maximized state
    const toggleMaximize = () => {
        setIsMaximized((prevState) => !prevState);
    };

    // Dynamic class for maximizing and minimizing
    const manuscriptClass = isMaximized
        ? "w-full h-screen"  // Maximize: Full width and height (or full screen)
        : "w-full h-[400px]"; // Minimize: Set to a smaller size



    const resetRating = () => {
        setSelectedRating(0); // Reset the rating to 0 (or whatever your default is)
    };

     // Handle opening the modal and setting the title
     const handleRatings = (manuscript) => {
        setSelectedManuscript(manuscript); // Store the manuscript for later use
        setIsModalOpen(true);
    };

    const resetCitation = () => {
        setSelectedRating(0); // Reset the rating to 0 (or whatever your default is)
    };

     // Handle opening the modal and setting the title
     const handleCitation = (manuscript) => {
        setSelectedManuscript(manuscript); // Store the manuscript for later use
        setIsCiteModalOpen(true);
    };


// Rating Component Reset Logic
const handleClick = (value) => {
    onRatingChange(value);
    resetRating(); // This can be called if you need a specific reset behavior
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
        // <section className="w-full mx-auto my-4 mt-10 pt-10">
        <section className="w-[95%] mx-auto my-3 pt-10">
            {manuscriptsToDisplay.map((manuscript) => (
                <div key={manuscript.id} className="w-full bg-white shadow-lg flex mb-4 text-sm">
                   <div
                        className={`rounded ${isMaximized ? 'w-full h-full' : 'w-40 h-48'} bg-gray-200 flex items-center justify-center relative transition-all duration-300 ease-in-out`}
                    >
                        {manuscript.man_doc_content ? (
                            <PdfViewer pdfUrl={manuscript.man_doc_content} />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full text-gray-500">
                                <p>No PDF available</p>
                            </div>
                        )}

                        {/* Maximize / Minimize Button */}
                        <button
                            onClick={toggleMaximize}
                            className="absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            {isMaximized ? 'Minimize' : 'Maximize'}
                        </button>
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

                            <div
                className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={toggleSidebar}>
                <FaComment size={20} />
            </div>
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                            <Tooltip content="Bookmark">
                                <button
                                    className={`text-blue-500 ${favorites.has(`${user.id}-${manuscript.id}`) ? 'text-blur-500' : 'hover:text-gray-600'}`}
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
                            </div>
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
