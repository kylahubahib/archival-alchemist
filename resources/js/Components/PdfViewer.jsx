import React, { useState, useEffect } from 'react';

const PdfViewer = ({ pdfUrl }) => {
  const [scrollingTime, setScrollingTime] = useState(0); // Track the scrolling time
  const [blur, setBlur] = useState(false); // State to apply blur effect
  const [isScrolling, setIsScrolling] = useState(false); // Flag for scrolling status




  // Timeout to start applying the blur effect after 30 seconds
  useEffect(() => {
    if (scrollingTime >= 30) {
      setBlur(true); // Apply blur after 30 seconds
    }
  }, [scrollingTime]);

  // Function to handle scroll events
  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      let timer = 0;
      const scrollInterval = setInterval(() => {
        timer += 1;
        setScrollingTime(timer);
      }, 1000); // Increment the timer every second

      // Stop counting when scrolling stops
      const stopScrollTimer = setTimeout(() => {
        setIsScrolling(false);
        clearInterval(scrollInterval);
      }, 300); // Set a small delay after the scroll ends (300ms) before stopping the timer
    }
  };

  return (
    <div className="relative w-full h-full p-4 shadow-lg rounded-lg">
      <div
        id="pdf-container"
        onScroll={handleScroll}
        className={`relative w-full h-full overflow-y-auto ${blur ? 'filter blur-sm' : ''}`} // Apply blur when scroll time exceeds 30 seconds
      >
        <iframe
          src={pdfUrl}
          className="w-full h-full rounded-lg"
          style={{
            border: 'none',
            minHeight: '500px', // Adjust as needed
          }}
          title="PDF Viewer"
        ></iframe>
      </div>

      {/* Optional: Display the scroll timer to show how much time has passed */}
      {/* <div className="absolute bottom-4 left-4 text-sm text-gray-600">
        Time Spent Scrolling: {scrollingTime} seconds
      </div> */}
    </div>
  );
};

export default PdfViewer;