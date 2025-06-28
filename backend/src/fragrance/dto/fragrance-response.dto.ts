import { ApiProperty } from '@nestjs/swagger';

export class FragranceRecommendation {
  @ApiProperty({
    description: 'Name of the recommended fragrance',
    example: 'Acqua di Gio by Giorgio Armani',
  })
  name: string;

  @ApiProperty({
    description: 'Brand of the fragrance',
    example: 'Giorgio Armani',
  })
  brand: string;

  @ApiProperty({
    description: 'Detailed description of the fragrance',
    example: 'A fresh aquatic fragrance with marine notes, perfect for summer days',
  })
  description: string;

  @ApiProperty({
    description: 'Top notes of the fragrance',
    isArray: true,
    type: String,
    example: ['bergamot', 'lemon', 'lime'],
  })
  topNotes: string[];

  @ApiProperty({
    description: 'Heart/middle notes of the fragrance',
    isArray: true,
    type: String,
    example: ['jasmine', 'rose', 'freesia'],
  })
  heartNotes: string[];

  @ApiProperty({
    description: 'Base notes of the fragrance',
    isArray: true,
    type: String,
    example: ['white musk', 'cedar', 'patchouli'],
  })
  baseNotes: string[];

  @ApiProperty({
    description: 'Why this fragrance matches user preferences',
    example: 'This fragrance perfectly matches your love for fresh, citrusy scents while providing the energetic feel you described',
  })
  matchReason: string;

  @ApiProperty({
    description: 'Estimated price range',
    example: '$60-80',
  })
  priceRange: string;

  @ApiProperty({
    description: 'Longevity of the fragrance',
    example: '6-8 hours',
  })
  longevity: string;

  @ApiProperty({
    description: 'Projection/sillage of the fragrance',
    example: 'Moderate',
  })
  projection: string;
}

export class FragranceResponseDto {
  @ApiProperty({
    description: 'List of fragrance recommendations',
    isArray: true,
    type: FragranceRecommendation,
  })
  recommendations: FragranceRecommendation[];

  @ApiProperty({
    description: 'Overall analysis of user preferences',
    example: 'Based on your preferences for fresh, citrusy scents, you have a preference for clean, energizing fragrances perfect for daily wear.',
  })
  analysis: string;

  @ApiProperty({
    description: 'Additional tips for fragrance selection',
    example: 'Consider testing fragrances on your skin as they may smell different due to individual body chemistry.',
  })
  tips: string;

  @ApiProperty({
    description: 'Timestamp of the recommendation',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: string;
} 