import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';

interface ShippingFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

// Country options for dropdown
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'RO', name: 'Romania'}
];

const ShippingForm = ({ onSubmit, initialData = {} }: ShippingFormProps) => {
  // Form state
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [address1, setAddress1] = useState(initialData.address1 || '');
  const [address2, setAddress2] = useState(initialData.address2 || '');
  const [city, setCity] = useState(initialData.city || '');
  const [state, setState] = useState(initialData.state || '');
  const [zip, setZip] = useState(initialData.zip || '');
  const [country, setCountry] = useState(initialData.country || 'US');
  const [saveAddress, setSaveAddress] = useState(initialData.saveAddress || false);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!address1.trim()) newErrors.address1 = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State/Province is required';
    if (!zip.trim()) newErrors.zip = 'ZIP/Postal code is required';
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        firstName,
        lastName,
        email,
        phone,
        address1,
        address2,
        city,
        state,
        zip,
        country,
        saveAddress,
      });
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
          Shipping Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="Address Line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              error={!!errors.address1}
              helperText={errors.address1}
              required
            />
          </Grid>
          
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="Address Line 2 (Optional)"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="State/Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
              error={!!errors.state}
              helperText={errors.state}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              error={!!errors.zip}
              helperText={errors.zip}
              required
            />
          </Grid>
          
          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              select
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              {countries.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid size={{xs:12}}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={saveAddress} 
                  onChange={(e) => setSaveAddress(e.target.checked)} 
                  color="primary" 
                />
              }
              label="Save this address for future orders"
            />
          </Grid>
        </Grid>
        
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

export default ShippingForm;