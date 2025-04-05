import { motion, useInView } from 'motion/react';
import React, { useRef, useEffect, useState } from 'react';

const images = [
  {
    background: '/images/landing_page/Indie Style - final - background.png',
    subject: '/images/landing_page/Indie Style - final - subject.png'
  },
  {
    background: '/images/landing_page/Streetwear Style - final - background.png',
    subject: '/images/landing_page/Streetwear Style - final - subject.png'
  },
  {
    background: '/images/landing_page/Urban Style - final - background.png',
    subject: '/images/landing_page/Urban Style - final - subject.png'
  },
];

const containerStyle: React.CSSProperties = {
  background: '#040403',
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  touchAction: 'pan-y',
};

const photoContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  margin: 0,
  scrollSnapAlign: 'start',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  pointerEvents: 'none',
  zIndex: 10,
};

const topOverlayStyle: React.CSSProperties = {
  ...overlayStyle,
  top: 0,
  height: '50%',
  background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 80%)',
};

const bottomOverlayStyle: React.CSSProperties = {
  ...overlayStyle,
  bottom: 0,
  height: '50%',
  background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 80%)',
};

const ScrollPhotos: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="scrollContainer" style={containerStyle}>
      <style>
        {`
          .scrollContainer::-webkit-scrollbar {
            display: none;
          }
          .scrollContainer {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          @media (max-width: 768px) {
            .photo-container {
              width: 100vw;
              overflow: hidden;
            }
            .bg-image-0, .subject-image-0 {
              object-position: calc(50% - 2%) 50% !important;
            }
            .bg-image-1, .subject-image-1 {
              object-position: calc(50% - 5%) 50% !important;
            }
            .bg-image-2, .subject-image-2 {
              object-position: calc(50% - 2%) 50% !important;
            }
          }
        `}
      </style>
      {images.map((image, index) => {
        const sectionRef = useRef<HTMLDivElement>(null);
        const isInView = useInView(sectionRef, { 
          amount: isMobile ? 0.3 : 0.6, 
          once: true 
        });
        
        const fromLeft = index % 2 === 0;
        
        return (
          <div key={index} ref={sectionRef} style={photoContainerStyle} className="photo-container">
            <motion.img 
              className={`bg-image-${index}`}
              src={image.background} 
              alt={`Background ${index + 1}`} 
              style={{
                ...imageStyle,
                objectPosition: 'center center',
              }} 
            />
            
            <motion.img
              className={`subject-image-${index}`}
              src={image.subject}
              alt={`Subject ${index + 1}`}
              initial={{ 
                opacity: 0, 
                x: isMobile ? 0 : (fromLeft ? -100 : 100),
                y: isMobile ? 50 : 0
              }}
              animate={
                isInView 
                  ? { 
                      opacity: 1, 
                      x: 0, 
                      y: 0 
                    } 
                  : { 
                      opacity: 0, 
                      x: isMobile ? 0 : (fromLeft ? -100 : 100),
                      y: isMobile ? 50 : 0
                    }
              }
              transition={{ 
                duration: isMobile ? 0.4 : 0.5,
                ease: "easeOut",
                delay: 0.1 
              }}
              style={{
                ...imageStyle,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 5,
                objectPosition: 'center center',
              }}
            />
            
            <div style={topOverlayStyle} />
            <div style={bottomOverlayStyle} />
          </div>
        );
      })}
    </div>
  );
};

export default ScrollPhotos;
