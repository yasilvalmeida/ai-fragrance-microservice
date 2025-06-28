import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export enum FragranceIntensity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  STRONG = 'strong',
}

export enum FragranceOccasion {
  DAILY = 'daily',
  EVENING = 'evening',
  SPECIAL = 'special',
  WORK = 'work',
  CASUAL = 'casual',
}

export enum FragranceSeason {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
  ALL_YEAR = 'all_year',
}

export class FragranceRequestDto {
  @ApiProperty({
    description: 'User preferences and personality description',
    example: 'I love fresh, citrusy scents that make me feel energetic and confident',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  preferences: string;

  @ApiProperty({
    description: 'Preferred fragrance notes',
    example: ['citrus', 'bergamot', 'vanilla', 'sandalwood'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one preferred note is required' })
  @ArrayMaxSize(10, { message: 'Maximum 10 preferred notes allowed' })
  preferredNotes: string[];

  @ApiProperty({
    description: 'Fragrance intensity preference',
    enum: FragranceIntensity,
    example: FragranceIntensity.MODERATE,
  })
  @IsEnum(FragranceIntensity)
  intensity: FragranceIntensity;

  @ApiProperty({
    description: 'Occasion for wearing the fragrance',
    enum: FragranceOccasion,
    example: FragranceOccasion.DAILY,
  })
  @IsEnum(FragranceOccasion)
  occasion: FragranceOccasion;

  @ApiProperty({
    description: 'Preferred season for the fragrance',
    enum: FragranceSeason,
    example: FragranceSeason.SUMMER,
  })
  @IsEnum(FragranceSeason)
  season: FragranceSeason;

  @ApiProperty({
    description: 'Budget range in USD',
    example: '50-150',
    required: false,
  })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiProperty({
    description: 'Gender preference for fragrance',
    example: 'unisex',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;
} 