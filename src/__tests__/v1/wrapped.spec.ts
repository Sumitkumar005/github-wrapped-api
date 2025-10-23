import { buildApp } from '../../app';

describe('GitHub Wrapped API', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /', () => {
    it('should return API documentation', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('🎁 GitHub Wrapped API');
      expect(body.version).toBe('1.0.0');
      expect(body.documentation).toBeDefined();
    });
  });

  describe('GET /v1/health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('Validation Tests', () => {
    it('should return 400 for invalid year in wrapped endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/wrapped/testuser?year=invalid',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('Invalid year');
    });

    it('should return 400 for year out of range', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/wrapped/testuser?year=2007',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('Invalid year');
    });
  });

  describe('Rate Limit Endpoint', () => {
    it('should return rate limit information or error', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/rate-limit',
      });

      // Should return either rate limit info or error if GitHub token is invalid
      expect([200, 500]).toContain(response.statusCode);
    });
  });
});