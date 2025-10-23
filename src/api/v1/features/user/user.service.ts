import { githubGraphQL, GitHubAPIError } from '../../../../lib/github';
import { CacheService } from '../../../../lib/redis';
import { GET_USER_PROFILE } from './user.gql';
import { GitHubUser, UserProfileResponse } from '../../../../types';

export class UserService {
  async getUserProfile(username: string): Promise<UserProfileResponse> {
    const cacheKey = `profile:${username}`;
    
    // Try to get from cache first
    const cached = await CacheService.get<UserProfileResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await githubGraphQL(GET_USER_PROFILE, { username });
      
      if (!response.user) {
        throw new GitHubAPIError(`User '${username}' not found`, 404);
      }

      const user = response.user;
      
      const profile: UserProfileResponse = {
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        company: user.company,
        website: user.websiteUrl,
        pinnedRepositories: user.pinnedItems.nodes.map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stargazerCount: repo.stargazerCount,
          primaryLanguage: repo.primaryLanguage,
          url: repo.url,
        })),
      };

      // Cache for 1 hour
      await CacheService.set(cacheKey, profile, 3600);
      
      return profile;
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error;
      }
      
      // Handle GraphQL errors
      if (error.errors) {
        throw new GitHubAPIError('GitHub API error', 400, error);
      }
      
      throw new GitHubAPIError('Failed to fetch user profile', 500, error);
    }
  }
}