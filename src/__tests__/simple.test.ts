// Simple test to verify Jest is working
describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should work with objects', () => {
    const obj = { name: 'GitHub Wrapped API', version: '1.0.0' };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('GitHub Wrapped API');
  });
});