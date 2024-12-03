import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from "@nextui-org/react";
import axios from 'axios';
import SearchBar from '@/Components/SearchBars/TagSearchBar';

export default function Tags({ auth }) {
    const [tags, setTags] = useState([]);

    // Function to update search results
    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    // Fetch the tags when the component mounts
    useEffect(() => {
        axios.get('/api/tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tags!', error);
            });
    }, []);

    // Function to generate a random color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }
        return color;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tags</h2>}
        >
            <Head title="Tags" />

            <div className="bg-white rounded m-4 h-screen ">
                <div className="rounded h-full items-center justify-center">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg p-10">
                        {/* Set up a 6-column grid */}
                        <div className="grid grid-cols-6">
                            {/* First column for SearchBar */}
                            <div className="col-span-5 md:col-span-2 mb-6"> {/* Use md:col-span-2 for responsive behavior */}
                                <SearchBar onSearchResults={handleSearchResults} /> {/* Add the search bar */}
                            </div>

                            {/* Remaining columns for tags */}
                            <div className="col-span-6 md:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pr-10"> {/* Remaining columns */}
                                {tags.map(tag => (
                                    <Button
                                        key={tag.id}
                                        variant="bordered"
                                        style={{
                                            borderColor: getRandomColor(),
                                        }}
                                        className="w-full" // Full width for buttons
                                    >
                                        {tag.tags_name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
