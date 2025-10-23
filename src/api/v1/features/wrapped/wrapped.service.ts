import { githubGraphQL, GitHubAPIError } from '../../../../lib/github';
import { CacheService } from '../../../../lib/redis';
import { GET_WRAPPED_STATS, GET_LANGUAGE_STATS, GET_USER_STATS } from './wrapped.gql';
import {
  WrappedResponse,
  ContributionStats,
  ActivityStats,
  LanguageStats,
  TopRepository,
  UserStatsResponse,
  GitHubContributionsCollection,
  GitHubRepository,
  LanguageBreakdown,
} from '../../../../types';

export class WrappedService {
  async getWrappedStats(username: string, year: number = new Date().getFullYear()): Promise<WrappedResponse> {
    const cacheKey = `wrapped:${username}:${year}`;
    
    // Try to get from cache first
    const cached = await CacheService.get<WrappedResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const from = new Date(`${year}-01-01T00:00:00Z`).toISOString();
      const to = new Date(`${year}-12-31T23:59:59Z`).toISOString();

      const response = await githubGraphQL(GET_WRAPPED_STATS, {
        username,
        from,
        to,
      });

      if (!response.user) {
        throw new GitHubAPIError(`User '${username}' not found`, 404);
      }

      const user = response.user;
      const contributions = user.contributionsCollection as GitHubContributionsCollection;
      
      // Process the data
      const stats = this.calculateContributionStats(contributions);
      const activity = this.calculateActivityStats(contributions, user.repositories.nodes, year);
      const languages = await this.calculateLanguageStats(username);
      const topRepos = this.calculateTopRepositories(
        user.repositories.nodes,
        user.repositoriesContributedTo.nodes,
        username
      );

      const wrappedData: WrappedResponse = {
        year,
        username: user.login,
        avatarUrl: user.avatarUrl,
        stats,
        activity,
        languages,
        topRepos,
      };

      // Cache for 24 hours
      await CacheService.set(cacheKey, wrappedData, 86400);

      return wrappedData;
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error;
      }
      throw new GitHubAPIError('Failed to fetch wrapped stats', 500, error);
    }
  }

  async getUserStats(username: string): Promise<UserStatsResponse> {
    const cacheKey = `stats:${username}`;
    
    // Try cache first
    const cached = await CacheService.get<UserStatsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await githubGraphQL(GET_USER_STATS, { username });

      if (!response.user) {
        throw new GitHubAPIError(`User '${username}' not found`, 404);
      }

      const user = response.user;
      const contributions = user.contributionsCollection;

      // Calculate total stars
      const totalStars = user.repositories.nodes.reduce(
        (sum: number, repo: any) => sum + repo.stargazerCount,
        0
      );

      // Get language breakdown
      const languages = await this.calculateLanguageStats(username);

      const stats: UserStatsResponse = {
        totalStars,
        totalCommits: contributions.totalCommitContributions,
        totalPRs: contributions.totalPullRequestContributions,
        totalIssues: contributions.totalIssueContributions,
        totalContributions: contributions.contributionCalendar.totalContributions,
        languageBreakdown: languages.breakdown,
      };

      // Cache for 1 hour
      await CacheService.set(cacheKey, stats, 3600);

      return stats;
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error;
      }
      throw new GitHubAPIError('Failed to fetch user stats', 500, error);
    }
  }

  private calculateContributionStats(contributions: GitHubContributionsCollection): ContributionStats {
    return {
      totalContributions: contributions.contributionCalendar.totalContributions,
      totalCommits: contributions.totalCommitContributions,
      totalPRs: contributions.totalPullRequestContributions,
      totalIssues: contributions.totalIssueContributions,
      totalReviews: contributions.totalPullRequestReviewContributions,
    };
  }

  private calculateActivityStats(
    contributions: GitHubContributionsCollection,
    repositories: any[],
    year: number
  ): ActivityStats {
    const calendar = contributions.contributionCalendar;
    const days = calendar.weeks.flatMap(week => week.contributionDays);

    // Find busiest month
    const monthCounts: { [key: string]: number } = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    days.forEach(day => {
      const date = new Date(day.date);
      const month = monthNames[date.getMonth()];
      monthCounts[month] = (monthCounts[month] || 0) + day.contributionCount;
    });

    const busiestMonth = Object.keys(monthCounts).reduce((a, b) =>
      monthCounts[a] > monthCounts[b] ? a : b
    ) || 'January';

    // Find busiest day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts: { [key: string]: number } = {};

    days.forEach(day => {
      const dayName = dayNames[day.weekday];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + day.contributionCount;
    });

    const busiestDay = Object.keys(dayCounts).reduce((a, b) =>
      dayCounts[a] > dayCounts[b] ? a : b
    ) || 'Monday';

    // Calculate streaks
    const { longestStreak, currentStreak } = this.calculateStreaks(days);

    // Find first contribution
    const firstContribution = days
      .filter(day => day.contributionCount > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date || null;

    // Count new repos created this year
    const newReposCreated = repositories.filter(repo => {
      const createdYear = new Date(repo.createdAt).getFullYear();
      return createdYear === year;
    }).length;

    return {
      busiestMonth,
      busiestDay,
      longestStreak,
      currentStreak,
      firstContribution,
      newReposCreated,
    };
  }

  private calculateStreaks(days: any[]): { longestStreak: number; currentStreak: number } {
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Sort days by date
    const sortedDays = days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const day of sortedDays) {
      if (day.contributionCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak (from the end)
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      if (sortedDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { longestStreak, currentStreak };
  }

  private async calculateLanguageStats(username: string): Promise<LanguageStats> {
    try {
      const response = await githubGraphQL(GET_LANGUAGE_STATS, { username });
      
      if (!response.user) {
        return { topLanguage: null, breakdown: [] };
      }

      const languageMap: { [key: string]: { size: number; color: string } } = {};
      
      response.user.repositories.nodes.forEach((repo: any) => {
        repo.languages.edges.forEach((edge: any) => {
          const lang = edge.node.name;
          const size = edge.size;
          const color = edge.node.color;
          
          if (languageMap[lang]) {
            languageMap[lang].size += size;
          } else {
            languageMap[lang] = { size, color };
          }
        });
      });

      const totalSize = Object.values(languageMap).reduce((sum, lang) => sum + lang.size, 0);
      
      const breakdown: LanguageBreakdown[] = Object.entries(languageMap)
        .map(([name, data]) => ({
          lang: name,
          color: data.color || '#000000',
          commits: Math.round((data.size / totalSize) * 1000), // Approximate commits
          percentage: Math.round((data.size / totalSize) * 100),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Top 10 languages

      return {
        topLanguage: breakdown[0]?.lang || null,
        breakdown,
      };
    } catch (error) {
      console.error('Error calculating language stats:', error);
      return { topLanguage: null, breakdown: [] };
    }
  }

  private calculateTopRepositories(
    ownRepos: any[],
    contributedRepos: any[],
    username: string
  ): TopRepository[] {
    // Process own repositories
    const ownRepoStats = ownRepos.map(repo => ({
      name: repo.name,
      owner: username,
      contributions: 50, // Estimate for own repos
      stars: repo.stargazerCount || 0,
      language: repo.primaryLanguage?.name || null,
    }));

    // Process contributed repositories
    const contributedRepoStats = contributedRepos.map(repo => ({
      name: repo.name,
      owner: repo.owner?.login || 'unknown',
      contributions: 10, // Estimate for contributed repos
      stars: repo.stargazerCount || 0,
      language: repo.primaryLanguage?.name || null,
    }));

    const allRepos = [...ownRepoStats, ...contributedRepoStats];
    
    return allRepos
      .sort((a, b) => b.stars - a.stars) // Sort by stars instead of contributions
      .slice(0, 10); // Top 10 repositories
  }
}