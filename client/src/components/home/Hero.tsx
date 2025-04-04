import { Box, Typography, Button, Container, useMediaQuery } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
      }}
    >
      {/* Background image with parallax effect */}
      <Box
        component={motion.div}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
          },
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '60%' },
              textAlign: { xs: 'center', md: 'left' },
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div variants={itemVariants}>
              <Typography
                variant="overline"
                component="div"
                color="primary"
                sx={{ fontWeight: 600, letterSpacing: 2, mb: 1 }}
              >
                MUSIC & FASHION FUSION
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 2,
                  background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                CultureDrop
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                component="h2"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Where music meets fashion in a cultural explosion of style and sound.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Our Story
                </Button>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Decorative elements */}
      {!isMobile && (
        <>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            sx={{
              position: 'absolute',
              right: '5%',
              top: '20%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${muiTheme.palette.primary.main}22, transparent 70%)`,
            }}
          />
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
            sx={{
              position: 'absolute',
              left: '10%',
              bottom: '15%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${muiTheme.palette.secondary.main}22, transparent 70%)`,
            }}
          />
        </>
      )}
    </Box>
  );
};

export default Hero;