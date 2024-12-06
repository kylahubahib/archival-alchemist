import React, { useState, useEffect } from 'react';
import { FaEye, FaComment, FaBookmark, FaFileDownload, FaFilter, FaStar, FaQuoteLeft } from 'react-icons/fa';
import axios from 'axios';
import { Button, Tooltip } from '@nextui-org/react';
import RatingComponent from '@/Components/Ratings'
import Modal from '@/Components/Modal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from '@nextui-org/skeleton'; // Import Skeleton
import CommentSections from '@/Components/CommentSection'; // Import the LibrarySearchBar component
import ManuscriptComment from '@/Components/Manuscripts/ManuscriptComment'; // Import the LibrarySearchBar component
import SubscriptionCard from '@/Components/SubscriptionCard';
import AskUserToLogin from '@/Components/AskUserToLogin';
import PdfViewer from '@/Components/PdfViewer';
import ToggleComments from '@/Components/ToggleComments';

const UserRepository = ({auth, user, manuscript}) => {
    const [manuscripts, setManuscripts] = useState(manuscript);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [favorites, setFavorites] = useState(new Set());// State to manage favorites
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCiteModalOpen, setIsCiteModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0); // Store the rating value
    const [selectedManuscript, setSelectedManuscript] = useState(null); // Track selected manuscript
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [titleInputValue, setTitleInputValue] = useState(''); // State for the title input
    const [selectedSearchField, setSelectedSearchField] = useState("Title"); // Track selected search field
    const [commentStates, setCommentStates] = useState({}); // This will store the state for each manuscript
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null means we haven't checked yet
    const [ismodalOpen, setIsmodalOpen] = useState(false);
    const [isSubsModal, setIsSubsModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [isPremium, setIsPremium] = useState(null); // State to store premium status
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // For the login modal
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar visibility
    const [isMaximized, setIsMaximized] = useState(false);
    const [maximizedId, setMaximizedId] = useState(null); // Tracks which manuscript is maximized
    const resetRating = () => {
        setSelectedRating(0); // Reset the rating to 0 (or whatever your default is)
    };

    console.log('User Manuscripts: ', manuscripts);

    const handleClick = (id) => {
        // When the PDF is loaded, increment the view count
        axios
        .post(`/manuscripts/${id}/increment-view`)
        .then((response) => {
            console.log('View count incremented:', response.data);
        })
        .catch((error) => {
            console.error('Error incrementing view count:', error);
        });
    };

    const handleMaximize = (id) => {
        console.log("This is the mannuscripts ID: ", id)
      setMaximizedId((prevId) => (prevId === id ? null : id)); // Toggle maximization
      axios
      .post(`/manuscripts/${id}/increment-view`)
      .then((response) => {
          console.log('View count incremented:', response.data);
      })
      .catch((error) => {
          console.error('Error incrementing view count:', error);
      });

    };

      const toggleSidebar = () => {
          setIsSidebarOpen((prevState) => !prevState); // Toggle sidebar visibility
      };

      // Handle manuscript selection and opening the sidebar
      const handleComments = (id, title) => {
          // Store the selected manuscript's id and title in an object
          setSelectedManuscript({ id, title });
          setIsSidebarOpen(true);  // Open the sidebar
      };

      // Function to toggle maximized state
      const toggleMaximize = () => {
          setIsMaximized((prevState) => !prevState);
      };

      // Dynamic class for maximizing and minimizing
      const manuscriptClass = isMaximized
          ? "w-full h-screen"  // Maximize: Full width and height (or full screen)
          : "w-full h-[400px]"; // Minimize: Set to a smaller size



      // Fetch premium status and authentication info from the backend
      useEffect(() => {
          const fetchPremiumStatus = async () => {
          try {
              const response = await axios.get('/ispremium'); // No need to pass token, backend handles it
              console.log('Backend response:', response.data);

              setIsPremium(response.data.is_premium); // Set premium status
              setIsAuthenticated(response.data.is_authenticated); // Set authentication status
          } catch (err) {
              console.error('Error fetching premium status:', err.response || err);
          } finally {
              setIsLoading(false);
          }
          };

          fetchPremiumStatus();
      }, []);


        const openLoginModal = () => {
          setIsLoginModalOpen(true);
        };

        const closeLoginModal = () => {
          setIsLoginModalOpen(false);
        };

        const goToLoginPage = () => {
          // Implement your login redirection logic here
          window.location.href = '/login'; // or use react-router if it's a single-page app
        };



      const handlePdfLoad = () => {
        setIsLoading(false); // Set loading to false once PDF is loaded
      };

        // Reset loading state when the modal is opened again
    useEffect(() => {
      if (ismodalOpen) {
        setIsLoading(true); // Reset loading state when modal is opened
      }
    }, [ismodalOpen]); // Depend on modal open state


    const [pageCount, setPageCount] = useState(0);

    // Function to handle messages from iframe (i.e., page number changes)
    const handleIframeMessage = (event) => {
      // Ensure the message is coming from a trusted source
      if (event.origin === 'http://127.0.0.1:8000' || event.origin === 'https://mozilla.github.io') {
        const data = event.data;
        if (data.pageNumber) {
          setPageCount(data.pageNumber);
        }
      }
    };

    // Set up the event listener for receiving messages
    useEffect(() => {
      window.addEventListener('message', handleIframeMessage);

      return () => {
        window.removeEventListener('message', handleIframeMessage);
      };
    }, []);

    const openLogInModal = () => {
        setIsLoginModalOpen(true);
        console.log("Log in MOdal is open");
    };

    const openSubsModal = () => {
        setIsSubsModal(true);
        console.log("MOdal is open");
    };

    const openModal = (pdfUrl) => {
        setIsmodalOpen(true);
        // Pass the pdfUrl to the PDFViewer
    };


    const closeModal = () => {
      setIsmodalOpen(false);  // Assuming you're using useState to manage modal state
      setIsSubsModal(false);
    };


      // Function to update search results
      // Handler to receive the search input value
      const handleSearch = (inputValue) => {
          setTitleInputValue(inputValue); // Update the input value for display
          fetchManuscripts(inputValue, selectedSearchField); // Perform the search
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

    const toggleComments = () => {
        setShowComments(!showComments);
    };



    // if (loading) {
    //     return (
    //         <section className="w-full mx-auto my-4">
    //             {[...Array(3)].map((_, index) => (
    //                 <div key={index} className="w-full bg-white shadow-lg flex mb-4">
    //                     <div className="rounded w-40 h-full bg-gray-200 flex items-center justify-center">
    //                         <Skeleton className="w-36 h-46 rounded" />
    //                     </div>
    //                     <div className="flex-1 p-4">
    //                         <Skeleton className="h-6 mb-2" />
    //                         <Skeleton className="h-4 mb-2" />
    //                         <Skeleton className="h-4 mb-2" />
    //                         <Skeleton className="h-4 mb-4" />
    //                         <Skeleton className="h-6" />
    //                     </div>
    //                 </div>
    //             ))}
    //         </section>
    //     );
    // }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const manuscriptsToDisplay = searchResults.length > 0 ? searchResults : manuscripts;

    if (manuscriptsToDisplay.length === 0) {
        return <div className="flex justify-center items-center text-gray-400">No manuscripts available.</div>;
    }

    return (
        <section className="w-full mx-auto my-4 mt-8 ml-50">
            <div className="mb-6 w-full flex items-center gap-4"> {/* Adjusted to use flex and gap */}
            <div className="flex-grow  h-full">

{/* {loading && <div>Loading...</div>} */}
                    {error && <div>{error}</div>}
                    <div>
                        {manuscriptsToDisplay.length === 0 ? (
                            <div className="flex justify-center items-center text-gray-400">No manuscripts available.</div>
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
            </div>

            {manuscriptsToDisplay.map((manuscript) => (
                <div key={manuscript.id} className="w-full bg-white shadow-lg flex mb-4 text-sm">
{/* {console.log("Mao ni:", manuscriptsToDisplay)} */}

        <div
            className={`rounded ${maximizedId === manuscript.id ? 'w-full h-full' : 'w-40 h-48'} bg-gray-200 flex items-center justify-center relative transition-all duration-300 ease-in-out y-4 m-5`}
        >

            {isPremium ? (
                // If the user is premium, show the link directly
                // If the user is premium, show the link directly
            <div className="flex items-center justify-center h-full w-full text-gray-500">
                {maximizedId === manuscript.id ? (
                    manuscript.man_doc_content ? (
                    <PdfViewer pdfUrl={manuscript.man_doc_content} />
                    ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-500">
                        <p>No PDF available</p>
                    </div>
                    )
                ) : (
                    <div className="flex flex-col h-full w-full items-center justify-center text-center text-gray-800 text-xxxs p-2 bg-white border-2 mb-1 leading-tight">
                        {manuscript.man_doc_title}
                        <p className="block pt-12">By:</p> {/* This "By:" will now be on a new line */}
                        <p className="block">{manuscript.authors?.length > 0 ? (
                            <div>
                                {manuscript.authors.map((author, index) => (
                                    <p key={index} className="text-xxxs text-gray-800 mb-1 leading-tight">{author.name}</p>))}
                            </div>) : ( <p >Unknown Authors</p>)}
                        </p>
                        <p className="block pt-5">{new Date(manuscript.updated_at).getFullYear()}</p>
                    </div>
                )}

                        {/* Maximize / Minimize ButthandleMaximizeon */}
                        <button
                            onClick={() => handleMaximize(manuscript.id)}
                            className="text-xxxss absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-200 z-40"
                        >
                            {maximizedId === manuscript.id ? 'X' : 'Preview'}
                        </button>
                </div>

            ) : isAuthenticated ? (
            <div className="relative">
                {/* Static Thumbnail for Authenticated User */}
                <div className="flex items-center justify-center h-full w-full text-gray-500">
                <img className="rounded w-25 h-30"
                    src="/images/pdf2.png"
                    alt="PDF Thumbnail"
                />
                </div>    

                {/* Preview Button at bottom */}
                {/* <button onClick={openModal}
                className="absolute bottom-6 w-max bg-white opacity-75 border-2 border-gray-600 text-gray-800 px-12 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:text-opacity-100 focus:outline-none"
                >
                Preview
                </button> */}

            </div>
            ):null}


        </div>


        <div className="flex-1 p-4">
            <div>
                {/* {isPremium ? ( */}
                {/* // If the user is premium, show the link directly */}
                <h2 className="text-base font-bold text-gray-900">
                    <a onClick={() => handleClick(manuscript.id)} // Trigger the increment logic before opening the link
                        href={`http://127.0.0.1:8000/${manuscript.man_doc_content}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer transition-all duration-300 ease-in-out"
                    >
                        {manuscript.man_doc_title}
                    </a>
                </h2>
            </div>
            
            {/* Authors */}
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


            {/* Manuscript Card Menu */}
            <div className="mt-4 flex items-center gap-4">

                <Tooltip content="Views">
                    <div className={`flex items-center ${manuscript.man_doc_view_count > 0 ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-700 cursor-pointer`}>
                        <FaEye size={20} />
                        <span className="ml-1">{manuscript.man_doc_view_count}</span>
                    </div>
                </Tooltip>
                
                {/* Open Comment Sidebar Button */}
                <div
                    key={manuscript.id}
                    className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                        setSelectedManuscript(manuscript); // Set the selected manuscript
                        setIsSidebarOpen(true); // Ensure the sidebar opens
                    }}
                >
                    <FaComment size={20} />
                </div>

                {/* Render ToggleComments only if a manuscript is selected and the sidebar is open */}
                {selectedManuscript && isSidebarOpen && (
                    <ToggleComments
                        auth={auth}
                        manuscripts={selectedManuscript} // Pass the selected manuscript to ToggleComments
                        man_id={selectedManuscript.id} // Pass additional properties if needed
                        man_doc_title={selectedManuscript.man_doc_title}
                        isOpen={isSidebarOpen}
                        toggleSidebar={() => setIsSidebarOpen((prevState) => !prevState)} // Toggle the sidebar
                    />
                )}

                <Tooltip content="Bookmark">
                    <button
                        className="text-gray-600 hover:text-blue-500"
                        onClick={() => {
                            if (!isAuthenticated) {
                                // Show the login modal if the user is not authenticated
                                openLogInModal();
                            } else if (!isPremium) {
                                // Show the subscription modal if the user is not premium
                                openSubsModal();
                            } else {
                                // Proceed with the bookmark action if the user is premium and authenticated
                                handleBookmark(manuscript.id);
                            }
                        }}
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


                {/* Subscription Card Modal for Non-Premium Users */}
                {isSubsModal && (
                    <Modal show={isSubsModal} onClose={closeModal}>
                    <SubscriptionCard />
                    </Modal>
                )}

                {/* Modal for Non-Authenticated Users */}
                {isLoginModalOpen && !isAuthenticated && (
                    <Modal show={isLoginModalOpen} onClose={closeLoginModal}>
                    </Modal>
                )}

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
                                disable='true'
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
                {/* Conditionally Render ManuscriptComment */}
                {commentStates[manuscript.id] && (
                    <div>
                        <ManuscriptComment manuscriptId={manuscript.id} /> {/* You can pass the manuscriptId to the comment component if needed */}
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

export default UserRepository;
