import { createClient } from 'redis';
import { config } from '../config';

let redis: any = null;
let redisAvailable = false;

// Initialize Redis connection
export async function initRedis() {
  // Skip Redis in serverless environments or when REDIS_URL is not provided
  if (process.env.VERCEL || !config.redisUrl || config.redisUrl === 'redis://localhost:6379') {
    console.log('⚠️ Redis disabled - running without cache');
    redisAvailable = false;
    return;
  }

  try {
    redis = createClient({
      url: config.redisUrl,
    });

    redis.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
      redisAvailable = false;
    });

    redis.on('connect', () => {
      console.log('✅ Connected to Redis');
      redisAvailable = true;
    });

    await redis.connect();
    redisAvailable = true;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    redisAvailable = false;
    redis = null;
  }
}

// Cache utilities
export class CacheService {
  static isAvailable(): boolean {
    return redisAvailable && redis !== null;
  }

  static async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}