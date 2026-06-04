// Static MSP (Minimum Support Price) and typical mandi price ranges for major Indian crops.
// MSP values are based on Government of India announcements (2024-25 season).
// Mandi ranges are indicative typical wholesale values (₹ per quintal unless noted).

export type PriceUnit = 'per_quintal' | 'per_kg' | 'per_tonne';

export interface CropMarketPrice {
  cropName: string;
  msp?: number; // ₹ per quintal (Government MSP if available)
  mandiMin: number; // typical mandi low (₹)
  mandiMax: number; // typical mandi high (₹)
  unit: PriceUnit;
  season?: string; // applicable season
  note?: string;
}

export interface LiveMandiPrice {
  mandiMin: number;
  mandiMax: number;
  market: string;
  district: string;
  state: string;
  unit: 'per_quintal';
  fetchedAt: string;
}

const DATA_GOV_MANDI_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const DATA_GOV_DEMO_API_KEY = '579b464db66ec23bdd000001591697ac';

const LIVE_MANDI_COMMODITY_MAP: Record<string, string> = {
  rice: 'Paddy(Dhan)(Common)',
  mustard: 'Mustard',
  'tur/arhar': 'Arhar (Tur/Red Gram)(Whole)',
  sesame: 'Sesamum(Sesame,Gingelly,Til)',
  'sesame (til)': 'Sesamum(Sesame,Gingelly,Til)',
  coriander: 'Coriander(Leaves)',
  'cumin (jeera)': 'Cummin Seed(Jeera)',
  chilli: 'Chilly Capsicum',
};

const MARKET_PRICES: CropMarketPrice[] = [
  // Grains
  { cropName: 'Wheat', msp: 2275, mandiMin: 2200, mandiMax: 2700, unit: 'per_quintal', season: 'Rabi', note: 'MSP 2024-25: ₹2,275/qtl' },
  { cropName: 'Rice', msp: 2300, mandiMin: 2000, mandiMax: 3500, unit: 'per_quintal', season: 'Kharif', note: 'Common variety. Basmati fetches ₹4,000–9,000/qtl' },
  { cropName: 'Maize', msp: 2090, mandiMin: 1800, mandiMax: 2400, unit: 'per_quintal', season: 'Kharif/Rabi' },
  { cropName: 'Bajra', msp: 2625, mandiMin: 2200, mandiMax: 3000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Jowar', msp: 3371, mandiMin: 2800, mandiMax: 4000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Barley', msp: 1735, mandiMin: 1600, mandiMax: 2200, unit: 'per_quintal', season: 'Rabi' },
  { cropName: 'Ragi', msp: 4290, mandiMin: 3500, mandiMax: 5000, unit: 'per_quintal', season: 'Kharif' },

  // Pulses
  { cropName: 'Chana', msp: 5440, mandiMin: 5000, mandiMax: 7500, unit: 'per_quintal', season: 'Rabi', note: 'Price varies by quality; bold gram fetches premium' },
  { cropName: 'Moong', msp: 8682, mandiMin: 7000, mandiMax: 10000, unit: 'per_quintal', season: 'Kharif/Zaid' },
  { cropName: 'Urad', msp: 7400, mandiMin: 6500, mandiMax: 9000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Tur/Arhar', msp: 7550, mandiMin: 6500, mandiMax: 10000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Masoor', msp: 6425, mandiMin: 5500, mandiMax: 8000, unit: 'per_quintal', season: 'Rabi' },

  // Oilseeds
  { cropName: 'Mustard', msp: 5650, mandiMin: 5200, mandiMax: 7000, unit: 'per_quintal', season: 'Rabi' },
  { cropName: 'Groundnut', msp: 6783, mandiMin: 5500, mandiMax: 8000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Soybean', msp: 4892, mandiMin: 4200, mandiMax: 5800, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Sunflower', msp: 7280, mandiMin: 6000, mandiMax: 8500, unit: 'per_quintal', season: 'Rabi/Kharif' },
  { cropName: 'Sesame (Til)', msp: 9267, mandiMin: 8000, mandiMax: 12000, unit: 'per_quintal', season: 'Kharif' },
  { cropName: 'Cotton', msp: 7121, mandiMin: 6500, mandiMax: 9000, unit: 'per_quintal', season: 'Kharif', note: 'Medium staple variety MSP 2024-25' },

  // Horticulture (per kg at mandi)
  { cropName: 'Tomato', mandiMin: 8, mandiMax: 35, unit: 'per_kg', note: 'Highly seasonal; peaks ₹60–80/kg in off-season' },
  { cropName: 'Onion', mandiMin: 10, mandiMax: 30, unit: 'per_kg', note: 'Storage onion fetches better price Mar–Jun' },
  { cropName: 'Potato', mandiMin: 8, mandiMax: 20, unit: 'per_kg', note: 'Cold-stored potato: ₹15–25/kg (Aug–Oct)' },
  { cropName: 'Brinjal', mandiMin: 10, mandiMax: 25, unit: 'per_kg' },
  { cropName: 'Okra', mandiMin: 15, mandiMax: 40, unit: 'per_kg' },
  { cropName: 'Cabbage', mandiMin: 6, mandiMax: 18, unit: 'per_kg' },
  { cropName: 'Cauliflower', mandiMin: 8, mandiMax: 20, unit: 'per_kg' },
  { cropName: 'Mango', mandiMin: 30, mandiMax: 120, unit: 'per_kg', note: 'Alphonso: ₹100–300/kg; Totapuri: ₹25–50/kg' },
  { cropName: 'Banana', mandiMin: 12, mandiMax: 25, unit: 'per_kg', note: 'Grand Naine variety: ₹15–30/kg' },
  { cropName: 'Sugarcane', msp: 340, mandiMin: 300, mandiMax: 400, unit: 'per_quintal', note: 'Fair & Remunerative Price (FRP) 2024-25' },

  // Spices (per kg)
  { cropName: 'Turmeric', mandiMin: 90, mandiMax: 200, unit: 'per_kg', note: 'Lakadong variety: ₹200–350/kg; polished finger ₹150/kg' },
  { cropName: 'Chilli', mandiMin: 80, mandiMax: 200, unit: 'per_kg', note: 'Dry red chilli (Teja/Byadgi): ₹150–250/kg' },
  { cropName: 'Ginger', mandiMin: 25, mandiMax: 80, unit: 'per_kg', note: 'Dry ginger: ₹100–200/kg; fresh ginger ₹25–80/kg' },
  { cropName: 'Garlic', mandiMin: 50, mandiMax: 200, unit: 'per_kg', note: 'Bold variety (Yamuna Safed): ₹80–250/kg' },
  { cropName: 'Coriander', mandiMin: 8000, mandiMax: 14000, unit: 'per_quintal', note: 'Dry seed' },
  { cropName: 'Cumin (Jeera)', mandiMin: 15000, mandiMax: 30000, unit: 'per_quintal', note: 'Price fluctuates widely; check e-NAM for current rate' },
];

