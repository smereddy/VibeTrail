import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIError, APIResponse, RetryConfig } from '../types';

/**
 * Base API service class with error handling and retry logic
 * Provides common functionality for all API services
 */
export abstract class BaseAPIService {
  protected client: AxiosInstance;
  protected retryConfig: RetryConfig;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.retryConfig = {
      maxRetries: 3,
      backoffMultiplier: 2,
      retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
      initialDelay: 1000,
    };

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to requests for debugging
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => {
        return Promise.reject(this.createAPIError(error, 'request'));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata) {
          const duration = Date.now() - response.config.metadata.startTime;
          console.log(`API Request to ${response.config.url} took ${duration}ms`);
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.createAPIError(error, 'response'));
      }
    );
  }

  /**
   * Make a request with retry logic
   */
  protected async makeRequest<T>(
    config: AxiosRequestConfig,
    retryCount: number = 0
  ): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      const apiError = error as APIError;
      
      // Check if we should retry
      if (this.shouldRetry(apiError, retryCount)) {
        const delay = this.calculateDelay(retryCount);
        await this.sleep(delay);
        return this.makeRequest<T>(config, retryCount + 1);
      }

      return {
        error: apiError,
        success: false,
      };
    }
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: APIError, retryCount: number): boolean {
    if (retryCount >= this.retryConfig.maxRetries) {
      return false;
    }

    // Retry on network errors
    if (this.retryConfig.retryableErrors.includes(error.code)) {
      return true;
    }

    // Retry on 5xx server errors
    if (error.code.startsWith('5')) {
      return true;
    }

    // Retry on rate limiting (429)
    if (error.code === '429') {
      return true;
    }

    return false;
  }

  /**
   * Calculate delay for exponential backoff
   */
  private calculateDelay(retryCount: number): number {
    return this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create standardized API error
   */
  private createAPIError(error: any, type: 'request' | 'response'): APIError {
    let code = 'UNKNOWN_ERROR';
    let message = 'An unknown error occurred';
    let details = error;

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        code = error.response.status.toString();
        message = error.response.data?.message || error.message;
        details = error.response.data;
      } else if (error.request) {
        // Request was made but no response received
        code = error.code || 'NETWORK_ERROR';
        message = 'Network error - no response received';
        details = error.request;
      } else {
        // Error in request configuration
        code = 'REQUEST_CONFIG_ERROR';
        message = error.message;
      }
    } else if (error instanceof Error) {
      code = error.name;
      message = error.message;
    }

    return {
      code,
      message,
      details,
      timestamp: new Date(),
      service: this.getServiceName(),
    };
  }

  /**
   * Get the service name for error reporting
   * Must be implemented by subclasses
   */
  protected abstract getServiceName(): 'openai' | 'qloo' | 'calendar';

  /**
   * Set authentication header
   */
  protected setAuthHeader(token: string, type: 'Bearer' | 'API-Key' = 'Bearer'): void {
    this.client.defaults.headers.common['Authorization'] = `${type} ${token}`;
  }

  /**
   * Set custom header
   */
  protected setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  /**
   * Update retry configuration
   */
  protected updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  /**
   * Health check method
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest({
        method: 'GET',
        url: '/health',
      });
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Test proxy connectivity
   */
  public async testProxyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.client.get('/health');
      return { 
        success: true,
        data: response.data 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Connection failed' 
      };
    }
  }
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}