import { Box, Typography, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import { motion } from 'framer-motion';

import type { CartItem } from '../../store/appStore';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const OrderSummary = ({ cartItems, subtotal, tax, shipping, total }: OrderSummaryProps) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        
        <List sx={{ mb: 2 }}>
          {cartItems.map((item) => (
            <ListItem key={item.product._id} alignItems="flex-start" sx={{ px: 0 }}>
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
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>
                }
              />
              <Typography variant="body2">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Tax</Typography>
          <Typography variant="body2" color="text.secondary">${tax.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Shipping</Typography>
          <Typography variant="body2" color="text.secondary">${shipping.toFixed(2)}</Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default OrderSummary;