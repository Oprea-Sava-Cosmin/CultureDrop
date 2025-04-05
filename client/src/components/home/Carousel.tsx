import { Box, Typography, Button, Container, useMediaQuery } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { useTheme } from '../../context/ThemeContext';
import Header from '../layout/Header';
import { useRef, useEffect, useState } from 'react';
import Footer from '../layout/Footer';
import CircularGallery from '../ui/Components/CircularGallery/CircularGallery';

const Carousel = () => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState('calc(100vh - 128px)');

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const headerHeight = footerRef.current.offsetHeight;
        setFooterHeight(`calc(100vh - ${headerHeight}px)`);
      }
    };

    // Initial measurement
    updateFooterHeight();
    
    // Update on resize
    window.addEventListener('resize', updateFooterHeight);
    return () => window.removeEventListener('resize', updateFooterHeight);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'relative',
          height: footerHeight,
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'visible', // Changed from 'hidden' to 'visible'
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          flexGrow: 1,
        }}
      >
        <CircularGallery 
          bend={isMobile ? 1.5 : 2} // Reduce bend on mobile
          textColor={mode === 'light' ? "#000000" : "#ffffff"}
          font={isMobile ? 'bold 24px Segoe UI' : 'bold 40px Segoe UI'} // Smaller font on mobile
        />
      </Box>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Carousel;