import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../redisClient.js";

const createStore = (prefix) => {
  // Only use Redis store if client exists
  if (!redisClient) {
    return undefined; // Uses in-memory store as fallback
  }
  
  return new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix,
  });
};
const rateLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    success: false,
    message,
  });
};


/* Global limiter */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore("rl:global"),

});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  store: createStore("rl:auth"),
  handler: rateLimitHandler("Too many login attempts. Try again later."),
});

/* Upload limiter */
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Upload limit reached. Try again later.",
  store: createStore("rl:upload"),
  handler: rateLimitHandler("Upload limit reached. Please wait."),

});
