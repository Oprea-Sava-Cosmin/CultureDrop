import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CardActionArea,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/appStore';
import type { Product } from '../../store/appStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  console.log(product);
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.5 } },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          height: '100%',
          width: '100%',
          minWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          boxShadow: isHovered ? 8 : 2,
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: '300px' }}>
          <CardActionArea component={Link} to={`/product/${product._id}`}>
            <motion.div variants={imageVariants} style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              padding: '25px'
            }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  width: 'auto',
                  aspectRatio: '2 / 1',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </motion.div>
          </CardActionArea>

          {/* Culture tag */}
          <Chip
            label={product.culture}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              textTransform: 'capitalize',
            }}
          />

          {/* Category tag */}
          <Chip
            label={product.category}
            size="small"
            color="secondary"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              textTransform: 'capitalize',
            }}
          />

          {/* Quick add to cart button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              color="primary"
              onClick={handleAddToCart}
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </motion.div>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <motion.div variants={contentVariants} initial="initial" animate="animate">
            <Typography gutterBottom variant="h6" component="h2" noWrap>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
              {product.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary">
                ${product.price.toFixed(2)}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                component={Link}
                to={`/product/${product._id}`}
              >
                Details
              </Button>
            </Box>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;