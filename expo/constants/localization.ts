import { ActivityType, CropCategory, FarmingType, GrowthStage } from '@/types/crop';

export type Language = 'en' | 'hi';

type TranslationValue = string | TranslationTree;
interface TranslationTree {
  [key: string]: TranslationValue;
}

export const LANGUAGE_OPTIONS: Array<{ code: Language; nativeLabel: string; englishLabel: string; shortLabel: string }> = [
  { code: 'en', nativeLabel: 'English', englishLabel: 'English', shortLabel: 'EN' },
  { code: 'hi', nativeLabel: 'हिन्दी', englishLabel: 'Hindi', shortLabel: 'हि' },
];

const translations: Record<Language, TranslationTree> = {
  en: {
    common: {
      language: 'Language',
      selectLanguage: 'Select language',
      enable: 'Enable',
      retry: 'Retry',
      loading: 'Loading…',
      location: 'Location',
      refresh: 'Refresh',
      weather: 'Weather',
      today: 'Today',
      current: 'Current',
      all: 'All',
    },
    tabs: {
      dashboard: 'Dashboard',
      crops: 'My Crops',
      activities: 'Activities',
      disease: 'Disease Scan',
    },
    stack: {
      addCrop: 'Add New Crop',
      cropDetail: 'Crop Details',
      addActivity: 'Log Activity',
      soilReport: 'Soil & Water Report',
      diseaseDiagnosis: 'Disease Diagnosis',
      back: 'Back',
    },
    dashboard: {
      greeting: 'Namaste, Farmer!',
      activeCropsGrowing: 'You have {{count}} active {{cropWord}} growing',
      cropSingular: 'crop',
      cropPlural: 'crops',
      addFirstCropPrompt: 'Start by adding your first crop',
      active: 'Active',
      harvestingSoon: 'Harvesting Soon',
      activities: 'Activities',
      harvested: 'Harvested',
      activeCrops: 'Active Crops',
      seeAll: 'See All',
      upcomingHarvests: 'Upcoming Harvests',
      recentActivities: 'Recent Activities',
      readyToHarvest: 'Ready to harvest',
      daysToHarvest: '{{count}}d to harvest',
      expectedHarvest: 'Expected: {{date}} ({{days}}d)',
      welcomeTitle: 'Welcome to Kishan!',
      welcomeSubtitle: 'Start managing your crops from sowing to harvest. Tap the + button to add your first crop.',
      addFirstCrop: 'Add First Crop',
    },
    weather: {
      title: 'Weather-based farming tips',
      subtitle: 'Use your location to see today’s field conditions and practical crop advice.',
      permissionTitle: 'Enable location for weather insights',
      permissionDescription: 'Get heat, rain, wind, and humidity guidance tailored to your area.',
      permissionDenied: 'Location access is off. Enable it to view local weather farming tips.',
      loadingLocation: 'Finding your farm area…',
      loadingWeather: 'Fetching the latest weather…',
      summary: '{{description}} near {{location}}',
      tipHeat: 'High heat is expected today. Irrigate in the early morning or evening and avoid foliar sprays during peak sun.',
      tipRain: 'Rain chances are high. Improve drainage, postpone chemical sprays, and inspect low-lying plots for waterlogging.',
      tipWind: 'Strong winds are expected. Avoid spraying, support tender plants, and secure shade nets or mulch sheets.',
      tipHumidity: 'Humidity is elevated. Scout closely for fungal diseases and keep canopy airflow open where possible.',
      tipCool: 'Temperatures are mild today. Use this window for transplanting, weeding, or nutrient application if the soil is workable.',
      tipGeneral: 'Review irrigation, pest scouting, and spray plans against the local forecast before starting field work.',
      temperature: 'Temp',
      humidity: 'Humidity',
      wind: 'Wind',
      rainChance: 'Rain chance',
      clear: 'Clear skies',
      partlyCloudy: 'Partly cloudy',
      cloudy: 'Cloudy',
      fog: 'Foggy',
      drizzle: 'Light drizzle',
      rain: 'Rain likely',
      snow: 'Cold conditions',
      storm: 'Thunderstorm risk',
      unknown: 'Changing conditions',
      locationUnavailable: 'Weather tips are unavailable right now. Please try again in a moment.',
      usesActiveCrops: 'Based on conditions around {{count}} active {{cropWord}}.',
    },
    cropsScreen: {
      showHarvested: 'Show Harvested',
      cropCount: '{{count}} {{cropWord}}',
      noCropsTitle: 'No Crops Found',
      noCropsFiltered: 'No crops in this category yet.',
      noCropsEmpty: 'Add your first crop to get started!',
      addCrop: 'Add Crop',
    },
    activitiesScreen: {
      unknownCrop: 'Unknown',
      noActivitiesTitle: 'No Activities Yet',
      noActivitiesSubtitle: 'Log your farming activities like watering, fertilizing, and more to keep track of your progress.',
      totalExpenses: 'Total Expenses',
    },
    cropDetail: {
      organic: 'Organic',
      nonOrganic: 'Non-Organic',
      progress: 'Progress',
      daysLeft: 'Days Left',
      activities: 'Activities',
      plot: 'Plot',
      size: 'Size',
      added: 'Added',
      notes: 'Notes',
      growthTimeline: 'Growth Timeline',
      updateStage: 'Update Stage',
      current: 'Current',
      advanceTo: 'Advance to {{stage}}',
      noActivities: 'No activities logged yet',
      logActivity: 'Log Activity',
      cropNotFound: 'Crop not found',
      sowed: 'Sowed',
      harvestDate: 'Harvest',
    },
    farmingTips: {
      important: 'Important',
      recommended: 'Recommended',
      goodPractice: 'Good Practice',
      cropTips: '{{cropName}} Tips',
      specificSuggestions: 'Specific suggestions for your {{cropName}} crop at {{stage}} stage',
      previewCropTips: '{{action}} {{cropName}} tips for {{stage}}',
      previewGeneralTips: '{{action}} tips for {{stage}} stage',
      previewLabel: 'Preview',
      hideLabel: 'Hide',
      showLabel: 'Show',
      showGeneralTips: '{{action}} general farming tips',
      comingUp: 'Coming Up: {{stage}}',
      generalTips: 'General Tips',
      farmingTips: 'Farming Tips',
      suggestionsForStage: 'Suggestions for the {{stage}} stage to help you produce quality harvest',
    },
  },
  hi: {
    common: {
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें',
      enable: 'चालू करें',
      retry: 'फिर से कोशिश करें',
      loading: 'लोड हो रहा है…',
      location: 'स्थान',
      refresh: 'रीफ्रेश',
      weather: 'मौसम',
      today: 'आज',
      current: 'वर्तमान',
      all: 'सभी',
    },
    tabs: {
      dashboard: 'डैशबोर्ड',
      crops: 'मेरी फसलें',
      activities: 'गतिविधियाँ',
      disease: 'रोग स्कैन',
    },
    stack: {
      addCrop: 'नई फसल जोड़ें',
      cropDetail: 'फसल विवरण',
      addActivity: 'गतिविधि दर्ज करें',
      soilReport: 'मिट्टी और पानी रिपोर्ट',
      diseaseDiagnosis: 'रोग पहचान',
      back: 'वापस',
    },
    dashboard: {
      greeting: 'नमस्ते, किसान!',
      activeCropsGrowing: 'आपकी {{count}} सक्रिय {{cropWord}} बढ़ रही हैं',
      cropSingular: 'फसल',
      cropPlural: 'फसलें',
      addFirstCropPrompt: 'अपनी पहली फसल जोड़कर शुरुआत करें',
      active: 'सक्रिय',
      harvestingSoon: 'जल्द कटाई',
      activities: 'गतिविधियाँ',
      harvested: 'कटाई हो चुकी',
      activeCrops: 'सक्रिय फसलें',
      seeAll: 'सब देखें',
      upcomingHarvests: 'आगामी कटाई',
      recentActivities: 'हाल की गतिविधियाँ',
      readyToHarvest: 'कटाई के लिए तैयार',
      daysToHarvest: 'कटाई में {{count}} दिन',
      expectedHarvest: 'अनुमानित: {{date}} ({{days}} दिन)',
      welcomeTitle: 'किशान में आपका स्वागत है!',
      welcomeSubtitle: 'बुवाई से कटाई तक अपनी फसलों का प्रबंधन शुरू करें। पहली फसल जोड़ने के लिए + दबाएँ।',
      addFirstCrop: 'पहली फसल जोड़ें',
    },
    weather: {
      title: 'मौसम आधारित खेती सुझाव',
      subtitle: 'अपने क्षेत्र की आज की मौसम स्थिति और खेत के उपयोगी सुझाव देखें।',
      permissionTitle: 'मौसम जानकारी के लिए लोकेशन चालू करें',
      permissionDescription: 'अपने क्षेत्र के तापमान, बारिश, हवा और नमी के अनुसार सलाह पाएँ।',
      permissionDenied: 'लोकेशन बंद है। स्थानीय मौसम आधारित खेती सुझाव देखने के लिए इसे चालू करें।',
      loadingLocation: 'आपके खेत का क्षेत्र खोजा जा रहा है…',
      loadingWeather: 'ताज़ा मौसम लाया जा रहा है…',
      summary: '{{location}} के आसपास {{description}}',
      tipHeat: 'आज गर्मी ज्यादा रहने की संभावना है। सिंचाई सुबह जल्दी या शाम को करें और तेज धूप में पत्तों पर स्प्रे न करें।',
      tipRain: 'बारिश की संभावना अधिक है। निकास व्यवस्था ठीक रखें, रासायनिक स्प्रे टालें और नीचे वाले खेतों में जलभराव देखें।',
      tipWind: 'तेज़ हवा चल सकती है। स्प्रे न करें, नाजुक पौधों को सहारा दें और शेड नेट या मल्च को सुरक्षित करें।',
      tipHumidity: 'नमी ज्यादा है। फफूंद रोगों की निगरानी बढ़ाएँ और पौधों के बीच हवा आने-जाने दें।',
      tipCool: 'आज तापमान संतुलित है। यदि मिट्टी उपयुक्त हो तो रोपाई, निराई या पोषक तत्व प्रबंधन के लिए अच्छा समय है।',
      tipGeneral: 'खेत का काम शुरू करने से पहले सिंचाई, कीट निगरानी और स्प्रे योजना को स्थानीय मौसम के अनुसार जाँच लें।',
      temperature: 'तापमान',
      humidity: 'नमी',
      wind: 'हवा',
      rainChance: 'बारिश की संभावना',
      clear: 'आसमान साफ',
      partlyCloudy: 'आंशिक बादल',
      cloudy: 'बादल छाए',
      fog: 'कोहरा',
      drizzle: 'हल्की फुहार',
      rain: 'बारिश संभव',
      snow: 'ठंडा मौसम',
      storm: 'आंधी/तूफान का खतरा',
      unknown: 'मौसम बदलता हुआ',
      locationUnavailable: 'अभी मौसम सुझाव उपलब्ध नहीं हैं। थोड़ी देर बाद फिर कोशिश करें।',
      usesActiveCrops: '{{count}} सक्रिय {{cropWord}} के अनुसार सलाह।',
    },
    cropsScreen: {
      showHarvested: 'कटी फसलें दिखाएँ',
      cropCount: '{{count}} {{cropWord}}',
      noCropsTitle: 'कोई फसल नहीं मिली',
      noCropsFiltered: 'इस श्रेणी में अभी कोई फसल नहीं है।',
      noCropsEmpty: 'शुरुआत करने के लिए अपनी पहली फसल जोड़ें!',
      addCrop: 'फसल जोड़ें',
    },
    activitiesScreen: {
      unknownCrop: 'अज्ञात',
      noActivitiesTitle: 'अभी कोई गतिविधि नहीं',
      noActivitiesSubtitle: 'पानी देना, खाद डालना और अन्य खेती कार्य दर्ज करें ताकि प्रगति पर नजर रहे।',
      totalExpenses: 'कुल खर्च',
    },
    cropDetail: {
      organic: 'जैविक',
      nonOrganic: 'रासायनिक',
      progress: 'प्रगति',
      daysLeft: 'बचे दिन',
      activities: 'गतिविधियाँ',
      plot: 'खेत',
      size: 'आकार',
      added: 'जोड़ा गया',
      notes: 'नोट्स',
      growthTimeline: 'विकास क्रम',
      updateStage: 'स्टेज बदलें',
      current: 'वर्तमान',
      advanceTo: '{{stage}} पर जाएँ',
      noActivities: 'अभी कोई गतिविधि दर्ज नहीं है',
      logActivity: 'गतिविधि दर्ज करें',
      cropNotFound: 'फसल नहीं मिली',
      sowed: 'बुवाई',
      harvestDate: 'कटाई',
    },
    farmingTips: {
      important: 'महत्वपूर्ण',
      recommended: 'सुझावित',
      goodPractice: 'अच्छी प्रथा',
      cropTips: '{{cropName}} सुझाव',
      specificSuggestions: 'आपकी {{cropName}} फसल के {{stage}} चरण के लिए विशेष सुझाव',
      previewCropTips: '{{cropName}} के लिए {{stage}} सुझाव {{action}}',
      previewGeneralTips: '{{stage}} चरण के सुझाव {{action}}',
      previewLabel: 'पूर्वावलोकन',
      hideLabel: 'छुपाएँ',
      showLabel: 'दिखाएँ',
      showGeneralTips: 'सामान्य खेती सुझाव {{action}}',
      comingUp: 'अगला चरण: {{stage}}',
      generalTips: 'सामान्य सुझाव',
      farmingTips: 'खेती सुझाव',
      suggestionsForStage: 'बेहतर उत्पादन के लिए {{stage}} चरण के सुझाव',
    },
  },
};

