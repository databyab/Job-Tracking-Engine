import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import aiRoutes from './routes/aiRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Verify critical environment variables at startup
console.log('🔍 Verifying Environment Configuration...');
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV'];
requiredEnv.forEach(env => {
  if (process.env[env]) {
    console.log(`✅ ${env} is defined`);
  } else {
    console.error(`❌ ${env} is MISSING!`);
  }
});

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(hpp());    // Prevents HTTP Parameter Pollution attacks

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { message: 'Too many authentication attempts, please try again after an hour' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: 'AI usage limit reached. Please try again in an hour.' }
});

// Apply limiters
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/ai/', aiLimiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server is LIVE!`);
      console.log(`📡 Listening on: 0.0.0.0:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
