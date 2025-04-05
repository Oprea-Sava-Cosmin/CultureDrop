import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';
import FilterBar from '../components/products/FilterBar';
import { useStore } from '@tanstack/react-store';
import { appStore, setProducts, filterProducts } from '../store/appStore';
import { mockProducts } from '../data/mockData';
import { useTheme, type CultureTheme } from '../context/ThemeContext';

export const Route = createFileRoute('/shop')({ 
  component: ShopPage,
});

function ShopPage() {
  const [loading, setLoading] = useState(true);
  
  const filteredProducts = useStore(appStore, (state) => state.filteredProducts);
  const productFilter = useStore(appStore, (state) => state.productFilter);
  
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const categoryParam = searchParams.get('category');
  const cultureParam = searchParams.get('culture');
  
  const { setCulture } = useTheme();
  
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
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (mockProducts.length > 0) {
          setProducts(mockProducts);
          
          if (categoryParam || cultureParam) {
            filterProducts(
              categoryParam, 
              cultureParam, 
              productFilter.searchQuery
            );
            
            if (cultureParam && ['urban', 'streetwear', 'hiphop', 'indie', 'punk'].includes(cultureParam)) {
              setCulture(cultureParam as CultureTheme);
            }
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [setProducts, categoryParam, cultureParam, productFilter.searchQuery, setCulture]);
  
  const handleFilterChange = (category: string | null, culture: string | null, searchQuery: string) => {
    filterProducts(category, culture, searchQuery);
    
    if (culture && ['urban', 'streetwear', 'hiphop', 'indie', 'punk'].includes(culture)) {
      setCulture(culture as CultureTheme);
    }
    
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (culture) params.set('culture', culture);
    
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState({}, '', newUrl);
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
            <Grid sx={{xs:12}}>
              <FilterBar 
                onFilterChange={handleFilterChange}
                activeCategory={productFilter.category}
                activeCulture={productFilter.culture}
                searchQuery={productFilter.searchQuery}
              />
            </Grid>
            <Grid sx={{xs:12}}>
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
