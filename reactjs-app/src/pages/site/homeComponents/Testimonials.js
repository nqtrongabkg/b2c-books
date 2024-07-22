import React, { useState, useEffect } from 'react';
import { urlImageBanner } from '../../../config';
import BannerService from '../../../services/BannerService';

const Testimonials = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await BannerService.getDisplay();
        setBanners(result);
        if (result.length > 0) {
          setCurrentBanner(result[Math.floor(Math.random() * result.length)]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner(banners[Math.floor(Math.random() * banners.length)]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  return (
    <div>
      <div className="container">
        <div className="slider-item">
          {currentBanner ? (
            <>
              <img src={urlImageBanner + currentBanner.image} alt={currentBanner.name} className="cta-banner" />
              <div className="banner-content">
                <p className="banner-subtitle">{currentBanner.description}</p>
              </div>
            </>
          ) : (
            <img src={require("../../../assets/images/cta-banner.jpg")} alt="summer collection" className="cta-banner" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
