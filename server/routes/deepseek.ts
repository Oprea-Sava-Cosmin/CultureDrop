import { Router } from 'express';
import { getRecommendations, savePreferences } from '../controllers/deepseekController';
import { protect, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/deepseek/recommendations
 * @desc    Get product recommendations based on user message and preferences
 * @access  Public (with optional authentication)
 */
router.post('/recommendations', optionalAuth, getRecommendations);



/**
 * @route   POST /api/deepseek/preferences
 * @desc    Save user preferences for future recommendations
 * @access  Private (requires authentication)
 */
router.post('/preferences', protect, savePreferences);

export default router;