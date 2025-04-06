import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { useState, useEffect } from 'react';

import Layout from '../../components/layout/Layout';
import { useStore } from '@tanstack/react-store';
import { appStore } from '../../store/appStore';

export const Route = createFileRoute('/admin/')({ 
  component: AdminDashboard,
  beforeLoad: () => {
    // Check if user is authenticated
    const isAuthenticated = appStore.state.isAuthenticated;
    const token = localStorage.getItem('adminToken');
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
    else if(!token) {
      throw redirect({
        to: '/'
      })
    }
  },
});

function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const products = useStore(appStore, (state) => state.products);
  
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/count');
        setProductCount(response.data.count);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };
    
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/count');
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };

    fetchProductCount();
    fetchUserCount();
  }, []);

  // Animation variants for dashboard elements
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Layout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dashboard Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size = {{xs:12, sm:6, md:3}}>
              <motion.div variants={itemVariants}>
                <Card elevation={3}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <InventoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {productCount}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Products
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid size = {{xs:12, sm:6, md:3}}>
              <motion.div variants={itemVariants}>
                <Card elevation={3}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {userCount}
                    </Typography>
                    <Typography color="text.secondary">
                      Registered Users
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid size = {{xs:12, sm:6, md:3}}>
              <motion.div variants={itemVariants}>
                <Card elevation={3}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      0
                    </Typography>
                    <Typography color="text.secondary">
                      Orders
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid size = {{xs:12, sm:6, md:3}}>
              <motion.div variants={itemVariants}>
                <Card elevation={3}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" component="div" sx={{ color: 'success.main' }}>
                      $0
                    </Typography>
                    <Typography color="text.secondary">
                      Total Revenue
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size = {{xs:12, sm:6, md:3}}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    component={motion.a}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/admin/add-product"
                  >
                    Add New Product
                  </Button>
                </Grid>
                <Grid size = {{xs:12, sm:6, md:3}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<InventoryIcon />}
                    component={motion.a}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/admin/products"
                  >
                    Manage Products
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
          
          {/* Recent Products */}
          <motion.div variants={itemVariants}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Products
              </Typography>
              
              {products.length > 0 ? (
                <Grid container spacing={2}>
                  {products.slice(0, 4).map((product) => (
                    <Grid size = {{xs:12, sm:6, md:3}} key={product._id}>
                      <Card>
                        <Box sx={{ height: 140, overflow: 'hidden' }}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${product.price.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                  No products available. Add your first product!
                </Typography>
              )}
              
              {products.length > 4 && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button 
                    variant="text" 
                    href="/admin/products"
                  >
                    View All Products
                  </Button>
                </Box>
              )}
            </Paper>
          </motion.div>
        </motion.div>
      </Box>
    </Layout>
  );
}
