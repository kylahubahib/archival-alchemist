import React from 'react';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};
//export default function Ratings({ rating, onRatingChange, resetRating }) {
export default function Ratings({ rating, onRatingChange }) {
  const [hover, setHover] = React.useState(-1);

  const handleMouseEnter = (value) => {
    setHover(value);
  };

  const handleMouseLeave = () => {
    setHover(-1);
  };

// Rating Component Reset Logic
const handleClick = (value) => {
    onRatingChange(value);
    //resetRating(); // This can be called if you need a specific reset behavior
};

  return (
    <div className="relative flex items-center">
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        return (
          <span
            key={value}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(value)}
            className={`cursor-pointer text-3xl transition-colors duration-200 ${
              value <= (hover !== -1 ? hover : rating) ? 'text-yellow-500' : 'text-gray-400'
            }`}
            style={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40px',
              height: '40px',
              fontSize: '30px',
              lineHeight: '1',
              margin: '0',
            }}
          >
            ★
          </span>
        );
      })}
      <span
        className="absolute left-full ml-2"
        style={{ whiteSpace: 'nowrap', visibility: rating !== null ? 'visible' : 'hidden' }}
      >
        {labels[hover !== -1 ? hover : rating]}
      </span>
    </div>
  );
}
