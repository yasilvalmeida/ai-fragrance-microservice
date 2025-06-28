import { Test, TestingModule } from '@nestjs/testing';
import { FragranceController } from './fragrance.controller';
import { FragranceService } from './fragrance.service';
import { FragranceRequestDto, FragranceIntensity, FragranceOccasion, FragranceSeason } from './dto/fragrance-request.dto';
import { FragranceResponseDto } from './dto/fragrance-response.dto';

describe('FragranceController', () => {
  let controller: FragranceController;
  let service: FragranceService;

  const mockRequest: FragranceRequestDto = {
    preferences: 'I love fresh, citrusy scents',
    preferredNotes: ['citrus', 'bergamot'],
    intensity: FragranceIntensity.MODERATE,
    occasion: FragranceOccasion.DAILY,
    season: FragranceSeason.SUMMER,
  };

  const mockResponse: FragranceResponseDto = {
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
    timestamp: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FragranceController],
      providers: [
        {
          provide: FragranceService,
          useValue: {
            getFragranceRecommendations: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FragranceController>(FragranceController);
    service = module.get<FragranceService>(FragranceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFragranceMatch', () => {
    it('should return fragrance recommendations successfully', async () => {
      jest.spyOn(service, 'getFragranceRecommendations').mockResolvedValue(mockResponse);

      const result = await controller.getFragranceMatch(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(service.getFragranceRecommendations).toHaveBeenCalledWith(mockRequest);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'getFragranceRecommendations').mockRejectedValue(error);

      await expect(controller.getFragranceMatch(mockRequest)).rejects.toThrow(error);
    });

    it('should log request details', async () => {
      const logSpy = jest.spyOn(controller['logger'], 'log');
      jest.spyOn(service, 'getFragranceRecommendations').mockResolvedValue(mockResponse);

      await controller.getFragranceMatch(mockRequest);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Received fragrance match request'),
      );
    });

    it('should log completion time', async () => {
      const logSpy = jest.spyOn(controller['logger'], 'log');
      jest.spyOn(service, 'getFragranceRecommendations').mockResolvedValue(mockResponse);

      await controller.getFragranceMatch(mockRequest);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('completed in'),
      );
    });

    it('should log errors with timing', async () => {
      const errorSpy = jest.spyOn(controller['logger'], 'error');
      const error = new Error('Service error');
      jest.spyOn(service, 'getFragranceRecommendations').mockRejectedValue(error);

      await expect(controller.getFragranceMatch(mockRequest)).rejects.toThrow();

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('failed after'),
      );
    });
  });
}); 