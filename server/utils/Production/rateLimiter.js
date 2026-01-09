import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../redisClient.js";

/* Helper to create isolated Redis stores */
const createStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix, // IMPORTANT
  });

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
