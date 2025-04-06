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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useStore } from '@tanstack/react-store';
import { appStore, adminLogout, toggleAdminPanel } from '../../store/appStore';

const AdminNav = () => {
  const isAuthenticated = useStore(appStore, (state) => state.isAuthenticated);
  const adminToken = useStore(appStore, (state) => state.adminToken);
  const isAdminPanelOpen = useStore(appStore, (state) => state.isAdminPanelOpen);
  
  const handleLogout = () => {
    adminLogout();
  };

  const handleToggleAdminPanel = () => {
    toggleAdminPanel();
  };

  // If not authenticated at all, don't show anything
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated but not admin, show only logout option
  if (!adminToken) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open admin panel"
          edge="end"
          onClick={handleToggleAdminPanel}
          sx={{ ml: 1 }}
        >
          <AccountCircleIcon />
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
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText' 
            }}>
              <Typography variant="h6">User Options</Typography>
            </Box>
            
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
  }

  // Full admin navigation for users with admin token
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
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText' 
          }}>
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