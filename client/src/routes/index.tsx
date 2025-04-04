import { createFileRoute } from '@tanstack/react-router';
import { Box } from '@mui/material';
import { motion } from 'motion/react';

import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CultureSection from '../components/home/CultureSection';

export const Route = createFileRoute('/')({ 
  component: HomePage,
});

function HomePage() {
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Products Section */}
        <Box sx={{ mt: 4 }}>
          <FeaturedProducts />
        </Box>
        
        {/* Culture Section */}
        <Box sx={{ mt: 4 }}>
          <CultureSection />
        </Box>
      </motion.div>
    </Layout>
  );
}
