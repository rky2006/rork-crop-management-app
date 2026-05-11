import { GrowthStage, CropCategory } from '@/types/crop';

export interface FarmingTip {
  id: string;
  stage: GrowthStage;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category?: CropCategory;
}

export const GENERAL_TIPS: FarmingTip[] = [
  { id: 'p1', stage: 'planning', title: 'Test Your Soil', description: 'Get soil tested for pH, nutrients (N, P, K), and organic matter before selecting crops. Visit your nearest Krishi Vigyan Kendra for free testing.', priority: 'high' },
  { id: 'p2', stage: 'planning', title: 'Select Right Variety', description: 'Choose disease-resistant and climate-suitable varieties recommended by your local agricultural university for best results.', priority: 'high' },
  { id: 'p3', stage: 'planning', title: 'Plan Crop Rotation', description: 'Rotate crops each season to maintain soil fertility. Alternate between cereals and legumes (e.g., wheat after moong/chana).', priority: 'medium' },
  { id: 'p4', stage: 'planning', title: 'Prepare Seeds in Advance', description: 'Buy certified seeds from trusted sources. Treat seeds with Thiram/Carbendazim (2-3g per kg) to prevent seed-borne diseases.', priority: 'high' },
  { id: 'p5', stage: 'planning', title: 'Check Irrigation Availability', description: 'Ensure adequate water source before sowing. Plan drip or sprinkler irrigation for water-saving.', priority: 'medium' },

  { id: 's1', stage: 'sowing', title: 'Optimal Sowing Time', description: 'Sow at the recommended time for your region. Late or early sowing reduces yield significantly. Check Kisan Call Center (1800-180-1551) for advice.', priority: 'high' },
  { id: 's2', stage: 'sowing', title: 'Seed Treatment', description: 'Treat seeds with bio-agents like Trichoderma (4g/kg seed) or Rhizobium culture (for pulses) before sowing for better germination and disease protection.', priority: 'high' },
  { id: 's3', stage: 'sowing', title: 'Proper Seed Depth & Spacing', description: 'Maintain recommended seed depth (2-5cm for most crops) and row spacing. Use seed drill for uniform sowing.', priority: 'high' },
  { id: 's4', stage: 'sowing', title: 'Apply Basal Fertilizer', description: 'Apply full dose of phosphorus, potash, and 1/3 nitrogen as basal dose at sowing time. Mix well with soil.', priority: 'high' },
  { id: 's5', stage: 'sowing', title: 'Soil Moisture Check', description: 'Ensure adequate soil moisture at sowing. If dry, give pre-sowing irrigation (palewa) 2-3 days before sowing.', priority: 'medium' },

  { id: 'g1', stage: 'germination', title: 'Monitor Germination Rate', description: 'Check germination within 7-10 days. If below 70%, consider gap-filling or re-sowing in patches.', priority: 'high' },
  { id: 'g2', stage: 'germination', title: 'Light Irrigation', description: 'Give light irrigation if soil surface is drying. Avoid heavy watering which may cause damping-off disease in seedlings.', priority: 'medium' },
  { id: 'g3', stage: 'germination', title: 'Protect from Birds & Ants', description: 'Use bird scarers or reflective tapes. Treat soil with Chlorpyrifos if ant problem is severe.', priority: 'medium' },
  { id: 'g4', stage: 'germination', title: 'Early Weed Control', description: 'Apply pre-emergence herbicide within 2-3 days of sowing if weeds are expected. Manual weeding can damage young seedlings.', priority: 'medium' },

  { id: 'v1', stage: 'vegetative', title: 'First Top Dressing', description: 'Apply 1/3 dose of nitrogen (urea) at 25-30 days after sowing. Place near plant roots, not on leaves.', priority: 'high' },
  { id: 'v2', stage: 'vegetative', title: 'Weeding & Hoeing', description: 'Complete first weeding at 20-25 DAS and second at 40-45 DAS. Use khurpi or power weeder between rows.', priority: 'high' },
  { id: 'v3', stage: 'vegetative', title: 'Pest Scouting', description: 'Inspect crops weekly for pest damage. Look for leaf holes, curling, discoloration, and insect eggs on leaf undersides.', priority: 'high' },
  { id: 'v4', stage: 'vegetative', title: 'Micronutrient Spray', description: 'Spray Zinc Sulphate (0.5%) or a multi-micronutrient solution if leaves show yellowing or deficiency symptoms.', priority: 'medium' },
  { id: 'v5', stage: 'vegetative', title: 'Thinning (if needed)', description: 'Remove excess seedlings to maintain proper plant population. This ensures each plant gets enough nutrients and light.', priority: 'medium' },
  { id: 'v6', stage: 'vegetative', title: 'Regular Irrigation', description: 'Maintain soil moisture at critical stages. Irrigate every 15-20 days depending on crop and soil type.', priority: 'high' },

  { id: 'f1', stage: 'flowering', title: 'Critical Irrigation', description: 'Flowering is the most water-sensitive stage. Never let the crop face water stress during this period — it directly reduces yield.', priority: 'high' },
  { id: 'f2', stage: 'flowering', title: 'Second Top Dressing', description: 'Apply remaining 1/3 nitrogen dose at flowering/booting stage for grain filling in cereals.', priority: 'high' },
  { id: 'f3', stage: 'flowering', title: 'Pollination Support', description: 'Avoid spraying insecticides during peak flowering to protect pollinators. Spray only in evening if absolutely needed.', priority: 'high' },
  { id: 'f4', stage: 'flowering', title: 'Disease Monitoring', description: 'Watch for fungal diseases (rust, blight, powdery mildew). Spray Mancozeb or Carbendazim preventively if weather is humid.', priority: 'high' },
  { id: 'f5', stage: 'flowering', title: 'Foliar Nutrition', description: 'Spray 2% urea + 1% potassium sulphate for better flower retention and grain development.', priority: 'medium' },

  { id: 'fr1', stage: 'fruiting', title: 'Support Plants if Needed', description: 'Stake or support heavy-bearing plants (tomato, brinjal, chilli) to prevent breakage and fruit touching soil.', priority: 'medium' },
  { id: 'fr2', stage: 'fruiting', title: 'Pest & Disease Control', description: 'Watch for fruit borers, aphids, and whiteflies. Use neem oil spray (5ml/litre) as organic alternative.', priority: 'high' },
  { id: 'fr3', stage: 'fruiting', title: 'Calcium Application', description: 'Spray Calcium Chloride (0.5%) to prevent blossom end rot in tomatoes and improve fruit quality.', priority: 'medium' },
  { id: 'fr4', stage: 'fruiting', title: 'Maintain Regular Irrigation', description: 'Irregular watering during fruiting causes fruit cracking. Use drip irrigation for consistent moisture.', priority: 'high' },

  { id: 'r1', stage: 'ripening', title: 'Reduce Irrigation', description: 'Stop or reduce irrigation 15-20 days before expected harvest for proper grain ripening and easier harvesting.', priority: 'high' },
  { id: 'r2', stage: 'ripening', title: 'Watch for Lodging', description: 'Strong winds can cause crop lodging. Ensure proper drainage and avoid excess nitrogen that causes weak stems.', priority: 'medium' },
  { id: 'r3', stage: 'ripening', title: 'Bird Protection', description: 'Use bird nets, reflective tapes, or sound devices to protect ripening grain from bird damage.', priority: 'medium' },
  { id: 'r4', stage: 'ripening', title: 'Check Grain Moisture', description: 'Test grain moisture before harvest. Ideal moisture for harvesting: Wheat 14%, Rice 20-22%, Maize 20-25%.', priority: 'high' },
  { id: 'r5', stage: 'ripening', title: 'Plan Harvest Logistics', description: 'Arrange combine harvester or labour in advance. Late harvest causes grain shattering and loss.', priority: 'medium' },

  { id: 'h1', stage: 'harvest', title: 'Harvest at Right Maturity', description: 'Harvest when 80-85% grains are mature (golden colour). Delayed harvest causes grain loss and quality reduction.', priority: 'high' },
  { id: 'h2', stage: 'harvest', title: 'Proper Drying', description: 'Dry harvested produce to safe moisture level (10-12% for grains). Spread on clean threshing floor under sun.', priority: 'high' },
  { id: 'h3', stage: 'harvest', title: 'Clean & Grade Produce', description: 'Remove chaff, broken grains, and foreign matter. Grade by size for better market price.', priority: 'medium' },
  { id: 'h4', stage: 'harvest', title: 'Safe Storage', description: 'Store in cleaned, fumigated godowns or metal bins. Use Aluminum Phosphide tablets for insect control. Keep away from walls and floor.', priority: 'high' },
  { id: 'h5', stage: 'harvest', title: 'Market Timing', description: 'Check mandi prices on e-NAM portal. Avoid selling immediately after harvest when prices are lowest. Store if possible.', priority: 'medium' },
  { id: 'h6', stage: 'harvest', title: 'Residue Management', description: 'Do not burn crop residue! Use Happy Seeder or incorporate in soil. It improves soil organic carbon and fertility.', priority: 'high' },

  { id: 'c1', stage: 'completed', title: 'Soil Rejuvenation', description: 'Apply FYM or compost (5-10 tonnes/acre) after harvest. Green manuring with dhaincha/sunhemp enriches soil nitrogen.', priority: 'high' },
  { id: 'c2', stage: 'completed', title: 'Record Keeping', description: 'Note down yield, expenses, income, and lessons learned. This helps plan better for the next season.', priority: 'medium' },
  { id: 'c3', stage: 'completed', title: 'Plan Next Crop', description: 'Based on soil test results and market demand, plan the next crop. Consider intercropping for additional income.', priority: 'medium' },
  { id: 'c4', stage: 'completed', title: 'Equipment Maintenance', description: 'Service and repair farm equipment during off-season. Sharpen blades, check oil, and store properly.', priority: 'low' },
];

