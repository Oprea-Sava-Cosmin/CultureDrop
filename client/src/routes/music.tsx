import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AlbumIcon from '@mui/icons-material/Album';

import Layout from '../components/layout/Layout';

export const Route = createFileRoute('/music')({ 
  component: MusicPage,
});

// Mock music releases data
const musicReleases = [
  {
    id: '1',
    title: 'Urban Beats Vol. 1',
    artist: 'Various Artists',
    cover: '/images/urban-vinyl.jpg',
    culture: 'urban',
    releaseDate: '2023-05-15',
    description: 'A collection of the hottest urban tracks from emerging artists.',
  },
  {
    id: '2',
    title: 'Hip-Hop Classics',
    artist: 'Old School Crew',
    cover: '/images/hiphop-collection.jpg',
    culture: 'hiphop',
    releaseDate: '2023-03-22',
    description: 'Revisiting the golden era of hip-hop with remastered classics.',
  },
  {
    id: '3',
    title: 'Street Anthems',
    artist: 'Street Collective',
    cover: '/images/streetwear-culture.jpg',
    culture: 'streetwear',
    releaseDate: '2023-07-08',
    description: 'The soundtrack of street culture featuring exclusive collaborations.',
  },
  {
    id: '4',
    title: 'Indie Discoveries',
    artist: 'The Independents',
    cover: '/images/indie-compilation.jpg',
    culture: 'indie',
    releaseDate: '2023-04-12',
    description: 'Fresh sounds from the independent music scene across the globe.',
  },
  {
    id: '5',
    title: 'Punk Revival',
    artist: 'Anarchy Band',
    cover: '/images/punk-anthology.jpg',
    culture: 'punk',
    releaseDate: '2023-06-30',
    description: 'Modern punk rock anthems that capture the rebellious spirit.',
  },
];

function MusicPage() {
  const theme = useTheme();
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 } 
    },
  };
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -10, transition: { duration: 0.3 } },
  };
  
  // Toggle play/pause
  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };
  
  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Music Collection
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              color="text.secondary"
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                mb: 4
              }}
            >
              Discover our curated selection of music releases from various cultural influences
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {musicReleases.map((release) => (
              <Grid size={{xs:12, sm:6, md:4}} key={release.id}>
                <motion.div 
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { boxShadow: 6 },
                  }}>
                    <Box sx={{ position: 'relative', pt: '100%' }}>
                      <CardMedia
                        component="img"
                        image={release.cover}
                        alt={release.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          padding: '10px',
                        }}
                      >
                        <Typography variant="body2" component="p">
                          Released: {release.releaseDate}
                        </Typography>
                      </Box>
                      
                      {/* Play button overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => togglePlay(release.id)}
                          sx={{
                            borderRadius: '50%',
                            minWidth: '60px',
                            height: '60px',
                            opacity: 0.9,
                          }}
                        >
                          {playingId === release.id ? <PauseIcon /> : <PlayArrowIcon />}
                        </Button>
                      </Box>
                      
                      {/* Culture tag */}
                      <Chip
                        label={release.culture}
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {release.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {release.artist}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {release.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 8, mb: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Shop Music Merchandise
            </Typography>
            <Typography variant="body1" paragraph>
              Complete your music experience with our exclusive merchandise collection.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              href="/shop?category=music"
              startIcon={<AlbumIcon />}
              sx={{ mt: 2 }}
            >
              Browse Music Products
            </Button>
          </Box>
        </Container>
      </motion.div>
    </Layout>
  );
}
