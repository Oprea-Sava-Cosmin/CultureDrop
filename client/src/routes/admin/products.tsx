import { useState } from 'react';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { appStore, updateProduct, deleteProduct } from '../../store/appStore';
import type { Product } from '../../store/appStore';
import axios from 'axios';

const URL = import.meta.env.VITE_DATABASE_URL;

export const Route = createFileRoute('/admin/products')({ 
  component: ProductsManagementPage,
  loader: async () => {
    const response = await axios.get(`https://${URL}/api/products`, { headers: {
      'Content-Type': 'application/json'
    }});
    return response.data;
  },
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

function ProductsManagementPage() {
  const navigate = useNavigate();
  // const products = useStore(appStore, (state) => state.products);
  const products = Route.useLoaderData() as Product[];
  console.log(products);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    culture: '',
    featured: false,
  });
  
  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    event; // add this to bypass build error
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Confirm product deletion
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        
        // Fetch fresh data after deletion
        await axios.get(`https://${URL}/api/products`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Update the products data with the fresh data
        navigate({ to: '/admin/products' });
        
        setAlert({ type: 'success', message: 'Product deleted successfully' });
        handleCloseDeleteDialog();
        setPage(0);
        
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete product' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      culture: product.culture,
      featured: product.featured || false,
    });
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingProduct(null);
  };

  // Handle form field changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Save edited product
  const handleSaveEdit = async () => {
    if (editingProduct) {
      try {
        const updatedProduct: Partial<Product> = {
          name: editFormData.name,
          category: editFormData.category as 'clothing' | 'music' | 'accessories',
          price: parseFloat(editFormData.price),
          image: editFormData.image,
          description: editFormData.description,
          culture: editFormData.culture,
          featured: editFormData.featured,
        };
        
        await updateProduct(editingProduct._id, updatedProduct);
        
        // Fetch fresh data after update
        await axios.get(`https://${URL}/api/products`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Update the products data with the fresh data
        navigate({ to: '/admin/products' });
        
        setAlert({ type: 'success', message: 'Product updated successfully' });
        handleCloseEditDialog();
        
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to update product' });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    }
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <Layout>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Manage Products
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate({ to: '/admin/add-product' })}
          >
            Add New Product
          </Button>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 3 }}>
            {alert.message}
          </Alert>
        )}
        
        <Paper
          component={motion.div}
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          elevation={3}
          sx={{ width: '100%', overflow: 'hidden' }}
        >
          {products.length > 0 ? (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Culture</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Featured</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <TableRow key={product._id} hover>
                          <TableCell>
                            <Box
                              component="img"
                              src={product.image}
                              alt={product.name}
                              sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category} 
                              color="secondary" 
                              size="small" 
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>{product.culture}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.featured ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenEditDialog(product)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(product._id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No products available.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate({ to: '/admin/add-product' })}
                sx={{ mt: 2 }}
              >
                Add Your First Product
              </Button>
            </Box>
          )}
        </Paper>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Product Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={editFormData.category}
                    label="Category"
                    onChange={(event) => handleEditFormChange(event as any)}
                  >
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Music">Music</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={editFormData.price}
                  onChange={handleEditFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid size = {{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Culture"
                  name="culture"
                  value={editFormData.culture}
                  onChange={handleEditFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid size = {{xs:12}}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={editFormData.image}
                  onChange={handleEditFormChange}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid size = {{xs:12}}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  multiline
                  rows={4}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid size = {{xs:12}}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editFormData.featured}
                      onChange={handleSwitchChange}
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