const priceMap = new Map<string, CropMarketPrice>(
  MARKET_PRICES.map(p => [p.cropName.toLowerCase(), p])
);

function normalizeCommodity(cropName: string): string {
  const normalized = cropName.trim().toLowerCase();
  return LIVE_MANDI_COMMODITY_MAP[normalized] ?? cropName;
}

function parseNumericPrice(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value !== 'string') return null;
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getMarketPrice(cropName: string): CropMarketPrice | null {
  return priceMap.get(cropName.toLowerCase()) ?? null;
}

export function formatPriceRange(price: CropMarketPrice): string {
  const unitLabel = price.unit === 'per_quintal' ? '/qtl' : price.unit === 'per_kg' ? '/kg' : '/tonne';
  return `₹${price.mandiMin.toLocaleString('en-IN')} – ₹${price.mandiMax.toLocaleString('en-IN')}${unitLabel}`;
}

export function getDefaultYieldUnit(cropName: string): 'quintal' | 'kg' | 'tonne' | 'bag' {
  const price = getMarketPrice(cropName);
  if (!price) return 'quintal';
  return price.unit === 'per_kg' ? 'kg' : price.unit === 'per_tonne' ? 'tonne' : 'quintal';
}

export async function getLiveMandiPrice(cropName: string): Promise<LiveMandiPrice | null> {
  const staticPrice = getMarketPrice(cropName);
  if (!staticPrice || staticPrice.unit !== 'per_quintal') return null;

  try {
    const params = new URLSearchParams({
      format: 'json',
      limit: '10',
      'api-key': process.env.EXPO_PUBLIC_DATA_GOV_API_KEY ?? DATA_GOV_DEMO_API_KEY,
      'filters[commodity]': normalizeCommodity(cropName),
    });

    const response = await fetch(`${DATA_GOV_MANDI_API_URL}?${params.toString()}`);
    if (!response.ok) return null;

    const data = await response.json() as { records?: Array<Record<string, unknown>> };
    const latestRecord = data.records?.find(record =>
      parseNumericPrice(record.min_price) !== null ||
      parseNumericPrice(record.max_price) !== null ||
      parseNumericPrice(record.modal_price) !== null
    );

    if (!latestRecord) return null;

    const minPrice = parseNumericPrice(latestRecord.min_price) ?? parseNumericPrice(latestRecord.modal_price);
    const maxPrice = parseNumericPrice(latestRecord.max_price) ?? parseNumericPrice(latestRecord.modal_price);
    if (minPrice === null || maxPrice === null) return null;

    return {
      mandiMin: Math.min(minPrice, maxPrice),
      mandiMax: Math.max(minPrice, maxPrice),
      market: typeof latestRecord.market === 'string' ? latestRecord.market : 'Unknown market',
      district: typeof latestRecord.district === 'string' ? latestRecord.district : 'Unknown district',
      state: typeof latestRecord.state === 'string' ? latestRecord.state : 'Unknown state',
      unit: 'per_quintal',
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
