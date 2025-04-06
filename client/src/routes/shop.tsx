import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';
import FilterBar from '../components/products/FilterBar';
// import { useStore } from '@tanstack/react-store';
// import { appStore, setProducts, filterProducts } from '../store/appStore';
// import { mockProducts } from '../data/mockData';
import { useTheme, type CultureTheme } from '../context/ThemeContext';
import Particles from '@/components/ui/Backgrounds/Particles/Particles';
import axios from 'axios';

const URL = import.meta.env.VITE_DATABASE_URL;
export const Route = createFileRoute('/shop')({ 
  component: ShopPage,
  loader: async () => {
    const response = await axios.get(`https://${URL}/api/products`, { headers: {
      'Content-Type': 'application/json'
    }});

    const products = await response.data;
    return products.sort((a: any, b:any) => {
      if(a.featured && !b.featured) {
       return -1; 
      }
      if(!a.featured && b.featured) {
        return 1;
      }
      return 0;
    });
  }
});


function ShopPage() {
  const [loading, setLoading] = useState(true);
  const products = Route.useLoaderData();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { setCulture } = useTheme();
  
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const categoryParam = searchParams.get('category');
  const cultureParam = searchParams.get('culture');
  const searchQueryParam = searchParams.get('search') || '';
  
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
    setLoading(true);
    let filtered = [...products];
    
    if (categoryParam) {
      filtered = filtered.filter(product => product.category.toLowerCase() === categoryParam);
    }
    if (cultureParam) {
      filtered = filtered.filter(product => 
        product.culture.toLowerCase() === cultureParam.toLowerCase()
      );
      if (['urban', 'streetwear', 'hiphop', 'indie', 'punk'].includes(cultureParam.toLowerCase())) {
        setCulture(cultureParam.toLowerCase() as CultureTheme);
      }
    }
    if (searchQueryParam) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQueryParam.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQueryParam.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
    setLoading(false);
  }, [products, categoryParam, cultureParam, searchQueryParam, setCulture]);
  
  const handleFilterChange = (category: string | null, culture: string | null, searchQuery: string) => {
    let filtered = [...products];
    
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }
    if (culture) {
      filtered = filtered.filter(product => 
        product.culture.toLowerCase() === culture.toLowerCase()
      );
      if (['urban', 'streetwear', 'hiphop', 'indie', 'punk'].includes(culture.toLowerCase())) {
        setCulture(culture.toLowerCase() as CultureTheme);
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
    
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (culture) params.set('culture', culture);
    if (searchQuery) params.set('search', searchQuery);
    
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState({}, '', newUrl);
  };
  
  return (
    <Layout>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}>
        <Particles
          particleColors={['#f5f5f5', '#f5f5f5']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </Box>

      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'transparent',
        minHeight: '100vh',
      }}>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
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
              <Grid size={{xs:12}}>
                <FilterBar 
                  onFilterChange={handleFilterChange}
                  activeCategory={categoryParam || null}
                  activeCulture={cultureParam || null}
                  searchQuery={searchQueryParam}
                />
              </Grid>
              <Grid size={{xs:12}}>
                <ProductGrid 
                  products={filteredProducts.map((product: { category: string; featured: boolean; image: string }) => ({
                    ...product,
                    image: product.image,
                    chips: [
                      {
                        label: product.category,
                        color: "secondary",
                        sx: { textTransform: 'capitalize' }
                      },
                      ...(product.featured ? [{
                        label: "Featured",
                        color: "warning",
                        sx: { 
                          backgroundColor: '#ffd700',
                          color: '#000',
                          ml: 1
                        }
                      }] : [])
                    ]
                  }))}
                  loading={loading}
                  emptyMessage="No products match your filters. Try adjusting your criteria."
                />
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>
    </Layout>
  );
}