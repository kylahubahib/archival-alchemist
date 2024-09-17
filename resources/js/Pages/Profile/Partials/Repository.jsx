import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Manuscript from '@/Components/Manuscript';

const Repository = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/my-approved-manuscripts')
            .then(response => {
                setManuscripts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching manuscript data.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (manuscripts.length === 0) return <div>No approved manuscripts available.</div>;

    return <div><Manuscript manuscripts={manuscripts} /></div>;
};

export default Repository;
