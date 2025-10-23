/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toContain(expected: string): R;
      toBeDefined(): R;
      toBe(expected: any): R;
    }
  }
}

export {};