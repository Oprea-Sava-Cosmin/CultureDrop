/**
 * DeepSeek AI Service (Server-side implementation)
 * 
 * This service handles communication with the DeepSeek AI API for product recommendations
 * based on user preferences and product tags.
 */

import Product from '../models/Product';

// API key should be stored in environment variables in production
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'mock-deepseek-api-key';

/**
 * Interface for chat request from client
 */
interface ChatRequest {
  message: string;
  userPreferences?: string[];
}

/**
 * Interface for chat response to client
 */
interface ChatResponse {
  message: string;
  recommendedProducts?: any[];
  confidence?: number;
}

/**
 * Get product recommendations based on user message and preferences
 * 
 * @param userMessage - The user's message or query
 * @param userPreferences - Optional array of user preferences or interests
 * @returns Promise with chat response containing recommendations
 */
export const getProductRecommendations = async (
  userMessage: string,
  userPreferences: string[] = []
): Promise<ChatResponse> => {
  try {
    // Fetch products from database
    const products = await Product.find({}).lean();
    
    // Extract keywords from user message
    const keywords = extractKeywords(userMessage);
    
    // Combine with user preferences
    const allKeywords = [...keywords, ...userPreferences];
    
    // Find matching products
    const recommendedProducts = findMatchingProducts(products, allKeywords);
    
    // Generate response message
    let responseMessage = '';
    
    if (recommendedProducts.length > 0) {
      responseMessage = `Based on your interests, I recommend these items:\n\n${recommendedProducts
        .map(p => `- ${p.name} (${p.category}) - $${p.price.toFixed(2)}`)
        .join('\n')}\n\nWould you like more specific recommendations?`;
    } else {
      responseMessage = 'I don\'t have specific recommendations based on your request. Could you tell me more about what styles or items you\'re interested in?';
    }
    
    return {
      message: responseMessage,
      recommendedProducts,
      confidence: 0.85, // Mock confidence score
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      message: 'Sorry, I encountered an error while processing your request. Please try again.',
    };
  }
};

/**
 * Extract keywords from user message
 * 
 * @param message - User message to extract keywords from
 * @returns Array of keywords
 */
const extractKeywords = (message: string): string[] => {
  // In a real implementation, this would use NLP techniques
  // For now, we'll use a simple approach
  
  const lowercaseMessage = message.toLowerCase();
  
  // Common words to filter out
  const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
    'than', 'too', 'very', 'can', 'will', 'just', 'don', 'should', 'now'];
  
  // Style and product-related keywords to look for
  const styleKeywords = ['hip-hop', 'rap', 'urban', 'streetwear', 'indie', 'rock', 'punk', 
    'vintage', 'retro', 'classic', 'modern', 'casual', 'formal', 'sporty', 'athletic', 
    'minimalist', 'colorful', 'dark', 'bright', 'trendy', 'fashion', 'style', 'music', 
    'vinyl', 'cd', 'digital', 'clothing', 'accessories', 'shoes', 'hat', 'cap', 'hoodie', 
    'shirt', 'tshirt', 't-shirt', 'pants', 'jeans', 'jacket', 'coat', 'sweater', 'sweatshirt', 
    'dress', 'skirt', 'shorts', 'socks', 'jewelry', 'necklace', 'bracelet', 'ring', 'earrings', 
    'watch', 'sunglasses', 'bag', 'backpack', 'purse', 'wallet'];
  
  // Extract words from message
  const words = lowercaseMessage.split(/\W+/).filter(word => 
    word.length > 2 && !stopWords.includes(word)
  );
  
  // Find style keywords in message
  const foundStyleKeywords = styleKeywords.filter(keyword => 
    lowercaseMessage.includes(keyword)
  );
  
  // Combine unique keywords
  return Array.from(new Set([...words, ...foundStyleKeywords]));
};

/**
 * Find products that match the given keywords
 * 
 * @param products - Available products to match against
 * @param keywords - Keywords to match with products
 * @returns Array of matching products
 */
const findMatchingProducts = (products: any[], keywords: string[]): any[] => {
  if (keywords.length === 0 || products.length === 0) {
    return [];
  }
  
  // Score each product based on keyword matches
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Check product name
    keywords.forEach(keyword => {
      if (product.name.toLowerCase().includes(keyword)) {
        score += 3; // Higher weight for name matches
      }
    });
    
    // Check product category
    keywords.forEach(keyword => {
      if (product.category.toLowerCase().includes(keyword)) {
        score += 2; // Medium weight for category matches
      }
    });
    
    // Check product tags
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach((tag: string) => {
        keywords.forEach(keyword => {
          if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
            score += 2; // Medium weight for tag matches
          }
        });
      });
    }
    
    // Check product description
    keywords.forEach(keyword => {
      if (product.description.toLowerCase().includes(keyword)) {
        score += 1; // Lower weight for description matches
      }
    });
    
    return { product, score };
  });
  
  // Sort by score (highest first) and take top results
  const sortedProducts = scoredProducts
    .filter(item => item.score > 0) // Only include products with matches
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
  
  // Return top 3 products or fewer if not enough matches
  return sortedProducts.slice(0, 3);
};

/**
 * Save user preferences for future recommendations
 * 
 * @param userId - User identifier
 * @param preferences - Array of user preferences
 * @returns Promise indicating success
 */
export const saveUserPreferences = async (
  userId: string,
  preferences: string[]
): Promise<boolean> => {
  try {
    // In a real implementation, this would save to a database
    // For now, we'll just simulate success
    console.log(`Saved preferences for user ${userId}:`, preferences);
    
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};