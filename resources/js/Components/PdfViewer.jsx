import React, { useEffect, useRef, useState } from 'react';
//import { Document, Page } from 'react-pdf';

const PdfViewer = ({ pdfUrl }) => {
    const viewerRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [pdfLoaded, setPdfLoaded] = useState(false); // Track when the PDF is loaded
    const [error, setError] = useState(null); // To track loading errors
    const [showReactPdf, setShowReactPdf] = useState(true); // Flag to toggle react-pdf or WebViewer

    useEffect(() => {
        if (!window.WebViewer && !scriptLoaded) {
            // Dynamically load the WebViewer script only if it's not already loaded
            const script = document.createElement('script');
            script.src = '/lib/webviewer.min.js'; // Correct path to WebViewer script
            script.async = true;

            script.onload = () => {
                setScriptLoaded(true); // Mark the script as loaded
                if (window.WebViewer) {
                    // Initialize WebViewer once the script is loaded
                    new window.WebViewer(
                        {
                            path: '/lib', // Path to WebViewer resources
                            initialDoc: pdfUrl, // Path to the PDF file you want to display
                            showThumbnailView: true,  // Enable thumbnail view
                            initialView: 'single',    // Set initial view to single page or thumbnail
                        },
                        viewerRef.current
                    ).then((instance) => {
                        console.log("WebViewer initialized", instance); // Log the initialized WebViewer instance
                        setPdfLoaded(true); // Set the PDF as loaded once WebViewer is initialized
                    }).catch((err) => {
                        console.error("Error initializing WebViewer:", err); // Log any error during initialization
                        setError('Failed to load the PDF viewer. Please try again later.');
                    });
                } else {
                    console.error('WebViewer script not loaded correctly.');
                    setError('Failed to load the PDF viewer. Please try again later.');
                }
            };

            script.onerror = () => {
                console.error('Failed to load WebViewer script');
                setError('Failed to load the PDF viewer. Please try again later.');
            };

            // Append the script to the body
            document.body.appendChild(script);
        }

        // Cleanup: remove the script tag if the component unmounts
        return () => {
            const script = document.querySelector('script[src="/lib/webviewer.min.js"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [pdfUrl, scriptLoaded]);

    return (
        <div className="relative w-full h-full">
            {/* Show error message if there is an issue loading the PDF */}
            {error && <div className="text-red-500">{error}</div>}

            {/* Optionally use react-pdf if the WebViewer is not available */}
            {showReactPdf && !pdfLoaded && !error && (
                <Document file={pdfUrl}>
                    <Page pageNumber={1} />
                </Document>
            )}

            {/* Show static thumbnail before PDF is fully loaded */}
            {!pdfLoaded && !error && (
                <img
                    src="http://127.0.0.1:8000/storage/images/samplepdfthumbnail.jpg"
                    alt="PDF Thumbnail"
                    className="object-contain w-full h-auto absolute top-0 left-0 z-10"
                />
            )}

            {/* WebViewer container with shadow on all sides */}
            <div
                ref={viewerRef}
                className={`w-full h-full ${pdfLoaded ? 'opacity-100' : 'opacity-0'}
                           transition-opacity duration-500 p-4 shadow-lg rounded-lg`}
            ></div>
        </div>
    );
};

export default PdfViewer;
