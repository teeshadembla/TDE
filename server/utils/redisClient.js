import { createClient } from 'redis';

let redisClient = null;

// Only connect if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
    redisClient = createClient({
        url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
        console.error("Redis error:", err);
    });

    await redisClient.connect();
} else {
    // In test mode, create a mock client
    console.log('Test mode: Redis connection skipped');
}

export default redisClient;