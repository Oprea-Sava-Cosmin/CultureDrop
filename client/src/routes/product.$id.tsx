import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
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
  useTheme,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import { useTheme as useAppTheme } from '../context/ThemeContext';
import type { CultureTheme } from '../context/ThemeContext';

interface LoaderData {
  product: Product | null;
  error?: string;
}

const URL = import.meta.env.VITE_DATABASE_URL;

export const Route = createFileRoute('/product/$id')({
  component: ProductDetailPage,
  loader: async ({ params }) => {
    try {
      const response = await axios.get(`https://${URL}/api/products/${params.id}`);
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
  const [selectedSize, setSelectedSize] = useState('M'); // Default size
  const theme = useTheme();
  const { setCulture } = useAppTheme();

  // Set culture theme based on product
  useEffect(() => {
    if (loadedProduct && loadedProduct.culture) {
      const cultureLower = loadedProduct.culture.toLowerCase();
      if (['urban', 'streetwear', 'hiphop', 'indie', 'punk'].includes(cultureLower)) {
        setCulture(cultureLower as CultureTheme);
      }
    }
  }, [loadedProduct, setCulture]);

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

  // Handle size change
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value);
  };

  // Handle add to cart - updated to include size
  const handleAddToCart = () => {
    if (loadedProduct) {
      // Add size to the product when adding to cart
      const productWithSize = {
        ...loadedProduct,
        selectedSize
      };
      addToCart(productWithSize, quantity);
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
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                      objectFit: 'contain',
                      padding: '2rem',
                      transition: 'all 0.3s ease-in-out',
                      // Culture-specific image styling
                      filter: loadedProduct.culture.toLowerCase() === 'hiphop' ? 'drop-shadow(0 0 10px gold)' : 
                              loadedProduct.culture.toLowerCase() === 'punk' ? 'contrast(1.1)' :
                              loadedProduct.culture.toLowerCase() === 'indie' ? 'sepia(0.2)' : 'none',
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
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: loadedProduct.culture.toLowerCase() === 'punk' ? 400 : 700,
                      letterSpacing: loadedProduct.culture.toLowerCase() === 'hiphop' ? '0.05em' : 'normal',
                    }}
                  >
                    {loadedProduct.name}
                  </Typography>

                  {/* Price */}
                  <Typography 
                    variant="h4" 
                    color="primary" 
                    sx={{ 
                      mb: 2,
                      fontWeight: loadedProduct.culture.toLowerCase() === 'streetwear' ? 700 : 600,
                    }}
                  >
                    ${loadedProduct.price.toFixed(2)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Description */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 4,
                      lineHeight: loadedProduct.culture.toLowerCase() === 'hiphop' ? 1.8 : 1.6,
                      letterSpacing: loadedProduct.culture.toLowerCase() === 'hiphop' ? '0.03em' : 'normal',
                    }}
                  >
                    {loadedProduct.description}
                  </Typography>

                  {/* Size Selector */}
                  {loadedProduct.category.toLowerCase() === 'clothing' && loadedProduct.size && loadedProduct.size.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 1 }}>Select Size</FormLabel>
                        <RadioGroup
                          row
                          name="size-selector"
                          value={selectedSize}
                          onChange={handleSizeChange}
                        >
                          {loadedProduct.size.map((size) => (
                            <FormControlLabel 
                              key={size} 
                              value={size} 
                              control={<Radio />} 
                              label={size}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: selectedSize === size ? 600 : 400,
                                }
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  )}

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
                      // Culture-specific button styling
                      letterSpacing: loadedProduct.culture.toLowerCase() === 'hiphop' ? '0.05em' : 'normal',
                      textTransform: 'none',
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