export const CATEGORY_SPECIFIC_TIPS: FarmingTip[] = [
  { id: 'cg1', stage: 'sowing', title: 'Zero Tillage for Wheat', description: 'Use zero-till drill after rice harvest to save water, reduce cost, and sow wheat on time. Saves ₹3000-4000/acre.', priority: 'medium', category: 'grain' },
  { id: 'cg2', stage: 'vegetative', title: 'Yellow Rust Alert (Wheat)', description: 'If yellow spots appear on leaves, spray Propiconazole (0.1%) immediately. Spray again after 15 days if needed.', priority: 'high', category: 'grain' },
  { id: 'cg3', stage: 'vegetative', title: 'Stem Borer in Rice', description: 'Install pheromone traps. If dead hearts exceed 5%, spray Cartap Hydrochloride or Chlorantraniliprole.', priority: 'high', category: 'grain' },

  { id: 'ch1', stage: 'sowing', title: 'Raised Bed Planting', description: 'Use raised beds for vegetables to improve drainage and reduce waterlogging. Mulch with straw to conserve moisture.', priority: 'medium', category: 'horticulture' },
  { id: 'ch2', stage: 'vegetative', title: 'Staking & Training', description: 'Stake tomatoes, cucumbers at 30-40 DAS. Prune side shoots in tomato for better fruit size and air circulation.', priority: 'high', category: 'horticulture' },
  { id: 'ch3', stage: 'fruiting', title: 'Harvest Vegetables Regularly', description: 'Pick vegetables like okra, brinjal, beans at right size. Regular picking promotes more fruiting and better quality.', priority: 'high', category: 'horticulture' },
  { id: 'ch4', stage: 'flowering', title: 'Hormone Spray for Fruit Set', description: 'Spray NAA (20 ppm) or Planofix on tomato during flower drop to improve fruit setting.', priority: 'medium', category: 'horticulture' },

  { id: 'cp1', stage: 'sowing', title: 'Rhizobium Inoculation', description: 'Treat pulse seeds with Rhizobium culture (200g per 10kg seed) for biological nitrogen fixation. Saves fertilizer cost.', priority: 'high', category: 'pulse' },
  { id: 'cp2', stage: 'flowering', title: 'Pod Borer Management', description: 'Install pheromone traps at 5/acre. Spray HaNPV or Bt at 50% flowering. Use Emamectin Benzoate if severe.', priority: 'high', category: 'pulse' },
  { id: 'cp3', stage: 'vegetative', title: 'Nipping in Chana', description: 'Nip (pinch) the terminal growing tip at 35-40 DAS to promote branching and increase pod number.', priority: 'medium', category: 'pulse' },

  { id: 'co1', stage: 'sowing', title: 'PSB Application', description: 'Apply Phosphate Solubilizing Bacteria (PSB) with seed or in soil for better phosphorus availability to oilseed crops.', priority: 'medium', category: 'oilseed' },
  { id: 'co2', stage: 'flowering', title: 'Boron for Mustard', description: 'Spray Borax (0.2%) at flowering stage in mustard for better seed setting and oil content.', priority: 'medium', category: 'oilseed' },
  { id: 'co3', stage: 'vegetative', title: 'Aphid Control in Mustard', description: 'Spray Dimethoate (0.03%) if 25-30 aphids per plant are seen. Spray only in evening to save beneficial insects.', priority: 'high', category: 'oilseed' },

  { id: 'cs1', stage: 'sowing', title: 'Deep Planting for Turmeric/Ginger', description: 'Plant rhizomes 5-7cm deep in raised beds with 25cm spacing. Mulch heavily with dry leaves (10-12 tonnes/acre).', priority: 'high', category: 'spice' },
  { id: 'cs2', stage: 'vegetative', title: 'Earthing Up in Spices', description: 'Do earthing up at 40-60 and 90-120 DAS for turmeric/ginger. It promotes rhizome development and prevents sun damage.', priority: 'high', category: 'spice' },
  { id: 'cs3', stage: 'fruiting', title: 'Chilli Fruit Rot Prevention', description: 'Spray Copper Oxychloride (0.3%) at 15-day intervals during rainy season to prevent Anthracnose fruit rot.', priority: 'high', category: 'spice' },
];

export function getTipsForStage(stage: GrowthStage, category?: CropCategory): FarmingTip[] {
  const generalForStage = GENERAL_TIPS.filter(t => t.stage === stage);
  const categoryForStage = category
    ? CATEGORY_SPECIFIC_TIPS.filter(t => t.stage === stage && t.category === category)
    : [];

  return [...categoryForStage, ...generalForStage].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getUpcomingTips(currentStage: GrowthStage, category?: CropCategory): FarmingTip[] {
  const stages: GrowthStage[] = ['planning', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'ripening', 'harvest', 'completed'];
  const currentIndex = stages.indexOf(currentStage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

  const currentTips = getTipsForStage(currentStage, category);
  const nextTips = nextStage ? getTipsForStage(nextStage, category).slice(0, 3) : [];

  return [...currentTips, ...nextTips];
}
