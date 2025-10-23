import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { v1Routes } from './api/v1/routes';
import { initRedis } from './lib/redis';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  });

  // Initialize Redis connection
  await initRedis();

  // Register security plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable for API
  });
  
  await fastify.register(cors, {
    origin: true, // Allow all origins for public API
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Register rate limiting
  await fastify.register(rateLimit, {
    max: 100, // 100 requests
    timeWindow: '15 minutes', // per 15 minutes
    errorResponseBuilder: (request, context) => {
      return {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.round(context.ttl / 1000)} seconds.`,
        statusCode: 429,
        retryAfter: Math.round(context.ttl / 1000),
      };
    },
  });

  // Register API routes
  await fastify.register(v1Routes, { prefix: '/v1' });

  // Root endpoint with comprehensive API documentation
  fastify.get('/', async (request, reply) => {
    return {
      message: '🎁 GitHub Wrapped API',
      description: 'Get your personalized GitHub year-end statistics',
      version: '1.0.0',
      documentation: {
        endpoints: {
          profile: {
            url: '/v1/user/:username/profile',
            description: 'Get user profile information',
            example: '/v1/user/octocat/profile',
          },
          stats: {
            url: '/v1/user/:username/stats',
            description: 'Get user statistics (stars, commits, PRs, etc.)',
            example: '/v1/user/octocat/stats',
          },
          wrapped: {
            url: '/v1/wrapped/:username?year=2024',
            description: 'Get comprehensive year-end wrapped statistics',
            example: '/v1/wrapped/octocat?year=2024',
          },
          health: {
            url: '/v1/health',
            description: 'API health check',
          },
          rateLimit: {
            url: '/v1/rate-limit',
            description: 'Check GitHub API rate limit status',
          },
        },
        features: [
          '📊 User profile and statistics',
          '🎯 Comprehensive wrapped summaries',
          '⚡ Redis caching for performance',
          '🔒 Rate limiting and security',
          '🚀 High-performance Fastify server',
        ],
      },
      github: 'https://github.com/your-username/github-wrapped-api',
      author: 'Your Name',
    };
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    
    fastify.log.error(error);
    
    reply.status(statusCode).send({
      error: error.name || 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  });

  return fastify;
}