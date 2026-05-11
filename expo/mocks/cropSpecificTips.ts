import { GrowthStage } from '@/types/crop';

export interface CropSpecificTip {
  id: string;
  cropName: string;
  stage: GrowthStage;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const CROP_TIPS: CropSpecificTip[] = [
  // ===== WHEAT =====
  { id: 'wh-p1', cropName: 'Wheat', stage: 'planning', title: 'Best Sowing Window', description: 'Sow wheat between 1st-25th November for irrigated conditions. Late sowing (after Dec 15) reduces yield by 25-30%. Use HD-3086 or PBW-550 for late sowing.', priority: 'high' },
  { id: 'wh-p2', cropName: 'Wheat', stage: 'planning', title: 'Seed Rate for Wheat', description: 'Use 40-45 kg/acre for timely sowing, 50-55 kg/acre for late sowing. Treat seeds with Carboxin+Thiram (Vitavax Power) at 2.5g/kg.', priority: 'high' },
  { id: 'wh-s1', cropName: 'Wheat', stage: 'sowing', title: 'Wheat Basal Dose', description: 'Apply DAP 50kg + MOP 20kg + Zinc Sulphate 10kg per acre at sowing. Use seed-cum-fertilizer drill for uniform placement.', priority: 'high' },
  { id: 'wh-s2', cropName: 'Wheat', stage: 'sowing', title: 'Row Spacing for Wheat', description: 'Keep 20cm row spacing for normal sowing, 15cm for late sowing to compensate reduced tillering. Seed depth should be 4-5cm.', priority: 'high' },
  { id: 'wh-g1', cropName: 'Wheat', stage: 'germination', title: 'First Irrigation (Crown Root)', description: 'Give first irrigation at 21-25 DAS (crown root initiation stage). This is the most critical irrigation for wheat — do not delay.', priority: 'high' },
  { id: 'wh-g2', cropName: 'Wheat', stage: 'germination', title: 'Weed Control in Wheat', description: 'Apply Sulfosulfuron (Leader) 13g/acre at 25-30 DAS for grassy weeds. For broad-leaf weeds, use 2,4-D (Weedmar) at 250ml/acre at 30-35 DAS.', priority: 'high' },
  { id: 'wh-v1', cropName: 'Wheat', stage: 'vegetative', title: 'First Urea Top Dressing', description: 'Apply 35-40 kg Urea/acre with first irrigation at tillering stage. Place near roots, do not broadcast on wet leaves.', priority: 'high' },
  { id: 'wh-v2', cropName: 'Wheat', stage: 'vegetative', title: 'Wheat Aphid Watch', description: 'Check for wheat aphids on leaves and ear heads in January-February. If 10-15 aphids per ear, spray Imidacloprid 17.8SL at 50ml/acre.', priority: 'high' },
  { id: 'wh-v3', cropName: 'Wheat', stage: 'vegetative', title: 'Second Irrigation (Tillering)', description: 'Give second irrigation at 40-45 DAS during active tillering. Wheat needs 4-6 irrigations total depending on soil type.', priority: 'medium' },
  { id: 'wh-f1', cropName: 'Wheat', stage: 'flowering', title: 'Booting Stage Irrigation', description: 'Irrigation at booting/heading stage (60-65 DAS) is critical. Water stress at this stage causes shriveled grains and 30-40% yield loss.', priority: 'high' },
  { id: 'wh-f2', cropName: 'Wheat', stage: 'flowering', title: 'Yellow Rust Management', description: 'If yellow rust spots appear on leaves, immediately spray Propiconazole (Tilt) 200ml/acre. Repeat after 15 days if needed. Do not ignore rust.', priority: 'high' },
  { id: 'wh-f3', cropName: 'Wheat', stage: 'flowering', title: 'Second Urea Dose', description: 'Apply remaining 35kg Urea/acre at booting/ear emergence for better grain filling. This is the last nitrogen application.', priority: 'high' },
  { id: 'wh-fr1', cropName: 'Wheat', stage: 'fruiting', title: 'Grain Filling Irrigation', description: 'Give irrigation at milking/dough stage (85-90 DAS). Hot winds (loo) during grain filling severely reduce grain weight.', priority: 'high' },
  { id: 'wh-fr2', cropName: 'Wheat', stage: 'fruiting', title: 'Karnal Bunt Prevention', description: 'If weather is cloudy and humid during grain filling, spray Propiconazole (Tilt) to prevent Karnal Bunt which reduces grain quality.', priority: 'medium' },
  { id: 'wh-r1', cropName: 'Wheat', stage: 'ripening', title: 'Stop Irrigation', description: 'Give last irrigation at dough stage (100-105 DAS). Stop watering after that for proper grain ripening and easy combine harvesting.', priority: 'high' },
  { id: 'wh-r2', cropName: 'Wheat', stage: 'ripening', title: 'Check Grain Moisture', description: 'Wheat is ready when grain moisture drops to 14-16%. Grain should be hard and golden. Bite test: grain should crack, not dent.', priority: 'high' },
  { id: 'wh-h1', cropName: 'Wheat', stage: 'harvest', title: 'Combine Harvesting Timing', description: 'Harvest wheat when grain moisture is 12-14%. Early morning harvesting gives less grain shattering. Adjust combine speed to 3-4 km/hr.', priority: 'high' },
  { id: 'wh-h2', cropName: 'Wheat', stage: 'harvest', title: 'Wheat Storage Tips', description: 'Dry wheat to 10-12% moisture before storage. Store in metal bins with Aluminium Phosphide (2 tablets per tonne). Sell at MSP through e-NAM.', priority: 'high' },

  // ===== RICE =====
  { id: 'ri-p1', cropName: 'Rice', stage: 'planning', title: 'Nursery Preparation', description: 'Prepare wet nursery beds 25-30 days before transplanting. Use 8-10 kg seed per acre. Treat seeds with Carbendazim (Bavistin) 2g/kg for blast prevention.', priority: 'high' },
  { id: 'ri-p2', cropName: 'Rice', stage: 'planning', title: 'Puddling & Field Prep', description: 'Puddle field 2-3 times with standing water. Level field properly for uniform water distribution. Apply 4-5 tonnes FYM/acre before puddling.', priority: 'high' },
  { id: 'ri-s1', cropName: 'Rice', stage: 'sowing', title: 'Transplanting Tips', description: 'Transplant 25-30 day old seedlings, 2-3 seedlings per hill at 20x15cm spacing. Transplant in 2-3cm standing water. Complete by July 15.', priority: 'high' },
  { id: 'ri-s2', cropName: 'Rice', stage: 'sowing', title: 'Rice Basal Fertilizer', description: 'Apply DAP 55kg + MOP 25kg + Zinc Sulphate 10kg per acre before last puddling. Mix thoroughly with soil.', priority: 'high' },
  { id: 'ri-g1', cropName: 'Rice', stage: 'germination', title: 'Water Management After Transplant', description: 'Maintain 2-3cm water for 7-10 days after transplanting for establishment. Do not flood deeply — it kills lower tillers.', priority: 'high' },
  { id: 'ri-g2', cropName: 'Rice', stage: 'germination', title: 'Gap Filling', description: 'Fill gaps within 7-10 days of transplanting using extra seedlings from nursery. Gaps reduce yield and increase weed growth.', priority: 'medium' },
  { id: 'ri-v1', cropName: 'Rice', stage: 'vegetative', title: 'First Urea Application', description: 'Apply 35kg Urea/acre at 21 days after transplanting (DAT). Apply in standing water and do not drain for 2-3 days to prevent nitrogen loss.', priority: 'high' },
  { id: 'ri-v2', cropName: 'Rice', stage: 'vegetative', title: 'Brown Plant Hopper (BPH)', description: 'Check for BPH at base of tillers. If 5-10 hoppers per hill, spray Buprofezin or Pymetrozine. Avoid Imidacloprid — it causes BPH resurgence.', priority: 'high' },
  { id: 'ri-v3', cropName: 'Rice', stage: 'vegetative', title: 'Rice Weed Control', description: 'Apply Bispyribac-sodium (Nominee Gold) 100ml/acre at 15-20 DAT for all types of weeds. Maintain 2-3cm water during application.', priority: 'high' },
  { id: 'ri-f1', cropName: 'Rice', stage: 'flowering', title: 'Panicle Initiation Irrigation', description: 'Maintain 5cm standing water during panicle initiation and flowering. Water stress at this stage causes blank/unfilled grains.', priority: 'high' },
  { id: 'ri-f2', cropName: 'Rice', stage: 'flowering', title: 'Rice Blast Management', description: 'If blast spots appear on leaves or neck, spray Tricyclazole (Beam) 120g/acre or Isoprothiolane (Fujione) 300ml/acre immediately.', priority: 'high' },
  { id: 'ri-f3', cropName: 'Rice', stage: 'flowering', title: 'Second Urea Top Dress', description: 'Apply 25-30kg Urea/acre at panicle initiation (45-50 DAT). This is crucial for grain number and weight.', priority: 'high' },
  { id: 'ri-fr1', cropName: 'Rice', stage: 'fruiting', title: 'Grain Filling Water', description: 'Maintain intermittent irrigation (wet-dry cycles) during grain filling. Do not let field crack completely.', priority: 'high' },
  { id: 'ri-fr2', cropName: 'Rice', stage: 'fruiting', title: 'Stem Borer & Leaf Folder', description: 'If white ear heads exceed 5%, spray Cartap Hydrochloride 800g/acre. For leaf folders, use Chlorantraniliprole (Coragen) 60ml/acre.', priority: 'high' },
  { id: 'ri-r1', cropName: 'Rice', stage: 'ripening', title: 'Drain Field Before Harvest', description: 'Drain water 15-20 days before harvest for uniform ripening and easy machine harvesting. Field should be dry at harvest.', priority: 'high' },
  { id: 'ri-r2', cropName: 'Rice', stage: 'ripening', title: 'Rice Harvest Timing', description: 'Harvest when 80% grains turn golden and moisture is 20-22%. Delayed harvest causes grain shattering and reduces quality.', priority: 'high' },
  { id: 'ri-h1', cropName: 'Rice', stage: 'harvest', title: 'Post-Harvest Drying', description: 'Dry paddy to 12-14% moisture on clean floor. Turn 3-4 times daily. Do not dry on road — contamination reduces price.', priority: 'high' },
  { id: 'ri-h2', cropName: 'Rice', stage: 'harvest', title: 'Straw Management', description: 'Do not burn rice straw! Use Happy Seeder for direct wheat sowing, or make silage/compost. Burning destroys soil health and causes pollution.', priority: 'high' },

  // ===== TOMATO =====
  { id: 'to-p1', cropName: 'Tomato', stage: 'planning', title: 'Nursery for Tomato', description: 'Raise seedlings in pro-trays or raised nursery beds. Use 100-150g seed/acre. Treat seeds with Trichoderma 4g/kg + Imidacloprid for virus protection.', priority: 'high' },
  { id: 'to-p2', cropName: 'Tomato', stage: 'planning', title: 'Field Preparation', description: 'Prepare raised beds or ridges, 60cm wide with 45cm furrows. Apply 8-10 tonnes FYM/acre + Trichoderma 2kg/acre in soil. Install drip irrigation.', priority: 'high' },
  { id: 'to-s1', cropName: 'Tomato', stage: 'sowing', title: 'Transplanting Tomato', description: 'Transplant 25-30 day old seedlings at 60x45cm spacing on raised beds. Transplant in evening, water immediately. Apply Carbofuran 3G in planting holes.', priority: 'high' },
  { id: 'to-s2', cropName: 'Tomato', stage: 'sowing', title: 'Tomato Basal Dose', description: 'Apply DAP 65kg + MOP 35kg + Borax 4kg + Zinc Sulphate 10kg per acre at transplanting. Fertigation via drip is most efficient.', priority: 'high' },
  { id: 'to-g1', cropName: 'Tomato', stage: 'germination', title: 'Early Establishment Care', description: 'Water daily for first week, then every 2-3 days via drip. Apply mulch (black polythene or straw) to conserve moisture and suppress weeds.', priority: 'high' },
  { id: 'to-g2', cropName: 'Tomato', stage: 'germination', title: 'Cutworm & Damping Off', description: 'If seedlings are cut at base, apply Chlorpyrifos drench around plants. For damping off, drench with Metalaxyl+Mancozeb solution.', priority: 'medium' },
  { id: 'to-v1', cropName: 'Tomato', stage: 'vegetative', title: 'Staking Tomato Plants', description: 'Stake plants at 25-30 days using bamboo sticks or trellis wire. Tie with soft cloth/jute. Staking improves air circulation and fruit quality.', priority: 'high' },
  { id: 'to-v2', cropName: 'Tomato', stage: 'vegetative', title: 'Pruning Side Shoots', description: 'Remove suckers/side shoots growing between main stem and leaf branches up to first flower cluster. This directs energy to fruit production.', priority: 'high' },
  { id: 'to-v3', cropName: 'Tomato', stage: 'vegetative', title: 'Tomato Leaf Curl Virus', description: 'Install yellow sticky traps for whitefly monitoring. If leaf curling starts, spray Thiamethoxam 5g/10L + Neem oil 5ml/L. Remove severely infected plants.', priority: 'high' },
  { id: 'to-f1', cropName: 'Tomato', stage: 'flowering', title: 'Flower Drop Prevention', description: 'Spray Planofix (NAA 4.5%) at 1ml/4.5L water when flowering starts. Repeat every 15 days. Avoid high nitrogen — it causes vegetative growth at cost of flowers.', priority: 'high' },
  { id: 'to-f2', cropName: 'Tomato', stage: 'flowering', title: 'Boron & Calcium Spray', description: 'Spray Borax 0.2% + Calcium Chloride 0.5% at flowering for better fruit set and to prevent blossom end rot. Repeat after 15 days.', priority: 'high' },
  { id: 'to-fr1', cropName: 'Tomato', stage: 'fruiting', title: 'Tomato Fruit Borer', description: 'Install pheromone traps (5/acre) for Helicoverpa. Spray Emamectin Benzoate 5SG at 80g/acre at fruit setting. Use Bt spray as organic alternative.', priority: 'high' },
  { id: 'to-fr2', cropName: 'Tomato', stage: 'fruiting', title: 'Regular Harvesting', description: 'Pick tomatoes at breaker stage (pink color) for distant market, at red-ripe for local market. Harvest every 4-5 days for continuous production.', priority: 'high' },
  { id: 'to-fr3', cropName: 'Tomato', stage: 'fruiting', title: 'Fruit Cracking Prevention', description: 'Maintain uniform drip irrigation. Irregular watering causes fruit cracking. Mulching helps maintain soil moisture consistency.', priority: 'medium' },
  { id: 'to-r1', cropName: 'Tomato', stage: 'ripening', title: 'Late Blight Management', description: 'In cool humid weather, spray Mancozeb+Metalaxyl (Ridomil Gold) 500g/acre preventively every 10 days. Late blight can destroy entire crop in days.', priority: 'high' },
  { id: 'to-h1', cropName: 'Tomato', stage: 'harvest', title: 'Post-Harvest Handling', description: 'Handle carefully — tomatoes bruise easily. Pack in ventilated crates, not gunny bags. Store at 12-15°C. Sell directly to mandi or processors for better price.', priority: 'high' },

  // ===== ONION =====
  { id: 'on-p1', cropName: 'Onion', stage: 'planning', title: 'Onion Nursery', description: 'Raise nursery 6-8 weeks before transplanting. Use 4-5 kg seed/acre. Treat with Thiram 3g/kg. Kharif onion: June-July nursery, Rabi: October nursery.', priority: 'high' },
  { id: 'on-s1', cropName: 'Onion', stage: 'sowing', title: 'Onion Transplanting', description: 'Transplant 45-50 day old seedlings at 15x10cm on flat beds or ridges. Trim 1/3 of leaf tops before transplanting. Plant 2-3cm deep.', priority: 'high' },
  { id: 'on-s2', cropName: 'Onion', stage: 'sowing', title: 'Onion Fertilizer', description: 'Apply DAP 50kg + MOP 35kg + Sulphur 10kg per acre as basal. Onion is a heavy sulphur feeder — sulphur improves pungency and storage life.', priority: 'high' },
  { id: 'on-v1', cropName: 'Onion', stage: 'vegetative', title: 'Onion Thrips Management', description: 'Onion thrips is the #1 pest. Spray Fipronil 5SC at 400ml/acre or Spinetoram 120ml/acre when 10+ thrips per plant. Add sticker to spray.', priority: 'high' },
  { id: 'on-v2', cropName: 'Onion', stage: 'vegetative', title: 'Urea Top Dressing', description: 'Apply 35kg Urea/acre at 30 DAT and again at 45 DAT. Stop nitrogen after 60 DAT — late nitrogen delays bulb maturity and reduces storage.', priority: 'high' },
  { id: 'on-f1', cropName: 'Onion', stage: 'flowering', title: 'Bulb Development Irrigation', description: 'Maintain regular irrigation every 7-10 days during bulb development. Irregular watering causes splitting of bulbs.', priority: 'high' },
  { id: 'on-fr1', cropName: 'Onion', stage: 'fruiting', title: 'Purple Blotch Disease', description: 'If purple/brown spots appear on leaves, spray Mancozeb 600g/acre + Carbendazim 200g/acre. Repeat every 10-12 days in humid weather.', priority: 'high' },
  { id: 'on-r1', cropName: 'Onion', stage: 'ripening', title: 'Neck Fall & Curing', description: 'When 50-75% plants show neck fall (tops bending), stop irrigation. Wait 10-15 days, then harvest. This ensures proper curing.', priority: 'high' },
  { id: 'on-h1', cropName: 'Onion', stage: 'harvest', title: 'Onion Storage', description: 'Cure onions in shade for 10-15 days after harvest. Store in well-ventilated structures with bamboo racks. Remove thick-necked and damaged bulbs.', priority: 'high' },

  // ===== POTATO =====
  { id: 'po-p1', cropName: 'Potato', stage: 'planning', title: 'Seed Potato Selection', description: 'Use certified seed potatoes (25-40g each). Keep in diffused light storage for proper sprouting. Treat with Mancozeb 0.25% dip for 20 minutes before planting.', priority: 'high' },
  { id: 'po-s1', cropName: 'Potato', stage: 'sowing', title: 'Potato Planting', description: 'Plant on ridges at 60x20cm spacing, 5-7cm deep with eyes facing up. Apply Carbofuran 3G in furrows for soil insect control. Sow in October-November.', priority: 'high' },
  { id: 'po-s2', cropName: 'Potato', stage: 'sowing', title: 'Potato Fertilizer', description: 'Apply 75kg DAP + 50kg MOP + 25kg Zinc Sulphate per acre as basal. Potato needs high potash for tuber development and quality.', priority: 'high' },
  { id: 'po-v1', cropName: 'Potato', stage: 'vegetative', title: 'Earthing Up Potato', description: 'Do first earthing up at 25-30 DAS and second at 45 DAS. Cover emerging tubers with soil to prevent greening. Green potatoes are toxic.', priority: 'high' },
  { id: 'po-v2', cropName: 'Potato', stage: 'vegetative', title: 'Late Blight Alert', description: 'Spray Mancozeb 600g/acre preventively when night temperature drops below 15°C with humidity. If blight appears, use Cymoxanil+Mancozeb immediately.', priority: 'high' },
  { id: 'po-f1', cropName: 'Potato', stage: 'flowering', title: 'Tuber Bulking Irrigation', description: 'Give irrigation every 8-10 days during tuber bulking. This is the most water-sensitive period. Uneven irrigation causes hollow heart and cracking.', priority: 'high' },
  { id: 'po-r1', cropName: 'Potato', stage: 'ripening', title: 'Haulm Cutting', description: 'Cut potato vines (haulms) 10-12 days before harvest when skin of tubers does not peel on rubbing. This helps skin hardening for storage.', priority: 'high' },
  { id: 'po-h1', cropName: 'Potato', stage: 'harvest', title: 'Potato Harvest & Storage', description: 'Harvest when soil is dry. Avoid cuts and bruises. Cure in shade for 10 days. Store in cold storage at 2-4°C or in well-ventilated rooms with CIPC treatment.', priority: 'high' },

  // ===== CHANA (Chickpea) =====
  { id: 'ch-p1', cropName: 'Chana', stage: 'planning', title: 'Chana Seed Treatment', description: 'Treat seeds with Carbendazim 2g/kg + Rhizobium culture 200g/10kg seed + PSB culture. Saves 25% nitrogen fertilizer through biological fixation.', priority: 'high' },
  { id: 'ch-s1', cropName: 'Chana', stage: 'sowing', title: 'Chana Sowing', description: 'Sow 30-35kg seed/acre at 30x10cm spacing, 5-7cm deep. Best time: 15 Oct - 15 Nov. Apply DAP 40kg + MOP 10kg per acre as basal. Chana needs less nitrogen.', priority: 'high' },
  { id: 'ch-v1', cropName: 'Chana', stage: 'vegetative', title: 'Nipping in Chana', description: 'Pinch (nip) the terminal growing tip of each branch at 35-40 DAS. This promotes side branching and increases pod count by 25-30%.', priority: 'high' },
  { id: 'ch-v2', cropName: 'Chana', stage: 'vegetative', title: 'Wilt Management', description: 'If plants start wilting, drench soil with Carbendazim 1g/L or Trichoderma 5g/L around the plant base. Use wilt-resistant varieties like JG-11.', priority: 'high' },
  { id: 'ch-f1', cropName: 'Chana', stage: 'flowering', title: 'Pod Borer in Chana', description: 'Install Helicoverpa pheromone traps at 5/acre. At 50% flowering, spray HaNPV or Bt. If severe, use Emamectin Benzoate 5SG at 80g/acre.', priority: 'high' },
  { id: 'ch-f2', cropName: 'Chana', stage: 'flowering', title: 'Flowering Irrigation', description: 'Give one light irrigation at flowering if soil is dry. Over-irrigation in chana causes excessive vegetative growth and root rot. Keep moisture moderate.', priority: 'medium' },
  { id: 'ch-r1', cropName: 'Chana', stage: 'ripening', title: 'Chana Maturity Check', description: 'Chana is ready when 80% pods turn brown and leaves start drying. Grain should be hard with 18-20% moisture. Delay causes pod shattering.', priority: 'high' },
  { id: 'ch-h1', cropName: 'Chana', stage: 'harvest', title: 'Chana Harvest & Storage', description: 'Harvest early morning to reduce shattering. Dry to 10-12% moisture. Store in jute bags treated with Malathion dust. Sell at MSP through procurement centers.', priority: 'high' },

  // ===== MUSTARD =====
  { id: 'mu-p1', cropName: 'Mustard', stage: 'planning', title: 'Mustard Variety Selection', description: 'Choose Pusa Bold or RH-0749 for irrigated, Varuna for rainfed. Treat seeds with Metalaxyl 6g/kg for white rust protection. Use 2kg seed/acre.', priority: 'high' },
  { id: 'mu-s1', cropName: 'Mustard', stage: 'sowing', title: 'Mustard Sowing', description: 'Sow in rows 30-45cm apart, thin to 15cm plant spacing at 15-20 DAS. Apply DAP 35kg + MOP 10kg + Sulphur 10kg per acre as basal. Sow by 25th October.', priority: 'high' },
  { id: 'mu-v1', cropName: 'Mustard', stage: 'vegetative', title: 'Aphid Alert in Mustard', description: 'Mustard aphid appears in January when temperature drops. If 25+ aphids per plant on 10% plants, spray Dimethoate 30EC at 400ml/acre in evening only.', priority: 'high' },
  { id: 'mu-v2', cropName: 'Mustard', stage: 'vegetative', title: 'White Rust & Alternaria', description: 'If white blisters or dark spots appear on leaves, spray Mancozeb 600g/acre + Metalaxyl 200g/acre. Repeat after 15 days if needed.', priority: 'high' },
  { id: 'mu-f1', cropName: 'Mustard', stage: 'flowering', title: 'Boron Spray for Mustard', description: 'Spray Borax 0.2% at flowering to improve pod setting and seed filling. Also spray 2% Urea for foliar nutrition. Boron is critical for mustard.', priority: 'high' },
  { id: 'mu-f2', cropName: 'Mustard', stage: 'flowering', title: 'Bee Pollination', description: 'Mustard benefits greatly from bee pollination. Place 5 bee hives per acre near field. Do not spray insecticides during flowering.', priority: 'medium' },
  { id: 'mu-r1', cropName: 'Mustard', stage: 'ripening', title: 'Harvest Before Shattering', description: 'Harvest mustard when 75% pods turn brown. Delayed harvest causes heavy shattering loss (15-20%). Cut plants and stack for 3-4 days before threshing.', priority: 'high' },

  // ===== MAIZE =====
  { id: 'mz-p1', cropName: 'Maize', stage: 'planning', title: 'Maize Hybrid Selection', description: 'Use single cross hybrids like DHM-117 or HQPM-1 (high quality protein). Use 8-10 kg seed/acre. Treat with Thiram+Carbendazim 3g/kg.', priority: 'high' },
  { id: 'mz-s1', cropName: 'Maize', stage: 'sowing', title: 'Maize Planting', description: 'Sow at 60x20cm spacing, 5cm deep. Apply DAP 55kg + MOP 30kg per acre as basal. Ridge planting gives better drainage and root development.', priority: 'high' },
  { id: 'mz-v1', cropName: 'Maize', stage: 'vegetative', title: 'Maize Urea Application', description: 'Apply 35kg Urea/acre at knee-high stage (25-30 DAS) and 35kg at tasseling (45-50 DAS). Place in bands near rows, not broadcast.', priority: 'high' },
  { id: 'mz-v2', cropName: 'Maize', stage: 'vegetative', title: 'Fall Armyworm Alert', description: 'Check whorl for frass and ragged feeding. If 10% plants infested, spray Emamectin Benzoate 5SG at 80g/acre or Chlorantraniliprole 60ml/acre in whorl.', priority: 'high' },
  { id: 'mz-f1', cropName: 'Maize', stage: 'flowering', title: 'Tasseling Stage Water', description: 'Maize is extremely sensitive to water stress at tasseling-silking. Even 2 days of stress can reduce yield by 40-50%. Ensure irrigation at this stage.', priority: 'high' },
  { id: 'mz-fr1', cropName: 'Maize', stage: 'fruiting', title: 'Cob Borer Management', description: 'If cob borer damage exceeds 5%, apply Carbofuran 3G granules in leaf whorls. For ear tip damage, use Emamectin Benzoate spray.', priority: 'high' },
  { id: 'mz-h1', cropName: 'Maize', stage: 'harvest', title: 'Maize Drying & Storage', description: 'Harvest at 20-25% moisture, dry to 12-14%. Store in airtight metal bins. Maize is prone to aflatoxin — ensure proper drying to prevent mold.', priority: 'high' },

  // ===== GROUNDNUT =====
  { id: 'gn-p1', cropName: 'Groundnut', stage: 'planning', title: 'Groundnut Seed Preparation', description: 'Shell pods 7-10 days before sowing. Treat kernels with Thiram 3g/kg + Rhizobium 200g/10kg. Use 50-60 kg kernels per acre. Do not use broken seeds.', priority: 'high' },
  { id: 'gn-s1', cropName: 'Groundnut', stage: 'sowing', title: 'Groundnut Planting', description: 'Sow at 30x10cm spacing, 5cm deep. Apply Gypsum 200kg/acre at sowing (calcium is essential for pod filling). Single Super Phosphate 100kg/acre as basal.', priority: 'high' },
  { id: 'gn-v1', cropName: 'Groundnut', stage: 'vegetative', title: 'Groundnut Earthing Up', description: 'Do earthing up at 35-40 DAS (before flowering). This helps peg penetration into soil. Without earthing up, many pods remain aerial and empty.', priority: 'high' },
  { id: 'gn-f1', cropName: 'Groundnut', stage: 'flowering', title: 'Calcium for Pod Filling', description: 'Spray Calcium Chloride 0.5% at pegging stage. Top dress Gypsum 100kg/acre near plant base at 45 DAS for proper kernel development.', priority: 'high' },
  { id: 'gn-f2', cropName: 'Groundnut', stage: 'flowering', title: 'Tikka Disease Control', description: 'If brown/black spots appear on leaves (tikka/leaf spot), spray Mancozeb 600g/acre or Chlorothalonil 500ml/acre every 15 days.', priority: 'high' },
  { id: 'gn-h1', cropName: 'Groundnut', stage: 'harvest', title: 'Groundnut Harvest', description: 'Harvest when inside of shell shows dark veins and kernel fills 75% of shell cavity. Dry pods to 8-10% moisture. Avoid rain on harvested pods.', priority: 'high' },

  // ===== SOYBEAN =====
  { id: 'so-p1', cropName: 'Soybean', stage: 'planning', title: 'Soybean Seed Treatment', description: 'Treat with Thiram+Carbendazim 3g/kg + Rhizobium + PSB. Use 30-35 kg seed/acre. Ensure 70%+ germination. Sow within 2 weeks of treatment.', priority: 'high' },
  { id: 'so-s1', cropName: 'Soybean', stage: 'sowing', title: 'Soybean Sowing Window', description: 'Sow with onset of monsoon (20 June - 10 July). Row spacing 30-45cm, 3-5cm deep. Apply DAP 40kg + MOP 15kg per acre. Do not delay beyond July 15.', priority: 'high' },
  { id: 'so-v1', cropName: 'Soybean', stage: 'vegetative', title: 'Girdle Beetle in Soybean', description: 'If stem girdling damage exceeds 10% plants, spray Triazophos 40EC at 600ml/acre. Collect and destroy girdled stems to break pest cycle.', priority: 'high' },
  { id: 'so-f1', cropName: 'Soybean', stage: 'flowering', title: 'Soybean Pod Borer', description: 'Monitor for pod borer at flowering. Spray Profenofos 50EC 500ml/acre or Chlorantraniliprole 60ml/acre. Use pheromone traps for monitoring.', priority: 'high' },
  { id: 'so-r1', cropName: 'Soybean', stage: 'ripening', title: 'Soybean Pre-Harvest', description: 'Apply Paraquat spray for desiccation if uneven maturity. Harvest when 95% pods are brown. Moisture should be 15-17% at harvest. Dry to 10-12%.', priority: 'high' },

  // ===== TURMERIC =====
  { id: 'tu-p1', cropName: 'Turmeric', stage: 'planning', title: 'Turmeric Rhizome Prep', description: 'Select healthy mother rhizomes (30-40g each). Treat with Mancozeb 0.3% + Quinalphos 0.075% dip for 30 minutes. Use 600-800 kg rhizomes per acre.', priority: 'high' },
  { id: 'tu-s1', cropName: 'Turmeric', stage: 'sowing', title: 'Turmeric Planting', description: 'Plant on raised beds at 25x30cm, 5-7cm deep. Apply 8-10 tonnes FYM + Neem cake 200kg/acre. Mulch heavily with dry leaves (10-12 tonnes/acre).', priority: 'high' },
  { id: 'tu-v1', cropName: 'Turmeric', stage: 'vegetative', title: 'Earthing Up & Mulching', description: 'Do earthing up at 40-60 DAS and 90-120 DAS. Refresh mulch after earthing up. This promotes rhizome development and prevents sun damage.', priority: 'high' },
  { id: 'tu-v2', cropName: 'Turmeric', stage: 'vegetative', title: 'Rhizome Rot Prevention', description: 'If plants show yellowing and wilting, drench soil with Metalaxyl+Mancozeb 2g/L or Copper Oxychloride 3g/L. Ensure good drainage to prevent rot.', priority: 'high' },
  { id: 'tu-f1', cropName: 'Turmeric', stage: 'flowering', title: 'Turmeric Nutrition', description: 'Apply Urea 20kg/acre at 60 and 120 DAS. Spray micronutrient mixture at 90 DAS. Adequate nutrition gives bright yellow color and higher curcumin.', priority: 'high' },
  { id: 'tu-r1', cropName: 'Turmeric', stage: 'ripening', title: 'Turmeric Maturity', description: 'Turmeric matures in 7-9 months when leaves turn yellow and dry. Stop irrigation 15 days before harvest. Rhizomes should snap easily when bent.', priority: 'high' },
  { id: 'tu-h1', cropName: 'Turmeric', stage: 'harvest', title: 'Turmeric Processing', description: 'Boil rhizomes for 45-60 minutes until soft. Sun dry for 10-15 days. Polish in drums. Well-processed turmeric fetches 20-30% higher price.', priority: 'high' },

  // ===== CHILLI =====
  { id: 'cl-p1', cropName: 'Chilli', stage: 'planning', title: 'Chilli Nursery', description: 'Raise seedlings in pro-trays or beds. Use 200-250g seed/acre. Treat with Thiram 3g/kg + Imidacloprid for thrips/virus protection. Nursery takes 35-40 days.', priority: 'high' },
  { id: 'cl-s1', cropName: 'Chilli', stage: 'sowing', title: 'Chilli Transplanting', description: 'Transplant 35-40 day old seedlings at 60x45cm on ridges or beds. Apply DAP 50kg + MOP 30kg + Neem cake 100kg per acre.', priority: 'high' },
  { id: 'cl-v1', cropName: 'Chilli', stage: 'vegetative', title: 'Chilli Thrips & Mite', description: 'Chilli thrips cause leaf curling and bronzing. Spray Fipronil 5SC 400ml/acre or Spinetoram 120ml/acre. For mites, use Propargite or Spiromesifen.', priority: 'high' },
  { id: 'cl-f1', cropName: 'Chilli', stage: 'flowering', title: 'Fruit Set in Chilli', description: 'Spray Planofix (NAA) 1ml/4.5L at flowering for better fruit set. Also spray Boron 0.2% + Calcium 0.5% to prevent flower and fruit drop.', priority: 'high' },
  { id: 'cl-fr1', cropName: 'Chilli', stage: 'fruiting', title: 'Anthracnose (Fruit Rot)', description: 'Spray Carbendazim 200g/acre + Mancozeb 600g/acre at 15-day intervals during rainy season. Pick and destroy infected fruits. Use disease-free seeds.', priority: 'high' },
  { id: 'cl-h1', cropName: 'Chilli', stage: 'harvest', title: 'Chilli Drying & Grading', description: 'Dry red chillies to 10-12% moisture on clean floor. Grade by size and color. Store in gunny bags in dry, ventilated rooms. Well-dried chilli fetches premium.', priority: 'high' },

  // ===== SUGARCANE =====
  { id: 'sc-p1', cropName: 'Sugarcane', stage: 'planning', title: 'Sugarcane Sett Preparation', description: 'Use disease-free 10-month old cane for setts. Cut 3-eye setts. Treat with Carbendazim 0.1% dip for 15 minutes. Use 30,000 three-eye setts per acre.', priority: 'high' },
  { id: 'sc-s1', cropName: 'Sugarcane', stage: 'sowing', title: 'Sugarcane Planting', description: 'Plant in 75-90cm spaced trenches, 20cm deep. Place setts end-to-end. Apply Carbofuran 3G for termite control. Spring planting (Feb-Mar) gives highest yield.', priority: 'high' },
  { id: 'sc-v1', cropName: 'Sugarcane', stage: 'vegetative', title: 'Earthing Up Sugarcane', description: 'Do first earthing up at 90 DAS and second at 120 DAS. This prevents lodging and promotes root development. Remove dry leaves during earthing.', priority: 'high' },
  { id: 'sc-v2', cropName: 'Sugarcane', stage: 'vegetative', title: 'Top Borer in Sugarcane', description: 'If dead heart symptoms in 10%+ shoots, release Trichogramma parasitoids (50,000/acre at 15-day intervals). Spray Chlorantraniliprole in whorls.', priority: 'high' },
  { id: 'sc-f1', cropName: 'Sugarcane', stage: 'flowering', title: 'Grand Growth Phase', description: 'Apply 50kg Urea/acre at grand growth phase (June-Sep). Ensure irrigation every 7-10 days. This phase produces 70% of total cane weight.', priority: 'high' },
  { id: 'sc-r1', cropName: 'Sugarcane', stage: 'ripening', title: 'Sugarcane Ripening', description: 'Stop nitrogen after September. Apply 20kg MOP/acre for ripening. Ethephon spray (400ppm) at 45 days before harvest improves sugar recovery by 0.5-1%.', priority: 'high' },
  { id: 'sc-h1', cropName: 'Sugarcane', stage: 'harvest', title: 'Sugarcane Harvest', description: 'Cut cane at ground level (do not leave stumps for ratoon). Remove tops and trash. Supply to mill within 24 hours of cutting to prevent sugar loss.', priority: 'high' },

  // ===== COTTON =====
  { id: 'ct-p1', cropName: 'Cotton', stage: 'planning', title: 'Cotton Seed & Refuge', description: 'Use Bt cotton hybrids from authorized companies. Plant 20% non-Bt refuge (5 rows border) to prevent resistance buildup. Use 800-1000g seed/acre.', priority: 'high' },
  { id: 'ct-s1', cropName: 'Cotton', stage: 'sowing', title: 'Cotton Sowing', description: 'Sow at 90x60cm (or 120x45cm) spacing, 3-4cm deep. Apply DAP 50kg + MOP 25kg per acre as basal. Sow with onset of monsoon or pre-monsoon with irrigation.', priority: 'high' },
  { id: 'ct-v1', cropName: 'Cotton', stage: 'vegetative', title: 'Sucking Pest Complex', description: 'Monitor for jassids, aphids, whiteflies weekly. If above ETL, spray Flonicamid or Diafenthiuron. Avoid synthetic pyrethroids — they cause whitefly resurgence.', priority: 'high' },
  { id: 'ct-f1', cropName: 'Cotton', stage: 'flowering', title: 'Pink Bollworm Management', description: 'Install pheromone traps (5/acre) for monitoring. If trap catch exceeds 8 moths/trap/week, spray Profenofos 50EC or Emamectin Benzoate.', priority: 'high' },
  { id: 'ct-fr1', cropName: 'Cotton', stage: 'fruiting', title: 'Boll Development Nutrition', description: 'Spray 2% DAP + 1% KCl + MgSO4 0.5% at boll development for better boll weight and fiber quality. Give irrigation every 15-20 days.', priority: 'high' },
  { id: 'ct-h1', cropName: 'Cotton', stage: 'harvest', title: 'Cotton Picking', description: 'Pick fully opened bolls when fiber moisture is below 10%. Do not pick wet cotton. Grade kapas by staple length. Sell through CCI or directly to mills.', priority: 'high' },

  // ===== BAJRA =====
  { id: 'bj-p1', cropName: 'Bajra', stage: 'planning', title: 'Bajra Hybrid Selection', description: 'Use certified hybrids like HHB-67 improved or GHB-558. Treat seeds with Metalaxyl 6g/kg for downy mildew protection. Use 1.5-2 kg seed/acre.', priority: 'high' },
  { id: 'bj-s1', cropName: 'Bajra', stage: 'sowing', title: 'Bajra Sowing', description: 'Sow at 45x15cm spacing, 2-3cm deep. Apply DAP 35kg + MOP 15kg per acre. Can be sown as Kharif (July) or summer (March) crop.', priority: 'high' },
  { id: 'bj-v1', cropName: 'Bajra', stage: 'vegetative', title: 'Downy Mildew in Bajra', description: 'If green ear/downy mildew appears (white growth under leaves), rogue out infected plants. Spray Metalaxyl+Mancozeb 600g/acre preventively.', priority: 'high' },
  { id: 'bj-f1', cropName: 'Bajra', stage: 'flowering', title: 'Ear Head Irrigation', description: 'Give irrigation at ear head emergence stage. Water stress at this stage causes incomplete grain filling and reduces yield by 30-40%.', priority: 'high' },
  { id: 'bj-h1', cropName: 'Bajra', stage: 'harvest', title: 'Bajra Harvest', description: 'Harvest when grains are hard and ear heads turn grey-brown. Cut ear heads first, then fodder. Dry grains to 12% moisture. Bajra stover is excellent fodder.', priority: 'high' },

  // ===== BANANA =====
  { id: 'bn-p1', cropName: 'Banana', stage: 'planning', title: 'Banana Sucker Selection', description: 'Use tissue culture plants or sword suckers (1.5-2 kg). Dip in Carbendazim 0.1% + Monocrotophos for 20 min. Grand Naine gives 25-30 tonnes/acre.', priority: 'high' },
  { id: 'bn-s1', cropName: 'Banana', stage: 'sowing', title: 'Banana Planting', description: 'Plant at 1.8x1.8m (1200 plants/acre) in 45cm cube pits. Apply 10kg FYM + 250g SSP + Neem cake 250g per pit. June-July or October planting is ideal.', priority: 'high' },
  { id: 'bn-v1', cropName: 'Banana', stage: 'vegetative', title: 'Banana Nutrition Schedule', description: 'Apply 90g Urea + 90g MOP per plant every month from 2nd to 7th month. Banana is a heavy feeder — fertigation gives best results.', priority: 'high' },
  { id: 'bn-v2', cropName: 'Banana', stage: 'vegetative', title: 'Panama Wilt Prevention', description: 'If leaves turn yellow and split, it may be Fusarium wilt (Panama). Remove infected plants, drench with Carbendazim 1g/L. Use resistant varieties like Grand Naine.', priority: 'high' },
  { id: 'bn-f1', cropName: 'Banana', stage: 'flowering', title: 'Bunch Emergence Care', description: 'After bunch emergence, remove male bud (bell) when last hand is visible. Apply bunch spray of Monocrotophos 1.5ml/L for thrips control on developing hands.', priority: 'high' },
  { id: 'bn-fr1', cropName: 'Banana', stage: 'fruiting', title: 'Bunch Cover & Propping', description: 'Cover bunches with blue polythene bags for pest protection and uniform ripening. Prop heavy bearing plants with bamboo poles to prevent toppling.', priority: 'high' },
  { id: 'bn-h1', cropName: 'Banana', stage: 'harvest', title: 'Banana Harvest & Ripening', description: 'Harvest when fingers are 75% round and light green. Use sharp curved knife. Ripen with Ethylene gas or Calcium Carbide in chambers. Pack in CFB boxes.', priority: 'high' },

  // ===== GINGER =====
  { id: 'gi-p1', cropName: 'Ginger', stage: 'planning', title: 'Ginger Seed Rhizome', description: 'Select bold, disease-free rhizomes (20-25g each). Treat with Mancozeb 0.3% + Quinalphos for 30 min. Use 600 kg seed rhizomes per acre. Store in shade.', priority: 'high' },
  { id: 'gi-s1', cropName: 'Ginger', stage: 'sowing', title: 'Ginger Planting', description: 'Plant on raised beds at 25x25cm, 5cm deep. Apply 10 tonnes FYM + Neem cake 200kg/acre. Mulch immediately with dry leaves 10-12 tonnes/acre.', priority: 'high' },
  { id: 'gi-v1', cropName: 'Ginger', stage: 'vegetative', title: 'Rhizome Rot (Soft Rot)', description: 'If plants show yellowing from base upward with foul smell, it is soft rot. Drench with Copper Oxychloride 3g/L. Improve drainage. Remove infected plants.', priority: 'high' },
  { id: 'gi-v2', cropName: 'Ginger', stage: 'vegetative', title: 'Ginger Earthing & Mulching', description: 'Do earthing up at 45, 90, and 120 DAS. Refresh mulch each time. Apply 20kg Urea/acre at each earthing up for continuous growth.', priority: 'high' },
  { id: 'gi-h1', cropName: 'Ginger', stage: 'harvest', title: 'Ginger Harvest', description: 'Harvest at 8-9 months when leaves turn yellow. For fresh ginger, harvest at 6 months (green ginger). Wash, grade, and dry for 2-3 days in shade before sale.', priority: 'high' },

  // ===== GARLIC =====
  { id: 'ga-p1', cropName: 'Garlic', stage: 'planning', title: 'Garlic Clove Selection', description: 'Use bold, healthy outer cloves (1.5-2g each). Treat with Carbendazim 2g/L + Imidacloprid dip. Use 150-200 kg cloves per acre. Yamuna Safed is best variety.', priority: 'high' },
  { id: 'ga-s1', cropName: 'Garlic', stage: 'sowing', title: 'Garlic Planting', description: 'Plant cloves 3-5cm deep at 15x10cm on raised beds. Apply DAP 50kg + MOP 25kg + Sulphur 10kg per acre. Best planting time: October-November.', priority: 'high' },
  { id: 'ga-v1', cropName: 'Garlic', stage: 'vegetative', title: 'Garlic Purple Blotch', description: 'If purple spots appear on leaves, spray Mancozeb 600g/acre + Carbendazim 200g/acre every 12-15 days. Avoid overhead irrigation.', priority: 'high' },
  { id: 'ga-v2', cropName: 'Garlic', stage: 'vegetative', title: 'Garlic Thrips', description: 'Garlic thrips cause silvery patches on leaves. Spray Fipronil 5SC 400ml/acre or Lambda-cyhalothrin when 30+ thrips per plant. Repeat after 10 days.', priority: 'high' },
  { id: 'ga-r1', cropName: 'Garlic', stage: 'ripening', title: 'Garlic Maturity Signs', description: 'Stop irrigation when 50% tops bend and start yellowing. Harvest 15 days later. Premature harvest gives shriveled cloves. Late harvest causes splitting.', priority: 'high' },
  { id: 'ga-h1', cropName: 'Garlic', stage: 'harvest', title: 'Garlic Curing & Storage', description: 'Cure garlic with tops intact in shade for 7-10 days. Cut tops, grade by size. Store in well-ventilated rooms on racks. Properly cured garlic stores 5-6 months.', priority: 'high' },

  // ===== MOONG =====
  { id: 'mo-p1', cropName: 'Moong', stage: 'planning', title: 'Moong Preparation', description: 'Use Rhizobium + PSB treated seeds. Seed rate 6-8 kg/acre. Treat with Carbendazim 2g/kg. Summer moong (March) or Kharif (July) — both timings work.', priority: 'high' },
  { id: 'mo-s1', cropName: 'Moong', stage: 'sowing', title: 'Moong Sowing Tips', description: 'Sow at 30x10cm spacing, 3-4cm deep. Apply DAP 35kg/acre as basal. Moong fixes its own nitrogen — do not over-apply urea. Pre-sowing irrigation helps.', priority: 'high' },
  { id: 'mo-v1', cropName: 'Moong', stage: 'vegetative', title: 'Yellow Mosaic Virus', description: 'If yellow patches on leaves, it is YMV spread by whitefly. Spray Thiamethoxam 5g/10L or Imidacloprid. Remove severely infected plants. Use resistant varieties.', priority: 'high' },
  { id: 'mo-f1', cropName: 'Moong', stage: 'flowering', title: 'Moong Pod Borer', description: 'Monitor for Maruca pod borer at flowering. Spray Emamectin Benzoate 80g/acre or Neem oil 5ml/L at 50% flowering. Repeat after 10 days.', priority: 'high' },
  { id: 'mo-h1', cropName: 'Moong', stage: 'harvest', title: 'Moong Picking', description: 'Pick mature (black) pods in 2-3 rounds as they mature unevenly. Do not wait for all pods — shattering causes 15-20% loss. Dry to 10-12% moisture.', priority: 'high' },

  // ===== OKRA =====
  { id: 'ok-p1', cropName: 'Okra', stage: 'planning', title: 'Okra Seed Preparation', description: 'Soak seeds in water for 12 hours before sowing. Use 4-5 kg seed/acre. Treat with Imidacloprid 5g/kg for YVMV protection. Choose Arka Anamika for resistance.', priority: 'high' },
  { id: 'ok-s1', cropName: 'Okra', stage: 'sowing', title: 'Okra Direct Sowing', description: 'Sow directly at 45x30cm, 2-3cm deep. Apply DAP 35kg + MOP 15kg per acre. Summer sowing: February, Kharif: June-July.', priority: 'high' },
  { id: 'ok-v1', cropName: 'Okra', stage: 'vegetative', title: 'Yellow Vein Mosaic (YVMV)', description: 'YVMV is spread by whiteflies. Spray Thiamethoxam or Acetamiprid for whitefly control. Remove infected plants immediately. Use YVMV-resistant varieties.', priority: 'high' },
  { id: 'ok-fr1', cropName: 'Okra', stage: 'fruiting', title: 'Fruit & Shoot Borer', description: 'If wilting shoots or damaged fruits, spray Emamectin Benzoate 80g/acre. Clip and destroy infested shoots. Install pheromone traps for monitoring.', priority: 'high' },
  { id: 'ok-h1', cropName: 'Okra', stage: 'harvest', title: 'Okra Harvesting Frequency', description: 'Pick tender fruits every 2-3 days. Delayed picking makes fruits fibrous and unmarketable. Morning picking gives fresh, crisp fruits for market.', priority: 'high' },

  // ===== CABBAGE =====
  { id: 'cb-s1', cropName: 'Cabbage', stage: 'sowing', title: 'Cabbage Transplanting', description: 'Transplant 25-30 day seedlings at 45x45cm spacing. Apply DAP 50kg + MOP 30kg/acre as basal. Water immediately. Best: October-November transplanting.', priority: 'high' },
  { id: 'cb-v1', cropName: 'Cabbage', stage: 'vegetative', title: 'Diamond Back Moth', description: 'DBM is #1 pest. Spray Spinosad 75ml/acre or Emamectin Benzoate at 10% infestation. Rotate chemicals. Install pheromone traps for monitoring.', priority: 'high' },
  { id: 'cb-fr1', cropName: 'Cabbage', stage: 'fruiting', title: 'Head Formation Care', description: 'Apply 25kg Urea/acre at head formation. Maintain uniform irrigation — irregular watering causes head splitting. Reduce nitrogen after heads form.', priority: 'high' },
  { id: 'cb-h1', cropName: 'Cabbage', stage: 'harvest', title: 'Cabbage Harvest', description: 'Harvest when heads are firm and compact. Cut with a sharp knife keeping 2-3 wrapper leaves. Do not over-mature — heads crack and lose market value.', priority: 'high' },

  // ===== CAULIFLOWER =====
  { id: 'cf-s1', cropName: 'Cauliflower', stage: 'sowing', title: 'Cauliflower Transplanting', description: 'Transplant 25-30 day seedlings at 60x45cm. Apply DAP 65kg + MOP 30kg + Borax 4kg per acre. Boron deficiency causes hollow stem and brown curd.', priority: 'high' },
  { id: 'cf-v1', cropName: 'Cauliflower', stage: 'vegetative', title: 'Curd Protection', description: 'When curd starts forming, tie 2-3 inner leaves over the curd to protect from sunlight. Sun exposure causes yellow discoloration and reduces market value.', priority: 'high' },
  { id: 'cf-h1', cropName: 'Cauliflower', stage: 'harvest', title: 'Cauliflower Harvest', description: 'Harvest when curds are compact and white (before they become loose/ricey). Cut with 4-5 wrapper leaves for protection. Handle carefully to avoid bruising.', priority: 'high' },

  // ===== BRINJAL =====
  { id: 'br-s1', cropName: 'Brinjal', stage: 'sowing', title: 'Brinjal Transplanting', description: 'Transplant 30-35 day old seedlings at 60x60cm. Apply DAP 50kg + MOP 25kg + Neem cake 100kg per acre. Install yellow sticky traps from day one.', priority: 'high' },
  { id: 'br-v1', cropName: 'Brinjal', stage: 'vegetative', title: 'Shoot & Fruit Borer', description: 'Brinjal shoot and fruit borer is the worst pest. Install 5 pheromone traps/acre. Clip wilted shoots weekly. Spray Emamectin Benzoate at 80g/acre every 15 days.', priority: 'high' },
  { id: 'br-fr1', cropName: 'Brinjal', stage: 'fruiting', title: 'Regular Picking', description: 'Pick fruits at tender stage when glossy and firm. Do not let fruits become dull/seedy. Regular 5-7 day picking intervals keep the plant productive.', priority: 'high' },

  // ===== CORIANDER =====
  { id: 'co-s1', cropName: 'Coriander', stage: 'sowing', title: 'Coriander Sowing', description: 'Split seeds gently before sowing. Soak in water 12 hours. Sow at 20-25cm rows, broadcast thinly. Use 6-8 kg/acre. Apply DAP 30kg + MOP 10kg per acre.', priority: 'high' },
  { id: 'co-v1', cropName: 'Coriander', stage: 'vegetative', title: 'Coriander Wilt', description: 'If plants suddenly wilt, drench with Carbendazim 1g/L. Use wilt-resistant varieties. Avoid waterlogging. Treat seeds with Trichoderma for prevention.', priority: 'high' },
  { id: 'co-f1', cropName: 'Coriander', stage: 'flowering', title: 'Aphid Control', description: 'Aphids are major pest at flowering. Spray Imidacloprid 50ml/acre or Neem oil 5ml/L when 10+ aphids per plant. Spray in evening to protect pollinators.', priority: 'high' },
  { id: 'co-h1', cropName: 'Coriander', stage: 'harvest', title: 'Coriander Harvest', description: 'For grain, harvest when 50% umbels turn brown. For leaf coriander, harvest at 30-45 DAS. Dry seeds to 10% moisture. Grade for better market price.', priority: 'high' },

  // ===== CUMIN =====
  { id: 'cu-s1', cropName: 'Cumin (Jeera)', stage: 'sowing', title: 'Cumin Sowing Tips', description: 'Broadcast 3-4 kg seed/acre on flat beds. Cover lightly with soil. Give light irrigation immediately. Best sowing: 15 Nov - 15 Dec. Avoid deep sowing.', priority: 'high' },
  { id: 'cu-v1', cropName: 'Cumin (Jeera)', stage: 'vegetative', title: 'Cumin Wilt & Blight', description: 'Spray Mancozeb 600g/acre + Carbendazim 200g/acre at 30 and 45 DAS preventively. Cumin is very sensitive to wilt. Ensure good drainage.', priority: 'high' },
  { id: 'cu-f1', cropName: 'Cumin (Jeera)', stage: 'flowering', title: 'Aphid in Cumin', description: 'Monitor for aphids during flowering. Spray Thiamethoxam 50g/acre if infestation is high. Avoid Dimethoate near harvest — it affects grain quality.', priority: 'high' },
  { id: 'cu-h1', cropName: 'Cumin (Jeera)', stage: 'harvest', title: 'Cumin Harvest', description: 'Harvest when plants turn yellowish-brown and seeds are aromatic. Cut whole plants, stack for 2 days, then thresh. Dry to 10% moisture.', priority: 'high' },

  // ===== SESAME =====
  { id: 'se-s1', cropName: 'Sesame (Til)', stage: 'sowing', title: 'Sesame Sowing', description: 'Sow 2-2.5 kg seed/acre at 30-45cm rows, 1-2cm deep. Mix seed with sand for uniform sowing. Apply DAP 30kg + MOP 10kg per acre. Sow with monsoon onset.', priority: 'high' },
  { id: 'se-v1', cropName: 'Sesame (Til)', stage: 'vegetative', title: 'Sesame Phyllody', description: 'If flowers turn into leaf-like structures (phyllody), it is caused by phytoplasma spread by leafhoppers. Spray Imidacloprid. Remove infected plants immediately.', priority: 'high' },
  { id: 'se-h1', cropName: 'Sesame (Til)', stage: 'harvest', title: 'Sesame Harvest', description: 'Harvest when lower capsules start turning brown. Bundle and dry upright for 5-7 days for capsules to open naturally. Collect seeds on clean cloth.', priority: 'high' },

  // ===== SUNFLOWER =====
  { id: 'sf-s1', cropName: 'Sunflower', stage: 'sowing', title: 'Sunflower Planting', description: 'Sow 2-3 kg hybrid seed/acre at 60x30cm, 3-5cm deep. Apply DAP 50kg + MOP 20kg + Borax 4kg per acre. Boron is critical for sunflower seed filling.', priority: 'high' },
  { id: 'sf-f1', cropName: 'Sunflower', stage: 'flowering', title: 'Pollination & Head Rot', description: 'Keep bee hives near field for cross-pollination. If head rot appears in humid weather, spray Carbendazim 200g/acre. Avoid overhead irrigation at flowering.', priority: 'high' },
  { id: 'sf-h1', cropName: 'Sunflower', stage: 'harvest', title: 'Sunflower Harvest', description: 'Harvest when back of heads turn brown and seeds are plump. Cut heads, dry in sun for 3-4 days. Thresh and clean. Dry seeds to 8-9% moisture for storage.', priority: 'high' },

  // ===== MANGO =====
  { id: 'mg-v1', cropName: 'Mango', stage: 'vegetative', title: 'Mango Nutrition', description: 'Apply 50kg FYM + 1kg Urea + 1kg SSP + 0.5kg MOP per tree per year (adult tree). Spray 2% Urea at new flush for better vegetative growth. Mulch tree basin.', priority: 'high' },
  { id: 'mg-f1', cropName: 'Mango', stage: 'flowering', title: 'Mango Flowering Care', description: 'Spray KNO3 1% or NAA 20ppm to induce flowering. At panicle emergence, spray Imidacloprid for hopper control. Do not spray during full bloom — protects pollinators.', priority: 'high' },
  { id: 'mg-f2', cropName: 'Mango', stage: 'flowering', title: 'Mango Hopper & Powdery Mildew', description: 'Spray Imidacloprid 3ml/10L + Karathane 5ml/10L at bud burst and repeat at pea stage. Mango hopper and powdery mildew are major threats during flowering.', priority: 'high' },
  { id: 'mg-fr1', cropName: 'Mango', stage: 'fruiting', title: 'Fruit Fly Protection', description: 'Install Methyl Eugenol traps (10/acre) from March. Spray Malathion 2ml/L at 15-day intervals. Collect and destroy fallen fruits to break pest cycle.', priority: 'high' },
  { id: 'mg-h1', cropName: 'Mango', stage: 'harvest', title: 'Mango Harvest & Ripening', description: 'Harvest when shoulder develops and fruit gives slight aroma. Use harvesting poles with nets. Ripen in wooden boxes with newspaper. Avoid Calcium Carbide.', priority: 'high' },
];

export function getCropSpecificTips(cropName: string, stage: GrowthStage): CropSpecificTip[] {
  const normalizedName = cropName.toLowerCase().trim();
  return CROP_TIPS.filter(t => 
    t.cropName.toLowerCase() === normalizedName && t.stage === stage
  ).sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

export function getAllCropTipsForStage(cropName: string, stage: GrowthStage): CropSpecificTip[] {
  return getCropSpecificTips(cropName, stage);
}

export function getUpcomingCropTips(cropName: string, currentStage: GrowthStage): CropSpecificTip[] {
  const stages: GrowthStage[] = ['planning', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'ripening', 'harvest', 'completed'];
  const currentIndex = stages.indexOf(currentStage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  
  const currentTips = getCropSpecificTips(cropName, currentStage);
  const nextTips = nextStage ? getCropSpecificTips(cropName, nextStage) : [];
  
  return [...currentTips, ...nextTips];
}

export function hasCropSpecificTips(cropName: string): boolean {
  const normalizedName = cropName.toLowerCase().trim();
  return CROP_TIPS.some(t => t.cropName.toLowerCase() === normalizedName);
}
