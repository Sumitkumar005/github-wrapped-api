import { FastifyInstance } from 'fastify';
import { getUserProfile } from './features/user/user.controller';
import { getWrappedStats, getUserStats } from './features/wrapped/wrapped.controller';
import { checkRateLimit } from '../../lib/github';

export async function v1Routes(fastify: FastifyInstance) {
  // User endpoints
  fastify.get('/user/:username/profile', getUserProfile);
  fastify.get('/user/:username/stats', getUserStats);
  
  // Wrapped endpoint - The main feature!
  fastify.get('/wrapped/:username', getWrappedStats);
  
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  });

  // Rate limit check endpoint
  fastify.get('/rate-limit', async (request, reply) => {
    try {
      const rateLimit = await checkRateLimit();
      return {
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      };
    } catch (error) {
      return reply.status(500).send({
        error: 'Failed to check rate limit',
        message: 'Could not retrieve GitHub API rate limit information',
        statusCode: 500,
      });
    }
  });
}