/**
 * Simple test utility to verify proxy server connectivity
 */
import { OpenAIService } from './OpenAIService';
import { QlooService } from './QlooService';

export class ProxyTest {
  private openaiService: OpenAIService;
  private qlooService: QlooService;

  constructor() {
    this.openaiService = new OpenAIService();
    this.qlooService = new QlooService();
  }

  /**
   * Test proxy server health endpoint
   */
  async testProxyHealth(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing proxy server health...');
      
      // Test OpenAI service proxy connection
      const openaiTest = await this.openaiService.testProxyConnection();
      console.log('OpenAI proxy test:', openaiTest);

      // Test Qloo service proxy connection  
      const qlooTest = await this.qlooService.testProxyConnection();
      console.log('Qloo proxy test:', qlooTest);

      if (openaiTest.success && qlooTest.success) {
        return {
          success: true,
          message: 'Proxy server is healthy and accessible',
          details: {
            openai: openaiTest,
            qloo: qlooTest
          }
        };
      } else {
        return {
          success: false,
          message: 'Proxy server connection issues detected',
          details: {
            openai: openaiTest,
            qloo: qlooTest
          }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Proxy test failed: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * Test basic API functionality through proxy
   */
  async testBasicAPIFlow(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('Testing basic API flow through proxy...');
      
      // Test OpenAI seed extraction with simple input
      const seedResponse = await this.openaiService.extractSeeds('jazz music');
      console.log('Seed extraction test:', seedResponse);

      if (seedResponse.success && seedResponse.data) {
        return {
          success: true,
          message: 'Basic API flow working through proxy',
          details: {
            extractedSeeds: seedResponse.data
          }
        };
      } else {
        return {
          success: false,
          message: 'API flow test failed',
          details: seedResponse.error
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `API flow test failed: ${error.message}`,
        details: error
      };
    }
  }
}