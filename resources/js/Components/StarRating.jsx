import React, { useEffect, useState } from 'react';

export default function StarRating({totalStars = 5, onRatingSelect, initialRating = 0, interactive = true, size = 8}) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
       setRating(initialRating);
    });
  
    const handleRatingClick = (ratingValue) => {
      if (interactive) {
        setRating(ratingValue);
        if (onRatingSelect) {
          onRatingSelect(ratingValue);
        }
      }
    };
  
    const handleMouseEnter = (ratingValue) => {
      if (interactive) {
        setHoverRating(ratingValue);
      }
    };
  
    const handleMouseLeave = () => {
      if (interactive) {
        setHoverRating(0);
      }
    };
  
    return (
      <div className="flex">
        {Array.from({ length: totalStars }, (_, index) => {
          const starValue = index + 1;
          return (
            <svg
              key={index}
              onClick={() => handleRatingClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              className={`w-${size} h-${size} ${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors ${
                (hoverRating || rating) >= starValue ? 'text-yellow-400' : 'text-gray-400'
              } ${!interactive && 'cursor-default'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          );
        })}
      </div>
    );
  };

  
//   const handleRatingSelect = (rating) => {
//     console.log('Selected rating:', rating);
//     // You can send the rating to the backend or handle it accordingly.
//   };