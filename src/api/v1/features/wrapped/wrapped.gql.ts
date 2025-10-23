// Simplified GraphQL query for wrapped stats (fixed version)
export const GET_WRAPPED_STATS = `
  query GetWrappedStats($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      name
      avatarUrl
      createdAt
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 50, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER) {
        nodes {
          name
          stargazerCount
          primaryLanguage {
            name
            color
          }
          createdAt
        }
      }
      repositoriesContributedTo(first: 50, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST]) {
        nodes {
          name
          owner {
            login
          }
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`;

// Query for getting language statistics
export const GET_LANGUAGE_STATS = `
  query GetLanguageStats($username: String!) {
    user(login: $username) {
      repositories(first: 100, ownerAffiliations: OWNER) {
        nodes {
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

// Query for user stats (total commits, PRs, etc.)
export const GET_USER_STATS = `
  query GetUserStats($username: String!) {
    user(login: $username) {
      login
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
      repositoriesContributedTo(first: 100) {
        totalCount
      }
    }
  }
`;