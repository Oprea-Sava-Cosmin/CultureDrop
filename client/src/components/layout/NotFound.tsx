import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Layout from './Layout';

function NotFound() {
    const { culture } = useTheme();

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    };

    const contentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    };

    const buttonVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
    };

    return (
        <Layout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '70vh',
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <motion.div variants={contentVariants}>
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontSize: culture === 'punk' ? '6rem' : '8rem',
                                    fontWeight: culture === 'punk' ? 400 : 700,
                                    letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
                                    mb: 2,
                                    background: culture === 'hiphop' ?
                                        'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)' :
                                        culture === 'punk' ?
                                            'linear-gradient(45deg, #f44336 30%, #651fff 90%)' :
                                            undefined,
                                    WebkitBackgroundClip: ['hiphop', 'punk'].includes(culture) ? 'text' : undefined,
                                    WebkitTextFillColor: ['hiphop', 'punk'].includes(culture) ? 'transparent' : undefined,
                                }}
                            >
                                404
                            </Typography>

                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{
                                    mb: 4,
                                    fontWeight: culture === 'punk' ? 400 : 600,
                                    letterSpacing: culture === 'hiphop' ? '0.05em' : 'normal',
                                    textTransform: culture === 'streetwear' ? 'uppercase' : 'none',
                                }}
                            >
                                Page Not Found
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 6,
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: culture === 'punk' ? '0.9rem' : '1.1rem',
                                    lineHeight: culture === 'hiphop' ? 1.8 : 1.6,
                                }}
                            >
                                The page you're looking for doesn't exist or has been moved.
                                Let's get you back on track to discover the latest in {culture} fashion.
                            </Typography>
                        </motion.div>

                        <motion.div variants={buttonVariants} whileHover="hover">
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: culture === 'punk' ? '2px' : '4px',
                                    textTransform: culture === 'indie' ? 'none' : 'uppercase',
                                }}
                            >
                                Back to Home
                            </Button>
                        </motion.div>
                    </Box>
                </Container>
            </motion.div>
        </Layout>
    );
}

export default NotFound;