import { SoilType, CropCategory } from '@/types/crop';

export type Season = 'kharif' | 'rabi' | 'zaid';

export const SEASON_LABELS: Record<Season, string> = {
  kharif: 'Kharif (Jun–Oct)',
  rabi: 'Rabi (Nov–Mar)',
  zaid: 'Zaid (Mar–May)',
};

export type IndianRegion =
  | 'northern_plains'
  | 'northwest'
  | 'central'
  | 'peninsular'
  | 'eastern'
  | 'hilly';

export const REGION_LABELS: Record<IndianRegion, string> = {
  northern_plains: 'Northern Plains',
  northwest: 'North-West / Semi-Arid',
  central: 'Central India',
  peninsular: 'Peninsular / South',
  eastern: 'Eastern India',
  hilly: 'Hilly / North-East',
};

export interface IndianState {
  label: string;
  region: IndianRegion;
}

export const INDIAN_STATES: IndianState[] = [
  { label: 'Andhra Pradesh', region: 'peninsular' },
  { label: 'Assam', region: 'hilly' },
  { label: 'Bihar', region: 'northern_plains' },
  { label: 'Chhattisgarh', region: 'central' },
  { label: 'Delhi', region: 'northern_plains' },
  { label: 'Goa', region: 'peninsular' },
  { label: 'Gujarat', region: 'northwest' },
  { label: 'Haryana', region: 'northern_plains' },
  { label: 'Himachal Pradesh', region: 'hilly' },
  { label: 'Jammu & Kashmir', region: 'hilly' },
  { label: 'Jharkhand', region: 'eastern' },
  { label: 'Karnataka', region: 'peninsular' },
  { label: 'Kerala', region: 'peninsular' },
  { label: 'Madhya Pradesh', region: 'central' },
  { label: 'Maharashtra', region: 'central' },
  { label: 'Manipur', region: 'hilly' },
  { label: 'Meghalaya', region: 'hilly' },
  { label: 'Nagaland', region: 'hilly' },
  { label: 'Odisha', region: 'eastern' },
  { label: 'Punjab', region: 'northern_plains' },
  { label: 'Rajasthan', region: 'northwest' },
  { label: 'Tamil Nadu', region: 'peninsular' },
  { label: 'Telangana', region: 'peninsular' },
  { label: 'Tripura', region: 'hilly' },
  { label: 'Uttar Pradesh', region: 'northern_plains' },
  { label: 'Uttarakhand', region: 'hilly' },
  { label: 'West Bengal', region: 'eastern' },
];

export interface CropProfile {
  name: string;
  category: CropCategory;
  imageUrl: string;
  soilTypes: SoilType[];
  phMin: number;
  phMax: number;
  seasons: Season[];
  regions: IndianRegion[];
  waterRequirement: 'low' | 'medium' | 'high';
  nitrogenNeed: 'low' | 'medium' | 'high';
  avgDaysToHarvest: number;
  topVarieties: string[];
  description: string;
}

export interface CropSuggestion {
  crop: CropProfile;
  score: number;
  matchReasons: string[];
  warnings: string[];
}

