import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

import Layout from '../components/layout/Layout';
import AuthForm from '../components/auth/AuthForm';

export const Route = createFileRoute('/auth')({ 
  component: AuthPage,
});

function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const toggleAuthMode = () => {
    setAuthMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Box sx={{ py: 4 }}>
            <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          </Box>
        </motion.div>
      </Container>
    </Layout>
  );
}
