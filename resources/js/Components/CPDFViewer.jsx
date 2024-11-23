import { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Specify the workerSrc path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const CPDFViewer = ({ pdfUrl, maxVisiblePages = 10 }) => {
    const [pages, setPages] = useState([]);
    const canvasRefs = useRef([]);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise.then((pdf) => {
            const renderPages = async () => {
                const loadedPages = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    loadedPages.push(page);
                }
                setPages(loadedPages);
            };
            renderPages();
        });
    }, [pdfUrl]);

    useEffect(() => {
        pages.forEach((page, index) => {
            const canvas = canvasRefs.current[index];
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: context, viewport }).promise;
        });
    }, [pages]);

    return (
        <div className="overflow-auto h-[80vh] relative">
            {pages.map((page, index) => (
                <div
                    key={index}
                    className={`relative ${index + 1 > maxVisiblePages ? 'blur-md' : ''}`}
                >
                    <canvas ref={(el) => (canvasRefs.current[index] = el)} />
                    {index + 1 > maxVisiblePages && (
                        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center text-gray-800 text-sm">
                            <p>Content beyond page {maxVisiblePages} is blurred</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CPDFViewer;
