export type CropCategory = 'grain' | 'horticulture' | 'pulse' | 'oilseed' | 'spice';

export type FarmingType = 'organic' | 'non-organic';

export interface SoilReport {
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicCarbon: string;
  sulphur: string;
  zinc: string;
  iron: string;
  manganese: string;
  copper: string;
  boron: string;
  soilType: SoilType;
  waterPh: string;
  waterEc: string;
  waterHardness: string;
}

export type SoilType = 'clay' | 'sandy' | 'loamy' | 'silt' | 'red' | 'black' | 'alluvial' | 'laterite';

export const SOIL_TYPE_LABELS: Record<SoilType, string> = {
  clay: 'Clay',
  sandy: 'Sandy',
  loamy: 'Loamy',
  silt: 'Silt',
  red: 'Red Soil',
  black: 'Black (Regur)',
  alluvial: 'Alluvial',
  laterite: 'Laterite',
};

export const FARMING_TYPE_LABELS: Record<FarmingType, string> = {
  organic: 'Organic',
  'non-organic': 'Non-Organic (Chemical)',
};

export type GrowthStage = 
  | 'planning'
  | 'sowing'
  | 'germination'
  | 'vegetative'
  | 'flowering'
  | 'fruiting'
  | 'ripening'
  | 'harvest'
  | 'completed';

export interface CropActivity {
  id: string;
  cropId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  cost?: number;
}

export type ActivityType = 
  | 'sowing'
  | 'watering'
  | 'fertilizing'
  | 'pesticide'
  | 'weeding'
  | 'pruning'
  | 'harvesting'
  | 'inspection'
  | 'other';

export interface Crop {
  id: string;
  name: string;
  category: CropCategory;
  variety: string;
  plotName: string;
  plotSize: string;
  sowingDate: string;
  expectedHarvestDate: string;
  currentStage: GrowthStage;
  activities: CropActivity[];
  notes: string;
  createdAt: string;
  imageUrl: string;
  farmingType: FarmingType;
  soilReport?: SoilReport;
}

export const GROWTH_STAGES: GrowthStage[] = [
  'planning',
  'sowing',
  'germination',
  'vegetative',
  'flowering',
  'fruiting',
  'ripening',
  'harvest',
  'completed',
];

export const STAGE_LABELS: Record<GrowthStage, string> = {
  planning: 'Planning',
  sowing: 'Sowing',
  germination: 'Germination',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
  ripening: 'Ripening',
  harvest: 'Harvest',
  completed: 'Completed',
};

export const STAGE_COLORS: Record<GrowthStage, string> = {
  planning: '#94A3B8',
  sowing: '#8B6914',
  germination: '#65A30D',
  vegetative: '#16A34A',
  flowering: '#E879A0',
  fruiting: '#EA580C',
  ripening: '#D97706',
  harvest: '#CA8A04',
  completed: '#059669',
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  sowing: 'Sowing',
  watering: 'Watering',
  fertilizing: 'Fertilizing',
  pesticide: 'Pesticide',
  weeding: 'Weeding',
  pruning: 'Pruning',
  harvesting: 'Harvesting',
  inspection: 'Inspection',
  other: 'Other',
};

export const CATEGORY_LABELS: Record<CropCategory, string> = {
  grain: 'Grain',
  horticulture: 'Horticulture',
  pulse: 'Pulse',
  oilseed: 'Oilseed',
  spice: 'Spice',
};

export interface DiseaseTreatment {
  method: string;
  details: string;
  applicationTiming: string;
}

export interface DiseaseDiagnosis {
  diseaseName: string;
  confidence: string;
  description: string;
  symptoms: string[];
  affectedPart: string;
  severity: 'mild' | 'moderate' | 'severe';
  organicTreatments: DiseaseTreatment[];
  chemicalTreatments: DiseaseTreatment[];
  preventionTips: string[];
}

export const SEVERITY_COLORS: Record<string, string> = {
  mild: '#65A30D',
  moderate: '#D97706',
  severe: '#DC2626',
};