export const LOCALIZED_STAGE_LABELS: Record<Language, Record<GrowthStage, string>> = {
  en: {
    planning: 'Planning',
    sowing: 'Sowing',
    germination: 'Germination',
    vegetative: 'Vegetative',
    flowering: 'Flowering',
    fruiting: 'Fruiting',
    ripening: 'Ripening',
    harvest: 'Harvest',
    completed: 'Completed',
  },
  hi: {
    planning: 'योजना',
    sowing: 'बुवाई',
    germination: 'अंकुरण',
    vegetative: 'विकास',
    flowering: 'फूल',
    fruiting: 'फलन',
    ripening: 'पकना',
    harvest: 'कटाई',
    completed: 'पूर्ण',
  },
};

export const LOCALIZED_CATEGORY_LABELS: Record<Language, Record<CropCategory, string>> = {
  en: {
    grain: 'Grain',
    horticulture: 'Horticulture',
    pulse: 'Pulse',
    oilseed: 'Oilseed',
    spice: 'Spice',
  },
  hi: {
    grain: 'अनाज',
    horticulture: 'बागवानी',
    pulse: 'दलहन',
    oilseed: 'तिलहन',
    spice: 'मसाला',
  },
};

export const LOCALIZED_ACTIVITY_LABELS: Record<Language, Record<ActivityType, string>> = {
  en: {
    sowing: 'Sowing',
    watering: 'Watering',
    fertilizing: 'Fertilizing',
    pesticide: 'Pesticide',
    weeding: 'Weeding',
    pruning: 'Pruning',
    harvesting: 'Harvesting',
    inspection: 'Inspection',
    other: 'Other',
  },
  hi: {
    sowing: 'बुवाई',
    watering: 'सिंचाई',
    fertilizing: 'खाद डालना',
    pesticide: 'कीटनाशक',
    weeding: 'निराई',
    pruning: 'छंटाई',
    harvesting: 'कटाई',
    inspection: 'निरीक्षण',
    other: 'अन्य',
  },
};

