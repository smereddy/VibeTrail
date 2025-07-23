export interface TasteItem {
  id: string;
  name: string;
  description: string;
  location: string;
  tasteStrength: number;
  normalizedWeight: number;
  image: string;
  whyItFits: string;
  category: 'food' | 'activity' | 'media' | 'movie' | 'tv_show' | 'artist' | 'book' | 'podcast' | 'videogame' | 'destination';
  subcategory?: string;
  qlooId: string;
  seedReferences: string[];
  estimatedDuration?: number;
  businessHours?: BusinessHours;
  priceRange?: string;
  
  // New: Dynamic properties
  entityType?: QlooEntityType;
  tabName?: string;
  relevanceScore?: number;
  contextMatch?: {
    indoor: number;
    outdoor: number;
    seasonal: number;
  };
  
  // Real Qloo properties
  rating?: number;
  phone?: string;
  website?: string;
  neighborhood?: string;
  confidence?: number;
  weight?: number;
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

// API-related interfaces

export interface BusinessHours {
  open: string;
  close: string;
  days: string[];
}

// OpenAI Service Types
export interface ExtractedSeed {
  text: string;
  category: string;
  confidence: number;
  searchTerms: string[];
}

export interface ItemExplanation {
  itemId: string;
  explanation: string;
  seedReferences: string[];
}

export interface ScheduledPlan {
  timeSlots: TimeSlot[];
  travelConsiderations: string[];
  alternativeOptions: string[];
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Qloo Service Types - Enhanced for VibeTrail 2.0
export type QlooCategory = 'food' | 'things_to_do' | 'media';

// New: Qloo Entity Types - All available entity types from Qloo API
export type QlooEntityType = 
    | 'urn:entity:place'
    | 'urn:entity:artist'
    | 'urn:entity:book'
    | 'urn:entity:brand'
    | 'urn:entity:destination'
    | 'urn:entity:movie'
    | 'urn:entity:person'
    | 'urn:entity:podcast'
    | 'urn:entity:tv_show'
    | 'urn:entity:videogame';

// New: Dynamic Tab Configuration
export interface DynamicTabConfig {
    id: string;
    entityType: QlooEntityType;
    displayName: string;
    icon: string;
    tags: string[];
    priority: number;
    isActive: boolean;
    estimatedCount?: number;
}

// New: Vibe Context for Dynamic Recommendations
export interface VibeContext {
    isIndoor?: boolean;
    isOutdoor?: boolean;
    isHybrid?: boolean;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    season?: 'spring' | 'summer' | 'fall' | 'winter';
    entityRelevance?: { [entityType: string]: number };
    confidenceScore?: number;
}

// New: Enhanced Vibe Processing Results
export interface ProcessedVibe {
    originalInput: string;
    extractedSeeds: ExtractedSeed[];
    context: VibeContext;
    suggestedTabs: DynamicTabConfig[];
    processingTime: number;
    confidence: number;
}

// Note: TasteItem interface is defined above with all necessary properties

export interface QlooEntityMap {
  [seedText: string]: {
    entityId: string;
    confidence: number;
    category: QlooCategory;
  };
}

export interface QlooMetadata {
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  priceLevel?: number;
  businessHours?: BusinessHours;
  
  // New: Enhanced metadata
  tags?: string[];
  entityType?: QlooEntityType;
  coordinates?: [number, number];
  openingHours?: string;
  priceRange?: string;
  imageUrl?: string;
}

export interface QlooInsight {
  id: string;
  name: string;
  description: string;
  location: string;
  weight: number;
  category: QlooCategory;
  metadata: QlooMetadata;
  
  // New: Dynamic properties
  entityType?: QlooEntityType;
  tabName?: string;
  tags?: string[];
}

export interface NormalizedInsight extends QlooInsight {
  normalizedWeight: number;
  crossDomainScore: number;
  
  // New: Context-aware scoring
  contextScore?: number;
  seasonalRelevance?: number;
  timeRelevance?: number;
}

// New: Dynamic Recommendations Response
export interface DynamicRecommendationsResponse {
  tabs: {
    [tabName: string]: {
      config: DynamicTabConfig;
      recommendations: QlooInsight[];
      totalCount: number;
      hasMore: boolean;
    };
  };
  vibeContext: VibeContext;
  processingTime: number;
  fallbackUsed: boolean;
}

// New: Enhanced API Request Types
export interface QlooLocationInsightsRequest {
  entityType: QlooEntityType;
  city: string;
  tags?: string[];
  seeds?: ExtractedSeed[];
  limit?: number;
  context?: VibeContext;
}

export interface QlooLocationInsightsResponse {
  results: {
    entities: Array<{
      entity_id: string;
      name: string;
      properties: {
        description?: string;
        address?: string;
        phone?: string;
        website?: string;
        business_rating?: number;
        rating?: number;
        price_level?: number;
        hours?: any;
        coordinates?: [number, number];
      };
      score?: number;
    }>;
  };
  total: number;
  processingTime?: number;
}

export interface QlooSearchRequest {
  query: string;
  category?: QlooCategory;
  location?: string;
  limit?: number;
}

export interface QlooSearchResponse {
  results: QlooSearchResult[];
  total: number;
  page: number;
}

export interface QlooSearchResult {
  id: string;
  name: string;
  category: QlooCategory;
  confidence: number;
}

export interface QlooInsightsRequest {
  entity_ids: string[];
  category: QlooCategory;
  location?: string;
  limit?: number;
}

export interface QlooInsightsResponse {
  insights: QlooInsight[];
  total: number;
}

// Calendar Export Types
export interface ICSEvent {
  summary: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  uid: string;
}

// API Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  service: 'openai' | 'qloo' | 'calendar';
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}

// Retry Configuration
export interface RetryConfig {
  maxRetries: number;
  backoffMultiplier: number;
  retryableErrors: string[];
  initialDelay: number;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  operation: string;
  progress?: number;
}

export interface ErrorMessage {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  dismissible: boolean;
}

export interface RecoveryAction {
  label: string;
  action: () => void;
  type: 'primary' | 'secondary';
}

// API Configuration Types
export interface APIConfig {
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  qloo: {
    apiKey: string;
    baseUrl: string;
    timeout: number;
  };
  cities: {
    [cityCode: string]: {
      name: string;
      coordinates: [number, number];
      timezone: string;
    };
  };
}

// Graph Visualization Types
export interface TasteGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  layout: GraphLayout;
}

