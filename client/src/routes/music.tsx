import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AlbumIcon from '@mui/icons-material/Album';
import {useTheme as useMuiTheme} from '@mui/material';
import Layout from '../components/layout/Layout';
import Aurora from '@/components/ui/Backgrounds/Aurora/Aurora';

export const Route = createFileRoute('/music')({ 
  component: MusicPage,
});

// Mock music releases data
const musicReleases = [
  {
    id: '1',
    title: 'The Miseducation of Lauryn Hill',
    artist: 'Lauryn Hill',
    cover: '/images/urban-vinyl.jpg',
    culture: 'urban',
    releaseDate: '1998-08-25',
    description: 'A genre-blending masterpiece rooted in soul, R&B, and hip-hop, this album embodies emotional depth and social commentary typical of urban culture.',
  },
  {
    id: '2',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    cover: '/images/hiphop-collection.png',
    culture: 'hiphop',
    releaseDate: '2015-03-15',
    description: 'A modern hip-hop classic combining jazz, funk, and powerful storytelling. It captures the essence of cultural identity and social struggle.',
  },
  {
    id: '3',
    title: 'Yeezus',
    artist: 'Kanye West',
    cover: '/images/streetwear-culture.png',
    culture: 'streetwear',
    releaseDate: '2013-06-18',
    description: 'Bold, experimental, and unapologetically fashion-forward—much like the streetwear scene itself. Kanye also heavily influences street fashion trends.',
  },
  {
    id: '4',
    title: 'For Emma, Forever Ago',
    artist: 'Bon Iver',
    cover: '/images/indie-compilation.jpg',
    culture: 'indie',
    releaseDate: '2007-07-12',
    description: 'Raw, introspective, and lo-fi in spirit, this album is a pillar of indie folk and DIY ethos, resonating deeply with indie culture.',
  },
  {
    id: '5',
    title: 'London Calling',
    artist: 'The Clash',
    cover: '/images/punk-anthology.jpg',
    culture: 'punk',
    releaseDate: '1979-12-14',
    description: 'A rebellious and genre-defying punk album that shaped generations. Politically charged, energetic, and eternally iconic.',
  },
];

function MusicPage() {
  const muiTheme = useMuiTheme();
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
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        opacity: 0.6
      }}>
        <Aurora
          colorStops={[muiTheme.palette.primary.main, muiTheme.palette.secondary.main, muiTheme.palette.primary.main]}
          blend={0.5}
          amplitude={0}
          speed={0.5}
        />
      </Box>

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
