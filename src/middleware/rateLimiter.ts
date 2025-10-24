import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';

/**
 * Simple rate limiter that applies to all routes
 * Limits each user to 100 requests per 15 minute window
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // User identification function that works for both authenticated and unauthenticated requests
  keyGenerator: async (req: Request): Promise<string> => {
    try {
      // Try to get user ID from auth token for authenticated users
      const token = extractTokenFromHeader(req);
      if (token) {
        const decodedToken = await verifyToken(token);
        if (decodedToken && decodedToken.user_id) {
          return decodedToken.user_id;
        }
      }
    } catch (err) {
      // If token verification fails, fallback to IP-based limiting
    }
    
    // For unauthenticated requests (login, registration), use IP address
    return req.ip || 'unknown-ip';
  },
  
  // Custom error handler with friendly message
  handler: (req: Request, res: Response): void => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
});