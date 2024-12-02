import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaComment, FaBookmark, FaFileDownload, FaFilter, FaStar, FaQuoteLeft } from 'react-icons/fa';
import RatingComponent from '@/Components/Ratings'
import Modal from '@/Components/Modal'
import axios from 'axios';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar'; // Import the LibrarySearchBar component
import {Tooltip, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { Skeleton } from '@nextui-org/skeleton'; // Import //Skeleton
import CommentSections from '@/Components/CommentSection'; // Import the LibrarySearchBar component
import ManuscriptComment from '@/Components/Manuscripts/ManuscriptComment'; // Import the LibrarySearchBar component
import SubscriptionCard from '@/Components/SubscriptionCard';
import AskUserToLogin from '@/Components/AskUserToLogin';
import PdfViewer from '@/Components/PdfViewer';
import ToggleComments from '@/Components/ToggleComments';

const Manuscript = ({auth, user, choice}) => {
    const [isPdfOpen, setPdfOpen] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const [userId, setUserId] = useState(null); // Store the current logged-in user ID
    const [manuscripts, setManuscripts] = useState([]);
    const [Manuscripts, setmanuscripts] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // State to hold search results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommentOpen, setisCommentOpen] = useState(false);
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
    const [isMaximized, setIsMaximized] = useState(false); // State to track if maximized or not
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar visibility
    const [maximizedId, setMaximizedId] = useState(null); // Tracks which manuscript is maximized
    const [manuscriptId, setManuscriptId] = useState(null);


  // State to store the message or any relevant data from the backend
  const [viewMessage, setViewMessage] = useState("");
  const [viewCount, setViewCount] = useState(0);




  // Function to trigger the book view request
  const handleBookView = async () => {
    console.log(`Attempting to track view for book with ID: ${bookId}`);

    try {
      // Make the request to the backend to track the view
      const response = await axios.post(`/api/view-book/${bookId}`);

      // Log the successful response from the backend
      console.log('Response from backend:', response.data);

      // Assuming the backend sends a message upon successful view tracking
      setViewMessage(response.data.message);

      // Optionally, you can update the view count here if returned by the backend
      // setViewCount(response.data.view_count);  // If view count is returned by backend
    } catch (error) {
      console.error("Error tracking the book view", error);
      setViewMessage("An error occurred while tracking the view.");
    }
  };


//   useEffect(() => {
//     // Set manuscript ID when the component loads
//     if (manuscript?.id) {
//       setManuscriptId(manuscript.id);
//     }
//   }, [manuscript]);

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


  // Function to handle the view increment
  const handlePdfLoad = (id) => {
    // When the PDF is loaded, increment the view count
    axios
    .post(`/manuscripts/${id}/increment-view`)
    .then((response) => {
        console.log('View count incremented:', response.data);
    })
    .catch((error) => {
        console.error('Error incrementing view count:', error);
    });

    // setIsLoading(false);

  };

  const handleClick = (id) => {
    // When the PDF is loaded, increment the view count
    axios.post(`/manuscripts/${id}/increment-view`)
    .then((response) => {
        console.log('View count incremented:', response.data);
    })
    .catch((error) => {
        console.error('Error incrementing view count:', error);
    });
};
    // const handlePdfLoad = () => {
    //   setIsLoading(false); // Set loading to false once PDF is loaded
    //     // Call the API to increment view count

    // axios
    // .post(`/manuscripts/${manuscripts.id}/increment-view`)
    // .then((response) => {
    //     console.log('View count incremented:', response.data);
    // })
    // .catch((error) => {
    //     console.error('Error incrementing view count:', error);
    // });
    // };

      // Reset loading state when the modal is opened again
  useEffect(() => {
    if (ismodalOpen) {
      setIsLoading(true); // Reset loading state when modal is opened
    }
  }, [ismodalOpen]); // Depend on modal open state


    // const openModal = (url) => {
    //     console.log("It is now open");
    //     setPdfUrl(url);
    //     setIsmodalOpen(true);
    // };

    // const closeModal = () => {
    //     setPdfUrl("");
    //     setIsmodalOpen(false);
    // };

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

    const openModal = (manuscript) => {
        setSelectedManuscript(manuscript.man_doc_content)
        setIsmodalOpen(true);

        // Pass the pdfUrl to the PDFViewer
    };

    const closeModal = () => {
        setIsmodalOpen(false);  // Assuming you're using useState to manage modal state
        setIsSubsModal(false);
        setSelectedManuscript(null);
      };


    // const handleCommentClick = (id) => {
    //     setCommentStates(prevState => ({
    //         ...prevState,
    //         [id]: !prevState[id], // Toggle the comment visibility for the specific manuscript
    //     }));
    // };


    // Handle opening the modal and setting the title
    const handleViewPdf = (manuscript) => {
        if (manuscript && manuscript.man_doc_content) {
            console.log("Viewing PDF for manuscript:", manuscript);
            setSelectedManuscript(manuscript); // Set the selected manuscript
            setPdfOpen(true); // Open the modal
        } else {
            console.error("Manuscript or PDF URL is missing.");
        }
    };



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



    // const handleDownload = async (manuscriptId, title) => {
    //     console.log("Attempting to download manuscript ID:", manuscriptId);
    //     try {
    //         const response = await axios.get(`/manuscript/${manuscriptId}/download`, {
    //             responseType: 'blob',
    //         });
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         const fileName = title ? `${title}.pdf` : 'file.pdf';

    //         link.href = url;
    //         link.setAttribute('download', fileName);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Error downloading the PDF:', error);
    //         alert('Error downloading the file. Please try again.');
    //     }
    // };


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

            //console.log(`Fetching favorites for user: ${user.id}`);

            try {
                const response = await axios.get(`/user/${user.id}/favorites`);
                //console.log('Response: ', response.data.favorites);
                const favoritesData = [];
                if(response.data.favorites) {
                    const favoritesData = response.data.favorites.map((favorite) => `${user.id}-${favorite.man_doc_id}`);
                }
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

        // Log user and favorite set for debugging
        console.log("User:", user);
        console.log("Favorites:", favorites);

        const favoriteKey = `${user.id}-${manuscriptId}`;

        // Check if the manuscript is already bookmarked
        if (favorites.has(favoriteKey)) {
            console.log("Removing favorite:", favoriteKey);
            // Manuscript is already favorited by the current user, remove it
            await handleRemoveFavorite(manuscriptId);
        } else {
            console.log("Adding favorite:", favoriteKey);
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
<section className="w-full mx-auto my-4 mt-8 ml-50">

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
        return <div className="flex justify-center items-center text-gray-400">No manuscripts available.</div>;
    }

    return (
        <section className="w-full mx-auto my-4 mt-8 ml-50">
            <div className="mb-6 w-full flex items-center gap-4"> {/* Adjusted to use flex and gap */}
            <div className="flex-grow  h-full">
            <SearchBar onSearch={handleSearch} selectedSearchField={selectedSearchField} titleInputValue={titleInputValue} // Maintain the value here
    setTitleInputValue={setTitleInputValue} // Optionally, for managing the input state
/>

{loading && <div>Loading...</div>}
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
                <div className="w-[200px] relative z-[0]"> {/* Set dropdown button width to 50px */}
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
                <div key={manuscript.id} className="w-full bg-white shadow-lg flex mb-4 text-sm">
{console.log("Mao ni:", manuscriptsToDisplay)}
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
    <img
      className="rounded w-25 h-30"
      src="/images/pdf2.png"
      alt="PDF Thumbnail"
    />
  )}

  {/* Maximize / Minimize ButthandleMaximizeon */}
  <button
    onClick={() => handleMaximize(manuscript.id)}
    className="absolute top-2 right-2 bg-gray-500 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-200 z-40"
  >
    {maximizedId === manuscript.id ? 'X' : 'Preview'}
  </button>
</div>
                   ) : isAuthenticated ? (
                    <div className="relative">
                      {/* Static Thumbnail for Authenticated User */}
                      <div className="flex items-center justify-center h-full w-full text-gray-500">
                        <img
                          className="rounded w-25 h-30"
      src="/images/pdf2.png"
                          alt="PDF Thumbnail"
                        />
                      </div>

                      {/* Preview Button at bottom */}
                      <button
                        onClick={openModal}
                        className="absolute bottom-6 w-max bg-white opacity-75 border-2 border-gray-600 text-gray-800 px-12 py-2 rounded transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white hover:text-opacity-100 focus:outline-none"
                      >
                        Preview
                      </button>
                    </div>
                   ):null}

                    {/* Modal for non-premium authenticated users */}
                   {isModalOpen &&  (
                             <Modal
                             show={ismodalOpen}
                             onClose={closeModal}
                             maxWidth="50%" // Percentage-based for responsiveness
                             maxHeight="100vh" // Set max height relative to viewport
                             className="relative overflow-hidden rounded-lg shadow-2xl"
                         >
                             <div
                                 className="absolute inset-0 bg-black opacity-60"
                                 onClick={closeModal}
                             ></div>

                             {/* Modal Content */}
                             <div className="relative p-6 bg-white rounded-lg z-10 overflow-hidden shadow-xl">
                                 <button
                                     onClick={closeModal}
                                     className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 focus:outline-none z-20"
                                     style={{ fontSize: '1.5rem' }}
                                 >
                                     <span className="font-bold">&times;</span>
                                 </button>

                                 {/* PDF Viewer Container */}
                                 <div className="relative h-[90vh] w-full bg-gray-200 shadow-2xl rounded-lg">
                                     <div
                                         className={`relative w-full h-full  rounded-lg ${pageCount > 10 ? 'blur-sm' : ''}`}
                                    >
                                         {isLoading && (
                                             <div className="absolute inset-0 flex justify-center items-center">
                                                 <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                                             </div>
                                         )}
                                         <iframe
                                             src={`http://127.0.0.1:8000/pdfViewer.html?pdfUrl=http://127.0.0.1:8000/${selectedManuscript}`}
                                             className="w-full h-full border-0 rounded-lg shadow-md"
                                             title="PDF Viewer"
                                             onLoad={handlePdfLoad}


                                         ></iframe>
                                     </div>


                                 </div>
                             </div>
                         </Modal>
                   )}

                   {/* Modal for non-authenticated users */}
                   { isLoginModalOpen && !isAuthenticated &&(
                     <Modal
                       show={isLoginModalOpen}
                       onClose={closeLoginModal}
                     >
                <AskUserToLogin />
                     </Modal>
                   )}
             </div>




