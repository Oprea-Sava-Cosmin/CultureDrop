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
  ListItemText,
  Avatar,
  Divider,
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
import { appStore, toggleChat as toggleChatStore, addChatMessage } from '../../store/appStore';
import { getProductRecommendations } from '../../services/deepseekService';
import ChatProductCard from './ChatProductCard';
import { Link } from '@tanstack/react-router';
import type { Product, ChatMessage } from '../../store/appStore';

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
  const products = useStore(appStore, (state) => state.products);
  
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
  
  // State for recommended products
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

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

      // Update recommended products if any
      if (response.recommendedProducts && response.recommendedProducts.length > 0) {
        setRecommendedProducts(response.recommendedProducts);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response in case of error
      addChatMessage({
        text: 'Sorry, I encountered an issue while processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      });
    }
  };
  
  // We're now using the DeepSeek service for product recommendations
  // The recommendation logic has been moved to deepseekService.ts
  
  // Handle clicking on a suggested tag
  const handleTagClick = (tag: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + tag);
  };
  
  return (
    <>
      {/* Chat button */}
      <Fab
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </Fab>
      
      {/* Chat drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleChat}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 380,
            height: isMobile ? '100%' : 'calc(100% - 100px)',
            bottom: isMobile ? 0 : 20,
            right: isMobile ? 0 : 20,
            top: isMobile ? 0 : 'auto',
            borderRadius: isMobile ? 0 : 2,
            boxShadow: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToyIcon sx={{ mr: 1 }} />
              <Typography variant="h6">DeepSeek Assistant</Typography>
            </Box>
            <IconButton onClick={toggleChat} edge="end" aria-label="close" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider />
          
          {/* Chat messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: theme.palette.background.default,
            }}
          >
            <List>
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: message.sender === 'user' ? theme.palette.secondary.main : theme.palette.primary.main,
                          ml: message.sender === 'user' ? 1 : 0,
                          mr: message.sender === 'user' ? 0 : 1,
                        }}
                      >
                        {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender === 'user' ? theme.palette.secondary.light : theme.palette.background.paper,
                          borderRadius: 2,
                          borderTopLeftRadius: message.sender === 'user' ? 2 : 0,
                          borderTopRightRadius: message.sender === 'user' ? 0 : 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {message.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <ListItem alignItems="flex-start">
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: theme.palette.background.paper,
                      borderRadius: 2,
                      borderTopLeftRadius: 0,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} thickness={5} sx={{ mr: 1 }} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  </Paper>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
          </Box>
          
          <Divider />
          
          {/* Product recommendations */}
          {recommendedProducts.length > 0 && (
            <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
              <Typography variant="subtitle2" gutterBottom>
                Recommended Products:
              </Typography>
              <Grid container spacing={2}>
                {recommendedProducts.map((product) => (
                  <Grid size= {{xs:12}} key={product.id}>
                    <ChatProductCard 
                      product={product} 
                      onProductClick={() => {
                        toggleChat();
                        // Navigate to product page
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Divider />
          
          {/* Suggested tags */}
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {suggestedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => handleTagClick(tag)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          
          <Divider />
          
          {/* Chat input */}
          <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Ask about products or styles..."
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={input.trim() === ''}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatBot;