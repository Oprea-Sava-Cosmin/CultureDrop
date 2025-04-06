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

interface ChatProductCardProps {
  product: Product;
  onProductClick?: () => void;
}

const ChatProductCard = ({ product, onProductClick }: ChatProductCardProps) => {
  const theme = useTheme();
  
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
      }}
      onClick={onProductClick}
    >
      <CardActionArea component={Link} to={`/product/${product._id}`}>
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
          
          {/* Featured star icon */}
          {product.featured && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.palette.warning.main,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <StarIcon sx={{ color: 'white', fontSize: '1rem' }} />
            </Box>
          )}
          
          {/* Culture tag - moved down to make room for the star */}
          <Chip
            label={product.culture}
            size="small"
            sx={{
              position: 'absolute',
              top: product.featured ? 48 : 8,
              left: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontWeight: 500,
            }}
          />
          
          {/* Category tag */}
          <Chip
            label={product.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 500,
            }}
          />
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
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              ${product.price.toFixed(2)}
            </Typography>
            
            <IconButton 
              size="small" 
              color="primary" 
              onClick={handleAddToCart}
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
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