<div className="flex-1 p-4">
        <div>
             {isPremium ? (
                // If the user is premium, show the link directly
                <h2 className="text-base font-bold text-gray-900">
                <a
                  onClick={() => handleClick(manuscript.id)} // Trigger the increment logic before opening the link
                    href={`http://127.0.0.1:8000/${manuscript.man_doc_content}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer transition-all duration-300 ease-in-out"
                >
                    {manuscript.man_doc_title}
                </a>
            </h2>
            ) : (
                // If the user is not premium, open modal on click (only for non-premium users)
                <h2 className="text-base font-bold text-gray-900">
                    <span
                        onClick={() => openModal(manuscript)} // Open modal when clicked
                        className="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer transition-all duration-300 ease-in-out"
                    >
                        {manuscript.man_doc_title}
                    </span>
                </h2>
            )}

            {/* Show modal for non-premium users */}
            {ismodalOpen && (
                 <Modal
                 show={ismodalOpen}
                 onClose={closeModal}
                 maxWidth="50%" // Percentage-based for responsiveness
                 maxHeight="80vh" // Set max height relative to viewport
                 className="relative overflow-hidden rounded-lg shadow-2xl"
             >
                 {/* Modal Overlay with smooth fade */}
                 <div
                     className="absolute inset-0 bg-black opacity-60"
                     onClick={closeModal}
                 ></div>

                 {/* Modal Content */}
                 <div className="relative p-6 bg-white rounded-lg z-10 overflow-hidden shadow-xl">
                     {/* Close Button */}
                     <button
                         onClick={closeModal}
                         className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 focus:outline-none z-20"
                         style={{ fontSize: '1.5rem' }}
                     >
                         <span className="font-bold">&times;</span>
                     </button>

                     {/* PDF Viewer Container */}
                     <div className="relative h-[80vh] w-full bg-gray-200 shadow-2xl rounded-lg overflow-hidden">
                         <div
                             className={`relative w-full h-full overflow-hidden rounded-lg ${pageCount > 10 ? 'blur-sm' : ''}`}
                         >
                             {isLoading && (
                                 <div className="absolute inset-0 flex justify-center items-center">
                                     <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                                 </div>
                             )}
                             <iframe
                                 src={`http://127.0.0.1:8000/pdfViewer.html?pdfUrl=http://127.0.0.1:8000/${selectedManuscript}`}
                                 className="w-full h-full border-0 rounded-lg shadow-md"
                                 title="PDF Viewer"
                                 onLoad={handlePdfLoad}
                             ></iframe>
                         </div>

                         {/* Message when page count exceeds 10 */}
                         {pageCount > 10 && (
                             <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white font-semibold text-xl p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                                 <div className="text-center">
                                     <h2 className="text-2xl mb-4 font-extrabold">You've Reached the Page Limit</h2>
                                     <p className="text-lg mb-6">
                                         To access the full document, please subscribe to unlock more pages.
                                     </p>
                                     <button
                                         onClick={() => alert('Redirecting to subscription page...')}
                                         className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-100"
                                     >
                                         Subscribe Now
                                     </button>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             </Modal>
            )}
        </div>


                {/* <p className="text-gray-700 mt-1">Author: {user.name}</p> */}

                {/* Display the users here */}
                <div className="mt-2 flex flex-wrap gap-2">
                    <p className="text-sm text-gray-700 mt-1">Author:</p>
                    {manuscript.authors?.length > 0 ? (
                        <p className="text-sm text-gray-700 mt-1">
                            {manuscript.authors.map(author => author.name).join(', ')}
                        </p>
                    ) : (
                        <p className="text-gray-700 mt-1">Unknown Authors</p>
                    )}
                </div>

                <p className="text-sm text-gray-700 mt-1">Adviser: {manuscript.man_doc_adviser}</p>

                {/* Display the tags here */}
                <div className="text-sm mt-2 flex flex-wrap gap-2">
                    {manuscript.tags && manuscript.tags.length > 0 ? ( // Check if tags exist and if the length is greater than 0
                        manuscript.tags.map(tag => ( // Map through the tags array
                            <span key={tag.id} className="bg-gray-200 text-sm text-gray-800 px-2 py-1 rounded">
                                {tag.tags_name} {/* Display the tag name */}
                            </span>
                        ))
                    ) : (
                        <p>No tags available</p> // Display message if no tags are found
                    )}
                </div>



                <div className="mt-4 flex items-center gap-4">
                <Tooltip content="Views">
        <button className={`text-gray-600 hover:text-blue-500 ${manuscript.man_doc_content ? 'text-blue-500' : ''} flex items-center`}>
            <FaEye size={20} />
            <span className="ml-2">{manuscript.man_doc_view_count}</span> {/* Adjusted margin to 2 for better spacing */}
        </button>
    </Tooltip>

{/*
                    <div
                    key={manuscript.id}
                    className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => handleComments(manuscript.id, manuscript.man_doc_title)}  // Pass id and title to handleComments
                    >
                    <FaComment size={20} />
                    </div> */}


<div
                    key={manuscript.id}
                    className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                        if (!isAuthenticated) {
                            // Show the login modal if the user is not authenticated
                            openLogInModal();
                        } else if (!isPremium) {
                            // Show the subscription modal if the user is not premium
                            openSubsModal();
                        } else {
                            // Proceed with the bookmark action if the user is premium and authenticated
                            handleComments(manuscript.id, manuscript.man_doc_title)
                        }
                    }}
                >
                    <FaComment size={20} />
                    </div>


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


                {/* Render ToggleComments only if a manuscript is selected and the sidebar is open */}
                {selectedManuscript && (
                    <ToggleComments
                    auth={auth}
                        manuscripts={selectedManuscript}  // Pass the selected manuscript to ToggleComments
                        man_id={selectedManuscript.id}  // Pass additional properties if needed
                        man_doc_title={selectedManuscript.title}
                        isOpen={isSidebarOpen}
                        toggleSidebar={() => setIsSidebarOpen((prevState) => !prevState)} // Toggle the sidebar
                    />
                )}



{/* 
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
                </Tooltip> */}


                <Tooltip content="Download">
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
                            // Proceed with the download if the user is premium and authenticated
                            handleDownload(manuscript.id, manuscript.man_doc_title);
                        }
                        }}
                    >
                        <FaFileDownload size={20} />
                    </button>
                </Tooltip>

                {/* Modal for Non-Premium Users */}
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




                {/* <Tooltip content="Ratings">
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
                                handleRatings(manuscript);
                            }
                        }}
                    >
                        <FaStar size={20} />
                    </button>
                </Tooltip>


                */}



                <Tooltip content="Ratings">
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
                                handleRatings(manuscript);
                            }
                        }}
                    >
                        <FaStar size={20} />
                    </button>
                </Tooltip>


