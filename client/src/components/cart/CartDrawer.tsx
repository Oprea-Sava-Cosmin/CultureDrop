import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  useTheme,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useStore } from '@tanstack/react-store';
import { appStore, removeFromCart, updateCartItemQuantity } from '../../store/appStore';
import { Link } from '@tanstack/react-router';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const cart = useStore(appStore, (state) => state.cart);
  
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Handle quantity changes
  const handleIncreaseQuantity = (itemId: string) => {
    const item = cart.find(item => item.product.id === itemId);
    if (item) {
      updateCartItemQuantity(itemId, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (itemId: string) => {
    const item = cart.find(item => item.product.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(itemId, item.quantity - 1);
    } else if (item) {
      removeFromCart(itemId);
    }
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          padding: 2,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Your Cart ({cart.length} items)
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {cart.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button 
            component={Link} 
            to="/shop" 
            variant="contained" 
            color="primary"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {cart.map((item) => (
              <ListItem 
                key={item.product.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeFromCart(item.product.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                }
                sx={{ 
                  mb: 1, 
                  bgcolor: theme.palette.background.default,
                  borderRadius: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    alt={item.product.name} 
                    src={item.product.image} 
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 1 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.product.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        ${item.product.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDecreaseQuantity(item.product.id)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleIncreaseQuantity(item.product.id)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={Link}
                to="/checkout"
                onClick={onClose}
              >
                Checkout
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;