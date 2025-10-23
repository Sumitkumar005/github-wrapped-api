import { FastifyRequest, FastifyReply } from 'fastify';
import { WrappedService } from './wrapped.service';
import { GitHubAPIError } from '../../../../lib/github';

const wrappedService = new WrappedService();

interface WrappedParams {
  username: string;
}

interface WrappedQuery {
  year?: string;
}

interface StatsParams {
  username: string;
}

export async function getWrappedStats(
  request: FastifyRequest<{ Params: WrappedParams; Querystring: WrappedQuery }>,
  reply: FastifyReply
) {
  try {
    const { username } = request.params;
    const { year } = request.query;
    
    if (!username || username.trim() === '') {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Username parameter is required',
        statusCode: 400,
      });
    }

    let targetYear = new Date().getFullYear();
    if (year) {
      const parsedYear = parseInt(year, 10);
      if (isNaN(parsedYear) || parsedYear < 2008 || parsedYear > new Date().getFullYear()) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid year. Must be between 2008 and current year.',
          statusCode: 400,
        });
      }
      targetYear = parsedYear;
    }

    const wrappedStats = await wrappedService.getWrappedStats(username, targetYear);
    
    return reply.status(200).send(wrappedStats);
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
    });
  }
}

export async function getUserStats(
  request: FastifyRequest<{ Params: StatsParams }>,
  reply: FastifyReply
) {
  try {
    const { username } = request.params;
    
    if (!username || username.trim() === '') {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Username parameter is required',
        statusCode: 400,
      });
    }

    const stats = await wrappedService.getUserStats(username);
    
    return reply.status(200).send(stats);
  } catch (error) {
    if (error instanceof GitHubAPIError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
    });
  }
}