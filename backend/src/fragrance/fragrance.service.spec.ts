import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FragranceService } from './fragrance.service';
import { FragranceRequestDto, FragranceIntensity, FragranceOccasion, FragranceSeason } from './dto/fragrance-request.dto';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

describe('FragranceService', () => {
  let service: FragranceService;
  let configService: ConfigService;
  let mockOpenAI: any;

  const mockRequest: FragranceRequestDto = {
    preferences: 'I love fresh, citrusy scents that make me feel energetic',
    preferredNotes: ['citrus', 'bergamot', 'vanilla'],
    intensity: FragranceIntensity.MODERATE,
    occasion: FragranceOccasion.DAILY,
    season: FragranceSeason.SUMMER,
    budget: '50-100',
    gender: 'unisex',
  };

  const mockOpenAIResponse = {
    choices: [
      {
        message: {
          content: JSON.stringify({
            recommendations: [
              {
                name: 'Test Fragrance',
                brand: 'Test Brand',
                description: 'Test Description',
                topNotes: ['citrus', 'bergamot'],
                heartNotes: ['rose', 'jasmine'],
                baseNotes: ['musk', 'amber'],
                matchReason: 'Perfect match for your preferences',
                priceRange: '$60-80',
                longevity: '6-8 hours',
                projection: 'Moderate',
              },
            ],
            analysis: 'You prefer fresh, energetic scents',
            tips: 'Test on skin before purchasing',
          }),
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FragranceService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<FragranceService>(FragranceService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Get the mocked OpenAI instance
    const OpenAI = require('openai').default;
    mockOpenAI = new OpenAI();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if OPENAI_API_KEY is not configured', async () => {
      const module = await Test.createTestingModule({
        providers: [
          FragranceService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(null),
            },
          },
        ],
      }).compile();

      expect(() => {
        module.get<FragranceService>(FragranceService);
      }).toThrow('OPENAI_API_KEY is not configured');
    });

    it('should initialize correctly with valid API key', () => {
      expect(service).toBeDefined();
      expect(configService.get).toHaveBeenCalledWith('OPENAI_API_KEY');
    });
  });

  describe('getFragranceRecommendations', () => {
    it('should return recommendations successfully', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      const result = await service.getFragranceRecommendations(mockRequest);

      expect(result).toBeDefined();
      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].name).toBe('Test Fragrance');
      expect(result.analysis).toBe('You prefer fresh, energetic scents');
      expect(result.timestamp).toBeDefined();
    });

    it('should handle OpenAI API errors with retry logic', async () => {
      mockOpenAI.chat.completions.create
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Rate limit'))
        .mockResolvedValue(mockOpenAIResponse);

      const result = await service.getFragranceRecommendations(mockRequest);

      expect(result).toBeDefined();
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(3);
    });

    it('should return fallback recommendations when OpenAI fails after retries', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('Persistent error'));

      await expect(service.getFragranceRecommendations(mockRequest)).rejects.toThrow(HttpException);
    });

    it('should handle invalid JSON response from OpenAI', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Invalid JSON response' } }],
      });

      const result = await service.getFragranceRecommendations(mockRequest);

      // Should return fallback recommendations
      expect(result).toBeDefined();
      expect(result.recommendations).toHaveLength(3);
      expect(result.recommendations[0].name).toBe('Acqua di Gio');
    });

    it('should handle empty response from OpenAI', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      await expect(service.getFragranceRecommendations(mockRequest)).rejects.toThrow(HttpException);
    });

    it('should validate and sanitize OpenAI response structure', async () => {
      const invalidResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendations: [
                  {
                    // Missing required fields
                    name: 'Test Fragrance',
                  },
                ],
                analysis: 'Test analysis',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(invalidResponse);

      const result = await service.getFragranceRecommendations(mockRequest);

      expect(result.recommendations[0].name).toBe('Test Fragrance');
      expect(result.recommendations[0].brand).toBe('Unknown Brand');
      expect(result.recommendations[0].description).toBe('No description available');
    });
  });

  describe('buildPrompt', () => {
    it('should build proper prompt with all user preferences', () => {
      // Access private method for testing
      const buildPrompt = (service as any).buildPrompt;
      const prompt = buildPrompt.call(service, mockRequest);

      expect(prompt).toContain('I love fresh, citrusy scents');
      expect(prompt).toContain('citrus, bergamot, vanilla');
      expect(prompt).toContain('moderate');
      expect(prompt).toContain('daily');
      expect(prompt).toContain('summer');
      expect(prompt).toContain('50-100');
      expect(prompt).toContain('unisex');
    });

    it('should handle optional fields gracefully', () => {
      const requestWithoutOptionals = {
        ...mockRequest,
        budget: undefined,
        gender: undefined,
      };

      const buildPrompt = (service as any).buildPrompt;
      const prompt = buildPrompt.call(service, requestWithoutOptionals);

      expect(prompt).toContain('Not specified');
    });
  });

  describe('parseOpenAIResponse', () => {
    it('should parse valid JSON response correctly', () => {
      const validResponse = JSON.stringify({
        recommendations: [
          {
            name: 'Test Fragrance',
            brand: 'Test Brand',
            description: 'Test Description',
            topNotes: ['citrus'],
            heartNotes: ['rose'],
            baseNotes: ['musk'],
            matchReason: 'Perfect match',
            priceRange: '$60-80',
            longevity: '6-8 hours',
            projection: 'Moderate',
          },
        ],
        analysis: 'Test analysis',
        tips: 'Test tips',
      });

      const parseResponse = (service as any).parseOpenAIResponse;
      const result = parseResponse.call(service, validResponse);

      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].name).toBe('Test Fragrance');
      expect(result.analysis).toBe('Test analysis');
      expect(result.tips).toBe('Test tips');
    });

    it('should return fallback recommendations for invalid JSON', () => {
      const parseResponse = (service as any).parseOpenAIResponse;
      const result = parseResponse.call(service, 'Invalid JSON');

      expect(result.recommendations).toHaveLength(3);
      expect(result.recommendations[0].name).toBe('Acqua di Gio');
    });
  });

  describe('getFallbackRecommendations', () => {
    it('should return well-formed fallback recommendations', () => {
      const getFallback = (service as any).getFallbackRecommendations;
      const result = getFallback.call(service);

      expect(result.recommendations).toHaveLength(3);
      expect(result.recommendations[0].name).toBe('Acqua di Gio');
      expect(result.recommendations[1].name).toBe('Light Blue');
      expect(result.recommendations[2].name).toBe('Black Opium');
      expect(result.analysis).toBeDefined();
      expect(result.tips).toBeDefined();
    });
  });
}); 