// components/Carousel.js
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const CustomCarousel = ({ images, autoplay = true, interval = 3000, showArrows = true }) => {
  const [carouselSettings, setCarouselSettings] = useState({
    autoPlay: autoplay,
    interval: interval,
    showArrows: showArrows,
  });

  useEffect(() => {
    setCarouselSettings(prev => ({
      ...prev,
      autoPlay: autoplay,
      interval: interval,
      showArrows: showArrows,
    }));
  }, [autoplay, interval, showArrows]);

  return (
    <Carousel
      autoPlay={carouselSettings.autoPlay}
      interval={carouselSettings.interval}
      showArrows={carouselSettings.showArrows}
      infiniteLoop
      showThumbs={false}
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Slide ${index}`} />
        </div>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
