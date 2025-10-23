import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './user.service';
import { GitHubAPIError } from '../../../../lib/github';

const userService = new UserService();

interface UserParams {
  username: string;
}

export async function getUserProfile(
  request: FastifyRequest<{ Params: UserParams }>,
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

    const profile = await userService.getUserProfile(username);

    return reply.status(200).send(profile);
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