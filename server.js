import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from './src/core/logger.js';
import { 
  errorHandler, 
  notFoundHandler, 
  validationErrorHandler,
  rateLimitErrorHandler,
  fileUploadErrorHandler,
  ollamaErrorHandler
} from './src/middleware/errorHandler.js';

// Import routes
import resumeRoutes from './src/routes/resume.js';
import jobMatcherRoutes from './src/routes/jobMatcher.js';
import interviewRoutes from './src/routes/interview.js';
import portfolioRoutes from './src/routes/portfolio.js';
import codeReviewRoutes from './src/routes/codeReview.js';
import schedulerRoutes from './src/routes/scheduler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const logger = createLogger('server');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobMatcherRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/code', codeReviewRoutes);
app.use('/api/scheduler', schedulerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'CareerForge API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware (order matters!)
app.use(validationErrorHandler);
app.use(rateLimitErrorHandler);
app.use(fileUploadErrorHandler);
app.use(ollamaErrorHandler);
app.use(errorHandler);

// 404 handler (must be last)
app.use('*', notFoundHandler);

app.listen(PORT, () => {
  logger.info(`CareerForge API running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info(`Dashboard: http://localhost:${PORT}`);
  console.log(`🚀 CareerForge API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Dashboard: http://localhost:${PORT}`);
});

export default app;
