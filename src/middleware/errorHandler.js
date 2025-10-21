import { createLogger } from '../core/logger.js';

const logger = createLogger('error-handler');

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Determine error type and status code
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflict';
  } else if (err.name === 'TooManyRequestsError') {
    statusCode = 429;
    message = 'Too Many Requests';
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    message: isDevelopment ? err.message : 'An error occurred',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.url
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  logger.warn('Route not found:', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error handler
 */
export const validationErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    logger.warn('Validation error:', {
      message: err.message,
      url: req.url,
      method: req.method
    });

    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || null,
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};

/**
 * Rate limiting error handler
 */
export const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.name === 'TooManyRequestsError') {
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });

    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: err.retryAfter || 60,
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};

/**
 * File upload error handler
 */
export const fileUploadErrorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    logger.warn('File too large:', {
      size: err.limit,
      url: req.url,
      ip: req.ip
    });

    return res.status(413).json({
      error: 'File Too Large',
      message: `File size exceeds the limit of ${err.limit} bytes`,
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    logger.warn('Too many files:', {
      limit: err.limit,
      url: req.url,
      ip: req.ip
    });

    return res.status(413).json({
      error: 'Too Many Files',
      message: `Number of files exceeds the limit of ${err.limit}`,
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    logger.warn('Unexpected file field:', {
      field: err.field,
      url: req.url,
      ip: req.ip
    });

    return res.status(400).json({
      error: 'Unexpected File Field',
      message: `Unexpected file field: ${err.field}`,
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};

/**
 * Ollama connection error handler
 */
export const ollamaErrorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('Ollama')) {
    logger.error('Ollama connection error:', {
      message: err.message,
      url: req.url,
      method: req.method
    });

    return res.status(503).json({
      error: 'AI Service Unavailable',
      message: 'The AI service is currently unavailable. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};
