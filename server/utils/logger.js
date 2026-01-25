import pino from 'pino';

// Configure Pino logger based on environment
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport: process.env.NODE_ENV === 'production' 
    ? undefined // JSON format for production
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '{levelLabel} - {msg}'
        }
      }
});

export default logger;
