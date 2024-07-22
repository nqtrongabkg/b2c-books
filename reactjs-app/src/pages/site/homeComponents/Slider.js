import { urlImageSlider } from '../../../config';
import SliderService from '../../../services/SliderService';
import React, { useState, useEffect } from 'react';
import '../../../assets/styles/slider.css';

const Slider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        let result = await SliderService.getAll();
        const sortedSliders = result.filter(slider => slider.status === 3);
        setSliders(sortedSliders);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % sliders.length);
      }, 3000); // 4 seconds

      return () => clearInterval(interval);
    }
  }, [sliders]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const renderSlider = () => {
    if (sliders.length === 0) {
      return <div>Loading sliders...</div>;
    }

    const currentSlider = sliders[currentIndex];

    return (
      <div className="slider-item" key={currentSlider.id}>
        <img src={urlImageSlider + currentSlider.image} alt="Slider" className="banner-img" />
        <div className="banner-content">
          <p className="banner-subtitle">Mua sắm thỏa thích với Anon Ecommerce</p>
        </div>
      </div>
    );
  };

  const renderDots = () => {
    return (
      <div className="slider-dots">
        {sliders.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="banner">
      <div className="container">
        <div className="slider-container has-scrollbar">
          {renderSlider()}
          {renderDots()}
        </div>
      </div>
    </div>
  );
};

export default Slider;
