import React, { useState } from 'react'; // Import React and useState hook
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Import layout for authenticated users
import { Head } from '@inertiajs/react'; // Import Head component from Inertia.js for setting the document head
import { FaBookmark } from 'react-icons/fa'; // Import bookmark icon from react-icons
import Manuscript from '@/Components/Manuscripts/MyFavoriteManuscript'; // Import Manuscript component for displaying manuscripts

// Define the SavedList functional component
export default function SavedList({ auth }) {
    // Initialize state for bookmarks and manuscripts
    const [bookmarks, setBookmarks] = useState([]); // State for storing bookmarks (favorites)
    const [manuscripts, setManuscripts] = useState([]); // State for storing manuscripts

    return (
        <AuthenticatedLayout
            user={auth.user} // Pass the authenticated user to the layout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Favorites</h2>} // Header for the layout
        >
            <Head title="Favorites" />

            <section className="bg-white h-full rounded m-4 rounded-xl"> {/* Section container with styles */}
                {bookmarks.length === 0 ? ( // Check if there are no bookmarks
                    <div className="max-w-7xl mx-auto bg-white shadow-lg flex justify-center h-screen items-center shadow-sm sm:rounded-lg sticky">
                        <FaBookmark size={50} className="text-gray-500" /> {/* Display bookmark icon */}
                        <p className="text-gray-500 mt-2">Favorite Manuscript Capstone will be added here.</p> {/* Message for empty state */}
                    </div>
                ) : ( // If there are bookmarks, render the Manuscript component
                    <div className="h-screen bg-white rounded m-4 rounded-xl">
                        <Manuscript manuscripts={manuscripts} /> {/* Pass manuscripts to the Manuscript component */}
                    </div>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