export interface GraphNode {
  id: string;
  type: 'seed' | 'recommendation';
  label: string;
  weight: number;
  category: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
  reason: string;
}

export interface GraphLayout {
  width: number;
  height: number;
  centerForce: number;
  linkDistance: number;
}

// Enhanced App Context Types for VibeTrail 2.0
export interface AppContextType {
  // Existing properties
  currentCity: CityData;
  setCurrentCity: (city: CityData) => void;
  selectedItems: TasteItem[];
  setSelectedItems: (items: TasteItem[]) => void;
  vibeInput: string;
  setVibeInput: (vibe: string) => void;
  dayPlan: TimeSlot[];
  setDayPlan: (plan: TimeSlot[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Enhanced properties for VibeTrail 2.0
  extractedSeeds: ExtractedSeed[];
  setExtractedSeeds: (seeds: ExtractedSeed[]) => void;
  tasteItems: TasteItem[];
  setTasteItems: (items: TasteItem[]) => void;
  apiError: string | null;
  setApiError: (error: string | null) => void;
  recommendationWeights: Map<string, number>;
  setRecommendationWeights: (weights: Map<string, number>) => void;

  // New: Dynamic system properties
  vibeContext: VibeContext;
  setVibeContext: (context: VibeContext) => void;
  activeTabs: DynamicTabConfig[];
  setActiveTabs: (tabs: DynamicTabConfig[]) => void;
  dynamicRecommendations: DynamicRecommendationsResponse | null;
  setDynamicRecommendations: (recommendations: DynamicRecommendationsResponse | null) => void;
  
  // New: Cultural ecosystem properties
  culturalEcosystem: any | null; // CulturalEcosystem type will be imported from service
  setCulturalEcosystem: (ecosystem: any | null) => void;
  isEcosystemLoading: boolean;

  // Enhanced methods
  processVibeInput: (vibe: string, city: string) => Promise<void>;
  buildDayPlan: (selectedItems: TasteItem[]) => Promise<void>;
  exportCalendar: () => Promise<void>;
  generateSurprisePlan: () => Promise<void>;
  
  // New: Dynamic system methods
  refreshRecommendations: (context?: Partial<VibeContext>) => Promise<void>;
  updateTabPriorities: (priorities: { [tabName: string]: number }) => void;
  getRecommendationsByTab: (tabName: string) => TasteItem[];
}

// New: Enhanced Service Interfaces
export interface OpenAIServiceInterface {
  extractSeeds(vibe: string): Promise<ExtractedSeed[]>;
  generateExplanations(items: QlooInsight[], seeds: ExtractedSeed[]): Promise<ItemExplanation[]>;
  scheduleDayPlan(selectedItems: TasteItem[], city: string): Promise<ScheduledPlan>;
}

export interface QlooServiceInterface {
  // Legacy methods (maintained for compatibility)
  searchEntities(seeds: ExtractedSeed[], city?: string): Promise<QlooEntityMap>;
  getInsights(entityIds: string[], category: QlooCategory, city: string): Promise<QlooInsight[]>;
  normalizeWeights(insights: QlooInsight[]): Promise<NormalizedInsight[]>;
  
  // New: Dynamic system methods
  getDynamicTabs(vibeContext: VibeContext): DynamicTabConfig[];
  getRecommendationsByEntityType(
    entityType: QlooEntityType,
    city: string,
    tags?: string[],
    seeds?: ExtractedSeed[],
    limit?: number
  ): Promise<APIResponse<QlooInsight[]>>;
  getAllRelevantRecommendations(
    city: string,
    vibeContext: VibeContext,
    seeds?: ExtractedSeed[],
    maxTabs?: number
  ): Promise<APIResponse<{ [key: string]: QlooInsight[] }>>;
}

export interface CalendarServiceInterface {
  generateICS(dayPlan: TimeSlot[], city: string): Promise<string>;
  downloadICS(icsContent: string, filename: string): void;
}

// Error Recovery and Caching Types
export interface ErrorRecovery {
  retryStrategy: RetryConfig;
  fallbackData: {
    defaultSeeds: ExtractedSeed[];
    cachedRecommendations: Map<string, TasteItem[]>;
  };
  userFeedback: {
    loadingStates: LoadingState[];
    errorMessages: ErrorMessage[];
    recoveryActions: RecoveryAction[];
  };
}

export interface CacheStrategy {
  seedCache: Map<string, ExtractedSeed[]>;
  entityCache: Map<string, QlooEntityMap>;
  recommendationCache: Map<string, TasteItem[]>;
  ttl: {
    seeds: number; // 1 hour
    entities: number; // 24 hours
    recommendations: number; // 6 hours
  };
}

// Environment Configuration Types
export interface EnvironmentConfig {
  development: {
    openaiApiKey: string;
    qlooApiKey: string;
    enableMockFallback: boolean;
    debugLogging: boolean;
  };
  production: {
    openaiApiKey: string;
    qlooApiKey: string;
    enableAnalytics: boolean;
    errorReporting: boolean;
  };
}

// New: Context Detection and Processing
export interface ContextDetectionResult {
  isIndoor: boolean;
  isOutdoor: boolean;
  isHybrid: boolean;
  confidence: number;
  indicators: string[];
  timeContext?: string;
  seasonalContext?: string;
}

export interface EntityRelevanceScoring {
  entityType: QlooEntityType;
  relevanceScore: number;
  reasoning: string[];
  boostFactors: string[];
}