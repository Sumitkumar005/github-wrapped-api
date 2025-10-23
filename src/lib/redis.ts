import { createClient } from 'redis';
import { config } from '../config';

export const redis = createClient({
  url: config.redisUrl,
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

// Initialize Redis connection
export async function initRedis() {
  try {
    await redis.connect();
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    // Don't exit - allow app to run without Redis
  }
}

// Cache utilities
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}