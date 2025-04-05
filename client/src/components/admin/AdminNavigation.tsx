import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { useStore } from '@tanstack/react-store';
import { appStore, adminLogout, toggleAdminPanel } from '../../store/appStore';

const AdminNav = () => {
  const theme = useTheme();
  const isAuthenticated = useStore(appStore, (state) => state.isAuthenticated);
  const isAdminPanelOpen = useStore(appStore, (state) => state.isAdminPanelOpen);
  
  const handleLogout = () => {
    adminLogout();
  };

  const handleToggleAdminPanel = () => {
    toggleAdminPanel();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open admin panel"
        edge="end"
        onClick={handleToggleAdminPanel}
        sx={{ ml: 1 }}
      >
        <DashboardIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={isAdminPanelOpen}
        onClose={handleToggleAdminPanel}
      >
        <Box
          sx={{ width: 280 }}
          role="presentation"
        >
          <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
            <Typography variant="h6">Admin Dashboard</Typography>
          </Box>
          
          <Divider />
          
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin" onClick={handleToggleAdminPanel}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/products" onClick={handleToggleAdminPanel}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Products" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/add-product" onClick={handleToggleAdminPanel}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Add New Product" />
              </ListItemButton>
            </ListItem>
          </List>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminNav;