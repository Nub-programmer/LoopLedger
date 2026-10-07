export type CategoryType = 'ELECTRONICS' | 'FURNITURE' | 'TEXTILES' | 'TOOLS' | 'BOOKS' | 'APPLIANCES' | 'OTHER';

export type NextLifeAction = 
  | 'REPAIR' 
  | 'REUSE' 
  | 'PARTS RECOVERY' 
  | 'UPCYCLE' 
  | 'REMANUFACTURE' 
  | 'TRANSFER' 
  | 'RECYCLE';

export interface ActionRank {
  rank: string;
  action: NextLifeAction;
  score: number;
  recommendationNote: string;
  isPrimary?: boolean;
}

export interface DecisionTraceMetric {
  key: string;
  label: string;
  score: number;
  rating: 'HIGH' | 'MED' | 'LOW' | 'CRITICAL';
  blockBar: string;
  notes: string;
}

export interface CircularityEngineResult {
  circularityScore: number;
  primaryAction: NextLifeAction;
  actionRationale: string;
  rankedActions: ActionRank[];
  traceMetrics: DecisionTraceMetric[];
  wasteAvoidedKg: number;
  carbonDebtAvoidedKgCO2: number;
  estimatedResidualValueUsd: number;
  repairDifficulty: 'VERY LOW' | 'MODERATE' | 'SPECIALIZED' | 'UNECONOMICAL';
  materialsBreakdown: {
    material: string;
    percentage: number;
  }[];
  engineDecisionSummary: string;
}

export interface LifecycleEvent {
  id: string;
  eventType: 'REGISTERED' | 'CONDITION ASSESSED' | 'REPAIR' | 'TRANSFER' | 'PARTS HARVESTED' | 'UPCYCLED' | 'RECYCLED';
  title: string;
  description: string;
  timestamp: string;
  operatorOrOwner: string;
  location?: string;
  verified: boolean;
  notes?: string;
}

export interface ProductPassport {
  id: string;
  name: string;
  category: CategoryType;
  brand?: string;
  modelNumber?: string;
  manufactureYear?: number;
  originalPriceUsd?: number;
  currentCondition: 'PRISTINE' | 'LIGHT WEAR' | 'MINOR FAULT' | 'HEAVILY DAMAGED' | 'PARTS ONLY';
  status: 'ACTIVE / IN USE' | 'IN REPAIR' | 'AVAILABLE ON EXCHANGE' | 'TRANSFERRED' | 'PARTS HARVESTED' | 'ARCHIVED';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  ownerName: string;
  ownerLocation: string;
  analysis: CircularityEngineResult;
  events: LifecycleEvent[];
  qrPayloadUrl?: string;
  serialNumber?: string;
  repairGuideUrl?: string;
}

export interface ExchangeListing {
  id: string;
  passportId: string;
  title: string;
  category: CategoryType;
  condition: string;
  location: string;
  priceType: 'FREE / DONATION' | 'EXCHANGE / TRADE' | 'COMMUNITY PRICE';
  priceUsd?: number;
  imageUrl: string;
  description: string;
  contactEmail?: string;
  status: 'AVAILABLE' | 'PENDING' | 'CLAIMED';
  listedDate: string;
  claimedBy?: string;
}

export interface ImpactMetrics {
  totalItemsDiverted: number;
  totalWasteAvoidedKg: number;
  totalLifecycleExtensions: number;
  totalEmbodiedCarbonSavedKgCO2: number;
  totalEconomicValueRetainedUsd: number;
  repairedCount: number;
  transferredCount: number;
  partsHarvestedCount: number;
  recycledCount: number;
}
