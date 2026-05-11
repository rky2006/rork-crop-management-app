import { SoilReport, FarmingType, CropCategory, SoilType, GrowthStage } from '@/types/crop';

export interface FertilizerSuggestion {
  id: string;
  title: string;
  description: string;
  dosage: string;
  timing: string;
  priority: 'high' | 'medium' | 'low';
  stage: GrowthStage | 'all';
  type: 'fertilizer' | 'amendment' | 'micronutrient' | 'bio';
}

interface NutrientLevel {
  status: 'deficient' | 'low' | 'medium' | 'adequate' | 'high' | 'excess';
  label: string;
}

function parseNutrientLevel(value: string, thresholds: { low: number; medium: number; high: number }): NutrientLevel {
  const num = parseFloat(value);
  if (isNaN(num)) return { status: 'medium', label: 'Not tested' };
  if (num < thresholds.low) return { status: 'deficient', label: 'Deficient' };
  if (num < thresholds.medium) return { status: 'low', label: 'Low' };
  if (num < thresholds.high) return { status: 'medium', label: 'Medium' };
  return { status: 'adequate', label: 'Adequate' };
}

function parsePh(value: string): { status: 'acidic' | 'neutral' | 'alkaline'; label: string } {
  const num = parseFloat(value);
  if (isNaN(num)) return { status: 'neutral', label: 'Not tested' };
  if (num < 6.0) return { status: 'acidic', label: `Acidic (${num})` };
  if (num <= 7.5) return { status: 'neutral', label: `Neutral (${num})` };
  return { status: 'alkaline', label: `Alkaline (${num})` };
}

export function analyzeSoilReport(report: SoilReport): {
  phStatus: { status: string; label: string };
  nitrogen: NutrientLevel;
  phosphorus: NutrientLevel;
  potassium: NutrientLevel;
  organicCarbon: NutrientLevel;
  sulphur: NutrientLevel;
  zinc: NutrientLevel;
  iron: NutrientLevel;
  boron: NutrientLevel;
  waterPhStatus: { status: string; label: string };
} {
  return {
    phStatus: parsePh(report.ph),
    nitrogen: parseNutrientLevel(report.nitrogen, { low: 140, medium: 280, high: 560 }),
    phosphorus: parseNutrientLevel(report.phosphorus, { low: 10, medium: 25, high: 50 }),
    potassium: parseNutrientLevel(report.potassium, { low: 110, medium: 280, high: 400 }),
    organicCarbon: parseNutrientLevel(report.organicCarbon, { low: 0.4, medium: 0.75, high: 1.0 }),
    sulphur: parseNutrientLevel(report.sulphur, { low: 10, medium: 20, high: 40 }),
    zinc: parseNutrientLevel(report.zinc, { low: 0.6, medium: 1.2, high: 2.0 }),
    iron: parseNutrientLevel(report.iron, { low: 2.5, medium: 4.5, high: 8.0 }),
    boron: parseNutrientLevel(report.boron, { low: 0.5, medium: 1.0, high: 2.0 }),
    waterPhStatus: parsePh(report.waterPh),
  };
}

