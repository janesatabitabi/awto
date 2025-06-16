import React from 'react';

const WheelCard = ({ image, title, description, sizes, reviews, isNew }) => {
  return (
    <div className="wheel-card">
      {isNew && <span className="new-label">NEW</span>}
      <img src={image} alt={title} className="wheel-image" />
      <h3 className="wheel-title">{title}</h3>
      <p className="wheel-description">{description}</p>
      <p className="wheel-sizes">{sizes.join(', ')}</p>
      <p className="wheel-reviews">{reviews} Reviews</p>
      <div className="rating">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className="star">★</span>
        ))}
      </div>
    </div>
  );
};

const WheelCatalog = () => {
  const wheels = [
    {
      image: 'path/to/image1.jpg',
      title: 'AMERICAN RACING G-FORCE',
      description: 'Flow Formed Aluminum',
      sizes: ['17', '18', '20'],
      reviews: 1,
      isNew: true,
    },
    {
      image: 'path/to/image2.jpg',
      title: 'AMERICAN RACING 500 MONO CAST',
      description: 'Cast Aluminum',
      sizes: ['15', '17'],
      reviews: 3,
      isNew: false,
    },
    {
      image: 'path/to/image3.jpg',
      title: 'AMERICAN RACING AR23',
      description: 'Cast Aluminum',
      sizes: ['14', '15', '16'],
      reviews: 3,
      isNew: false,
    }
  ];

  return (
    <div className="wheel-catalog">
      {wheels.map((wheel, index) => (
        <WheelCard key={index} {...wheel} />
      ))}
    </div>
  );
};

export default WheelCatalog;
