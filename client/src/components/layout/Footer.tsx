import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  // Animation for social media icons
  const iconVariants = {
    hover: {
      scale: 1.2,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Section */}
          <Grid size={{xs:12, sm:4}}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Culture Drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Music and Fashion Concept Shop blending streetwear and music, inspired by urban culture.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <motion.div style={{ display: 'inline-block' }} variants={iconVariants} whileHover="hover">
                <IconButton aria-label="facebook" color="primary">
                  <FacebookIcon />
                </IconButton>
              </motion.div>
              <motion.div style={{ display: 'inline-block' }} variants={iconVariants} whileHover="hover">
                <IconButton aria-label="twitter" color="primary">
                  <TwitterIcon />
                </IconButton>
              </motion.div>
              <motion.div style={{ display: 'inline-block' }} variants={iconVariants} whileHover="hover">
                <IconButton aria-label="instagram" color="primary">
                  <InstagramIcon />
                </IconButton>
              </motion.div>
              <motion.div style={{ display: 'inline-block' }} variants={iconVariants} whileHover="hover">
                <IconButton aria-label="youtube" color="primary">
                  <YouTubeIcon />
                </IconButton>
              </motion.div>
            </Box>
          </Grid>

          {/* Shop Links */}
          <Grid size={{xs:6, sm:2}}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Shop
            </Typography>
            <Link href="/shop" color="text.secondary" display="block" sx={{ mb: 1 }}>
              All Products
            </Link>
            <Link href="/shop?category=clothing" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Clothing
            </Link>
            <Link href="/shop?category=music" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Music
            </Link>
            <Link href="/shop?category=accessories" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Accessories
            </Link>
          </Grid>

          {/* Culture Links */}
          <Grid size={{xs:6, sm:2}}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Cultures
            </Typography>
            <Link href="/shop?culture=urban" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Urban
            </Link>
            <Link href="/shop?culture=hiphop" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Hip-Hop
            </Link>
            <Link href="/shop?culture=streetwear" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Streetwear
            </Link>
            <Link href="/shop?culture=indie" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Indie
            </Link>
            <Link href="/shop?culture=punk" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Punk
            </Link>
          </Grid>

          {/* Info Links */}
          <Grid size={{xs:6, sm:2}}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Info
            </Typography>
            <Link href="/about" color="text.secondary" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="/contact" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
            <Link href="/faq" color="text.secondary" display="block" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link href="/privacy" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Culture Drop. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;