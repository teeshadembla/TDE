# Application Logging Guide - Pino Integration

## Overview
Your project now uses **Pino** for structured logging. It's configured to:
- **Development**: Pretty-printed, colorized console output for readability
- **Production**: JSON format for integration with log aggregation services

## Installation
Pino and pino-pretty have been added to your `package.json`. Run:
```bash
npm install
```

## Logger Location
- **Configuration**: [utils/logger.js](../utils/logger.js)
- **HTTP Middleware**: [middleware/httpLogger.js](../middleware/httpLogger.js)

## How to Use in Your Controllers

### Basic Usage
```javascript
import logger from '../utils/logger.js';

// Log info level
logger.info('Application started');

// Log with context data
logger.info({ userId: '123', action: 'LOGIN' }, 'User logged in');

// Log errors
logger.error({ error: err }, 'Database connection failed');

// Log warnings
logger.warn({ count: 5 }, 'High error rate detected');

// Debug level (development only)
logger.debug({ payload }, 'Processing request');
```

### Log Levels (from least to most severe)
1. **debug** - Detailed information, only in development
2. **info** - General information about application flow
3. **warn** - Warning conditions that should be investigated
4. **error** - Error conditions that need attention
5. **fatal** - Critical errors causing shutdown

### Real-World Examples for Your Controllers

#### User Controller
```javascript
import logger from '../utils/logger.js';

export const userLogin = async (req, res) => {
  try {
    const { userId } = req.body;
    logger.info({ userId, action: 'LOGIN_ATTEMPT' }, 'User login attempt');
    
    // ... authentication logic ...
    
    logger.info({ userId, action: 'LOGIN_SUCCESS' }, 'User logged in successfully');
    res.json({ success: true });
  } catch (err) {
    logger.error({ userId: req.body.userId, error: err.message }, 'Login failed');
    res.status(401).json({ error: 'Login failed' });
  }
};
```

#### Events Controller
```javascript
export const createEvent = async (req, res) => {
  try {
    const { eventName, date } = req.body;
    logger.debug({ eventName, date }, 'Creating event');
    
    const event = await Event.create({ eventName, date });
    
    logger.info({ eventId: event._id, eventName }, 'Event created successfully');
    res.json(event);
  } catch (err) {
    logger.error({ eventName: req.body.eventName, error: err.message }, 'Event creation failed');
    res.status(500).json({ error: 'Failed to create event' });
  }
};
```

#### Database Operations
```javascript
export const getEventById = async (req, res) => {
  const { eventId } = req.params;
  
  try {
    logger.debug({ eventId }, 'Fetching event');
    const event = await Event.findById(eventId);
    
    if (!event) {
      logger.warn({ eventId }, 'Event not found');
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    logger.error({ eventId, error: err.message }, 'Event fetch failed');
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};
```

#### Payment Controller
```javascript
export const processPayment = async (req, res) => {
  const { userId, amount } = req.body;
  
  try {
    logger.info({ userId, amount, action: 'PAYMENT_INITIATED' }, 'Payment processing started');
    
    const payment = await Stripe.charges.create({...});
    
    logger.info({ 
      userId, 
      amount, 
      transactionId: payment.id,
      action: 'PAYMENT_SUCCESS'
    }, 'Payment processed successfully');
    
    res.json({ success: true, transactionId: payment.id });
  } catch (err) {
    logger.error({ 
      userId, 
      amount, 
      error: err.message,
      action: 'PAYMENT_FAILED'
    }, 'Payment processing failed');
    res.status(500).json({ error: 'Payment failed' });
  }
};
```

## Where Logs Appear

### Development Environment
Run your server:
```bash
npm start
```
Logs will appear in your terminal with:
- ✅ Color-coded levels (blue=info, yellow=warn, red=error)
- ✅ Timestamps
- ✅ Pretty-formatted JSON context

Example output:
```
INFO - 🚀 Server started successfully {"port":3000,"environment":"development"}
DEBUG - Incoming request {"method":"GET","path":"/api/user/profile","userId":"user_123"}
INFO - User login attempt {"userId":"user_123","action":"LOGIN_ATTEMPT"}
INFO - User logged in successfully {"userId":"user_123","action":"LOGIN_SUCCESS"}
```

### Production Environment
When `NODE_ENV=production`, logs are JSON format:
```json
{"level":30,"time":"2026-01-15T10:30:00.000Z","pid":1234,"hostname":"app-server","msg":"User logged in successfully","userId":"user_123","action":"LOGIN_SUCCESS"}
```

This JSON format is queryable by:
- AWS CloudWatch Logs Insights
- ELK Stack (Elasticsearch/Logstash/Kibana)
- Datadog
- Splunk
- Any log aggregation service

## Configuration Options

You can adjust logging via environment variables:

```bash
# Set log level
export LOG_LEVEL=debug  # or info, warn, error, fatal

# Set environment
export NODE_ENV=production
```

## Best Practices

1. **Always log context**: Include relevant IDs and data
   ```javascript
   ✅ logger.info({ userId, fellowshipId, action }, 'Fellowship updated');
   ❌ logger.info('Fellowship updated');
   ```

2. **Use appropriate levels**:
   - `debug` for development troubleshooting only
   - `info` for important business events (login, payment, creation)
   - `warn` for unusual but recoverable situations
   - `error` for failures that need attention

3. **Include error objects properly**:
   ```javascript
   ✅ logger.error({ error: err.message, stack: err.stack }, 'Operation failed');
   ❌ logger.error('Error: ' + err);
   ```

4. **Log authentication events**: Every login, token refresh, permission check
   ```javascript
   logger.info({ userId, action: 'TOKEN_REFRESH' }, 'User token refreshed');
   ```

5. **Log database operations**: Failures and important creates/updates
   ```javascript
   logger.info({ documentId, action: 'RESEARCH_PAPER_PUBLISHED' }, 'Paper published');
   ```

## What Logs You Should Add Now

Add logging to these critical paths:

1. **Authentication** (userController.js, authMiddleware.js)
2. **Payment Processing** (paymentController.js)
3. **Database Errors** (all Controllers)
4. **Email Jobs** (emailProcessor.js, overduePaymentChecker.js)
5. **API Errors** (error handling in all routes)
6. **Community Features** (post creation, comments, reactions)

## Monitoring in Production

Once deployed:
1. Connect CloudWatch/ELK/Datadog to capture logs
2. Set up alerts for `error` and `fatal` level logs
3. Create dashboards for:
   - Login attempts and failures
   - Payment processing success rate
   - API error rates
   - Background job execution

## Next Steps

1. Run `npm install` to get Pino packages
2. Import logger in your controllers:
   ```javascript
   import logger from '../utils/logger.js';
   ```
3. Replace console.log/console.error with logger calls
4. Test in development: `npm start`
5. Verify JSON output in production mode: `NODE_ENV=production npm start`
