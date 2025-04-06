import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageCarouselProps {
  onCarouselEnd: () => void;
}

const images: string[] = [
    "/images/landing_page/landingPageText1-trans.webp",
    "/images/landing_page/landingPageText2-trans.webp",
    "/images/landing_page/landingPageText3-trans.webp",
    "/images/landing_page/landingPageText1-trans.webp",
    "/images/landing_page/landingPageText2-trans.webp",
    "/images/landing_page/landingPageText3-trans.webp",
    "/images/landing_page/landingPageText2-trans.webp",
];

const ImageCarousel: React.FC<ImageCarouselProps> = ({ onCarouselEnd }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (currentImageIndex < images.length - 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onCarouselEnd();
      }, 1500);
      return () => clearTimeout(finalTimer);
    }
  }, [currentImageIndex, onCarouselEnd]);

  return (
    <div style={{ 
      position: 'relative', 
      width: isMobile ? '95vw' : '50vw', 
      height: isMobile ? '60vh' : '50vh',
      overflow: 'hidden',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: isMobile ? '20vh' : '25vh'
    }}>
      {images.map((image, index) => (
        <motion.div
          key={image}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: index === currentImageIndex ? 'block' : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;
