// Middleware to prevent sensitive data exposure in HTTP responses and enforce anti-caching headers
export const secureResponseMiddleware = (req, res, next) => {
  // Prevent browser & proxy caching of sensitive API responses in Network Inspector
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Override res.json to strip sensitive fields recursively
  const originalJson = res.json;
  res.json = function (data) {
    const stripSensitiveKeys = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) {
        return obj.map(stripSensitiveKeys);
      }
      const cleaned = {};
      for (const key in obj) {
        if (['password', 'currentPassword', 'newPassword', 'hash', 'secret'].includes(key)) {
          continue; // Strip out sensitive fields
        }
        cleaned[key] = typeof obj[key] === 'object' && obj[key] !== null 
          ? stripSensitiveKeys(obj[key]) 
          : obj[key];
      }
      return cleaned;
    };

    const sanitizedData = stripSensitiveKeys(data);
    return originalJson.call(this, sanitizedData);
  };

  next();
};

// Input sanitization helper to prevent XSS script injection in text inputs
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Middleware to recursively sanitize request body, query params, and route params
export const sanitizeInputMiddleware = (req, res, next) => {
  const sensitiveKeys = ['password', 'currentPassword', 'newPassword', 'idToken'];

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        if (sensitiveKeys.includes(key)) {
          obj[key] = obj[key].trim();
        } else {
          obj[key] = sanitizeString(obj[key].trim());
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// Generic required field validator helper
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter(field => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: `Missing required field(s): ${missing.join(', ')}` 
      });
    }
    next();
  };
};
