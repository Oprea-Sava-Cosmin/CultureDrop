import { Box, useMediaQuery } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';
import { useRef, useEffect, useState } from 'react';
import Footer from '../layout/Footer';
import CircularGallery from '../ui/Components/CircularGallery/CircularGallery';

const Carousel = () => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState('calc(100vh - 96px)');

  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current && !isMobile) {
        const headerHeight = footerRef.current.offsetHeight;
        setFooterHeight(`calc(100vh - ${headerHeight}px)`);
      }
    };

    // Initial measurement
    updateFooterHeight();
    
    // Update on resize
    window.addEventListener('resize', updateFooterHeight);
    return () => window.removeEventListener('resize', updateFooterHeight);
  }, [isMobile]);

  if (isMobile) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the gallery
          overflow: 'visible',
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        }}
      >
        <Box sx={{ 
          width: '90%', // Constrain width on mobile
          maxWidth: '500px', // Maximum width
          height: '80vh', // Reduce height to fit more photos
        }}>
          <CircularGallery 
            bend={1.5}
            textColor={mode === 'light' ? "#000000" : "#ffffff"}
            font={'bold 24px Segoe UI'}
          />
        </Box>
      </Box>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'relative',
          height: footerHeight,
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the gallery
          overflow: 'visible',
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          flexGrow: 1,
        }}
      >
        <Box sx={{ 
          width: '90%', // Constrain width
          maxWidth: '1200px', // Maximum width
          height: '80%', // Reduce height to fit more photos
        }}>
          <CircularGallery 
            bend={2}
            textColor={mode === 'light' ? "#000000" : "#ffffff"}
            font={'bold 40px Segoe UI'}
          />
        </Box>
      </Box>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Carousel;