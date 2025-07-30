export interface PhoneMetadata {
  make: string;
  model: string;
  color: string;
  year?: string;
  confidence: number;
}

export interface DamageSummary {
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  estimatedRepairTime: string;
}

export interface CostEstimate {
  repairCost: {
    min: number;
    max: number;
    currency: string;
  };
  replacementCost: {
    amount: number;
    currency: string;
  };
  confidence: number;
}

export interface AssessmentResult {
  phoneMetadata: PhoneMetadata;
  damageSummary: DamageSummary;
  costEstimate: CostEstimate;
  processingTime: number;
  timestamp: string;
}

export interface UploadResponse {
  success: boolean;
  result?: AssessmentResult;
  error?: string;
} 