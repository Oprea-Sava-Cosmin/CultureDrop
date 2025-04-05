/**
 * DeepSeek API Routes
 * 
 * This file contains routes for handling DeepSeek AI service requests
 */

import express from 'express';
import { getProductRecommendations, saveUserPreferences } from '../services/deepseekService';

const router = express.Router();

/**
 * @route   POST /api/deepseek/recommendations
 * @desc    Get product recommendations based on user message and preferences
 * @access  Public
 */
// router.post('/recommendations', async (req, res) => {
//   try {
//     const { message, userPreferences } = req.body;
    
//     if (!message) {
//       return res.status(400).json({ error: 'Message is required' });
//     }
    
//     const response = await getProductRecommendations(message, userPreferences);
//     res.json(response);
//   } catch (error) {
//     console.error('Error in recommendations route:', error);
//     res.status(500).json({ 
//       error: 'Server error processing recommendation request',
//       message: 'Sorry, we encountered an error while processing your request. Please try again.'
//     });
//   }
// });

/**
 * @route   POST /api/deepseek/preferences
 * @desc    Save user preferences for future recommendations
 * @access  Public (would be protected in production)
 */
// router.post('/preferences', async (req, res) => {
//   try {
//     const { userId, preferences } = req.body;
    
//     if (!userId || !preferences || !Array.isArray(preferences)) {
//       return res.status(400).json({ error: 'Valid userId and preferences array are required' });
//     }
    
//     const success = await saveUserPreferences(userId, preferences);
    
//     if (success) {
//       res.json({ success: true, message: 'Preferences saved successfully' });
//     } else {
//       res.status(500).json({ success: false, error: 'Failed to save preferences' });
//     }
//   } catch (error) {
//     console.error('Error in save preferences route:', error);
//     res.status(500).json({ 
//       error: 'Server error saving preferences',
//       message: 'Sorry, we encountered an error while saving your preferences. Please try again.'
//     });
//   }
// });

export default router;