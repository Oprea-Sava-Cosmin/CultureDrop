import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from '../components/layout/Layout';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { useStore } from '@tanstack/react-store';
import { appStore, clearCart } from '../store/appStore';
import axios from 'axios';
import { redirect } from '@tanstack/react-router';

const URL = import.meta.env.VITE_DATABASE_URL;
export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
  beforeLoad: () => {
    const isAuthenticated = appStore.state.isAuthenticated;
    if(!isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: '/checkout'
        }
      });
    }
  }
});

// Steps for checkout process
const steps = ['Shipping', 'Payment', 'Review'];


function CheckoutPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: '',
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
  });
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Get cart data from store
  const cart = useStore(appStore, (state) => state.cart);
  
  // Calculate order totals
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };
  
  // Check if cart is empty and redirect to shop
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigate({ to: '/shop' });
    }
  }, [cart, navigate, orderComplete]);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleShippingSubmit = (data: any) => {
    setShippingData(data);
    handleNext();
  };
  
  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    handleNext();
  };
  
  const handlePlaceOrder = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      if(!userToken) {
        navigate({to: '/auth'});
        return;
      }

      await axios.post(`https://${URL}/api/transactions`, {
        amount: total
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
     

    setOrderComplete(true);
    clearCart();
    // navigate('/order-confirmation');
    } catch (error) {
      console.error('Error processign order: ', error);
    }
  };
  
  // Render step content based on active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingData} />;
      case 1:
        return <PaymentForm onSubmit={handlePaymentSubmit} initialData={paymentData} />;
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Review
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size = {{xs:12, md: 6}}>
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body1">
                    {shippingData.firstName} {shippingData.lastName}
                  </Typography>
                  <Typography variant="body2">
                    {shippingData.address1}
                    {shippingData.address2 && <>, {shippingData.address2}</>}
                  </Typography>
                  <Typography variant="body2">
                    {shippingData.city}, {shippingData.state} {shippingData.zip}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {countries.find(c => c.code === shippingData.country)?.name}
                  </Typography>
                  <Typography variant="body2">
                    {shippingData.email}
                  </Typography>
                  {shippingData.phone && (
                    <Typography variant="body2">
                      {shippingData.phone}
                    </Typography>
                  )}
                </Paper>
                
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {paymentData.paymentMethod === 'credit_card' && 'Credit Card'}
                    {paymentData.paymentMethod === 'paypal' && 'PayPal'}
                    {paymentData.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                  </Typography>
                  {paymentData.paymentMethod === 'credit_card' && (
                    <Typography variant="body2">
                      Card ending in {paymentData.cardNumber.slice(-4)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
              
              <Grid size = {{xs:12, md: 6}}>
                <OrderSummary 
                  cartItems={cart}
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePlaceOrder}
                sx={{ minWidth: 200 }}
              >
                Place Order
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  // Order complete view
  if (orderComplete) {
    return (
      <Layout>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                Thank You For Your Order!
              </Typography>
              
              <Typography variant="body1" paragraph>
                Your order has been placed successfully. We've sent a confirmation email with all the details.
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Order #: {Math.floor(100000 + Math.random() * 900000)}
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate({ to: '/' })}
                  sx={{ mx: 1 }}
                >
                  Return to Home
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate({ to: '/shop' })}
                  sx={{ mx: 1 }}
                >
                  Continue Shopping
                </Button>
              </Box>
            </Paper>
          </Container>
        </motion.div>
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Checkout
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={4}>
            <Grid size= {{xs:12, md: 8}}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                {getStepContent(activeStep)}
                
                {activeStep !== 0 && activeStep !== 2 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
                    <Button
                      onClick={handleBack}
                      startIcon={<ArrowBackIcon />}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid size= {{xs:12, md: 4}}>
              <OrderSummary 
                cartItems={cart}
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                total={total}
              />
            </Grid>
          </Grid>
        </Container>
      </motion.div>
    </Layout>
  );
}

// Country options for dropdown (used in review step)
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];
