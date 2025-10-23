// Jest setup file

// Extend Jest timeout for integration tests
jest.setTimeout(10000);

// Mock Redis to avoid connection issues in tests
jest.mock('../lib/redis', () => ({
  redis: {
    connect: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
  },
  initRedis: jest.fn(),
  CacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    del: jest.fn().mockResolvedValue(undefined),
  },
}));

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = jest.fn();
  console.error = originalConsoleError; // Keep error logs for debugging
});

afterEach(() => {
  console.log = originalConsoleLog;
});