import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { FragranceRequestDto } from './dto/fragrance-request.dto';
import { FragranceResponseDto, FragranceRecommendation } from './dto/fragrance-response.dto';

@Injectable()
export class FragranceService {
  private readonly logger = new Logger(FragranceService.name);
  private readonly openai: OpenAI;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async getFragranceRecommendations(request: FragranceRequestDto): Promise<FragranceResponseDto> {
    this.logger.log(`Processing fragrance request for preferences: ${request.preferences.substring(0, 50)}...`);

    try {
      const prompt = this.buildPrompt(request);
      const response = await this.callOpenAIWithRetry(prompt);
      const recommendations = this.parseOpenAIResponse(response);
      
      this.logger.log(`Successfully generated ${recommendations.recommendations.length} fragrance recommendations`);
      
      return {
        ...recommendations,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to generate fragrance recommendations: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to generate fragrance recommendations. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildPrompt(request: FragranceRequestDto): string {
    return `You are an expert perfumer and fragrance consultant. Based on the following user preferences, recommend 3 specific fragrances that would be perfect matches.

User Preferences:
- Description: ${request.preferences}
- Preferred Notes: ${request.preferredNotes.join(', ')}
- Intensity: ${request.intensity}
- Occasion: ${request.occasion}
- Season: ${request.season}
- Budget: ${request.budget || 'Not specified'}
- Gender Preference: ${request.gender || 'Not specified'}

Please provide your response in the following JSON format:
{
  "recommendations": [
    {
      "name": "Fragrance Name",
      "brand": "Brand Name",
      "description": "Detailed description of the fragrance",
      "topNotes": ["note1", "note2", "note3"],
      "heartNotes": ["note1", "note2", "note3"],
      "baseNotes": ["note1", "note2", "note3"],
      "matchReason": "Explanation of why this matches the user's preferences",
      "priceRange": "$X-Y",
      "longevity": "X-Y hours",
      "projection": "Light/Moderate/Strong"
    }
  ],
  "analysis": "Overall analysis of the user's fragrance preferences and style",
  "tips": "Additional tips for fragrance selection and wearing"
}

Important guidelines:
- Recommend real, well-known fragrances from established brands
- Ensure the fragrances match the specified intensity, occasion, and season
- Include specific fragrance notes that align with the user's preferences
- Provide realistic price ranges
- Give practical advice in the tips section
- Make sure the matchReason clearly explains why each fragrance suits the user`;
  }

  private async callOpenAIWithRetry(prompt: string): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.log(`OpenAI API call attempt ${attempt}/${this.maxRetries}`);
        
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert perfumer and fragrance consultant. Always respond with valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
          throw new Error('No response from OpenAI');
        }

        this.logger.log('Successfully received response from OpenAI');
        return response;
      } catch (error) {
        lastError = error;
        this.logger.warn(`OpenAI API call attempt ${attempt} failed: ${error.message}`);
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          this.logger.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`OpenAI API failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  private parseOpenAIResponse(response: string): Omit<FragranceResponseDto, 'timestamp'> {
    try {
      // Clean up the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Invalid recommendations structure');
      }

      // Ensure we have the required fields
      const recommendations: FragranceRecommendation[] = parsed.recommendations.map((rec: any) => ({
        name: rec.name || 'Unknown Fragrance',
        brand: rec.brand || 'Unknown Brand',
        description: rec.description || 'No description available',
        topNotes: Array.isArray(rec.topNotes) ? rec.topNotes : [],
        heartNotes: Array.isArray(rec.heartNotes) ? rec.heartNotes : [],
        baseNotes: Array.isArray(rec.baseNotes) ? rec.baseNotes : [],
        matchReason: rec.matchReason || 'Good match for your preferences',
        priceRange: rec.priceRange || '$50-100',
        longevity: rec.longevity || '4-6 hours',
        projection: rec.projection || 'Moderate',
      }));

      return {
        recommendations,
        analysis: parsed.analysis || 'Analysis not available',
        tips: parsed.tips || 'Test fragrances on your skin before purchasing',
      };
    } catch (error) {
      this.logger.error(`Failed to parse OpenAI response: ${error.message}`);
      
      // Return fallback recommendations
      return this.getFallbackRecommendations();
    }
  }

  private getFallbackRecommendations(): Omit<FragranceResponseDto, 'timestamp'> {
    return {
      recommendations: [
        {
          name: 'Acqua di Gio',
          brand: 'Giorgio Armani',
          description: 'A fresh aquatic fragrance perfect for everyday wear',
          topNotes: ['bergamot', 'lemon', 'lime'],
          heartNotes: ['jasmine', 'rose', 'freesia'],
          baseNotes: ['white musk', 'cedar', 'patchouli'],
          matchReason: 'A versatile fragrance suitable for most preferences',
          priceRange: '$60-80',
          longevity: '6-8 hours',
          projection: 'Moderate',
        },
        {
          name: 'Light Blue',
          brand: 'Dolce & Gabbana',
          description: 'A Mediterranean-inspired fragrance with citrus notes',
          topNotes: ['sicilian lemon', 'apple', 'bluebell'],
          heartNotes: ['bamboo', 'jasmine', 'white rose'],
          baseNotes: ['cedarwood', 'amber', 'musk'],
          matchReason: 'Fresh and light, perfect for daily wear',
          priceRange: '$50-70',
          longevity: '5-7 hours',
          projection: 'Light to Moderate',
        },
        {
          name: 'Black Opium',
          brand: 'Yves Saint Laurent',
          description: 'A modern take on oriental fragrances with coffee notes',
          topNotes: ['pink pepper', 'orange blossom', 'pear'],
          heartNotes: ['coffee', 'jasmine', 'bitter almond'],
          baseNotes: ['vanilla', 'patchouli', 'cedarwood'],
          matchReason: 'Sophisticated and alluring for evening wear',
          priceRange: '$80-120',
          longevity: '8-10 hours',
          projection: 'Strong',
        },
      ],
      analysis: 'These are popular, well-reviewed fragrances suitable for various preferences and occasions.',
      tips: 'Always test fragrances on your skin and allow them to develop for at least 30 minutes before making a decision.',
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 