import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/index.js';
import apiRouter from './routes/index.js';
import { sanitizeInputMiddleware, apiLimiter } from './middleware/index.js';

const app = express();

// Security HTTP Headers (Helmet)
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser agents or matching client origins
    if (!origin || env.CLIENT_ORIGIN.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy restriction: Origin not allowed.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parsing & Sanitization
app.use(express.json({ limit: '10kb' })); // Limit body payload to prevent DoS
app.use(sanitizeInputMiddleware);

// Mount API Router with global rate limiter
app.use('/api', apiLimiter, apiRouter);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bannari Amman Institute of Technology (BIT) Hostel Mess Foot-Traffic & Waste Reduction API',
    status: 'Operational',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const isDev = env.NODE_ENV === 'development';
  console.error('Error occurred:', err.stack || err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  });
});

export default app;
