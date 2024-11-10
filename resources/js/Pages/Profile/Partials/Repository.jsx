import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Manuscript from '@/Components/Manuscripts/MyManuscript';

const Repository = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/my-approved-manuscripts')
            .then(response => {
                setManuscripts(response.data);
                //setLoading(false);
            })
            .catch(error => {
                setError('Error fetching manuscript data.');
                //setLoading(false);
            });
    }, []);

    //if (loading) return <div className="min-h-screen">Loading...</div>;
    if (error) return <div className="min-h-screen">Error: {error}</div>;
   // if (manuscripts.length === 0) return <div className="min-h-screen">No approved manuscripts available.</div>;

    return <div className="min-h-screen"><Manuscript manuscripts={manuscripts} /></div>;
};

export default Repository;