{/*
                        onClick={() => handleRatings(manuscript)}
                    >
                        <FaStar size={20} />
                    </button>
                </Tooltip> */}



                <Tooltip content="Cite">
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
                                handleCitation(manuscript);
                            }
                        }}
                    >
                        <FaQuoteLeft size={20} />
                    </button>
                </Tooltip>


                {/* <Tooltip content="Cite">
                    <button
                        className="text-gray-600 hover:text-blue-500"
                        onClick={() => handleCitation(manuscript)}
                    >
                        <FaQuoteLeft size={20} />
                    </button>
                </Tooltip> */}



                {/* Rendering the PDF preview */}
                {isPdfOpen && selectedManuscript && (
                    <Modal show={isPdfOpen} onClose={() => setPdfOpen(false)}>
                        <button disabled className="bg-gray-300 text-gray-500 py-4 px-4 font-bold rounded w-full">
                            We systematically review all ratings to enhance our services, and we highly value them.
                        </button>
                        <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-center text-gray-500">
                                {selectedManuscript.man_doc_title}
                            </h2>

                            {selectedManuscript.man_doc_content ? (
                                <PdfViewer pdfUrl={selectedManuscript.man_doc_content} />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-gray-500">
                                    <p>No PDF available</p>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}



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



                               {/* Rendering the comment modal */}
                               {isCommentOpen && (
                    <Modal show={isCommentOpen} onClose={() => setisCommentOpen(false)}>
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
                            <CommentSections
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
                    theme="colored"/>
        </section>
    );
}

export default Manuscript;