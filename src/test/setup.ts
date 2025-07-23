import '@testing-library/jest-dom';

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    DEV: true,
    VITE_OPENAI_API_KEY: 'test-openai-key',
    VITE_API_PROXY_URL: 'http://localhost:3001/api',
    VITE_OPENAI_MODEL: 'gpt-3.5-turbo',
    VITE_OPENAI_MAX_TOKENS: '1000',
    VITE_OPENAI_TEMPERATURE: '0.7',
    VITE_QLOO_TIMEOUT: '10000',
  },
  writable: true,
});

// Mock axios for API calls
import { vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      defaults: {
        headers: {
          common: {},
        },
      },
    })),
    isAxiosError: vi.fn(),
  },
}));