export const LOCALIZED_FARMING_TYPE_LABELS: Record<Language, Record<FarmingType, string>> = {
  en: {
    organic: 'Organic',
    'non-organic': 'Non-Organic',
  },
  hi: {
    organic: 'जैविक',
    'non-organic': 'रासायनिक',
  },
};

function getNestedValue(tree: TranslationTree, path: string): string | undefined {
  return path.split('.').reduce<TranslationValue | undefined>((value, segment) => {
    if (typeof value === 'string' || !value) return value;
    return value[segment];
  }, tree) as string | undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => String(params[key.trim()] ?? ''));
}

export function translate(language: Language, key: string, params?: Record<string, string | number>): string {
  const template = getNestedValue(translations[language], key) ?? getNestedValue(translations.en, key) ?? key;
  return interpolate(template, params);
}

export function getStageLabel(language: Language, stage: GrowthStage): string {
  return LOCALIZED_STAGE_LABELS[language][stage] ?? LOCALIZED_STAGE_LABELS.en[stage];
}

export function getCategoryLabel(language: Language, category: CropCategory): string {
  return LOCALIZED_CATEGORY_LABELS[language][category] ?? LOCALIZED_CATEGORY_LABELS.en[category];
}

export function getActivityLabel(language: Language, type: ActivityType): string {
  return LOCALIZED_ACTIVITY_LABELS[language][type] ?? LOCALIZED_ACTIVITY_LABELS.en[type];
}

export function getFarmingTypeLabel(language: Language, type: FarmingType): string {
  return LOCALIZED_FARMING_TYPE_LABELS[language][type] ?? LOCALIZED_FARMING_TYPE_LABELS.en[type];
}
