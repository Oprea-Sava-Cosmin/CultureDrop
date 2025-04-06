import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  TextField,
  IconButton,
  Paper,
  Breadcrumbs,
  CircularProgress,
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Layout from '../components/layout/Layout';
import { addToCart } from '../store/appStore';
import type { Product } from '../store/appStore';

interface LoaderData {
  product: Product | null;
  error?: string;
}

export const Route = createFileRoute('/product/$id')({
  component: ProductDetailPage,
  loader: async ({ params }) => {
    console.log(params)
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${params.id}`);
      return { product: response.data };
    } catch (error) {
      console.error('Error loading product:', error);
      return { product: null, error: 'Failed to load product' };
    }
  },
  pendingComponent: () => (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    </Layout>
  ),
});

function ProductDetailPage() {
  const { product: loadedProduct, error: loadError } = Route.useLoaderData() as LoaderData;
  const [quantity, setQuantity] = useState(1);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (loadedProduct) {
      addToCart(loadedProduct, quantity);
      // Reset quantity after adding to cart
      setQuantity(1);
    }
  };

  // Error state
  if (loadError || !loadedProduct) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography color="error">{loadError || 'Product not found'}</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Typography color="text.primary">{loadedProduct.name}</Typography>
          </Breadcrumbs>

          <Grid container spacing={4}>
            {/* Product Image */}
            <Grid size={{xs:12, md:6}}>
              <motion.div variants={imageVariants}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    overflow: 'hidden',
                    borderRadius: 2,
                    height: 0,
                    paddingTop: '100%',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={loadedProduct.image}
                    alt={loadedProduct.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Paper>
              </motion.div>
            </Grid>

            {/* Product Details */}
            <Grid size={{xs:12, md:6}}>
              <motion.div variants={contentVariants}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Tags */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={loadedProduct.culture} 
                      color="primary" 
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip 
                      label={loadedProduct.category} 
                      color="secondary" 
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>

                  {/* Product Name */}
                  <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    {loadedProduct.name}
                  </Typography>

                  {/* Price */}
                  <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                    ${loadedProduct.price.toFixed(2)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Description */}
                  <Typography variant="body1" sx={{ mb: 4 }}>
                    {loadedProduct.description}
                  </Typography>

                  {/* Quantity Selector */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Quantity:
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      size="small"
                      value={quantity}
                      inputProps={{ 
                        min: 1, 
                        style: { textAlign: 'center' } 
                      }}
                      sx={{ width: 60, mx: 1 }}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          handleQuantityChange(value);
                        }
                      }}
                    />
                    <IconButton 
                      size="small"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    sx={{ 
                      py: 1.5,
                      mt: 'auto',
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Layout>
  );
}
