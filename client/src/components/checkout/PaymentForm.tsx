import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PaymentForm = ({ onSubmit, initialData = {} }: PaymentFormProps) => {
  // Form state
  const [paymentMethod, setPaymentMethod] = useState(initialData.paymentMethod || 'credit_card');
  const [cardName, setCardName] = useState(initialData.cardName || '');
  const [cardNumber, setCardNumber] = useState(initialData.cardNumber || '');
  const [expDate, setExpDate] = useState(initialData.expDate || '');
  const [cvv, setCvv] = useState(initialData.cvv || '');
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    },
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'credit_card') {
      if (!cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!expDate.trim()) {
        newErrors.expDate = 'Expiration date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) {
        newErrors.expDate = 'Invalid format (MM/YY)';
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        paymentMethod,
        cardName,
        cardNumber,
        expDate,
        cvv,
      });
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <RadioGroup
            aria-label="payment-method"
            name="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:4}}>
                <Box 
                  sx={{
                    border: 1,
                    borderColor: paymentMethod === 'credit_card' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    transition: 'all 0.2s',
                    bgcolor: paymentMethod === 'credit_card' ? 'action.selected' : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon sx={{ mr: 1 }} />
                        <Typography>Credit Card</Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{xs:12, sm:4}}>
                <Box 
                  sx={{
                    border: 1,
                    borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    transition: 'all 0.2s',
                    bgcolor: paymentMethod === 'paypal' ? 'action.selected' : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1 }} />
                        <Typography>PayPal</Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Box>
              </Grid>
              
              <Grid size={{xs:12, sm:4}}>
                <Box 
                  sx={{
                    border: 1,
                    borderColor: paymentMethod === 'bank_transfer' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    transition: 'all 0.2s',
                    bgcolor: paymentMethod === 'bank_transfer' ? 'action.selected' : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    value="bank_transfer"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalanceIcon sx={{ mr: 1 }} />
                        <Typography>Bank Transfer</Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </RadioGroup>
        </FormControl>
        
        {paymentMethod === 'credit_card' && (
          <Grid container spacing={2}>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                error={!!errors.cardName}
                helperText={errors.cardName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                inputProps={{ maxLength: 19 }}
              />
            </Grid>
            
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Expiration date"
                placeholder="MM/YY"
                value={expDate}
                onChange={(e) => {
                  let value = e.target.value;
                  // Auto-add slash after month
                  if (value.length === 2 && expDate.length === 1) {
                    value += '/';
                  }
                  // Restrict to MM/YY format
                  if (/^\d{0,2}(\/\d{0,2})?$/.test(value)) {
                    setExpDate(value);
                  }
                }}
                error={!!errors.expDate}
                helperText={errors.expDate}
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            
            <Grid size={{xs:12, sm:4}}>
              <TextField
                fullWidth
                label="CVV"
                value={cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCvv(value);
                }}
                error={!!errors.cvv}
                helperText={errors.cvv}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
          </Grid>
        )}
        
        {paymentMethod === 'paypal' && (
          <Box sx={{ my: 2, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              You will be redirected to PayPal to complete your payment securely.
            </Typography>
          </Box>
        )}
        
        {paymentMethod === 'bank_transfer' && (
          <Box sx={{ my: 2, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please use the following details for bank transfer:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Bank: Example Bank<br />
              Account: 1234567890<br />
              Sort Code: 12-34-56<br />
              Reference: Your order number
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: 150 }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default PaymentForm;