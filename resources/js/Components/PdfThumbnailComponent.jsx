import React, { useState, useEffect } from "react";
import PdfThumbnail from "react-pdf-thumbnail";  // Import the library

const PdfThumbnailComponent = ({ pdfUrl }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  useEffect(() => {
    if (pdfUrl) {
      setThumbnailUrl(pdfUrl);
    }
  }, [pdfUrl]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {thumbnailUrl ? (
        <PdfThumbnail
          pdf={thumbnailUrl}
          width={150} // Adjust size for the thumbnail
          height={200} // Adjust size for the thumbnail
        />
      ) : (
        <div>Loading thumbnail...</div>
      )}
    </div>
  );
};

export default PdfThumbnailComponent;
