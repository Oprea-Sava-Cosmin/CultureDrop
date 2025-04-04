import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

import { culturalThemes } from '../../data/mockData';

const CultureSection = () => {
  const theme = useTheme();

  // Culture cards data with descriptions
  const cultureData = [
    {
      id: 'urban',
      title: 'Urban',
      description: 'City-inspired fashion and beats that capture the essence of metropolitan life.',
      image: '/images/urban-culture.jpg',
    },
    {
      id: 'hiphop',
      title: 'Hip-Hop',
      description: 'Bold styles and rhythmic sounds influenced by hip-hop culture and its rich history.',
      image: '/images/hiphop-culture.jpg',
    },
    {
      id: 'streetwear',
      title: 'Streetwear',
      description: 'Casual, comfortable clothing inspired by skateboard and surf culture with a modern twist.',
      image: '/images/streetwear-culture.jpg',
    },
    {
      id: 'indie',
      title: 'Indie',
      description: 'Alternative styles and sounds that celebrate individuality and artistic expression.',
      image: '/images/indie-culture.jpg',
    },
    {
      id: 'punk',
      title: 'Punk',
      description: 'Rebellious fashion and music that challenges conventions and embraces authenticity.',
      image: '/images/punk-culture.jpg',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box component="section" sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Explore Cultural Styles
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
        >
          Discover unique fashion and music inspired by diverse cultural movements
        </Typography>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Grid container spacing={4}>
          {cultureData.map((culture) => (
            <Grid size={{xs:12, sm:6, md:4}} key={culture.id}>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '60%', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={culture.image}
                      alt={culture.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                      {culture.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {culture.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/shop?culture=${culture.id}`}
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      Explore {culture.title}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default CultureSection;