export function getFertilizerSuggestions(
  report: SoilReport,
  farmingType: FarmingType,
  cropName: string,
  category: CropCategory,
  currentStage: GrowthStage,
): FertilizerSuggestion[] {
  const suggestions: FertilizerSuggestion[] = [];
  const analysis = analyzeSoilReport(report);
  const isOrganic = farmingType === 'organic';
  let idCounter = 1;

  const phVal = parseFloat(report.ph);
  if (!isNaN(phVal)) {
    if (phVal < 5.5) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: isOrganic ? 'Apply Wood Ash / Dolomite Lime' : 'Apply Agricultural Lime',
        description: isOrganic
          ? `Soil pH is acidic (${phVal}). Apply wood ash at 400-500 kg/acre or dolomite lime to raise pH. Wood ash also adds potash and micronutrients.`
          : `Soil pH is acidic (${phVal}). Apply agricultural lime (CaCO3) at 400-800 kg/acre to raise soil pH. Lime also provides calcium.`,
        dosage: isOrganic ? 'Wood ash 400-500 kg/acre' : 'Lime 400-800 kg/acre',
        timing: '2-3 weeks before sowing',
        priority: 'high',
        stage: 'planning',
        type: 'amendment',
      });
    } else if (phVal > 8.0) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: isOrganic ? 'Apply Sulphur-rich Compost / FYM' : 'Apply Gypsum',
        description: isOrganic
          ? `Soil pH is alkaline (${phVal}). Apply well-decomposed FYM 8-10 tonnes/acre and sulphur-rich compost. Green manuring with Dhaincha helps lower pH naturally.`
          : `Soil pH is alkaline (${phVal}). Apply Gypsum (CaSO4) at 200-400 kg/acre. Gypsum helps reduce soil alkalinity and improves soil structure.`,
        dosage: isOrganic ? 'FYM 8-10 tonnes/acre' : 'Gypsum 200-400 kg/acre',
        timing: 'Before land preparation',
        priority: 'high',
        stage: 'planning',
        type: 'amendment',
      });
    }
  }

  const nLevel = analysis.nitrogen;
  if (nLevel.status === 'deficient' || nLevel.status === 'low') {
    if (isOrganic) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Apply FYM + Vermicompost for Nitrogen',
        description: `Nitrogen is ${nLevel.label}. Apply well-decomposed FYM at 8-10 tonnes/acre + Vermicompost 2-3 tonnes/acre. Also apply Azotobacter/Azospirillum bio-fertilizer at 4-5 kg/acre for biological nitrogen fixation.`,
        dosage: 'FYM 8-10 t/acre + Vermicompost 2-3 t/acre + Azotobacter 4-5 kg/acre',
        timing: 'FYM at land prep, bio-fertilizer with seed treatment',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Green Manuring with Dhaincha/Sunhemp',
        description: 'Grow green manure crop (Dhaincha or Sunhemp) for 45-60 days and incorporate into soil. This adds 25-30 kg Nitrogen per acre naturally and improves soil organic matter.',
        dosage: 'Seed rate: 8-10 kg/acre',
        timing: '45-60 days before main crop sowing',
        priority: 'medium',
        stage: 'planning',
        type: 'bio',
      });
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Neem Cake Application',
        description: 'Apply neem cake at 200-250 kg/acre. Neem cake is a slow-release nitrogen source, also acts as nematicide and improves soil health.',
        dosage: 'Neem cake 200-250 kg/acre',
        timing: 'At sowing or basal',
        priority: 'medium',
        stage: 'sowing',
        type: 'bio',
      });
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Jeevamrut / Panchagavya Spray',
        description: 'Prepare Jeevamrut (desi cow dung + urine + jaggery + pulse flour + water) and apply through drip or drenching at 200L/acre every 15 days. Rich in beneficial microbes and nutrients.',
        dosage: '200 L/acre every 15 days',
        timing: 'From sowing to vegetative stage',
        priority: 'medium',
        stage: 'vegetative',
        type: 'bio',
      });
    } else {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Nitrogen Deficient - Apply Urea/DAP',
        description: `Nitrogen is ${nLevel.label}. Apply Urea (46-0-0) in split doses. Basal: 30-40 kg Urea/acre with DAP. Top dress: 35-40 kg Urea/acre at tillering/vegetative stage.`,
        dosage: 'Urea 70-80 kg/acre in 2-3 splits',
        timing: 'Basal + top dressing at 25-30 DAS',
        priority: 'high',
        stage: 'all',
        type: 'fertilizer',
      });
    }
  }

  const pLevel = analysis.phosphorus;
  if (pLevel.status === 'deficient' || pLevel.status === 'low') {
    if (isOrganic) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Apply Rock Phosphate + PSB',
        description: `Phosphorus is ${pLevel.label}. Apply rock phosphate at 100-150 kg/acre along with PSB (Phosphate Solubilizing Bacteria) at 4-5 kg/acre. PSB converts locked phosphorus into available form.`,
        dosage: 'Rock phosphate 100-150 kg/acre + PSB 4-5 kg/acre',
        timing: 'Rock phosphate at land prep, PSB with seed',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Bone Meal Application',
        description: 'Apply steamed bone meal at 50-80 kg/acre. Bone meal is an excellent organic phosphorus source with 20-24% P2O5 and also provides calcium.',
        dosage: 'Bone meal 50-80 kg/acre',
        timing: 'At land preparation',
        priority: 'medium',
        stage: 'planning',
        type: 'bio',
      });
    } else {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Phosphorus Deficient - Apply DAP/SSP',
        description: `Phosphorus is ${pLevel.label}. Apply DAP (18-46-0) at 50-65 kg/acre as basal dose. Alternatively, use Single Super Phosphate (SSP) at 100-125 kg/acre which also supplies sulphur and calcium.`,
        dosage: 'DAP 50-65 kg/acre or SSP 100-125 kg/acre',
        timing: 'Full dose as basal at sowing',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  const kLevel = analysis.potassium;
  if (kLevel.status === 'deficient' || kLevel.status === 'low') {
    if (isOrganic) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Apply Wood Ash + Banana Stem Compost',
        description: `Potassium is ${kLevel.label}. Apply wood ash at 300-400 kg/acre (rich in K). Also compost banana stems, coconut husk, or other K-rich plant residues.`,
        dosage: 'Wood ash 300-400 kg/acre',
        timing: 'At land preparation',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
    } else {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Potassium Deficient - Apply MOP/SOP',
        description: `Potassium is ${kLevel.label}. Apply Muriate of Potash (MOP, 0-0-60) at 30-50 kg/acre. For salt-sensitive crops like potato/tomato, use Sulphate of Potash (SOP) instead.`,
        dosage: 'MOP 30-50 kg/acre or SOP 40-60 kg/acre',
        timing: 'Basal dose at sowing',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  const sLevel = analysis.sulphur;
  if (sLevel.status === 'deficient' || sLevel.status === 'low') {
    if (isOrganic) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Apply Elemental Sulphur + Gypsum',
        description: `Sulphur is ${sLevel.label}. Apply natural gypsum at 100-150 kg/acre. Especially important for oilseeds (mustard, groundnut) and onion/garlic for pungency.`,
        dosage: 'Natural gypsum 100-150 kg/acre',
        timing: 'At land preparation',
        priority: category === 'oilseed' || cropName === 'Onion' || cropName === 'Garlic' ? 'high' : 'medium',
        stage: 'planning',
        type: 'amendment',
      });
    } else {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Sulphur Deficient - Apply Bentonite Sulphur/SSP',
        description: `Sulphur is ${sLevel.label}. Apply Bentonite Sulphur at 10-15 kg/acre or use SSP instead of DAP (SSP contains 12% S). Critical for oilseeds and allium crops.`,
        dosage: 'Bentonite Sulphur 10-15 kg/acre',
        timing: 'At sowing as basal',
        priority: category === 'oilseed' || cropName === 'Onion' || cropName === 'Garlic' ? 'high' : 'medium',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  const znLevel = analysis.zinc;
  if (znLevel.status === 'deficient' || znLevel.status === 'low') {
    if (isOrganic) {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Zinc Deficient - Apply Chelated Zinc',
        description: `Zinc is ${znLevel.label}. Spray chelated zinc (Zn-EDTA) at 0.5% solution twice during vegetative stage. Also apply zinc-enriched vermicompost.`,
        dosage: 'Zn-EDTA 0.5% foliar spray',
        timing: 'Spray at 25 and 45 DAS',
        priority: 'high',
        stage: 'vegetative',
        type: 'micronutrient',
      });
    } else {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Zinc Deficient - Apply Zinc Sulphate',
        description: `Zinc is ${znLevel.label}. Apply Zinc Sulphate (ZnSO4) at 10 kg/acre as basal. Critical for rice, wheat, maize — zinc deficiency causes stunted growth and poor grain filling.`,
        dosage: 'ZnSO4 10 kg/acre (basal) or 0.5% foliar spray',
        timing: 'Basal at sowing or foliar at 25-30 DAS',
        priority: 'high',
        stage: 'sowing',
        type: 'micronutrient',
      });
    }
  }

  const feLevel = analysis.iron;
  if (feLevel.status === 'deficient' || feLevel.status === 'low') {
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: isOrganic ? 'Iron Deficient - Apply Iron Chelate' : 'Iron Deficient - Apply Ferrous Sulphate',
      description: `Iron is ${feLevel.label}. ${isOrganic
        ? 'Spray Fe-EDTA chelated iron at 0.5% twice. Also apply FYM which helps in iron availability.'
        : 'Apply Ferrous Sulphate (FeSO4) at 10-15 kg/acre as basal or spray 1% FeSO4 + 0.5% lime solution on leaves.'
      }`,
      dosage: isOrganic ? 'Fe-EDTA 0.5% foliar spray' : 'FeSO4 10-15 kg/acre or 1% foliar spray',
      timing: 'Spray at vegetative stage',
      priority: 'medium',
      stage: 'vegetative',
      type: 'micronutrient',
    });
  }

  const bLevel = analysis.boron;
  if (bLevel.status === 'deficient' || bLevel.status === 'low') {
    const isBoronCritical = ['Mustard', 'Sunflower', 'Cauliflower', 'Tomato', 'Groundnut'].includes(cropName);
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'Boron Deficient - Apply Borax',
      description: `Boron is ${bLevel.label}. ${isOrganic
        ? 'Spray Borax 0.2% at flowering stage. Boron deficiency causes hollow stem in cauliflower, poor pod set in mustard, and flower drop in tomato.'
        : 'Apply Borax at 4 kg/acre as basal or spray 0.2% solution at flowering. Critical for oilseeds, vegetables, and pulses.'
      }`,
      dosage: isOrganic ? 'Borax 0.2% foliar spray' : 'Borax 4 kg/acre basal or 0.2% foliar',
      timing: 'Basal at sowing + foliar at flowering',
      priority: isBoronCritical ? 'high' : 'medium',
      stage: 'flowering',
      type: 'micronutrient',
    });
  }

  const ocLevel = analysis.organicCarbon;
  if (ocLevel.status === 'deficient' || ocLevel.status === 'low') {
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'Low Organic Carbon - Improve Soil Health',
      description: isOrganic
        ? `Organic carbon is ${ocLevel.label}. Apply FYM 10-12 tonnes/acre + Vermicompost 3-4 tonnes/acre. Do green manuring every alternate season. Mulch crop residues instead of burning. Practice crop rotation with legumes.`
        : `Organic carbon is ${ocLevel.label}. Apply FYM/compost at 6-8 tonnes/acre. Incorporate crop residues instead of burning. Low organic carbon reduces fertilizer efficiency by 30-40%.`,
      dosage: isOrganic ? 'FYM 10-12 t/acre + Vermicompost 3-4 t/acre' : 'FYM 6-8 tonnes/acre',
      timing: '3-4 weeks before sowing',
      priority: 'high',
      stage: 'planning',
      type: 'amendment',
    });
  }

  if (isOrganic) {
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'Organic Pest Management with Neem',
      description: 'Use Neem oil spray (5ml/L) or Neem kernel extract for pest control. Neem is effective against 200+ insect species and is safe for beneficial insects and humans.',
      dosage: 'Neem oil 5ml/L water spray',
      timing: 'Every 10-15 days during pest-prone stages',
      priority: 'medium',
      stage: 'vegetative',
      type: 'bio',
    });
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'Apply Trichoderma Bio-Fungicide',
      description: 'Apply Trichoderma viride at 4-5 kg/acre mixed with FYM for soil-borne disease prevention. Also use as seed treatment at 8-10g/kg seed. Prevents wilt, root rot, and damping off.',
      dosage: 'Trichoderma 4-5 kg/acre + seed treatment 8-10g/kg',
      timing: 'At land prep (soil) + sowing (seed)',
      priority: 'medium',
      stage: 'planning',
      type: 'bio',
    });
    if (category === 'pulse') {
      suggestions.push({
        id: `fs-${idCounter++}`,
        title: 'Rhizobium + PSB for Pulse Crops',
        description: 'Treat pulse seeds with Rhizobium culture at 200g per 10kg seed + PSB at 200g per 10kg seed. This fixes 20-40 kg Nitrogen/acre biologically and makes phosphorus available.',
        dosage: 'Rhizobium 200g + PSB 200g per 10kg seed',
        timing: 'Seed treatment before sowing',
        priority: 'high',
        stage: 'sowing',
        type: 'bio',
      });
    }
  }

  const waterPh = parseFloat(report.waterPh);
  if (!isNaN(waterPh) && waterPh > 8.5) {
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'High Water pH - Use Gypsum in Irrigation',
      description: `Irrigation water pH is high (${waterPh}). Apply Gypsum at 200 kg/acre to counteract alkalinity. If using drip, add Sulphuric acid to lower water pH to 6.5-7.0.`,
      dosage: isOrganic ? 'Natural gypsum 200 kg/acre' : 'Gypsum 200 kg/acre or H2SO4 in drip',
      timing: 'Before each irrigation season',
      priority: 'high',
      stage: 'all',
      type: 'amendment',
    });
  }

  const waterEc = parseFloat(report.waterEc);
  if (!isNaN(waterEc) && waterEc > 2.0) {
    suggestions.push({
      id: `fs-${idCounter++}`,
      title: 'High EC Water - Salt Management',
      description: `Water EC is high (${waterEc} dS/m). Use salt-tolerant crops/varieties. Apply extra organic matter to improve soil structure. Give heavy pre-sowing irrigation to leach salts.`,
      dosage: 'Extra FYM 4-5 tonnes/acre + leaching irrigation',
      timing: 'Before sowing season',
      priority: 'high',
      stage: 'planning',
      type: 'amendment',
    });
  }

  const cropSpecificSuggestions = getCropSpecificFertilizer(cropName, farmingType, report);
  suggestions.push(...cropSpecificSuggestions.map((s, i) => ({ ...s, id: `fs-crop-${i + 1}` })));

  return suggestions;
}

