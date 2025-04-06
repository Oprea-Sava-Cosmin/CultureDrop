import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  Avatar,
  Button,
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

// Use the ChatMessage type from appStore

const ChatBot = () => {
  const theme = useTheme();
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
  
  return (
    <>
      {/* Chat button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={toggleChat}
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
            width: isMobile ? '100%' : '800px', // Increased width from typical 400px
            maxWidth: '100%',
            borderRadius: isMobile ? 0 : '12px 0 0 12px',
            overflow: 'hidden',
          },
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Shopping Assistant</Typography>
          </Box>
          <IconButton onClick={toggleChat} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Chat content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          height: 'calc(100% - 64px)' 
        }}>
          {/* Product recommendations panel - desktop version */}
          {!isMobile && (
            <Box 
              sx={{ 
                width: '600px', 
                borderRight: 1, 
                borderColor: 'divider',
                display: recommendedProducts.length > 0 ? 'block' : 'none',
                overflow: 'auto',
                p: 2
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Recommended Products
              </Typography>
              
              <Grid container spacing={2}>
                {recommendedProducts.map((product) => (
                  <Grid size={{xs:12}} key={product._id}>
                    <ChatProductCard 
                      product={product} 
                      onProductClick={() => toggleChat()} 
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Chat messages area */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            height: isMobile ? '100%' : '100%',
            justifyContent: 'space-between'
          }}>
            {/* Messages list */}
            <List 
              sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2, 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                maxHeight: isMobile ? 'calc(100vh - 200px)' : 'auto'
              }}
            >
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                          ml: msg.sender === 'user' ? 1 : 0,
                          mr: msg.sender === 'user' ? 0 : 1,
                        }}
                      >
                        {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: msg.sender === 'user' ? 'primary.light' : 'background.paper',
                          color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                          borderRadius: 2,
                        }}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </Paper>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {isTyping && (
                <ListItem sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  </Paper>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
            
            {/* Bottom section with recommendations, tags and input */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: theme.palette.background.paper,
            }}>
              {/* Mobile recommendations panel */}
              {isMobile && recommendedProducts.length > 0 && (
                <Box 
                  sx={{ 
                    p: 1.5,
                    maxHeight: '30vh',
                    overflow: 'auto',
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Recommended Products
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {recommendedProducts.map((product) => (
                      <Grid size={{xs:6}} key={product._id}>
                        <ChatProductCard 
                          product={product} 
                          onProductClick={() => toggleChat()} 
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Quick tags */}
              <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {suggestedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagClick(tag)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText
                        } 
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              {/* Input area */}
              <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Ask about products..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="small"
                    multiline
                    maxRows={3}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={isTyping || input.trim() === ''}
                    sx={{ minWidth: 'auto' }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot;