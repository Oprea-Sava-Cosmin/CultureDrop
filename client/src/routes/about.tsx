import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Button,
  useTheme,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import StoreIcon from '@mui/icons-material/Store';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StyleIcon from '@mui/icons-material/Style';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

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
    bio: 'Alex founded CultureDrop with 15+ years of experience in fashion and music to connect cultural movements with consumer products.',
  },
  {
    id: 2,
    name: 'Maya Rodriguez',
    role: 'Head of Music Curation',
    avatar: '/images/team-2.jpg',
    bio: 'Former DJ and music producer, Maya brings her expertise in music trends to curate our authentic product selection.',
  },
  {
    id: 3,
    name: 'Jamal Williams',
    role: 'Fashion Director',
    avatar: '/images/team-3.jpg',
    bio: 'With a background in streetwear design, Jamal ensures our clothing authentically represents each cultural movement.',
  },
  {
    id: 4,
    name: 'Sarah Chen',
    role: 'Community Manager',
    avatar: '/images/team-4.jpg',
    bio: 'Sarah builds connections with artists and creators to ensure our products remain authentic and culturally relevant.',
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
            py: 10,
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
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' }
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
                  mb: 4,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  px: { xs: 2, sm: 0 }
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
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
        <Box sx={{
          py: 8
        }}>
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
                      'We ensure all products authentically represent their cultural origins by working directly with creators.',
                    color: 'primary.main',
                  },
                  {
                    id: 2,
                    icon: <MusicNoteIcon fontSize="large" />,
                    title: 'Cultural Appreciation',
                    description:
                      'We celebrate diverse cultural expressions through music and fashion, promoting understanding.',
                    color: 'secondary.main',
                  },
                  {
                    id: 3,
                    icon: <StyleIcon fontSize="large" />,
                    title: 'Quality',
                    description:
                      'We never compromise on quality, ensuring each item meets our high standards of craftsmanship.',
                    color: 'primary.main',
                  },
                  {
                    id: 4,
                    icon: <GroupIcon fontSize="large" />,
                    title: 'Community',
                    description:
                      'We foster a community of individuals who share passion for music, fashion, and cultural expression.',
                    color: 'secondary.main',
                  },
                ].map((member) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id} sx={{display: 'flex'}}>
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
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id} sx={{ display: 'flex' }}>
                  <motion.div variants={itemVariants} style={{ width: '100%' }}>
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
                          flexGrow: 1
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
            position: 'relative',
            py: 10,
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main
                    }}
                  >
                    Get In Touch
                  </Typography>
                  <Typography variant="h6" paragraph sx={{ mb: 3 }}>
                    Have questions or want to collaborate? We'd love to hear from you!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Whether you're an artist looking to collaborate, a designer with fresh ideas,
                    or simply a customer with questions, our team is ready to connect.
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 4,
                    alignItems: { xs: 'center', md: 'flex-start' }
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: 2
                      }}
                      href="mailto:contact@culturedrop.com"
                    >
                      Email Us
                    </Button>

                    <Box sx={{
                      mt: 2,
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        Find us on social media:
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: { xs: 'center', md: 'flex-start' }
                      }}>
                        <IconButton color="primary" aria-label="instagram" component="a" href="#" sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                          <InstagramIcon />
                        </IconButton>
                        <IconButton color="primary" aria-label="twitter" component="a" href="#" sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                          <TwitterIcon />
                        </IconButton>
                        <IconButton color="primary" aria-label="facebook" component="a" href="#" sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}>
                          <FacebookIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <Box 
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      bgcolor: theme.palette.background.paper,
                      maxWidth: { xs: '100%', sm: '450px' },
                      width: '100%',
                      mt: { xs: 4, md: 0 }
                    }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                      Contact Information
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 3
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2
                      }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <EmailIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            contact@culturedrop.com
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2
                      }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <PhoneIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            +1 (555) 123-4567
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2
                      }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <LocationOnIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1">
                            123 Culture Street, Fashion District
                          </Typography>
                          <Typography variant="body1">
                            New York, NY 10001
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>
    </Layout>
  );
}
