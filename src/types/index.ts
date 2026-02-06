// API Request/Response types
export interface CalculationRequest {
  activityData: {
    [key: string]: number | string;
  };
  unit: string;
  standard?: 'GHG_PROTOCOL' | 'ISO_14064' | 'IPCC_2023';
}

export interface EmissionFactorResponse {
  activityType: string;
  value: number;
  unit: string;
  standard: string;
  dataSource: string;
  updatedAt: string;
}

export interface CalculationResponse {
  activityType: string;
  emissionsCO2e: number;
  unit: string; // kg CO2e
  standard: string;
  breakDownByComponent?: {
    [component: string]: number;
  };
  offsetRecommendations?: string[];
  timestamp: string;
}

export interface BatchCalculationRequest {
  calculations: CalculationRequest[];
}

export interface BatchCalculationResponse {
  results: CalculationResponse[];
  totalEmissions: number;
  processingTimeMs: number;
}

export interface AuthRequest {
  apiKey: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: string;
}
