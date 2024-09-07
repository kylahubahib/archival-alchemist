import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Manuscript from '@/Components/Manuscript'; // Import the Manuscript component
import axios from 'axios'; // Import axios to make HTTP requests

const Approved = () => {
    const [manuscript, setManuscript] = useState(null);

    useEffect(() => {
        // Fetch the manuscript data from the database
        axios.get('/api/approved-manuscript') // Update the endpoint based on your routes
            .then(response => {
                const data = response.data;
                if (data.man_doc_status === 'Y') {
                    setManuscript(data);
                }
            })
            .catch(error => {
                console.error('Error fetching manuscript data:', error);
            });
    }, []);

    if (!manuscript) {
        return <div>Loading...</div>; // Show a loading state while fetching data
    }

    return (
        <div>
            {/* Render the Manuscript component */}
            <Manuscript
                // Pass any props to Manuscript component if needed, e.g.,
                manuscriptData={manuscript}
            />
        </div>
    );
}

export default Approved;
