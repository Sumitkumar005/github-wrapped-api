// User Profile Types
export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  company: string | null;
  websiteUrl: string | null;
  pinnedRepositories: PinnedRepository[];
}

export interface PinnedRepository {
  name: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  url: string;
}

// API Response Types
export interface UserProfileResponse {
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  company: string | null;
  website: string | null;
  pinnedRepositories: PinnedRepository[];
}

// Wrapped Stats Types
export interface WrappedResponse {
  year: number;
  username: string;
  avatarUrl: string;
  stats: ContributionStats;
  activity: ActivityStats;
  languages: LanguageStats;
  topRepos: TopRepository[];
}

export interface ContributionStats {
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
}

export interface ActivityStats {
  busiestMonth: string;
  busiestDay: string;
  longestStreak: number;
  currentStreak: number;
  firstContribution: string | null;
  newReposCreated: number;
}

export interface LanguageStats {
  topLanguage: string | null;
  breakdown: LanguageBreakdown[];
}

export interface LanguageBreakdown {
  lang: string;
  color: string;
  commits: number;
  percentage: number;
}

export interface TopRepository {
  name: string;
  owner: string;
  contributions: number;
  stars: number;
  language: string | null;
}

// GitHub GraphQL Response Types
export interface GitHubContributionsCollection {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
        weekday: number;
      }>;
    }>;
  };
}

export interface GitHubRepository {
  name: string;
  owner: {
    login: string;
  };
  stargazerCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
      };
    };
  } | null;
}

// User Stats Types
export interface UserStatsResponse {
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalContributions: number;
  languageBreakdown: LanguageBreakdown[];
}

// Error Types
export interface APIError {
  error: string;
  message: string;
  statusCode: number;
}