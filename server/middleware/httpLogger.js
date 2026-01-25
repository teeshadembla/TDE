import logger from '../utils/logger.js';

/**
 * HTTP Request Logger Middleware for Pino
 * Logs incoming requests and outgoing responses with timing
 */
export const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request
  logger.debug({
    method: req.method,
    path: req.path,
    query: req.query,
    userId: req.auth?.userId || 'anonymous'
  }, 'Incoming request');

  // Capture original res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    const duration = Date.now() - start;
    
    logger.debug({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.auth?.userId || 'anonymous'
    }, 'Request completed');

    return originalJson(data);
  };

  next();
};

export default httpLogger;
