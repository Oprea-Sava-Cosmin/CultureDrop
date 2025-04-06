import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { addToCart } from '../../store/appStore';
import type { Product } from '../../store/appStore';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

interface ChatProductCardProps {
  product: Product;
  onProductClick?: () => void;
}

const ChatProductCard = ({ product, onProductClick }: ChatProductCardProps) => {
  const theme = useTheme();
  const { culture, mode } = useCustomTheme();
  
  // Define culture-specific colors based on product culture or current theme
  const getCultureColors = () => {
    // First try to match the product's own culture
    const productCulture = product.culture.toLowerCase();
    const themeCulture = culture.toLowerCase();
    
    // Use the product's culture first, fall back to the current theme culture
    const activeCulture = productCulture || themeCulture;
    
    switch (activeCulture) {
      case 'punk':
        return {
          primary: mode === 'dark' ? '#E5E5E5' : '#D72638',     // Match ThemeContext colors
          secondary: mode === 'dark' ? '#FF2E63' : '#1B1B1E',   // Match ThemeContext colors
          accent: mode === 'dark' ? '#FF2E63' : '#D72638'       // Use secondary in dark, primary in light
        };
      case 'hiphop':
        return {
          primary: mode === 'dark' ? '#F5F5F5' : '#2D132C',     // Match ThemeContext colors
          secondary: mode === 'dark' ? '#C28800' : '#FFD700',   // Match ThemeContext colors
          accent: mode === 'dark' ? '#C28800' : '#FFD700'       // Use secondary color for accent
        };
      case 'urban':
        return {
          primary: mode === 'dark' ? '#ECF0F1' : '#2C3E50',     // Match ThemeContext colors
          secondary: mode === 'dark' ? '#F39C12' : '#E67E22',   // Match ThemeContext colors
          accent: mode === 'dark' ? '#F39C12' : '#E67E22'       // Use secondary color for accent
        };
      case 'indie':
        return {
          primary: mode === 'dark' ? '#2B2D42' : '#8D99AE',     // Match ThemeContext colors
          secondary: mode === 'dark' ? '#F1D302' : '#EF8354',   // Match ThemeContext colors
          accent: mode === 'dark' ? '#F1D302' : '#EF8354'       // Use secondary color for accent
        };
      case 'streetwear':
        return {
          primary: mode === 'dark' ? '#EFEFEF' : '#1A1A1A',     // Match ThemeContext colors
          secondary: mode === 'dark' ? '#FF6B6B' : '#FF3B3F',   // Match ThemeContext colors
          accent: mode === 'dark' ? '#FF6B6B' : '#FF3B3F'       // Use secondary color for accent
        };
      case 'goth':
        return {
          primary: '#7b1fa2',
          secondary: '#212121',
          accent: '#9c27b0'
        };
      default:
        return {
          primary: theme.palette.primary.main,
          secondary: theme.palette.secondary.main,
          accent: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.main
        };
    }
  };
  
  const cultureColors = getCultureColors();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <Card
      component={motion.div}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        '&:hover': {
          backgroundColor: 'inherit', // Prevent background color change on hover
        }
      }}
      onClick={onProductClick}
    >
      <CardActionArea 
        component={Link} 
        to={`/product/${product._id}`}
        sx={{
          '&:hover': {
            backgroundColor: 'transparent', // Prevent background color change on hover
          }
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Category tag */}
          <Chip
            label={product.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: cultureColors.primary,
              color: 'white',
              fontWeight: 500,
            }}
          />
          
          {/* Culture tag - positioned below category */}
          <Chip
            label={product.culture}
            size="small"
            sx={{
              position: 'absolute',
              top: 44, // Position below the category tag
              left: 8,
              backgroundColor: cultureColors.secondary,
              color: 'white',
              fontWeight: 500,
            }}
          />
          
          {/* Featured star icon - at the bottom */}
          {product.featured && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: cultureColors.accent,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <StarIcon sx={{ color: 'white', fontSize: '1rem' }} />
            </Box>
          )}
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              fontSize: '1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: cultureColors.primary }}>
              ${product.price.toFixed(2)}
            </Typography>
            
            <IconButton 
              size="small" 
              onClick={handleAddToCart}
              sx={{ 
                backgroundColor: cultureColors.primary,
                color: 'white',
                '&:hover': {
                  backgroundColor: cultureColors.accent,
                },
                '&.Mui-focusVisible': {
                  backgroundColor: cultureColors.primary,
                }
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ChatProductCard;