import { graphql } from '@octokit/graphql';
import { config } from '../config';

// Initialize the GitHub GraphQL client
export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `token ${config.githubToken}`,
  },
});

// GitHub API Error handling
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: any
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

// Rate limit response type
interface RateLimitResponse {
  rateLimit: {
    limit: number;
    remaining: number;
    resetAt: string;
  };
}

// Rate limit check helper
export async function checkRateLimit() {
  try {
    const response = await githubGraphQL(`
      query {
        rateLimit {
          limit
          remaining
          resetAt
        }
      }
    `) as RateLimitResponse;
    
    return response.rateLimit;
  } catch (error) {
    throw new GitHubAPIError('Failed to check rate limit', 500, error);
  }
}