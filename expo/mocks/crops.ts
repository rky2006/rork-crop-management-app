import { CropCategory } from '@/types/crop';

export interface CropTemplate {
  name: string;
  category: CropCategory;
  varieties: string[];
  imageUrl: string;
  avgDaysToHarvest: number;
}

export const CROP_TEMPLATES: CropTemplate[] = [
  { name: 'Wheat', category: 'grain', varieties: ['HD-2967', 'PBW-343', 'Lok-1', 'GW-322', 'WH-147', 'HD-3086', 'DBW-17', 'PBW-550', 'Raj-3765', 'UP-2338'], imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', avgDaysToHarvest: 120 },
  { name: 'Rice', category: 'grain', varieties: ['Basmati-370', 'Pusa-1121', 'IR-36', 'Swarna', 'Samba Mahsuri', 'MTU-7029', 'Pusa-44', 'HKR-47', 'PR-126', 'Jaya'], imageUrl: 'https://images.unsplash.com/photo-1536304993881-460e32f50069?w=400', avgDaysToHarvest: 130 },
  { name: 'Maize', category: 'grain', varieties: ['DHM-117', 'Ganga-5', 'Deccan-103', 'HQPM-1', 'Vivek-9', 'Pusa Composite-3', 'Shaktiman-1'], imageUrl: 'https://images.unsplash.com/photo-1601593768498-71401e208782?w=400', avgDaysToHarvest: 100 },
  { name: 'Bajra', category: 'grain', varieties: ['HHB-67', 'ICTP-8203', 'Pusa-23', 'RHB-177', 'GHB-558', 'Pusa-322'], imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', avgDaysToHarvest: 90 },
  { name: 'Jowar', category: 'grain', varieties: ['CSH-14', 'SPV-462', 'Maldandi', 'CSV-15', 'CSH-16', 'PVK-801'], imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400', avgDaysToHarvest: 110 },
  { name: 'Barley', category: 'grain', varieties: ['RD-2035', 'BH-393', 'Jyoti', 'DWRB-73', 'RD-2552'], imageUrl: 'https://images.unsplash.com/photo-1631898039984-fd5e42cbb48e?w=400', avgDaysToHarvest: 115 },
  { name: 'Ragi', category: 'grain', varieties: ['GPU-28', 'GPU-67', 'MR-1', 'VL-149', 'KMR-204'], imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', avgDaysToHarvest: 110 },
  { name: 'Tomato', category: 'horticulture', varieties: ['Pusa Ruby', 'Arka Vikas', 'Hybrid NS-501', 'Arka Rakshak', 'Pusa Rohini', 'Arka Samrat', 'TO-1057'], imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', avgDaysToHarvest: 75 },
  { name: 'Onion', category: 'horticulture', varieties: ['Nasik Red', 'Pusa Ratnar', 'Agrifound Light', 'Arka Kalyan', 'Bhima Shakti', 'N-53', 'Pusa Ridhi'], imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400', avgDaysToHarvest: 120 },
  { name: 'Potato', category: 'horticulture', varieties: ['Kufri Jyoti', 'Kufri Bahar', 'Kufri Pukhraj', 'Kufri Chandramukhi', 'Kufri Sindhuri', 'Kufri Badshah'], imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82ber630?w=400', avgDaysToHarvest: 90 },
  { name: 'Brinjal', category: 'horticulture', varieties: ['Pusa Purple Long', 'Arka Keshav', 'Pusa Hybrid-6', 'Arka Nidhi', 'Punjab Sadabahar'], imageUrl: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400', avgDaysToHarvest: 70 },
  { name: 'Mango', category: 'horticulture', varieties: ['Alphonso', 'Dasheri', 'Langra', 'Kesar', 'Totapuri', 'Chausa', 'Himsagar', 'Banganapalli'], imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', avgDaysToHarvest: 150 },
  { name: 'Cabbage', category: 'horticulture', varieties: ['Golden Acre', 'Pusa Mukta', 'Pride of India', 'Quisto'], imageUrl: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400', avgDaysToHarvest: 90 },
  { name: 'Cauliflower', category: 'horticulture', varieties: ['Pusa Snowball', 'Pant Subhra', 'Arka Kanti', 'Early Kunwari'], imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', avgDaysToHarvest: 85 },
  { name: 'Okra', category: 'horticulture', varieties: ['Pusa Sawani', 'Arka Anamika', 'Parbhani Kranti', 'Punjab Padmini'], imageUrl: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400', avgDaysToHarvest: 55 },
  { name: 'Banana', category: 'horticulture', varieties: ['Grand Naine', 'Robusta', 'Dwarf Cavendish', 'Red Banana', 'Nendran', 'Poovan'], imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', avgDaysToHarvest: 300 },
  { name: 'Sugarcane', category: 'horticulture', varieties: ['Co-86032', 'CoJ-64', 'Co-0238', 'CoS-767', 'CoLk-94184'], imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400', avgDaysToHarvest: 330 },
  { name: 'Chana', category: 'pulse', varieties: ['Pusa-256', 'JG-11', 'KAK-2', 'JAKI-9218', 'Vijay', 'Vishal', 'JG-315'], imageUrl: 'https://images.unsplash.com/photo-1515543904738-63e8da7a9348?w=400', avgDaysToHarvest: 100 },
  { name: 'Moong', category: 'pulse', varieties: ['Pusa Vishal', 'SML-668', 'IPM-02-3', 'Pusa-9531', 'Samrat'], imageUrl: 'https://images.unsplash.com/photo-1585184394826-75e3e9f5e3ec?w=400', avgDaysToHarvest: 65 },
  { name: 'Urad', category: 'pulse', varieties: ['Pant U-31', 'T-9', 'IPU 02-43', 'Shekhar-1', 'KU-301'], imageUrl: 'https://images.unsplash.com/photo-1585184394826-75e3e9f5e3ec?w=400', avgDaysToHarvest: 70 },
  { name: 'Tur/Arhar', category: 'pulse', varieties: ['ICPL-87', 'Pusa-9', 'Asha', 'Maruti', 'BDN-711'], imageUrl: 'https://images.unsplash.com/photo-1515543904738-63e8da7a9348?w=400', avgDaysToHarvest: 160 },
  { name: 'Masoor', category: 'pulse', varieties: ['Pant L-406', 'IPL-81', 'HUL-57', 'K-75'], imageUrl: 'https://images.unsplash.com/photo-1515543904738-63e8da7a9348?w=400', avgDaysToHarvest: 110 },
  { name: 'Mustard', category: 'oilseed', varieties: ['Pusa Bold', 'RH-30', 'Varuna', 'Pusa Jai Kisan', 'RH-0749', 'NRCHB-101'], imageUrl: 'https://images.unsplash.com/photo-1594629725893-b60ee03edab4?w=400', avgDaysToHarvest: 110 },
  { name: 'Groundnut', category: 'oilseed', varieties: ['TG-37A', 'JL-24', 'TAG-24', 'Kaushal', 'ICGS-76', 'GG-20'], imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400', avgDaysToHarvest: 120 },
  { name: 'Soybean', category: 'oilseed', varieties: ['JS-335', 'JS-9305', 'NRC-7', 'MACS-450', 'Pusa-16'], imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400', avgDaysToHarvest: 100 },
  { name: 'Sunflower', category: 'oilseed', varieties: ['KBSH-44', 'Morden', 'DRSF-113', 'LSFH-171'], imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400', avgDaysToHarvest: 95 },
  { name: 'Sesame (Til)', category: 'oilseed', varieties: ['RT-346', 'TKG-22', 'Swetha Til', 'Gujarat Til-2'], imageUrl: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400', avgDaysToHarvest: 85 },
  { name: 'Turmeric', category: 'spice', varieties: ['Lakadong', 'Erode Local', 'Rajapore', 'Prabha', 'Pratibha', 'Sudarshana'], imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', avgDaysToHarvest: 240 },
  { name: 'Chilli', category: 'spice', varieties: ['Pusa Jwala', 'Kashmiri', 'Byadgi', 'Arka Lohit', 'Pant C-1', 'G-4', 'Teja'], imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400', avgDaysToHarvest: 90 },
  { name: 'Ginger', category: 'spice', varieties: ['Maran', 'Nadia', 'Rio-de-Janeiro', 'Varada', 'Suprabha'], imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', avgDaysToHarvest: 240 },
  { name: 'Garlic', category: 'spice', varieties: ['Yamuna Safed-1', 'Agrifound Parvati', 'G-1', 'G-282', 'Godavari'], imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', avgDaysToHarvest: 140 },
  { name: 'Coriander', category: 'spice', varieties: ['Pant Haritima', 'RCr-41', 'Gujarat Coriander-2', 'Swathi'], imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', avgDaysToHarvest: 100 },
  { name: 'Cumin (Jeera)', category: 'spice', varieties: ['RZ-19', 'Gujarat Cumin-4', 'RZ-209', 'GC-4'], imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', avgDaysToHarvest: 120 },
  { name: 'Cotton', category: 'oilseed', varieties: ['Bt Cotton', 'H-777', 'F-1861', 'Suraj', 'MCU-5', 'LRA-5166'], imageUrl: 'https://images.unsplash.com/photo-1594629725893-b60ee03edab4?w=400', avgDaysToHarvest: 170 },
];
