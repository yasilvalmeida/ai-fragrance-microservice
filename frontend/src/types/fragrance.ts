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

export interface FragranceRequest {
  preferences: string;
  preferredNotes: string[];
  intensity: FragranceIntensity;
  occasion: FragranceOccasion;
  season: FragranceSeason;
  budget?: string;
  gender?: string;
}

export interface FragranceRecommendation {
  name: string;
  brand: string;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  matchReason: string;
  priceRange: string;
  longevity: string;
  projection: string;
}

export interface FragranceResponse {
  recommendations: FragranceRecommendation[];
  analysis: string;
  tips: string;
  timestamp: string;
}

export interface CheckoutItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  size: string;
  quantity?: number;
}
