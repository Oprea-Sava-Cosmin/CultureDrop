import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@tanstack/react-store';
import { appStore, toggleChat as toggleChatStore, addChatMessage, setRecommendedProducts as setStoreRecommendedProducts } from '../../store/appStore';
import { getProductRecommendations } from '../../services/deepseekService';
import ChatProductCard from './ChatProductCard';
import ReactMarkdown from 'react-markdown';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';


const ChatBot = () => {
  const theme = useTheme();
  const { culture, mode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get state from store
  const isOpen = useStore(appStore, (state) => state.isChatOpen);
  const messages = useStore(appStore, (state) => state.chatMessages);
  const recommendedProducts = useStore(appStore, (state) => state.recommendedProducts);
  
  // Sample product tags for quick selection
  const suggestedTags = ['hip-hop', 'streetwear', 'vinyl', 'urban', 'indie', 'accessories'];
  
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Toggle chat open/closed
  const toggleChat = () => {
    // Add welcome message if opening chat for the first time
    if (!isOpen && messages.length === 0) {
      addChatMessage({
        text: 'Hi there! I\'m your DeepSeek shopping assistant. I can help you find products based on your style preferences. What kind of items are you looking for today?',
        sender: 'bot',
        timestamp: new Date(),
      });
    }
    toggleChatStore();
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    addChatMessage({
      text: input,
      sender: 'user',
      timestamp: new Date(),
    });
    
    const userInput = input;
    setInput('');
    setIsTyping(true);
    
    try {
      // Call the DeepSeek service to generate a response
      await generateResponse(userInput);
    } catch (error) {
      console.error('Error in chat response:', error);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Generate AI response based on user input using DeepSeek service
  const generateResponse = async (userInput: string) => {
    try {
      // Get recommendations from DeepSeek service (now calls server API)
      const response = await getProductRecommendations(userInput);
      
      // Add the response to chat
      addChatMessage({
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
      });
      
      // Set recommended products if available
      if (response.recommendedProducts && response.recommendedProducts.length > 0) {
        setStoreRecommendedProducts(response.recommendedProducts);
      }
      
    } catch (error) {
      console.error('Error generating response:', error);
      addChatMessage({
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      });
    }
  };
  
  // Handle clicking on a suggested tag
  const handleTagClick = (tag: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + tag);
  };
  
  // Update color function to use ThemeContext colors with lighter dark mode colors
  const getCultureColors = () => {
    switch (culture.toLowerCase()) {
      case 'punk':
        return {
          primary: mode === 'dark' ? '#FF4D6E' : '#D72638',     // Lightened for dark mode
          secondary: mode === 'dark' ? '#FF2E63' : '#1B1B1E',   
          accent: mode === 'dark' ? '#FF2E63' : '#D72638',      
          button: mode === 'dark' ? '#FF4D6E' : '#D72638',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#000000' : '#EEEEEE',      
          responseBg: mode === 'dark' ? '#1F1F1F' : '#FFFFFF'   
        };
      case 'hiphop':
        return {
          primary: mode === 'dark' ? '#FFD54F' : '#2D132C',     // Lightened for dark mode
          secondary: mode === 'dark' ? '#C28800' : '#FFD700',   
          accent: mode === 'dark' ? '#C28800' : '#FFD700',      
          button: mode === 'dark' ? '#FFD54F' : '#FFD700',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#111111' : '#F0F0F0',      
          responseBg: mode === 'dark' ? '#1D1D1D' : '#FFFFFF'   
        };
      case 'urban':
        return {
          primary: mode === 'dark' ? '#F9A825' : '#2C3E50',     // Lightened for dark mode
          secondary: mode === 'dark' ? '#F39C12' : '#E67E22',   
          accent: mode === 'dark' ? '#F39C12' : '#E67E22',      
          button: mode === 'dark' ? '#F9A825' : '#E67E22',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#121212' : '#F5F5F5',      
          responseBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF'   
        };
      case 'indie':
        return {
          primary: mode === 'dark' ? '#F9F871' : '#8D99AE',     // Lightened for dark mode
          secondary: mode === 'dark' ? '#F1D302' : '#EF8354',   
          accent: mode === 'dark' ? '#F1D302' : '#EF8354',      
          button: mode === 'dark' ? '#F9F871' : '#EF8354',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#0D0D0D' : '#F9F9F9',      
          responseBg: mode === 'dark' ? '#1A1A1A' : '#FFFFFF'   
        };
      case 'streetwear':
        return {
          primary: mode === 'dark' ? '#FF8A80' : '#1A1A1A',     // Lightened for dark mode
          secondary: mode === 'dark' ? '#FF6B6B' : '#FF3B3F',   
          accent: mode === 'dark' ? '#FF6B6B' : '#FF3B3F',      
          button: mode === 'dark' ? '#FF8A80' : '#FF3B3F',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#0A0A0A' : '#F8F8F8',      
          responseBg: mode === 'dark' ? '#181818' : '#FFFFFF'   
        };
      case 'goth':
        return {
          primary: mode === 'dark' ? '#CE93D8' : '#7b1fa2',     // Lightened for dark mode
          secondary: '#212121',
          accent: '#9c27b0',
          button: mode === 'dark' ? '#CE93D8' : '#7b1fa2',      // Lightened for dark mode
          chatBg: mode === 'dark' ? '#121212' : '#f5f5f5',      
          responseBg: mode === 'dark' ? '#1C1C1C' : '#FFFFFF'   
        };
      default:
        return {
          primary: theme.palette.primary.main,
          secondary: theme.palette.secondary.main,
          accent: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.main,
          button: theme.palette.primary.main,
          chatBg: theme.palette.background.default,             
          responseBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF'   
        };
    }
  };
  
  const cultureColors = getCultureColors();
  
  return (
    <>
      {/* Chat toggle button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: cultureColors.button,
          '&:hover': {
            backgroundColor: cultureColors.accent,
          },
        }}
      >
        <ChatIcon />
      </Fab>
      
      {/* Chat drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleChat}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 400,
            backgroundColor: cultureColors.chatBg,
            color: mode === 'dark' ? '#fff' : '#000',
          },
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: cultureColors.primary,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Style Assistant</Typography>
          </Box>
          <IconButton onClick={toggleChat} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Chat messages */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? cultureColors.accent : cultureColors.primary,
                      width: 36,
                      height: 36,
                    }}
                  >
                    {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      ml: message.sender === 'user' ? 0 : 1,
                      mr: message.sender === 'user' ? 1 : 0,
                      backgroundColor: message.sender === 'user' 
                        ? cultureColors.secondary 
                        : cultureColors.responseBg, // Use the new responseBg for bot messages
                      color: message.sender === 'user' 
                        ? '#fff' 
                        : (mode === 'dark' ? '#fff' : '#000'), // Adjust text color based on sender and mode
                      borderRadius: 2,
                      maxWidth: '80%',
                    }}
                  >
                    {message.sender === 'bot' ? (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => (
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'inherit',
                                '& a': {
                                  color: cultureColors.accent,
                                  textDecoration: 'underline'
                                }
                              }} 
                              {...props} 
                            />
                          )
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    ) : (
                      <Typography>{message.text}</Typography>
                    )}
                  </Paper>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
              <CircularProgress size={20} sx={{ color: cultureColors.primary }} />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                Assistant is typing...
              </Typography>
            </Box>
          )}

          {/* Recommended products */}
          {recommendedProducts.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Recommended Products:
              </Typography>
              <Grid container spacing={2}>
                {recommendedProducts.map((product) => (
                  <Grid size={{xs:12, md:6}} key={product._id}>
                    <ChatProductCard 
                      product={product} 
                      onProductClick={() => {
                        toggleChat();
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Suggested tags */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Suggested:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => handleTagClick(tag)}
                sx={{ 
                  backgroundColor: cultureColors.primary,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: cultureColors.accent,
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Chat input */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
          }}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask about products or styles..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                '&.Mui-focused fieldset': {
                  borderColor: cultureColors.primary,
                },
              },
            }}
          />
          <IconButton
            type="submit"
            sx={{ 
              ml: 1, 
              backgroundColor: cultureColors.primary,
              color: '#fff',
              '&:hover': {
                backgroundColor: cultureColors.accent,
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
              },
            }}
            disabled={input.trim() === '' || isTyping}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot;