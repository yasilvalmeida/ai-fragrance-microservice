import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FragranceService } from './fragrance.service';
import { FragranceRequestDto } from './dto/fragrance-request.dto';
import { FragranceResponseDto } from './dto/fragrance-response.dto';

@ApiTags('fragrance')
@Controller('fragrance')
export class FragranceController {
  private readonly logger = new Logger(FragranceController.name);

  constructor(private readonly fragranceService: FragranceService) {}

  @Post('match')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get AI-powered fragrance recommendations',
    description: 'Submit user preferences to receive personalized fragrance recommendations powered by AI'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully generated fragrance recommendations',
    type: FragranceResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data - check validation errors' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error - AI service temporarily unavailable' 
  })
  async getFragranceMatch(@Body() request: FragranceRequestDto): Promise<FragranceResponseDto> {
    const startTime = Date.now();
    
    this.logger.log(`Received fragrance match request - Intensity: ${request.intensity}, Occasion: ${request.occasion}, Season: ${request.season}`);
    
    try {
      const response = await this.fragranceService.getFragranceRecommendations(request);
      
      const duration = Date.now() - startTime;
      this.logger.log(`Fragrance match request completed in ${duration}ms`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Fragrance match request failed after ${duration}ms: ${error.message}`);
      throw error;
    }
  }
} 