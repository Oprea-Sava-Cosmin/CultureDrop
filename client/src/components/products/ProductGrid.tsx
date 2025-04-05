import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

import ProductCard from './ProductCard';
import type { Product } from '../../store/appStore';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
}

const ProductGrid = ({
  products,
  loading = false,
  title,
  emptyMessage = 'No products found',
}: ProductGridProps) => {
  // Animation variants for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{xs:12, sm:6, md:4, lg:3}} key={product.id}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <ProductCard product={product} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default ProductGrid;