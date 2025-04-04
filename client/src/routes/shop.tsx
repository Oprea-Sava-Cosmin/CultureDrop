import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';
import FilterBar from '../components/products/FilterBar';
import { useStore } from '@tanstack/react-store';
import { appStore, setProducts, filterProducts } from '../store/appStore';
import { mockProducts } from '../data/mockData';

export const Route = createFileRoute('/shop')({ 
  component: ShopPage,
});

function ShopPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  
  // Access state and actions using useStore
  const filteredProducts = useStore(appStore, (state) => state.filteredProducts);
  // const setProducts = useStore(appStore, (state) => state.setProducts);
  // const filterProducts = useStore(appStore, (state) => state.filterProducts);
  const productFilter = useStore(appStore, (state) => state.productFilter);
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 } 
    },
  };
  
  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (mockProducts.length > 0) {
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [setProducts]);
  
  // Handle filter changes
  const handleFilterChange = (category: string | null, culture: string | null, searchQuery: string) => {
    filterProducts(category, culture, searchQuery);
  };
  
  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                mb: 2
              }}
            >
              Shop All Products
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              color="text.secondary"
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                textAlign: 'center',
                mb: 4
              }}
            >
              Explore our curated collection of music and fashion items from various cultural influences
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid size={{xs:12, md:3}}>
              <FilterBar 
                onFilterChange={handleFilterChange}
                activeCategory={productFilter.category}
                activeCulture={productFilter.culture}
                searchQuery={productFilter.searchQuery}
              />
            </Grid>
            <Grid size={{xs:12, md:9}}>
              <ProductGrid 
                products={filteredProducts} 
                loading={loading}
                emptyMessage="No products match your filters. Try adjusting your criteria."
              />
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </Layout>
  );
}