function getCropSpecificFertilizer(cropName: string, farmingType: FarmingType, report: SoilReport): Omit<FertilizerSuggestion, 'id'>[] {
  const isOrganic = farmingType === 'organic';
  const suggestions: Omit<FertilizerSuggestion, 'id'>[] = [];

  const cropLower = cropName.toLowerCase();

  if (cropLower === 'wheat' || cropLower === 'rice' || cropLower === 'maize') {
    if (isOrganic) {
      suggestions.push({
        title: `Organic Basal Dose for ${cropName}`,
        description: `Apply FYM 8-10 tonnes/acre + Vermicompost 2 tonnes/acre + Rock phosphate 80 kg/acre + Wood ash 200 kg/acre. Also apply Azotobacter/Azospirillum for nitrogen fixation.`,
        dosage: 'FYM 8-10t + Vermicompost 2t + Rock phosphate 80kg + Wood ash 200kg per acre',
        timing: 'At land preparation, 2-3 weeks before sowing',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
      suggestions.push({
        title: 'Organic Top Dressing - Jeevamrut',
        description: 'Apply Jeevamrut (cow dung + cow urine + jaggery + pulse flour + soil in water) at 200L/acre through irrigation at 25 and 45 DAS for nitrogen supplementation.',
        dosage: '200 L/acre at each application',
        timing: '25 DAS and 45 DAS',
        priority: 'high',
        stage: 'vegetative',
        type: 'bio',
      });
    } else {
      suggestions.push({
        title: `Recommended NPK for ${cropName}`,
        description: `Apply DAP 50-55 kg + MOP 25-30 kg + Urea 40 kg (in splits) per acre. First Urea split at sowing, second at tillering (25-30 DAS), third at flowering.`,
        dosage: 'DAP 50-55 kg + MOP 25-30 kg + Urea 80 kg/acre (splits)',
        timing: 'DAP+MOP basal, Urea in 2-3 splits',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  if (cropLower === 'tomato' || cropLower === 'chilli' || cropLower === 'brinjal') {
    if (isOrganic) {
      suggestions.push({
        title: `Organic Nutrition for ${cropName}`,
        description: 'Apply FYM 10 tonnes + Vermicompost 3 tonnes + Neem cake 200 kg + Bone meal 50 kg per acre. Use Panchagavya spray (3%) every 15 days for growth and immunity.',
        dosage: 'FYM 10t + Vermicompost 3t + Neem cake 200kg + Bone meal 50kg/acre',
        timing: 'FYM at land prep, others at transplanting',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
      suggestions.push({
        title: 'Organic Calcium + Boron for Fruit Quality',
        description: 'Spray calcium chloride 0.5% + Borax 0.2% at flowering to prevent blossom end rot and improve fruit set. Also apply seaweed extract at 2ml/L for better flowering.',
        dosage: 'CaCl2 0.5% + Borax 0.2% foliar spray',
        timing: 'At flowering and every 15 days after',
        priority: 'high',
        stage: 'flowering',
        type: 'micronutrient',
      });
    } else {
      suggestions.push({
        title: `Vegetable Crop NPK for ${cropName}`,
        description: 'Apply DAP 65 kg + MOP 35 kg + Borax 4 kg + ZnSO4 10 kg per acre as basal. Top dress Urea 25-30 kg/acre at 30 and 60 days after transplanting.',
        dosage: 'DAP 65kg + MOP 35kg + Borax 4kg + ZnSO4 10kg/acre',
        timing: 'Basal at transplanting + Urea top dress',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  if (cropLower === 'onion' || cropLower === 'garlic') {
    if (isOrganic) {
      suggestions.push({
        title: `Organic Sulphur for ${cropName}`,
        description: 'Apply natural gypsum 150 kg/acre + FYM 10 tonnes + Vermicompost 3 tonnes/acre. Sulphur is critical for pungency and storage life. Apply Trichoderma for disease prevention.',
        dosage: 'Gypsum 150 kg + FYM 10t + Vermicompost 3t/acre',
        timing: 'At land preparation',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
    } else {
      suggestions.push({
        title: `Sulphur-rich Fertilization for ${cropName}`,
        description: 'Use SSP instead of DAP to supply sulphur. Apply SSP 100 kg + MOP 35 kg + Sulphur 10 kg per acre. Sulphur increases pungency, storage life, and market value.',
        dosage: 'SSP 100 kg + MOP 35 kg + Sulphur 10 kg/acre',
        timing: 'Basal at transplanting',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  if (cropLower.includes('groundnut') || cropLower.includes('soybean') || cropLower.includes('mustard')) {
    if (isOrganic) {
      suggestions.push({
        title: `Organic Protocol for ${cropName}`,
        description: 'Apply FYM 8 tonnes + Vermicompost 2 tonnes + Rock phosphate 100 kg + Natural gypsum 200 kg per acre. Use Rhizobium + PSB seed treatment. Gypsum is critical for pod/seed filling.',
        dosage: 'FYM 8t + Rock phosphate 100kg + Gypsum 200kg/acre',
        timing: 'At land preparation + seed treatment at sowing',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
    } else {
      suggestions.push({
        title: `Oilseed NPK for ${cropName}`,
        description: 'Apply DAP 40-50 kg + MOP 20 kg + Sulphur 15 kg + Gypsum 200 kg per acre. Oilseeds need extra sulphur for oil content. Use Rhizobium for biological nitrogen.',
        dosage: 'DAP 40-50 kg + MOP 20 kg + Sulphur 15 kg + Gypsum 200 kg/acre',
        timing: 'Basal at sowing',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  if (cropLower.includes('chana') || cropLower.includes('moong') || cropLower.includes('urad') || cropLower.includes('tur') || cropLower.includes('masoor')) {
    if (isOrganic) {
      suggestions.push({
        title: `Organic Protocol for Pulse Crop (${cropName})`,
        description: 'Pulses fix their own nitrogen! Apply Rhizobium + PSB seed treatment. Basal: FYM 6 tonnes + Rock phosphate 80 kg + Wood ash 150 kg per acre. Avoid excess nitrogen — it reduces nodulation.',
        dosage: 'FYM 6t + Rock phosphate 80kg + Wood ash 150kg/acre',
        timing: 'FYM at land prep, seed treatment at sowing',
        priority: 'high',
        stage: 'planning',
        type: 'bio',
      });
    } else {
      suggestions.push({
        title: `Pulse Crop Fertilization (${cropName})`,
        description: 'Pulses need low nitrogen but high phosphorus. Apply DAP 40 kg + MOP 10-15 kg per acre. Use Rhizobium seed treatment to save 25% nitrogen. Do not over-apply urea.',
        dosage: 'DAP 40 kg + MOP 10-15 kg/acre + Rhizobium seed treatment',
        timing: 'Basal at sowing',
        priority: 'high',
        stage: 'sowing',
        type: 'fertilizer',
      });
    }
  }

  return suggestions;
}

export function getSoilHealthSummary(report: SoilReport): { score: number; label: string; color: string; issues: string[] } {
  const analysis = analyzeSoilReport(report);
  let score = 100;
  const issues: string[] = [];

  if (analysis.phStatus.status === 'acidic') { score -= 15; issues.push('Soil pH is acidic'); }
  if (analysis.phStatus.status === 'alkaline') { score -= 15; issues.push('Soil pH is alkaline'); }
  if (analysis.nitrogen.status === 'deficient') { score -= 15; issues.push('Nitrogen is deficient'); }
  else if (analysis.nitrogen.status === 'low') { score -= 8; issues.push('Nitrogen is low'); }
  if (analysis.phosphorus.status === 'deficient') { score -= 12; issues.push('Phosphorus is deficient'); }
  else if (analysis.phosphorus.status === 'low') { score -= 6; issues.push('Phosphorus is low'); }
  if (analysis.potassium.status === 'deficient') { score -= 12; issues.push('Potassium is deficient'); }
  else if (analysis.potassium.status === 'low') { score -= 6; issues.push('Potassium is low'); }
  if (analysis.organicCarbon.status === 'deficient') { score -= 15; issues.push('Organic carbon is very low'); }
  else if (analysis.organicCarbon.status === 'low') { score -= 8; issues.push('Organic carbon is low'); }
  if (analysis.sulphur.status === 'deficient' || analysis.sulphur.status === 'low') { score -= 5; issues.push('Sulphur is low'); }
  if (analysis.zinc.status === 'deficient' || analysis.zinc.status === 'low') { score -= 5; issues.push('Zinc is deficient'); }
  if (analysis.iron.status === 'deficient' || analysis.iron.status === 'low') { score -= 4; issues.push('Iron is low'); }
  if (analysis.boron.status === 'deficient' || analysis.boron.status === 'low') { score -= 4; issues.push('Boron is low'); }

  score = Math.max(0, Math.min(100, score));

  let label = 'Poor';
  let color = '#DC2626';
  if (score >= 80) { label = 'Excellent'; color = '#059669'; }
  else if (score >= 60) { label = 'Good'; color = '#16A34A'; }
  else if (score >= 40) { label = 'Fair'; color = '#D97706'; }
  else if (score >= 20) { label = 'Poor'; color = '#EA580C'; }

  return { score, label, color, issues };
}
