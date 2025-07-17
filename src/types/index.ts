export interface TasteItem {
  id: string;
  name: string;
  description: string;
  location: string;
  tasteStrength: number;
  image: string;
  whyItFits: string;
  category: 'food' | 'activity' | 'media';
  subcategory?: string;
}

export interface TasteSeed {
  id: string;
  text: string;
  category: string;
  confidence: number;
}

export interface TasteRelationship {
  source: string;
  target: string;
  strength: number;
  reason: string;
}

export interface CityData {
  name: string;
  code: string;
  seeds: TasteSeed[];
  recommendations: TasteItem[];
  relationships: TasteRelationship[];
}

export interface TimeSlot {
  id: string;
  name: string;
  time: string;
  item?: TasteItem;
  explanation?: string;
}

export interface WeekendEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  pairedRecommendation?: TasteItem;
}

export interface CreatorInsight {
  topCuisines: string[];
  topGenres: string[];
  styleAdjectives: string[];
  partnershipIdeas: string[];
  copyHooks: string[];
}