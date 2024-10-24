import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
//import { Routes, Route } from 'react-router-dom';


export default function PostDetail({ auth }) {
    //const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!auth.user;
    const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

    useEffect(() => {
        const fetchPostDetails = async () => {
            const response = await fetch(`/api/posts/${id}`); // Adjust the URL to your API endpoint
            const data = await response.json();
            setPost(data);
            setLoading(false);
        };

        fetchPostDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <MainLayout>
            <Head title={post.title} />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="mb-4">
                    {/* Displaying a static view count, or use an API for real-time */}
                    <span className="text-gray-500">Views: {Math.floor(Math.random() * 1000)}</span> {/* Replace with actual logic if needed */}
                    <span className="text-gray-500 ml-4">Comments: {post.comments_count}</span> {/* Adjust this if you have comments_count */}
                </div>
                <div className="mb-4">{post.body}</div>
                <div className="mb-4">
                    <h2 className="font-semibold">Tags:</h2>
                    {post.tags && post.tags.map((tag) => (
                        <span key={tag.id} className="bg-gray-300 rounded-full px-2 py-1 text-sm mr-2">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
