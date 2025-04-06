import { Box, useMediaQuery, Typography } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';
import { useRef, useEffect, useState } from 'react';
import Footer from '../layout/Footer';
import BounceCards from '../ui/Components/BounceCards/BounceCards';
import axios from 'axios';
import { Link } from '@tanstack/react-router';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  featured?: boolean;
}

const Carousel = () => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState('calc(100vh - 96px)');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Fetch featured products from the database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products?featured=true');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback data in case of error
        setFeaturedProducts([
          { _id: '1', name: 'Product 1', image: '/images/product-placeholder.jpg', price: 99.99 },
          { _id: '2', name: 'Product 2', image: '/images/product-placeholder.jpg', price: 149.99 },
          { _id: '3', name: 'Product 3', image: '/images/product-placeholder.jpg', price: 199.99 }
        ]);
      }
    };

    fetchFeaturedProducts();
  }, []);

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

  // Extract product images for BounceCards (limit to first 6)
  const limitedProducts = featuredProducts.slice(0, 5);
  const productImages = limitedProducts.map(product => product.image);

  // Custom transform styles based on number of products
  const getTransformStyles = () => {
    const count = productImages.length;
    if (count <= 1) return ["rotate(0deg)"];
    if (count === 2) return ["rotate(-5deg) translate(-100px)", "rotate(5deg) translate(100px)"];
    if (count === 3) return ["rotate(-10deg) translate(-150px)", "rotate(0deg)", "rotate(10deg) translate(150px)"];
    if (count === 4) return [
      "rotate(-15deg) translate(-170px)",
      "rotate(-5deg) translate(-60px)",
      "rotate(5deg) translate(60px)",
      "rotate(15deg) translate(170px)"
    ];
    // Default for 5 or more
    return [
      "rotate(10deg) translate(-170px)",
      "rotate(5deg) translate(-85px)",
      "rotate(-3deg)",
      "rotate(-10deg) translate(85px)",
      "rotate(2deg) translate(170px)",
    ];
  };

  // Handle card click to navigate to product page
  const handleCardClick = (index: number) => {
    if (limitedProducts[index]) {
      window.location.href = `/product/${limitedProducts[index]._id}`;
    }
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          padding: 2,
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            color: mode === 'dark' ? 'white' : 'black',
            textAlign: 'center'
          }}
        >
          Featured Products
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: '70vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <BounceCards
            images={productImages}
            containerWidth={300}
            containerHeight={400}
            enableHover={true}
            transformStyles={getTransformStyles()}
            className={`bounce-cards-${mode}`}
            onCardClick={handleCardClick}
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
          flexGrow: 1,
          padding: 4,
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            color: mode === 'dark' ? 'white' : 'black',
            textAlign: 'center'
          }}
        >
          Featured Products
        </Typography>
        
        <Box 
          sx={{ 
            width: '100%', 
            height: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <BounceCards
            images={productImages}
            containerWidth={600}
            containerHeight={500}
            enableHover={true}
            transformStyles={getTransformStyles()}
            className={`bounce-cards-${mode}`}
            onCardClick={handleCardClick}
          />
        </Box>
      </Box>
      <div ref={footerRef}>
        <Footer />
      </div>
      
      {/* Add custom styles for the BounceCards based on theme */}
      <style>
        {`
          .bounce-cards-dark .card {
            border-color: #333;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
          }
          
          .bounce-cards-light .card {
            border-color: #fff;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default Carousel;