export const CROP_PROFILES: CropProfile[] = [
  {
    name: 'Wheat',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    soilTypes: ['loamy', 'clay', 'alluvial', 'black'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['rabi'],
    regions: ['northern_plains', 'central', 'northwest'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 120,
    topVarieties: ['HD-2967', 'PBW-343', 'HD-3086', 'WH-147'],
    description: 'Leading rabi cereal requiring cool weather and fertile soil.',
  },
  {
    name: 'Rice',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-460e32f50069?w=400',
    soilTypes: ['clay', 'alluvial', 'loamy'],
    phMin: 5.5,
    phMax: 7.0,
    seasons: ['kharif'],
    regions: ['northern_plains', 'eastern', 'peninsular', 'hilly'],
    waterRequirement: 'high',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 130,
    topVarieties: ['Basmati-370', 'Pusa-1121', 'IR-36', 'Swarna'],
    description: 'Staple kharif cereal; thrives in standing water and warm climate.',
  },
  {
    name: 'Maize',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1601593768498-71401e208782?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial', 'red'],
    phMin: 5.8,
    phMax: 7.5,
    seasons: ['kharif', 'rabi'],
    regions: ['northern_plains', 'central', 'peninsular', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 100,
    topVarieties: ['DHM-117', 'Ganga-5', 'HQPM-1', 'Vivek-9'],
    description: 'Versatile cereal; grows in kharif and rabi under well-drained soils.',
  },
  {
    name: 'Bajra',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    soilTypes: ['sandy', 'loamy', 'red'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['kharif'],
    regions: ['northwest', 'central', 'northern_plains'],
    waterRequirement: 'low',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 90,
    topVarieties: ['HHB-67', 'RHB-177', 'GHB-558', 'Pusa-23'],
    description: 'Drought-tolerant millet; thrives in arid/semi-arid sandy soils.',
  },
  {
    name: 'Jowar',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
    soilTypes: ['black', 'loamy', 'clay', 'red'],
    phMin: 6.0,
    phMax: 8.5,
    seasons: ['kharif', 'rabi'],
    regions: ['central', 'peninsular', 'northwest'],
    waterRequirement: 'low',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 110,
    topVarieties: ['CSH-14', 'CSH-16', 'CSV-15', 'Maldandi'],
    description: 'Hardy cereal for dry regions; grows well in black and red soils.',
  },
  {
    name: 'Barley',
    category: 'grain',
    imageUrl: 'https://images.unsplash.com/photo-1631898039984-fd5e42cbb48e?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial'],
    phMin: 6.5,
    phMax: 8.0,
    seasons: ['rabi'],
    regions: ['northern_plains', 'northwest'],
    waterRequirement: 'low',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 115,
    topVarieties: ['RD-2035', 'BH-393', 'DWRB-73', 'Jyoti'],
    description: 'Cool-season rabi cereal; tolerates slightly alkaline soils.',
  },
  {
    name: 'Tomato',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    soilTypes: ['loamy', 'sandy', 'red', 'alluvial'],
    phMin: 6.0,
    phMax: 7.0,
    seasons: ['rabi', 'zaid'],
    regions: ['peninsular', 'central', 'northern_plains', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 75,
    topVarieties: ['Pusa Ruby', 'Arka Vikas', 'Hybrid NS-501', 'Arka Samrat'],
    description: 'High-value vegetable; prefers well-drained fertile loamy soil.',
  },
  {
    name: 'Onion',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial', 'red'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['rabi', 'kharif'],
    regions: ['central', 'peninsular', 'northern_plains', 'northwest'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 120,
    topVarieties: ['Nasik Red', 'Pusa Ratnar', 'Bhima Shakti', 'N-53'],
    description: 'Important bulb crop; needs well-drained loamy to sandy loam soils.',
  },
  {
    name: 'Potato',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82be0630?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial'],
    phMin: 5.5,
    phMax: 6.5,
    seasons: ['rabi'],
    regions: ['northern_plains', 'hilly', 'central'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 90,
    topVarieties: ['Kufri Jyoti', 'Kufri Bahar', 'Kufri Pukhraj', 'Kufri Badshah'],
    description: 'Important rabi crop; prefers slightly acidic, well-drained sandy loam.',
  },
  {
    name: 'Brinjal',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400',
    soilTypes: ['loamy', 'red', 'alluvial', 'sandy'],
    phMin: 5.5,
    phMax: 7.0,
    seasons: ['kharif', 'rabi'],
    regions: ['peninsular', 'central', 'eastern', 'northern_plains'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 70,
    topVarieties: ['Pusa Purple Long', 'Arka Keshav', 'Pusa Hybrid-6', 'Arka Nidhi'],
    description: 'Warm-season vegetable adaptable to most well-drained soils.',
  },
  {
    name: 'Okra',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400',
    soilTypes: ['loamy', 'sandy', 'red', 'alluvial'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif', 'zaid'],
    regions: ['peninsular', 'central', 'northern_plains', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 55,
    topVarieties: ['Pusa Sawani', 'Arka Anamika', 'Parbhani Kranti', 'Punjab Padmini'],
    description: 'Warm-weather vegetable; quick harvest, widely adaptable.',
  },
  {
    name: 'Cauliflower',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    soilTypes: ['loamy', 'clay', 'alluvial'],
    phMin: 6.0,
    phMax: 7.0,
    seasons: ['rabi'],
    regions: ['northern_plains', 'hilly', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 85,
    topVarieties: ['Pusa Snowball', 'Pant Subhra', 'Arka Kanti', 'Early Kunwari'],
    description: 'Cool-season vegetable; requires fertile loamy soil.',
  },
  {
    name: 'Chana',
    category: 'pulse',
    imageUrl: 'https://images.unsplash.com/photo-1515543904738-63e8da7a9348?w=400',
    soilTypes: ['loamy', 'sandy', 'red', 'black'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['rabi'],
    regions: ['central', 'northern_plains', 'northwest'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 100,
    topVarieties: ['Pusa-256', 'JG-11', 'KAK-2', 'Vijay', 'JG-315'],
    description: 'Major rabi pulse; nitrogen-fixing legume, tolerates dry conditions.',
  },
  {
    name: 'Moong',
    category: 'pulse',
    imageUrl: 'https://images.unsplash.com/photo-1585184394826-75e3e9f5e3ec?w=400',
    soilTypes: ['sandy', 'loamy', 'alluvial', 'red'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif', 'zaid'],
    regions: ['northern_plains', 'central', 'peninsular', 'northwest'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 65,
    topVarieties: ['Pusa Vishal', 'SML-668', 'IPM-02-3', 'Samrat'],
    description: 'Short-season pulse; excellent nitrogen fixer for light soils.',
  },
  {
    name: 'Urad',
    category: 'pulse',
    imageUrl: 'https://images.unsplash.com/photo-1585184394826-75e3e9f5e3ec?w=400',
    soilTypes: ['loamy', 'sandy', 'red', 'alluvial'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif', 'zaid'],
    regions: ['central', 'peninsular', 'northern_plains'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 70,
    topVarieties: ['Pant U-31', 'T-9', 'IPU 02-43', 'KU-301'],
    description: 'Warm-season pulse; grows well in light to medium soils.',
  },
  {
    name: 'Tur/Arhar',
    category: 'pulse',
    imageUrl: 'https://images.unsplash.com/photo-1515543904738-63e8da7a9348?w=400',
    soilTypes: ['loamy', 'red', 'black', 'alluvial'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif'],
    regions: ['central', 'peninsular', 'eastern', 'northern_plains'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 160,
    topVarieties: ['ICPL-87', 'Pusa-9', 'Asha', 'Maruti', 'BDN-711'],
    description: 'Important kharif pulse; deep-rooted, tolerates light drought.',
  },
  {
    name: 'Mustard',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1594629725893-b60ee03edab4?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['rabi'],
    regions: ['northern_plains', 'northwest', 'central'],
    waterRequirement: 'low',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 110,
    topVarieties: ['Pusa Bold', 'RH-30', 'Varuna', 'RH-0749', 'NRCHB-101'],
    description: 'Key rabi oilseed; tolerates cold and slightly saline conditions.',
  },
  {
    name: 'Groundnut',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400',
    soilTypes: ['sandy', 'loamy', 'red'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif'],
    regions: ['peninsular', 'central', 'northwest', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 120,
    topVarieties: ['TG-37A', 'JL-24', 'TAG-24', 'Kaushal', 'GG-20'],
    description: 'Kharif oilseed; prefers well-drained sandy loam to red soils.',
  },
  {
    name: 'Soybean',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400',
    soilTypes: ['loamy', 'black', 'alluvial', 'clay'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['kharif'],
    regions: ['central', 'northern_plains'],
    waterRequirement: 'medium',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 100,
    topVarieties: ['JS-335', 'JS-9305', 'NRC-7', 'MACS-450'],
    description: 'High-protein kharif oilseed; thrives in well-drained black soils.',
  },
  {
    name: 'Sunflower',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400',
    soilTypes: ['loamy', 'alluvial', 'red'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['kharif', 'rabi', 'zaid'],
    regions: ['peninsular', 'central', 'northern_plains', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 95,
    topVarieties: ['KBSH-44', 'DRSF-113', 'LSFH-171'],
    description: 'All-season oilseed; very adaptable to varied soils and climates.',
  },
  {
    name: 'Sesame (Til)',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400',
    soilTypes: ['sandy', 'loamy', 'red'],
    phMin: 5.5,
    phMax: 8.0,
    seasons: ['kharif', 'zaid'],
    regions: ['central', 'peninsular', 'northwest', 'eastern'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 85,
    topVarieties: ['RT-346', 'TKG-22', 'Swetha Til', 'Gujarat Til-2'],
    description: 'Drought-tolerant kharif oilseed for light soils.',
  },
  {
    name: 'Cotton',
    category: 'oilseed',
    imageUrl: 'https://images.unsplash.com/photo-1594629725893-b60ee03edab4?w=400',
    soilTypes: ['black', 'alluvial', 'loamy', 'clay'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['kharif'],
    regions: ['central', 'northwest', 'peninsular'],
    waterRequirement: 'medium',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 170,
    topVarieties: ['Bt Cotton', 'H-777', 'F-1861', 'MCU-5'],
    description: 'Major cash crop grown in black soils of central and south India.',
  },
  {
    name: 'Chilli',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400',
    soilTypes: ['loamy', 'red', 'alluvial', 'sandy'],
    phMin: 6.0,
    phMax: 7.0,
    seasons: ['kharif', 'rabi'],
    regions: ['peninsular', 'central', 'eastern'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 90,
    topVarieties: ['Pusa Jwala', 'Kashmiri', 'Byadgi', 'Arka Lohit', 'Teja'],
    description: 'High-value spice crop for warm climates and well-drained soils.',
  },
  {
    name: 'Turmeric',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    soilTypes: ['loamy', 'red', 'alluvial'],
    phMin: 5.5,
    phMax: 7.0,
    seasons: ['kharif'],
    regions: ['peninsular', 'eastern', 'central'],
    waterRequirement: 'high',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 240,
    topVarieties: ['Lakadong', 'Erode Local', 'Prabha', 'Pratibha'],
    description: 'Long-duration kharif spice; prefers humid, well-drained loamy soil.',
  },
  {
    name: 'Ginger',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    soilTypes: ['loamy', 'red', 'laterite'],
    phMin: 5.5,
    phMax: 6.5,
    seasons: ['kharif'],
    regions: ['peninsular', 'hilly', 'eastern'],
    waterRequirement: 'high',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 240,
    topVarieties: ['Maran', 'Nadia', 'Varada', 'Suprabha'],
    description: 'Tropical spice for humid, acidic, well-drained soils.',
  },
  {
    name: 'Garlic',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial'],
    phMin: 6.0,
    phMax: 7.5,
    seasons: ['rabi'],
    regions: ['central', 'northern_plains', 'northwest'],
    waterRequirement: 'medium',
    nitrogenNeed: 'medium',
    avgDaysToHarvest: 140,
    topVarieties: ['Yamuna Safed-1', 'G-1', 'G-282', 'Godavari'],
    description: 'Rabi bulb spice; thrives in well-drained loamy to sandy soil.',
  },
  {
    name: 'Coriander',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    soilTypes: ['loamy', 'sandy', 'alluvial', 'black'],
    phMin: 6.5,
    phMax: 7.5,
    seasons: ['rabi'],
    regions: ['northwest', 'central', 'northern_plains'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 100,
    topVarieties: ['Pant Haritima', 'RCr-41', 'Gujarat Coriander-2', 'Swathi'],
    description: 'Short rabi spice crop; grows well in cool, dry, loamy soils.',
  },
  {
    name: 'Cumin (Jeera)',
    category: 'spice',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    soilTypes: ['sandy', 'loamy'],
    phMin: 7.0,
    phMax: 8.5,
    seasons: ['rabi'],
    regions: ['northwest'],
    waterRequirement: 'low',
    nitrogenNeed: 'low',
    avgDaysToHarvest: 120,
    topVarieties: ['RZ-19', 'Gujarat Cumin-4', 'RZ-209', 'GC-4'],
    description: 'Cool-season spice for dry, sandy to loamy alkaline soils of Gujarat/Rajasthan.',
  },
  {
    name: 'Sugarcane',
    category: 'horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
    soilTypes: ['loamy', 'alluvial', 'black', 'clay'],
    phMin: 6.0,
    phMax: 8.0,
    seasons: ['kharif'],
    regions: ['northern_plains', 'central', 'peninsular'],
    waterRequirement: 'high',
    nitrogenNeed: 'high',
    avgDaysToHarvest: 330,
    topVarieties: ['Co-86032', 'CoJ-64', 'Co-0238', 'CoS-767'],
    description: 'Long-duration cash crop; requires fertile, well-irrigated soil.',
  },
];

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 11 || month <= 2) return 'rabi';
  return 'zaid';
}

function scoreSoilTypeMatch(cropSoilTypes: SoilType[], userSoilType: SoilType | null): { score: number; reason: string | null; warning: string | null } {
  if (!userSoilType) return { score: 10, reason: null, warning: null };
  if (cropSoilTypes.includes(userSoilType)) {
    return { score: 30, reason: `Grows well in ${userSoilType} soil`, warning: null };
  }
  // Partial compatibility
  const partialMap: Record<SoilType, SoilType[]> = {
    loamy: ['alluvial', 'silt', 'clay', 'sandy'],
    alluvial: ['loamy', 'silt', 'clay'],
    clay: ['black', 'loamy', 'alluvial'],
    black: ['clay', 'loamy'],
    sandy: ['loamy', 'red'],
    red: ['loamy', 'sandy', 'laterite'],
    silt: ['loamy', 'alluvial'],
    laterite: ['red', 'loamy'],
  };
  const partials = partialMap[userSoilType] ?? [];
  if (cropSoilTypes.some(t => partials.includes(t))) {
    return { score: 15, reason: null, warning: `Soil type (${userSoilType}) is marginally compatible` };
  }
  return { score: 0, reason: null, warning: `Not ideal for ${userSoilType} soil` };
}

function scorePhMatch(phMin: number, phMax: number, userPh: string): { score: number; reason: string | null; warning: string | null } {
  const ph = parseFloat(userPh);
  if (isNaN(ph)) return { score: 10, reason: null, warning: null };
  if (ph >= phMin && ph <= phMax) {
    return { score: 25, reason: `Soil pH ${ph} is ideal (${phMin}–${phMax})`, warning: null };
  }
  const diff = ph < phMin ? phMin - ph : ph - phMax;
  if (diff <= 0.5) return { score: 12, reason: null, warning: `pH ${ph} is slightly outside ideal range (${phMin}–${phMax})` };
  if (diff <= 1.0) return { score: 5, reason: null, warning: `pH ${ph} is outside ideal range (${phMin}–${phMax})` };
  return { score: 0, reason: null, warning: `pH ${ph} is incompatible (ideal ${phMin}–${phMax})` };
}

function scoreRegionMatch(cropRegions: IndianRegion[], userRegion: IndianRegion | null): { score: number; reason: string | null } {
  if (!userRegion) return { score: 10, reason: null };
  if (cropRegions.includes(userRegion)) {
    return { score: 20, reason: `Well-suited to your region (${REGION_LABELS[userRegion]})`, };
  }
  return { score: 5, reason: null };
}

function scoreWaterEcMatch(waterRequirement: 'low' | 'medium' | 'high', waterEc: string): { score: number; reason: string | null; warning: string | null } {
  const ec = parseFloat(waterEc);
  if (isNaN(ec)) return { score: 8, reason: null, warning: null };
  // High EC = saline water → penalise crops needing good water
  if (ec < 1.0) {
    // Good water quality
    const score = waterRequirement === 'high' ? 15 : waterRequirement === 'medium' ? 12 : 10;
    return { score, reason: 'Good water quality', warning: null };
  }
  if (ec < 2.0) {
    if (waterRequirement === 'high') return { score: 5, reason: null, warning: 'Marginal water quality for this water-intensive crop' };
    return { score: 10, reason: null, warning: null };
  }
  // EC >= 2 (saline)
  if (waterRequirement === 'high') return { score: 0, reason: null, warning: 'Saline water not suitable for this crop' };
  if (waterRequirement === 'medium') return { score: 4, reason: null, warning: 'Water salinity may affect yield' };
  return { score: 8, reason: 'Crop tolerates saline conditions', warning: null };
}

function scoreNitrogenMatch(nitrogenNeed: 'low' | 'medium' | 'high', nitrogen: string): { score: number; reason: string | null } {
  const n = parseFloat(nitrogen);
  if (isNaN(n)) return { score: 5, reason: null };
  const isHighN = n > 280;
  const isLowN = n < 140;
  if (nitrogenNeed === 'high' && isHighN) return { score: 10, reason: 'High soil nitrogen suits this crop', };
  if (nitrogenNeed === 'low' && isLowN) return { score: 10, reason: null };
  if (nitrogenNeed === 'low' && isHighN) return { score: 8, reason: 'Legume can fix own nitrogen', };
  return { score: 5, reason: null };
}

export function getCropSuggestions(params: {
  season: Season;
  soilType: SoilType | null;
  ph: string;
  waterEc: string;
  nitrogen: string;
  region: IndianRegion | null;
}): CropSuggestion[] {
  const { season, soilType, ph, waterEc, nitrogen, region } = params;

  const results: CropSuggestion[] = [];

  for (const crop of CROP_PROFILES) {
    // Season filter: only suggest crops that can grow in this season
    if (!crop.seasons.includes(season)) continue;

    const matchReasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    const soilResult = scoreSoilTypeMatch(crop.soilTypes, soilType);
    score += soilResult.score;
    if (soilResult.reason) matchReasons.push(soilResult.reason);
    if (soilResult.warning) warnings.push(soilResult.warning);

    const phResult = scorePhMatch(crop.phMin, crop.phMax, ph);
    score += phResult.score;
    if (phResult.reason) matchReasons.push(phResult.reason);
    if (phResult.warning) warnings.push(phResult.warning);

    const regionResult = scoreRegionMatch(crop.regions, region);
    score += regionResult.score;
    if (regionResult.reason) matchReasons.push(regionResult.reason);

    const waterResult = scoreWaterEcMatch(crop.waterRequirement, waterEc);
    score += waterResult.score;
    if (waterResult.reason) matchReasons.push(waterResult.reason);
    if (waterResult.warning) warnings.push(waterResult.warning);

    const nResult = scoreNitrogenMatch(crop.nitrogenNeed, nitrogen);
    score += nResult.score;
    if (nResult.reason) matchReasons.push(nResult.reason);

    // Normalise score to 0–100 (max raw score = 100)
    const normalised = Math.min(100, Math.round(score));

    results.push({ crop, score: normalised, matchReasons, warnings });
  }

  return results.sort((a, b) => b.score - a.score);
}
