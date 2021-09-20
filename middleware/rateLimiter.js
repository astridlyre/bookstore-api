import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const redis = new Redis();
const rateLimiterFlexible = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export default async function rateLimiter(req, res, next) {
  return rateLimiterFlexible.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ error: "Too many requests" }));
}
