import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  githubToken: process.env.GITHUB_TOKEN || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

// Validate required environment variables
if (!config.githubToken) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }
}