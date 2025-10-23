import { UserService } from '../../api/v1/features/user/user.service';

// Mock dependencies
jest.mock('../../lib/github');
jest.mock('../../lib/redis');

import { githubGraphQL, GitHubAPIError } from '../../lib/github';
import { CacheService } from '../../lib/redis';

const mockGithubGraphQL = githubGraphQL as jest.MockedFunction<typeof githubGraphQL>;
const mockCacheService = CacheService as jest.Mocked<typeof CacheService>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return cached profile if available', async () => {
      const cachedProfile = {
        name: 'Cached User',
        avatarUrl: 'https://example.com/avatar.jpg',
        bio: 'Cached bio',
        followers: 100,
        following: 50,
        company: 'Cached Company',
        website: 'https://cached.com',
        pinnedRepositories: [],
      };

      mockCacheService.get.mockResolvedValueOnce(cachedProfile);

      const result = await userService.getUserProfile('testuser');

      expect(result).toEqual(cachedProfile);
      expect(mockCacheService.get).toHaveBeenCalledWith('profile:testuser');
      expect(mockGithubGraphQL).not.toHaveBeenCalled();
    });

    it('should fetch from GitHub API when not cached', async () => {
      const githubResponse = {
        user: {
          login: 'testuser',
          name: 'Test User',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
          bio: 'Test bio',
          followers: { totalCount: 100 },
          following: { totalCount: 50 },
          company: 'Test Company',
          websiteUrl: 'https://test.com',
          pinnedItems: {
            nodes: [
              {
                name: 'test-repo',
                description: 'A test repository',
                stargazerCount: 10,
                primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
                url: 'https://github.com/testuser/test-repo',
              },
            ],
          },
        },
      };

      mockCacheService.get.mockResolvedValueOnce(null);
      mockGithubGraphQL.mockResolvedValueOnce(githubResponse);
      mockCacheService.set.mockResolvedValueOnce(undefined);

      const result = await userService.getUserProfile('testuser');

      expect(result.name).toBe('Test User');
      expect(result.followers).toBe(100);
      expect(result.following).toBe(50);
      expect(result.pinnedRepositories).toHaveLength(1);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        'profile:testuser',
        expect.any(Object),
        3600
      );
    });

    it('should throw GitHubAPIError when user not found', async () => {
      mockCacheService.get.mockResolvedValueOnce(null);
      mockGithubGraphQL.mockResolvedValueOnce({ user: null });

      await expect(userService.getUserProfile('nonexistentuser')).rejects.toThrow(
        GitHubAPIError
      );
    });

    it('should handle GitHub API errors', async () => {
      mockCacheService.get.mockResolvedValueOnce(null);
      mockGithubGraphQL.mockRejectedValueOnce(new Error('API Error'));

      await expect(userService.getUserProfile('testuser')).rejects.toThrow(
        GitHubAPIError
      );
    });
  });
});