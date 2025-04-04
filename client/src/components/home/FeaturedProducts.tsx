import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

import ProductGrid from '../products/ProductGrid';
import { useStore } from '@tanstack/react-store';
import { appStore, setProducts } from '../../store/appStore';
import { mockProducts } from '../../data/mockData';

const FeaturedProducts = () => {
  // Get featured products from store
  const featuredProducts = useStore(appStore, (state) => state.featuredProducts);
  // const setProducts = useStore(appStore, (state) => state.setProducts);

  // Load mock products on component mount
  useEffect(() => {
    if (mockProducts.length > 0) {
      setProducts(mockProducts);
    }
  }, [setProducts]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box component="section" sx={{ py: 8 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Featured Products
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
          >
            Discover our curated selection of trending items from various cultural influences
          </Typography>
        </Box>

        <ProductGrid products={featuredProducts} />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/shop"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            View All Products
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default FeaturedProducts;