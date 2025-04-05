import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useState } from 'react';
import ImageCarousel from '../components/home/ImageCarousel';
import TextReveal from '../components/home/TextReveal';
import ScrollPhotos from '../components/home/ScrollPhotos';
import Hero from '../components/home/Hero';
import Carousel from '@/components/home/Carousel';

export const Route = createFileRoute('/')({ 
  component: HomePage,
});

const containerStyle: React.CSSProperties = {
  backgroundColor: '#040403',
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};

const sectionStyle: React.CSSProperties = {
  height: '100vh',
  scrollSnapAlign: 'start',
};

function HomePage() {
  const [showText, setShowText] = useState(false);

  const handleCarouselEnd = () => {
    setShowText(true);
  };

  return (
    <div style={containerStyle}>
      <section style={sectionStyle}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            backgroundColor: '#040403',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <ImageCarousel onCarouselEnd={handleCarouselEnd} />
          {showText && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextReveal />
            </div>
          )}
        </motion.div>
      </section>
      <section style={sectionStyle}>
        <ScrollPhotos />
      </section>
      <section style={sectionStyle}>
        <Hero />
      </section>
      <section style={sectionStyle}>
        <Carousel/>
      </section>
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
