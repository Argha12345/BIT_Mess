import rateLimit from 'express-rate-limit';

// Rate limiter for authentication endpoints (Login, Google Auth)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts from this IP address. Please try again after 15 minutes for security reasons.'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// General API rate limiter to prevent DoS attacks
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: {
    error: 'Too many API requests from this IP. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
