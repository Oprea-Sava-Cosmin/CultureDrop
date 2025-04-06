import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Badge,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { useStore } from '@tanstack/react-store';
import { appStore, toggleCart} from '../../store/appStore';
import CartDrawer from '../cart/CartDrawer';
import AdminNav from '../admin/AdminNavigation';

const pages = ['Home', 'Shop', 'Music', 'About'];
const routes = ['/', '/shop', '/music', '/about'];
const pageIcons = [<HomeIcon />, <StoreIcon />, <MusicNoteIcon />, <InfoIcon />];

const Header = () => {
  // const muiTheme = useMuiTheme();
  const { mode, toggleMode} = useTheme();
  const cart = useStore(appStore, (state) => state.cart);
  const isCartOpen = useStore(appStore, (state) => state.isCartOpen);
  const isAuthenticated = useStore(appStore, (state) => state.isAuthenticated);
  // const toggleCart = useAppStore((state) => state.toggleCart);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Logo animation
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      p: 2
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{ 
            fontWeight: 700, 
            letterSpacing: '.1rem',
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          Culture Drop
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ flexGrow: 1 }}>
        {pages.map((page, index) => (
          <ListItem key={page} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              to={routes[index]} 
              sx={{ 
                borderRadius: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon>
                {pageIcons[index]}
              </ListItemIcon>
              <ListItemText 
                primary={page} 
                primaryTypographyProps={{ 
                  fontWeight: 500 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleMode}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        
        <Button 
          startIcon={<ShoppingCartIcon />}
          onClick={() => {
            toggleCart();
            handleDrawerToggle();
          }}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Cart ({cartItemCount})
        </Button>
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        color="primary"
        component={Link}
        to="/auth"
        startIcon={<LoginIcon />}
        sx={{ 
          mt: 1, 
          borderRadius: 2,
          py: 1
        }}
      >
        {isAuthenticated ? 'Dashboard' : 'Login / Sign Up'}
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(8px)',
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <motion.div variants={logoVariants} whileHover="hover">
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mb: 0,
                  mr: 2,
                  lineHeight: 1.6,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Culture Drop
              </Typography>
            </motion.div>
  
            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                sx={{
                  color: (theme) => theme.palette.mode === 'light' ? '#000000' : '#ffffff'
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 280,
                    backgroundColor: (theme) => theme.palette.background.default,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                  },
                }}
              >
                {drawer}
              </Drawer>
            </Box>
  
            {/* Mobile Logo */}
            <Box
              sx={{
                height: 48, // Fixed height container
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                alignItems: 'center', // Center vertically
                justifyContent: 'flex-start' // Align to left
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Culture Drop
              </Typography>
            </Box>
            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'start' }}>
              {pages.map((page, index) => (
                <Button
                  key={page}
                  component={Link}
                  to={routes[index]}
                  sx={{ 
                    my: 2, 
                    color: 'inherit', 
                    display: 'block',
                    textAlign: 'center',
                    px: 2
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
  
            {/* Theme & Controls */}
            <Box sx={{ 
              flexGrow: 0, 
              display: isCartOpen ? 'none' : 'flex', 
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}>
              {/* Theme Toggle - Hidden on mobile */}
              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton 
                  onClick={toggleMode} 
                  color="inherit" 
                  sx={{ 
                    ml: 1,
                    display: { xs: 'none', md: 'flex' }
                  }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
  
              {/* Cart Button - Hidden on mobile */}
              <Tooltip title="Shopping cart">
                <IconButton 
                  onClick={toggleCart} 
                  sx={{ 
                    ml: 1,
                    color: (theme) => theme.palette.mode === 'light' ? '#000000' : '#ffffff',
                    display: { xs: 'none', md: 'flex' }
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge badgeContent={cartItemCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* Authentication/Admin - Visible on all devices */}
              {isAuthenticated ? (
                <AdminNav />
              ) : (
                <Tooltip title="Login or Sign Up">
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to="/auth"
                  >
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Header;