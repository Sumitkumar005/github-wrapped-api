// GraphQL query for user profile data
export const GET_USER_PROFILE = `
  query GetUserProfile($username: String!) {
    user(login: $username) {
      login
      name
      avatarUrl
      bio
      followers {
        totalCount
      }
      following {
        totalCount
      }
      company
      websiteUrl
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            stargazerCount
            primaryLanguage {
              name
              color
            }
            url
          }
        }
      }
    }
  }
`;