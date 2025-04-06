import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import Product from '../models/Product';
import UserPreference from '../models/UserPreference';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client with DeepSeek API configuration
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY as string,
  baseURL: process.env.DEEPSEEK_API_URL as string,
});

/**
 * Get product recommendations based on user message and preferences
 * @param req - Express request object
 * @param res - Express response object
 */
export const getRecommendations = async (req: Request, res: Response) => {
    console.log('getRecommendations called');
  try {
    const { message, userPreferences = [] } = req.body;
    // Get userId from authenticated user if available, otherwise from request body
    const userId = req.user?.id || req.body.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get all products from database
    const products = await Product.find();
    // If userId is provided, save the search query to user's history
    if (userId) {
      try {
        let userPreference = await UserPreference.findOne({ userId });
        if (userPreference) {
          // Add to search history
          userPreference.searchHistory.push({
            query: message,
            timestamp: new Date()
          });
          userPreference.lastInteraction = new Date();
          await userPreference.save();
        } else {
          // Create new user preference with search history
          const newUserPreference = new UserPreference({
            userId,
            preferences: userPreferences,
            searchHistory: [{ query: message, timestamp: new Date() }],
            lastInteraction: new Date()
          });
          await newUserPreference.save();
        }
      } catch (error) {
        console.error('Error saving search history:', error);
        // Continue with recommendations even if saving history fails
      }
    }

    if (!products || products.length === 0) {
      return res.status(404).json({ 
        message: 'Sorry, we don\'t have any products available at the moment.'
      });
    }

    // Format products for the AI prompt
    const productsContext = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      tags: product.tags,
      size: product.size
    }));

    // Get user's stored preferences if userId is provided
    let allUserPreferences = [...userPreferences];
    
    if (userId) {
      try {
        const storedPreferences = await UserPreference.findOne({ userId });
        if (storedPreferences && storedPreferences.preferences.length > 0) {
          // Combine stored preferences with current request preferences
          allUserPreferences = [...new Set([...allUserPreferences, ...storedPreferences.preferences])];
        }
      } catch (error) {
        console.error('Error fetching stored preferences:', error);
        // Continue with available preferences
      }
    }
    
    // Create system prompt with user preferences
    let systemPrompt = 'You are a helpful shopping assistant for Rythm Vogue, a fashion and music store. ';
    systemPrompt += 'Your task is to recommend products based on the user\'s message and preferences. ';
    
    if (allUserPreferences.length > 0) {
      systemPrompt += `The user has expressed interest in the following: ${allUserPreferences.join(', ')}. `;
    }
    
    systemPrompt += 'Provide thoughtful recommendations with a brief explanation why each product might suit them.';

    // Call DeepSeek API (via OpenAI client)
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat', // Use appropriate DeepSeek model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Based on my message: "${message}", what products would you recommend from the following list? ${JSON.stringify(productsContext)}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract recommended product IDs from the response
    const aiResponse = completion.choices[0].message.content;
    
    // Use regex to find product IDs in the AI response
    const productIdRegex = /"id":\s*"([^"]+)"/g;
    const recommendedIds = [];
    let match;
    
    while ((match = productIdRegex.exec(aiResponse as string)) !== null) {
      recommendedIds.push(match[1]);
    }

    // Get full product details for recommended products
    const recommendedProducts = recommendedIds.length > 0 
      ? await Product.find({ _id: { $in: recommendedIds } })
      : [];

    return res.status(200).json({
      message: aiResponse,
      recommendedProducts,
      confidence: 0.85 // Placeholder confidence score
    });

  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return res.status(500).json({ 
      message: 'Sorry, I encountered an error while processing your request.', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Save user preferences for future recommendations
 * @param req - Express request object
 * @param res - Express response object
 */
export const savePreferences = async (req: Request, res: Response) => {
  try {
    const { preferences } = req.body;
    // Get userId from authenticated user (this route requires authentication)
    const userId = req.user?.id;

    if (!userId || !preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ error: 'User ID and preferences array are required' });
    }

    // Find existing preferences or create new document
    let userPreference = await UserPreference.findOne({ userId });
    
    if (userPreference) {
      // Update existing preferences
      userPreference.preferences = [...new Set([...userPreference.preferences, ...preferences])];
      userPreference.lastInteraction = new Date();
    } else {
      // Create new preferences document
      userPreference = new UserPreference({
        userId,
        preferences,
        lastInteraction: new Date()
      });
    }

    // Save to database
    await userPreference.save();
    
    return res.status(200).json({
      success: true,
      message: 'Preferences saved successfully'
    });

  } catch (error) {
    console.error('Error in savePreferences:', error);
    return res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};