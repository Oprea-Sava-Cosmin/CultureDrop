import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import StoreIcon from '@mui/icons-material/Store';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StyleIcon from '@mui/icons-material/Style';
import GroupIcon from '@mui/icons-material/Group';

import Layout from '../components/layout/Layout';

export const Route = createFileRoute('/about')({ 
  component: AboutPage,
});

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Founder & Creative Director',
    avatar: '/images/team-1.jpg',
    bio: 'With over 15 years in the fashion and music industry, Alex founded CultureDrop to bridge the gap between cultural movements and consumer products.',
  },
  {
    id: 2,
    name: 'Maya Rodriguez',
    role: 'Head of Music Curation',
    avatar: '/images/team-2.jpg',
    bio: 'Former DJ and music producer, Maya brings her extensive knowledge of music trends and cultural movements to our product selection.',
  },
  {
    id: 3,
    name: 'Jamal Williams',
    role: 'Fashion Director',
    avatar: '/images/team-3.jpg',
    bio: 'With a background in streetwear design, Jamal ensures our clothing collection authentically represents each cultural movement.',
  },
  {
    id: 4,
    name: 'Sarah Chen',
    role: 'Community Manager',
    avatar: '/images/team-4.jpg',
    bio: 'Sarah builds connections with artists and creators from various cultural backgrounds to ensure our products remain authentic and relevant.',
  },
];

function AboutPage() {
  const theme = useTheme();
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  const staggerContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  return (
    <Layout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Hero Section */}
        <Box 
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            py: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background image with overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/about-bg.jpg)',
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
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
              },
            }}
          />
          
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  mb: 2
                }}
              >
                About CultureDrop
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 800, 
                  mx: 'auto', 
                  mb: 4
                }}
              >
                Where Music and Fashion Converge to Create Cultural Experiences
              </Typography>
            </Box>
          </Container>
        </Box>
        
        {/* Our Story Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{xs:12, md:6}}>
              <motion.div variants={itemVariants} initial="initial" animate="animate">
                <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Our Story
                </Typography>
                <Typography variant="body1" paragraph>
                  CultureDrop was born from a passion for the intersection of music and fashion. We believe that cultural movements have always been defined by both their sound and their style.
                </Typography>
                <Typography variant="body1" paragraph>
                  Founded in 2023, our mission is to provide authentic products that represent various cultural influences, from urban and hip-hop to indie and punk. We curate collections that tell the story of these movements through both music and fashion.
                </Typography>
                <Typography variant="body1" paragraph>
                  Each product in our store is carefully selected to ensure it authentically represents the culture it comes from. We work directly with artists, designers, and communities to create a shopping experience that goes beyond mere consumption—it's about cultural appreciation and expression.
                </Typography>
              </motion.div>
            </Grid>
            <Grid size={{xs:12, md:6}}>
              <motion.div 
                variants={itemVariants} 
                initial="initial" 
                animate="animate"
                style={{ overflow: 'hidden', borderRadius: '16px' }}
              >
                <Box 
                  component="img"
                  src="/images/about-story.jpg"
                  alt="Our story"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: 4,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
        
        {/* Values Section */}
        <Box sx={{ bgcolor: theme.palette.background.paper, py: 8 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Our Values
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                The principles that guide everything we do
              </Typography>
            </Box>
            
            <motion.div 
  variants={staggerContainerVariants}
  initial="initial"
  animate="animate"
>
  <Grid container spacing={4}>
    {[
      {
        id: 1,
        icon: <StoreIcon fontSize="large" />,
        title: 'Authenticity',
        description:
          'We ensure all our products authentically represent the cultures they come from, working directly with communities and creators.',
        color: 'primary.main',
      },
      {
        id: 2,
        icon: <MusicNoteIcon fontSize="large" />,
        title: 'Cultural Appreciation',
        description:
          'We celebrate diverse cultural expressions through music and fashion, promoting understanding and appreciation.',
        color: 'secondary.main',
      },
      {
        id: 3,
        icon: <StyleIcon fontSize="large" />,
        title: 'Quality',
        description:
          'We never compromise on the quality of our products, ensuring each item meets our high standards of craftsmanship.',
        color: 'primary.main',
      },
      {
        id: 4,
        icon: <GroupIcon fontSize="large" />,
        title: 'Community',
        description:
          'We foster a community of like-minded individuals who share a passion for music, fashion, and cultural expression.',
        color: 'secondary.main',
      },
    ].map((member) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
        <motion.div variants={itemVariants}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 4,
            }}
          >
            <Avatar 
              sx={{ 
                width: 70, 
                height: 70,
                mb: 2,
                boxShadow: 2,
                bgcolor: member.color,
              }}
            >
              {member.icon}
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom>
              {member.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                flexGrow: 1,
                height: 120,
                overflow: 'auto'
              }}
            >
              {member.description}
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    ))}
  </Grid>
</motion.div>

          </Container>
        </Box>
        
        {/* Team Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Meet Our Team
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              The passionate individuals behind CultureDrop
            </Typography>
          </Box>
          
          <motion.div 
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
          >
            <Grid container spacing={4}>
              {teamMembers.map((member) => (
                <Grid size={{xs:12, sm:6, md:3}} key={member.id}>
                  <motion.div variants={itemVariants}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: 4,
                      }}
                    >
                      <Avatar 
                        src={member.avatar} 
                        alt={member.name}
                        sx={{ 
                          width: 120, 
                          height: 120,
                          mb: 2,
                          boxShadow: 2,
                        }}
                      />
                      <Typography variant="h6" component="h3" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {member.role}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          flexGrow: 1,
                          height: 120,
                          overflow: 'auto'
                        }}
                      >
                        {member.bio}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
        
        {/* Contact CTA Section */}
        <Box 
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            py: 8,
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Get In Touch
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Have questions or want to collaborate? We'd love to hear from you!
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
                href="mailto:contact@culturedrop.com"
              >
                Contact Us
              </Button>
            </Box>
          </Container>
        </Box>
      </motion.div>
    </Layout>
  );
}
