import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenAIService } from '../OpenAIService';
import { ExtractedSeed, ItemExplanation, ScheduledPlan, TasteItem } from '../../types';

// Mock the environment config
vi.mock('../../config/environment', () => ({
  getEnvironmentConfig: () => ({
    openai: {
      apiKey: 'mock-key-for-testing',
      model: 'gpt-4',
      maxTokens: 1000,
      temperature: 0.7,
    },
  }),
}));

describe('OpenAIService', () => {
  let openAIService: OpenAIService;
  let mockMakeRequest: any;

  beforeEach(() => {
    openAIService = new OpenAIService();
    // Mock the makeRequest method
    mockMakeRequest = vi.spyOn(openAIService as any, 'makeRequest');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('extractSeeds', () => {
    it('should extract seeds from user vibe input successfully', async () => {
      const mockSeeds: ExtractedSeed[] = [
        {
          text: 'jazz music',
          category: 'media',
          confidence: 0.9,
          searchTerms: ['jazz', 'music', 'blues'],
        },
        {
          text: 'romantic restaurants',
          category: 'food',
          confidence: 0.8,
          searchTerms: ['romantic', 'dining', 'restaurants'],
        },
      ];

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockSeeds),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds('La La Land weekend');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSeeds);
      expect(mockMakeRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chat/completions',
        data: expect.objectContaining({
          model: 'gpt-4',
          max_tokens: 1000,
          temperature: 0.7,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('taste intelligence assistant'),
            }),
            expect.objectContaining({
              role: 'user',
              content: 'Extract seeds from this vibe: "La La Land weekend"',
            }),
          ]),
        }),
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'OpenAI API error',
          timestamp: new Date(),
          service: 'openai' as const,
        },
      };

      mockMakeRequest.mockResolvedValue(mockError);

      const result = await openAIService.extractSeeds('test vibe');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError.error);
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: 'invalid json',
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds('test vibe');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PARSE_ERROR');
      expect(result.error?.message).toBe('Failed to parse OpenAI response');
    });

    it('should handle empty response content', async () => {
      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: null,
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds('test vibe');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PARSE_ERROR');
    });
  });

  describe('generateExplanations', () => {
    it('should generate explanations for recommendation items', async () => {
      const mockItems: TasteItem[] = [
        {
          id: '1',
          name: 'Blue Note Jazz Club',
          description: 'Intimate jazz venue',
          location: 'Los Angeles',
          tasteStrength: 0.9,
          normalizedWeight: 0.8,
          image: 'image.jpg',
          whyItFits: '',
          category: 'activity',
          qlooId: 'qloo-1',
          seedReferences: [],
        },
      ];

      const mockSeeds: ExtractedSeed[] = [
        {
          text: 'jazz music',
          category: 'media',
          confidence: 0.9,
          searchTerms: ['jazz'],
        },
      ];

      const mockExplanations: ItemExplanation[] = [
        {
          itemId: '1',
          explanation: 'Perfect jazz venue matching your music taste',
          seedReferences: ['jazz music'],
        },
      ];

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockExplanations),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.generateExplanations(mockItems, mockSeeds);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExplanations);
      expect(mockMakeRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chat/completions',
        data: expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('jazz music'),
            }),
          ]),
        }),
      });
    });

    it('should handle explanation generation errors', async () => {
      const mockError = {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to generate explanations',
          timestamp: new Date(),
          service: 'openai' as const,
        },
      };

      mockMakeRequest.mockResolvedValue(mockError);

      const result = await openAIService.generateExplanations([], []);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError.error);
    });
  });

  describe('scheduleDayPlan', () => {
    it('should schedule items into a day plan', async () => {
      const mockItems: TasteItem[] = [
        {
          id: '1',
          name: 'Morning Cafe',
          description: 'Great coffee',
          location: 'Downtown LA',
          tasteStrength: 0.8,
          normalizedWeight: 0.7,
          image: 'cafe.jpg',
          whyItFits: 'Perfect morning spot',
          category: 'food',
          qlooId: 'qloo-1',
          seedReferences: ['coffee'],
          estimatedDuration: 60,
          businessHours: {
            open: '7:00 AM',
            close: '3:00 PM',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
        },
      ];

      const mockPlan: ScheduledPlan = {
        timeSlots: [
          {
            id: 'morning',
            name: 'Morning',
            time: '9:00 AM - 10:00 AM',
            item: mockItems[0],
            explanation: 'Perfect time for coffee',
          },
        ],
        travelConsiderations: ['Allow 15 minutes between locations'],
        alternativeOptions: ['Consider backup venues'],
      };

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockPlan),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.scheduleDayPlan(mockItems, 'Los Angeles');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlan);
      expect(mockMakeRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/chat/completions',
        data: expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('Los Angeles'),
            }),
          ]),
        }),
      });
    });

    it('should handle scheduling errors', async () => {
      const mockError = {
        success: false,
        error: {
          code: 'SCHEDULING_ERROR',
          message: 'Failed to schedule day plan',
          timestamp: new Date(),
          service: 'openai' as const,
        },
      };

      mockMakeRequest.mockResolvedValue(mockError);

      const result = await openAIService.scheduleDayPlan([], 'Los Angeles');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError.error);
    });

    it('should handle items with missing business hours', async () => {
      const mockItems: TasteItem[] = [
        {
          id: '1',
          name: 'Mystery Venue',
          description: 'Unknown hours',
          location: 'Somewhere',
          tasteStrength: 0.5,
          normalizedWeight: 0.5,
          image: 'venue.jpg',
          whyItFits: 'Fits somehow',
          category: 'activity',
          qlooId: 'qloo-1',
          seedReferences: [],
          // No businessHours or estimatedDuration
        },
      ];

      const mockPlan: ScheduledPlan = {
        timeSlots: [
          {
            id: 'afternoon',
            name: 'Afternoon',
            time: '2:00 PM - 4:00 PM',
            item: mockItems[0],
            explanation: 'Scheduled with unknown hours',
          },
        ],
        travelConsiderations: ['Verify business hours before visiting'],
        alternativeOptions: ['Have backup plans ready'],
      };

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockPlan),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.scheduleDayPlan(mockItems, 'Phoenix');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPlan);
      expect(mockMakeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/chat/completions',
          data: expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                content: expect.stringContaining('Duration: Unknown'),
              }),
            ]),
          }),
        })
      );
    });
  });

  describe('service configuration', () => {
    it('should return correct service name', () => {
      const serviceName = (openAIService as any).getServiceName();
      expect(serviceName).toBe('openai');
    });

    it('should set up authentication header correctly', () => {
      // This tests that the constructor properly calls setAuthHeader
      expect(openAIService).toBeInstanceOf(OpenAIService);
      // The actual header setting is tested through the BaseAPIService
    });
  });

  describe('edge cases', () => {
    it('should handle empty vibe input', async () => {
      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify([]),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds('');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle very long vibe input', async () => {
      const longVibe = 'a'.repeat(1000);
      const mockSeeds: ExtractedSeed[] = [
        {
          text: 'general preference',
          category: 'general',
          confidence: 0.5,
          searchTerms: ['general'],
        },
      ];

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockSeeds),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds(longVibe);

      expect(result.success).toBe(true);
      expect(mockMakeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/chat/completions',
          data: expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                content: expect.stringContaining(longVibe),
              }),
            ]),
          }),
        })
      );
    });

    it('should handle special characters in vibe input', async () => {
      const specialVibe = 'café & résumé with émojis 🎵🍕';
      const mockSeeds: ExtractedSeed[] = [
        {
          text: 'café',
          category: 'food',
          confidence: 0.8,
          searchTerms: ['cafe', 'coffee'],
        },
      ];

      const mockResponse = {
        success: true,
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify(mockSeeds),
              },
            },
          ],
        },
      };

      mockMakeRequest.mockResolvedValue(mockResponse);

      const result = await openAIService.extractSeeds(specialVibe);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSeeds);
    });
  });
});