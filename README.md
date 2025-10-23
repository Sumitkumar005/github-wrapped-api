# 🎁 GitHub Wrapped API

> **Your coding year in review - GitHub stats made beautiful**

A high-performance REST API that provides personalized GitHub statistics and "Spotify Wrapped" style year-end summaries for developers. Built with TypeScript, Fastify, and Redis for blazing-fast performance.

[![GitHub stars](https://img.shields.io/github/stars/your-username/github-wrapped-api?style=social)](https://github.com/your-username/github-wrapped-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)](https://www.fastify.io/)

## ✨ Features

### 🎯 **The "Wrapped" Experience**
Get your complete GitHub year in review with beautiful statistics:
- 📈 **Total contributions, commits, PRs, and issues**
- 🏆 **Longest contribution streak and busiest coding days**
- 💻 **Top programming languages with percentages**
- 🌟 **Most contributed repositories**
- 📅 **Monthly activity patterns and trends**

### ⚡ **Performance & Reliability**
- **Redis caching** - Lightning-fast responses with smart caching
- **Rate limiting** - Built-in protection against abuse
- **Error handling** - Comprehensive error responses with proper HTTP codes
- **TypeScript** - Full type safety and excellent developer experience

### 🚀 **Production Ready**
- **Docker support** - Easy containerization and deployment
- **Vercel ready** - One-click deployment to Vercel
- **Health checks** - Built-in monitoring endpoints
- **Security** - Helmet.js security headers and CORS protection

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Redis** (or use Docker Compose)
- **GitHub Personal Access Token** with scopes: `read:user`, `public_repo`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/github-wrapped-api.git
cd github-wrapped-api
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your GitHub token:
```env
GITHUB_TOKEN=your_github_personal_access_token_here
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=development
```

### 3. Start the API

**Option A: Docker Compose (Recommended)**
```bash
docker-compose up -d
```

**Option B: Manual Setup**
```bash
# Start Redis
redis-server

# Start the API in development mode
npm run dev
```

### 4. Test Your API
```bash
# Get your GitHub wrapped stats
curl "http://localhost:3000/v1/wrapped/octocat?year=2024"

# Get user profile
curl "http://localhost:3000/v1/user/octocat/profile"

# Check API health
curl "http://localhost:3000/v1/health"
```

## 📚 API Documentation

### Base URL
```
https://your-api-domain.com
```

### Endpoints

#### 🎁 **GET** `/v1/wrapped/:username`
Get comprehensive year-end statistics (the main feature!)

**Parameters:**
- `username` (required) - GitHub username
- `year` (optional) - Year for statistics (defaults to current year)

**Example:**
```bash
curl "https://api.example.com/v1/wrapped/octocat?year=2024"
```

**Response:**
```json
{
  "year": 2024,
  "username": "octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
  "stats": {
    "totalContributions": 1847,
    "totalCommits": 1200,
    "totalPRs": 350,
    "totalIssues": 200,
    "totalReviews": 97
  },
  "activity": {
    "busiestMonth": "October",
    "busiestDay": "Wednesday",
    "longestStreak": 42,
    "currentStreak": 12,
    "firstContribution": "2024-01-05",
    "newReposCreated": 8
  },
  "languages": {
    "topLanguage": "TypeScript",
    "breakdown": [
      {
        "lang": "TypeScript",
        "color": "#3178c6",
        "commits": 450,
        "percentage": 38
      },
      {
        "lang": "JavaScript",
        "color": "#f1e05a",
        "commits": 320,
        "percentage": 27
      }
    ]
  },
  "topRepos": [
    {
      "name": "github-wrapped-api",
      "owner": "octocat",
      "contributions": 245,
      "stars": 150,
      "language": "TypeScript"
    }
  ]
}
```

#### 👤 **GET** `/v1/user/:username/profile`
Get user profile information

#### 📊 **GET** `/v1/user/:username/stats`
Get user statistics (total stars, commits, PRs, etc.)

#### ❤️ **GET** `/v1/health`
API health check

#### 🔍 **GET** `/v1/rate-limit`
Check GitHub API rate limit status

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Lint code
npm run format      # Format code with Prettier
```

### Project Structure
```
src/
├── api/v1/
│   ├── features/
│   │   ├── user/           # User profile & stats
│   │   └── wrapped/        # Wrapped statistics (main feature)
│   └── routes.ts           # API routes
├── lib/
│   ├── github.ts           # GitHub GraphQL client
│   └── redis.ts            # Redis caching utilities
├── __tests__/              # Test files
├── app.ts                  # Fastify app setup
├── config.ts               # Environment configuration
├── types.ts                # TypeScript interfaces
└── index.ts                # Server entry point
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Docker
```bash
# Build image
docker build -t github-wrapped-api .

# Run container
docker run -p 3000:3000 --env-file .env github-wrapped-api
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | ✅ | - |
| `REDIS_URL` | Redis connection URL | ✅ | `redis://localhost:6379` |
| `PORT` | Server port | ❌ | `3000` |
| `NODE_ENV` | Environment mode | ❌ | `development` |

### GitHub Token Scopes
Your GitHub Personal Access Token needs these scopes:
- `read:user` - Read user profile information
- `public_repo` - Read public repository data
- `read:org` - Read organization membership (optional)

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Use Prettier for code formatting
- Update documentation for API changes

## 📈 Performance

- **Redis caching** reduces GitHub API calls by 90%
- **Response times** under 100ms for cached requests
- **Rate limiting** prevents abuse (100 requests per 15 minutes)
- **Efficient GraphQL queries** minimize data transfer

## 🔒 Security

- **Helmet.js** security headers
- **CORS** protection
- **Rate limiting** built-in
- **Input validation** on all endpoints
- **Error handling** without sensitive data exposure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

If this project helped you, please consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase

## 🙏 Acknowledgments

- Inspired by [alfa-leetcode-api](https://github.com/alfaarghya/alfa-leetcode-api)
- Built with [Fastify](https://www.fastify.io/) for performance
- Powered by [GitHub GraphQL API](https://docs.github.com/en/graphql)
- Cached with [Redis](https://redis.io/) for speed

---

**Made with ❤️ by developers, for developers**

[⬆ Back to top](#-github-wrapped-api)