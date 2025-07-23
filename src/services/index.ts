/**
 * Service factory and exports
 * Provides centralized access to all API services
 */

import { OpenAIService } from './OpenAIService';
import { QlooService } from './QlooService';
import { validateEnvironment } from '../config/environment';

// Service instances
let openAIService: OpenAIService | null = null;
let qlooService: QlooService | null = null;

/**
 * Get OpenAI service instance (singleton)
 */
export function getOpenAIService(): OpenAIService {
  if (!openAIService) {
    try {
      validateEnvironment();
      openAIService = new OpenAIService();
    } catch (error) {
      console.warn('Environment validation warning:', error);
      openAIService = new OpenAIService();
    }
  }
  return openAIService;
}

/**
 * Get Qloo service instance (singleton)
 */
export function getQlooService(): QlooService {
  if (!qlooService) {
    try {
      validateEnvironment();
      qlooService = new QlooService();
    } catch (error) {
      console.warn('Environment validation warning:', error);
      qlooService = new QlooService();
    }
  }
  return qlooService;
}

/**
 * Reset service instances (useful for testing)
 */
export function resetServices(): void {
  openAIService = null;
  qlooService = null;
}

/**
 * Check if services are properly configured
 */
export function areServicesConfigured(): boolean {
  try {
    validateEnvironment();
    return true;
  } catch {
    return false;
  }
}

// Re-export service classes for direct instantiation if needed
export { OpenAIService } from './OpenAIService';
export { QlooService } from './QlooService';
export { CulturalEcosystemService } from './CulturalEcosystemService';
export type { CulturalEcosystem, CulturalConnection, CulturalTheme, CulturalInsight } from './CulturalEcosystemService';
export { BaseAPIService } from './BaseAPIService';
export { ProxyTest } from './ProxyTest';