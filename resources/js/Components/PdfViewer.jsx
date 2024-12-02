import React, { useEffect, useRef, useState } from 'react';

const PdfViewer = ({ pdfUrl }) => {
  const viewerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.WebViewer && !scriptLoaded) {
      const script = document.createElement('script');
      script.src = '/lib/webviewer.min.js';
      script.async = true;

      script.onload = () => {
        setScriptLoaded(true);
        if (window.WebViewer) {
          new window.WebViewer(
            {
              path: '/lib',
              initialDoc: pdfUrl,
              showThumbnailView: true,
              initialView: 'single',
              fullScreen: false,
              enableAnnotations: false,
              enableSearch: false,
              pageLoadingLimit: 2, // Only load a few pages at a time
              useOnlyCssZoom: true, // For better performance
            },
            viewerRef.current
          ).then((instance) => {
            setPdfLoaded(true);
          }).catch((err) => {
            console.error('Error initializing WebViewer:', err);
            setError('Failed to load the PDF viewer.');
          });
        } else {
          setError('WebViewer script not loaded correctly.');
        }
      };

      script.onerror = () => {
        setError('Failed to load WebViewer script.');
      };

      document.body.appendChild(script);
    }

    return () => {
      const script = document.querySelector('script[src="/lib/webviewer.min.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [pdfUrl, scriptLoaded]);

  return (
    <div className="relative w-full h-full">
      {error && <div className="text-red-500">{error}</div>}
      <div
        ref={viewerRef}
        className={`w-full h-full ${pdfLoaded ? 'opacity-100' : 'opacity-0'}
                    transition-opacity duration-500 p-4 shadow-lg rounded-lg`}
      ></div>
    </div>
  );
};

export default PdfViewer;
