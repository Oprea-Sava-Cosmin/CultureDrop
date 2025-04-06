// import { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@tanstack/react-store';
import { appStore, toggleCart, removeFromCart, updateCartItemQuantity, clearCart } from '../../store/appStore';

const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const cart = useStore(appStore, (state) => state.cart);
  const isCartOpen = useStore(appStore, (state) => state.isCartOpen);
  
  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  const cartItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };
  
  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={toggleCart}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : 400,
          boxSizing: 'border-box',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
        </Typography>
        <IconButton onClick={toggleCart} edge="end" aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {cart.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={toggleCart}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.product._id}
                  variants={cartItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        alt={item.product.name} 
                        src={item.product.image}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ${item.product.price.toFixed(2)}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small"
                              onClick={() => updateCartItemQuantity(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              inputProps={{ 
                                min: 1, 
                                style: { textAlign: 'center' } 
                              }}
                              sx={{ width: 40, mx: 1, '& input': { p: 0.5 } }}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  updateCartItemQuantity(item.product._id, value);
                                }
                              }}
                            />
                            <IconButton 
                              size="small"
                              onClick={() => updateCartItemQuantity(item.product._id, item.quantity + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
          
          <Box>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Tax</Typography>
                <Typography variant="body2" color="text.secondary">${tax.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Checkout
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={clearCart}
                size="small"
              >
                Clear Cart
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Cart;