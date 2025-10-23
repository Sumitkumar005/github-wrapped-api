import { CacheService } from '../../lib/redis';

// Mock Redis to simulate unavailable state
jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
        on: jest.fn(),
    })),
}));

describe('CacheService without Redis', () => {
    beforeEach(() => {
        // Reset Redis availability
        process.env.VERCEL = '1'; // Simulate Vercel environment
    });

    afterEach(() => {
        delete process.env.VERCEL;
    });

    it('should return false for isAvailable when Redis is not connected', () => {
        expect(CacheService.isAvailable()).toBe(false);
    });

    it('should return null for cache get when Redis is unavailable', async () => {
        const result = await CacheService.get('test-key');
        expect(result).toBeNull();
    });

    it('should not throw error for cache set when Redis is unavailable', async () => {
        await expect(CacheService.set('test-key', { data: 'test' })).resolves.toBeUndefined();
    });

    it('should not throw error for cache delete when Redis is unavailable', async () => {
        await expect(CacheService.del('test-key')).resolves.toBeUndefined();
    });
});