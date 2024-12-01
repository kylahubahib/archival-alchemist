import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyManuscript from '@/Components/Manuscripts/MyManuscript';


const Approved = (auth, user) => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/my-approved-manuscripts')
            .then(response => {
                setManuscripts(response.data);
                setLoading(false);
                console.log("These are the approved manuscripts: ", response.data)
            })
            .catch(error => {
                console.error('Error fetching manuscripts:', error);
                const errorMessage = error.response ? error.response.data.error : 'An error occurred while fetching the data.';
                setError(errorMessage);
                setLoading(false);
            });

    }, []);

    //if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    //if (manuscripts.length === 0) return <div>No approved manuscripts available.</div>;

    // <div className="flex flex-col items-start justify-start w-h-screen  relative w-relative px-10">
    return<div className="flex   relative w-relative px-10"><MyManuscript auth={auth} user={auth.user} manuscripts={manuscripts} /></div>;
};

export default Approved;
