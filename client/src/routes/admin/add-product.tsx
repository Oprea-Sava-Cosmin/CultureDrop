import { useState } from 'react';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Layout from '../../components/layout/Layout';
import { appStore, addProduct } from '../../store/appStore';
// import type { Product } from '../../store/appStore';


export const Route = createFileRoute('/admin/add-product')({ 
  component: AddProductPage,
  beforeLoad: () => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = appStore.state.isAuthenticated;
    const isAdmin = appStore.state.adminToken != null
    
    if (!isAuthenticated || !isAdmin) {
      throw redirect({
        to: '/auth',
      });
    }
  },
});

function AddProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
interface FormData {
  name: string;
  category: string;
  subCategory: string;
  price: string;
  size: string[];
  stock: string;
  description: string;
  culture: string;
  tags: string[];
  featured: boolean;
  imageFile: File | null;
}

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    size: [],
    stock: '',
    description: '',
    culture: '',
    tags: [],
    featured: false,
    imageFile: null
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    category: '',
    subCategory: '',
    price: '',
    size: '',
    stock: '',
    image: '',
    description: '',
    culture: '',
    tags: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle multi-select changes for size
  const handleSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setFormData((prev) => ({
      ...prev,
      size: value,
    }));
    
    // Clear error
    if (formErrors.size) {
      setFormErrors((prev) => ({
        ...prev,
        size: '',
      }));
    }
  };
  

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      valid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
      valid = false;
    }
    
    if (formData.category && !formData.subCategory) {
      newErrors.subCategory = 'Sub-category is required';
      valid = false;
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
      valid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
      valid = false;
    }
    
    if (formData.size.length === 0) {
      newErrors.size = 'At least one size must be selected';
      valid = false;
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
      valid = false;
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
      valid = false;
    }
    
    /*if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
      valid = false;
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = 'Please enter a valid URL';
      valid = false;
    }*/
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    
    if (!formData.culture.trim()) {
      newErrors.culture = 'Culture is required';
      valid = false;
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;
    
  //   setIsSubmitting(true);
  //   setError(null);
    
  //   try {
  //     // Create the product object
  //     const productData: Omit<Product, '_id'> = {
  //       name: formData.name,
  //       category: formData.category as 'clothing' | 'music' | 'accessories',
  //       subCategory: formData.subCategory,
  //       price: parseFloat(formData.price),
  //       size: formData.size,
  //       stock: parseInt(formData.stock),
  //       image: formData.image,
  //       description: formData.description,
  //       culture: formData.culture,
  //       tags: formData.tags,
  //       featured: formData.featured,
  //     };
      
  //     // Add the product to the store
  //     const newProduct = addProduct(productData);
      
  //     // Show success message
  //     setSuccess(true);
      
  //     // Reset form after successful submission
  //     setFormData({
  //       name: '',
  //       category: '',
  //       subCategory: '',
  //       price: '',
  //       size: [],
  //       stock: '',
  //       image: '',
  //       description: '',
  //       culture: '',
  //       tags: [],
  //       featured: false,
  //     });
      
  //     // Redirect to product management after a short delay
  //     setTimeout(() => {
  //       navigate({ to: '/admin/products' });
  //     }, 2000);
  //   } catch (err) {
  //     console.error('Error adding product:', err);
  //     setError('An error occurred while adding the product. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if(!formData.imageFile) {
        throw new Error('Please select an image');
      }

      const imageData = new FormData();
      imageData.append('file', formData.imageFile);
      imageData.append('upload_preset', 'basicUnsignedUpload');
      imageData.append('cloud_name', 'dh4yaghm0');
      // imageData.append('upload_preset', 'your_upload_preset');

      const uploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/dh4yaghm0/image/upload`, imageData);

      const productData = {
        name: formData.name,
        category: formData.category as 'clothing' | 'music' | 'accessories',
        subCategory: formData.subCategory,
        price: parseFloat(formData.price),
        size: formData.size,
        stock: parseInt(formData.stock),
        description: formData.description,
        culture: formData.culture,
        tags: formData.tags,
        featured: formData.featured,
        image: uploadResponse.data.secure_url
      };

      await addProduct(productData);
      
      setSuccess(true);

      setTimeout(() => {
        navigate({ to: '/admin/products' });
      }, 2000);
    } catch (error) {
      console.error('Error: ', error);
      setError('An error occurred while adding the product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Product
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Product added successfully!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper
          component={motion.div}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          elevation={3}
          sx={{ p: 3 }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  required
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <FormControl fullWidth error={!!formErrors.category} required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={(event) => handleChange(event as any)}
                  >
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Music">Music</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                  </Select>
                  {formErrors.category && (
                    <FormHelperText>{formErrors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                  <FormControl fullWidth error={!!formErrors.subCategory} required disabled={!formData.category}>
                    <InputLabel>Sub-Category</InputLabel>
                    <Select
                      name="subCategory"
                      value={formData.subCategory}
                      label="Sub-Category"
                      onChange={(event) => handleChange(event as any)}
                    >
                      {formData.category === 'Clothing' && [
                        <MenuItem key="Shirts" value="shirts">Shirts</MenuItem>,
                        <MenuItem key="Pants" value="pants">Pants</MenuItem>,
                        <MenuItem key="Dresses" value="dresses">Dresses</MenuItem>,
                        <MenuItem key="Jackets" value="jackets">Jackets</MenuItem>,
                      ]}
                      {formData.category === 'Music' && [
                        <MenuItem key="Instruments" value="instruments">Instruments</MenuItem>,
                        <MenuItem key="Albums" value="albums">Albums</MenuItem>,
                        <MenuItem key="Accessories" value="accessories">Accessories</MenuItem>,
                      ]}
                      {formData.category === 'Accessories' && [
                        <MenuItem key="Jewelry" value="jewelry">Jewelry</MenuItem>,
                        <MenuItem key="Bags" value="bags">Bags</MenuItem>,
                        <MenuItem key="Hats" value="hats">Hats</MenuItem>,
                        <MenuItem key="Other" value="other">Other</MenuItem>,
                      ]}
                    </Select>
                    {formErrors.subCategory && (
                      <FormHelperText>{formErrors.subCategory}</FormHelperText>
                    )}
                  </FormControl>
              </Grid>
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={formData.price}
                  onChange={handleChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  required
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  value={formData.stock}
                  onChange={handleChange}
                  error={!!formErrors.stock}
                  helperText={formErrors.stock}
                  required
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Culture"
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  error={!!formErrors.culture}
                  helperText={formErrors.culture}
                  required
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <FormControl fullWidth error={!!formErrors.size} required>
                  <InputLabel id="size-label">Size</InputLabel>
                  <Select
                    labelId="size-label"
                    multiple
                    name="size"
                    value={formData.size}
                    label="Size"
                    onChange={handleSizeChange as any}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="XS">XS</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                    <MenuItem value="XXL">XXL</MenuItem>
                    <MenuItem value="One Size">One Size</MenuItem>
                  </Select>
                  {formErrors.size && (
                    <FormHelperText>{formErrors.size}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size = {{xs:12}}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
                      }
                    }}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Product Image
                    </Button>
                  </label>
                  {formData.imageFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {formData.imageFile.name}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size = {{xs:12}}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              
              <Grid size = {{xs:12}}>
                <FormControl fullWidth error={!!formErrors.tags} required sx={{ mb: 2 }}>
                  <InputLabel shrink>Tags</InputLabel>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => {
                          const newTags = [...formData.tags];
                          newTags.splice(index, 1);
                          setFormData(prev => ({ ...prev, tags: newTags }));
                        }}
                      />
                    ))}
                    <TextField
                      variant="standard"
                      placeholder="Add tag and press Enter"
                      sx={{ ml: 1, flex: 1 }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
                          e.preventDefault();
                          const newTag = (e.target as HTMLInputElement).value.trim();
                          if (!formData.tags.includes(newTag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, newTag]
                            }));
                            // Clear error
                            if (formErrors.tags) {
                              setFormErrors(prev => ({ ...prev, tags: '' }));
                            }
                          }
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </Box>
                  {formErrors.tags && (
                    <FormHelperText>{formErrors.tags}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size = {{xs:12}}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={handleSwitchChange}
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                />
              </Grid>
              
              <Grid size = {{xs:12}} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Add Product'
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate({ to: '/admin' })}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}
