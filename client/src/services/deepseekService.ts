/**
 * DeepSeek AI Service (Client-side)
 * 
 * This service handles communication with the server-side DeepSeek API for product recommendations
 * based on user preferences and product tags.
 */

import type { Product } from '../store/appStore';

// Remove dotenv import and config
// Use Vite's environment variables instead
const API_URL = import.meta.env.VITE_DATABASE_URL || 'localhost:5000';
const API_BASE_URL = `https://${API_URL}/api/deepseek`;

/**
 * Interface for chat response from server
 */
interface ChatResponse {
  message: string;
  recommendedProducts?: Product[];
  confidence?: number;
}

/**
 * Get product recommendations based on user message and preferences
 * 
 * @param userMessage - The user's message or query
 * @param products - Available products to recommend from
 * @param userPreferences - Optional array of user preferences or interests
 * @returns Promise with chat response containing recommendations
 */
export const getProductRecommendations = async (
  userMessage: string,
  userPreferences: string[] = []
): Promise<ChatResponse> => {
  try {
    // Make API call to server-side DeepSeek service
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        userPreferences
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      message: 'Sorry, I encountered an error while processing your request. Please try again.',
    };
  }
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
    // Make API call to server-side DeepSeek service
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        preferences
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

/**
 * Save user preferences for future recommendations
 * 
 * @param userId - User identifier
 * @param preferences - Array of user preferences
 * @returns Promise indicating success
 */