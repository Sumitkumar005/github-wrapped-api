// Test helper utilities
export const mockGitHubUser = {
  login: 'testuser',
  name: 'Test User',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  bio: 'A test user for GitHub Wrapped API',
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
};

export const mockWrappedData = {
  user: {
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    createdAt: '2020-01-01T00:00:00Z',
    contributionsCollection: {
      totalCommitContributions: 500,
      totalIssueContributions: 25,
      totalPullRequestContributions: 75,
      totalPullRequestReviewContributions: 30,
      contributionCalendar: {
        totalContributions: 630,
        weeks: [
          {
            contributionDays: [
              { contributionCount: 5, date: '2024-01-01', weekday: 1 },
              { contributionCount: 3, date: '2024-01-02', weekday: 2 },
              { contributionCount: 0, date: '2024-01-03', weekday: 3 },
              { contributionCount: 8, date: '2024-01-04', weekday: 4 },
            ],
          },
        ],
      },
    },
    repositories: {
      nodes: [
        {
          name: 'test-repo',
          stargazerCount: 100,
          primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
          defaultBranchRef: { target: { history: { totalCount: 50 } } },
          createdAt: '2024-01-15T00:00:00Z',
        },
      ],
    },
    repositoriesContributedTo: {
      nodes: [
        {
          name: 'open-source-project',
          owner: { login: 'opensource' },
          stargazerCount: 1000,
          primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
          defaultBranchRef: { target: { history: { totalCount: 25 } } },
        },
      ],
    },
  },
};

export const mockLanguageStats = {
  user: {
    repositories: {
      nodes: [
        {
          languages: {
            edges: [
              { size: 1000, node: { name: 'TypeScript', color: '#3178c6' } },
              { size: 500, node: { name: 'JavaScript', color: '#f1e05a' } },
              { size: 200, node: { name: 'Python', color: '#3572A5' } },
            ],
          },
        },
      ],
    },
  },
};

export function createMockResponse(data: any) {
  return Promise.resolve(data);
}

export function createMockError(message: string, statusCode: number = 500) {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
}