import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  useMediaQuery,
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';
import { useStore } from '@tanstack/react-store';
import { appStore, toggleCart } from '../../store/appStore';
import { culturalThemes } from '../../data/mockData';
import CartDrawer from '../cart/CartDrawer';

const pages = ['Home', 'Shop', 'Music', 'About'];
const routes = ['/', '/shop', '/music', '/about'];

const Header = () => {
  const muiTheme = useMuiTheme();
  const { mode, toggleMode, culture, setCulture } = useTheme();
  const cart = useStore(appStore, (state) => state.cart);
  const isCartOpen = useStore(appStore, (state) => state.isCartOpen);
  // const toggleCart = useAppStore((state) => state.toggleCart);
  
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElCulture, setAnchorElCulture] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenCultureMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCulture(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleCloseCultureMenu = () => {
    setAnchorElCulture(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleCultureChange = (newCulture: any) => {
    setCulture(newCulture);
    handleCloseCultureMenu();
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Vogue&Rythm
      </Typography>
      <List>
        {pages.map((page, index) => (
          <ListItem key={page} disablePadding>
            <ListItemButton 
              component={Link} 
              to={routes[index]} 
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={page} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <motion.div variants={logoVariants} whileHover="hover">
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Vogue&Rythm
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
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better mobile performance
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
              >
                {drawer}
              </Drawer>
            </Box>
  
            {/* Mobile Logo */}
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Vogue&Rythm
            </Typography>
  
            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'start' }}>
              {pages.map((page, index) => (
                <Button
                  key={page}
                  component={Link}
                  to={routes[index]}
                  onClick={handleCloseNavMenu}
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
  
            {/* Theme & Culture Controls */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {/* Culture Selector */}
              <Tooltip title="Change culture theme">
                <IconButton onClick={handleOpenCultureMenu} sx={{ p: 1, mr: 1 }}>
                  <Avatar 
                    alt={culture} 
                    src={`/images/${culture}-icon.png`} 
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="culture-menu"
                anchorEl={anchorElCulture}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElCulture)}
                onClose={handleCloseCultureMenu}
              >
                {culturalThemes.map((theme) => (
                  <MenuItem key={theme} onClick={() => handleCultureChange(theme)}>
                    <Typography textAlign="center" sx={{ textTransform: 'capitalize' }}>
                      {theme}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
  
              {/* Theme Toggle */}
              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton onClick={toggleMode} color="inherit" sx={{ ml: 1 }}>
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
  
              {/* Cart Button */}
              <Tooltip title="Shopping cart">
                <IconButton 
                  onClick={toggleCart} 
                  color="inherit" 
                  sx={{ ml: 1 }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge badgeContent={cartItemCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
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