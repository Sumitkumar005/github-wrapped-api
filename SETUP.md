# 🚀 GitHub Wrapped API - Complete Setup Guide

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Redis** server (or Docker for easy setup)
- **GitHub Personal Access Token**

## Step 1: GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "GitHub Wrapped API"
4. Select these scopes:
   - ✅ `read:user` - Read user profile information
   - ✅ `public_repo` - Read public repository data
   - ✅ `read:org` - Read organization membership (optional)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## Step 2: Project Setup

### Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd github-wrapped-api

# Install dependencies
npm install
```

### Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env  # or use your preferred editor
```

Add your configuration to `.env`:
```env
# GitHub Personal Access Token (REQUIRED)
GITHUB_TOKEN=your_github_personal_access_token_here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Step 3: Start Redis

### Option A: Docker (Recommended)
```bash
# Start everything with Docker Compose
docker-compose up -d

# This will start both Redis and the API
```

### Option B: Local Redis Installation

**On macOS (with Homebrew):**
```bash
brew install redis
brew services start redis
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**On Windows:**
```bash
# Use Docker or WSL2 with Ubuntu instructions
```

## Step 4: Start the API

### Development Mode
```bash
# Start the development server with hot reload
npm run dev
```

### Production Mode
```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Step 5: Test Your API

### Basic Health Check
```bash
curl http://localhost:3000/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Test User Profile
```bash
curl "http://localhost:3000/v1/user/octocat/profile"
```

### Test Wrapped Stats (The Main Feature!)
```bash
curl "http://localhost:3000/v1/wrapped/octocat?year=2024"
```

### Check Rate Limits
```bash
curl http://localhost:3000/v1/rate-limit
```

## Step 6: Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

### Common Issues

#### 1. "GitHub token is required" Error
- Make sure your `.env` file has the correct `GITHUB_TOKEN`
- Verify the token has the right scopes
- Check that the `.env` file is in the project root

#### 2. Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"

# If using Docker:
docker-compose ps
# Should show redis container as "Up"
```

#### 3. Port Already in Use
```bash
# Change the port in .env file
PORT=3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### 4. TypeScript Errors
```bash
# Clean build
rm -rf dist/
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

### Performance Tips

1. **Redis Caching**: The API uses intelligent caching:
   - User profiles: 1 hour cache
   - Wrapped stats: 24 hours cache
   - This dramatically reduces GitHub API calls

2. **Rate Limiting**: Built-in rate limiting (100 requests per 15 minutes)

3. **Error Handling**: Comprehensive error responses with proper HTTP status codes

## API Endpoints Reference

| Endpoint | Description | Cache TTL |
|----------|-------------|-----------|
| `GET /` | API documentation | None |
| `GET /v1/health` | Health check | None |
| `GET /v1/user/:username/profile` | User profile | 1 hour |
| `GET /v1/user/:username/stats` | User statistics | 1 hour |
| `GET /v1/wrapped/:username?year=2024` | **Wrapped stats** | 24 hours |
| `GET /v1/rate-limit` | GitHub API rate limit | None |

## Development Commands

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Check code style
npm run lint:fix    # Fix code style issues
npm run format      # Format code with Prettier

# Testing
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

## Deployment

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

### Manual Server
```bash
# On your server
npm run build
npm start

# With PM2 (recommended)
npm install -g pm2
pm2 start dist/index.js --name github-wrapped-api
```

## Next Steps

1. **Test with your GitHub username**: `curl "http://localhost:3000/v1/wrapped/YOUR_USERNAME?year=2024"`
2. **Customize the API**: Add new endpoints or modify existing ones
3. **Deploy to production**: Use Vercel, Docker, or your preferred platform
4. **Share with the community**: This API has viral potential!

## Support

If you encounter any issues:

1. Check this setup guide
2. Look at the error logs: `npm run dev` shows detailed errors
3. Verify your GitHub token and Redis connection
4. Check the [GitHub Issues](https://github.com/your-username/github-wrapped-api/issues)

---

**🎉 Congratulations! Your GitHub Wrapped API is ready to go viral!**