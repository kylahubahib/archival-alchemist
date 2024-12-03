import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaBookmark } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import Manuscript from '@/Components/Manuscripts/MyFavoriteManuscript';
import {Skeleton} from "@nextui-org/skeleton";

import { BookOpenIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import AllManuscript from '@/Components/Manuscripts/AllManuscript';
import RecManuscript from '@/Components/Manuscripts/RecommendedManuscript';
import SearchBar from '@/Components/SearchBars/LibrarySearchBar';

export default function SavedList({ auth }) {
    const isAuthenticated = !!auth.user; // Check if user is authenticated
    const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;
    const [bookmarks, setBookmarks] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch favorite manuscripts from API
        axios.get('/api/my-favorite-manuscripts')
            .then(response => {
                setManuscripts(response.data);
                //setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch favorite manuscripts.');
                //setLoading(false);
            });
    }, []);

    if (loading) {
        return <Skeleton height="100px" />;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <MainLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Favorites</h2>}
        >
            <Head title="Favorites" />

            <section className="bg-white h-full  m-4 rounded-xl">
                {manuscripts.length === 0 ? (
                    <div className="max-w-7xl mx-auto bg-white shadow-lg flex justify-center h-screen items-center sm:rounded-lg sticky">
                        <FaBookmark size={50} className="text-gray-500" />
                        <p className="text-gray-500 mt-2">Favorite Manuscript Capstone will be added here.</p>
                    </div>
                ) : (
                    <div className="h-screen bg-white  m-4 rounded-xl">
                        <Manuscript
                    auth={auth}
                            title="Favorite Manuscripts"
                            description="A list of all available capstone manuscripts."
                            manuscripts={manuscripts} // Pass manuscripts to Manuscript
                            user={auth.user} // Pass the user to Manuscript
                            //choice={choice} // Pass choice to Manuscript
                        /> {/* Pass the fetched manuscripts */}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
