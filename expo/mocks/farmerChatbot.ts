import type { Season } from '@/mocks/cropSuggestions';

export type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
};

type ReplyContext = {
  query: string;
  language: string | null;
  season: Season;
  location: string | null;
  topCropNames: string[];
};

const SEASON_TEXT: Record<Season, { en: string; hi: string }> = {
  kharif: { en: 'Kharif', hi: 'खरीफ' },
  rabi: { en: 'Rabi', hi: 'रबी' },
  zaid: { en: 'Zaid', hi: 'जायद' },
};

const MAX_TOP_CROP_HINTS = 3;

function isLanguageHindi(language: string | null): boolean {
  return language === 'hi';
}

function hasKeyword(query: string, keywords: string[]): boolean {
  const normalized = query.toLowerCase();
  return keywords.some(keyword => normalized.includes(keyword));
}

export function createBotWelcomeMessage(language: string | null): ChatMessage {
  return {
    id: 'welcome',
    role: 'bot',
    text: isLanguageHindi(language)
      ? 'नमस्ते किसान मित्र! आप फसल, खाद, सिंचाई, मौसम और रोग नियंत्रण से जुड़े सवाल पूछ सकते हैं।'
      : 'Hello farmer! Ask me about crops, fertilizer, irrigation, weather, and pest control.',
  };
}

export function getFarmerChatbotReply({
  query,
  language,
  season,
  location,
  topCropNames,
}: ReplyContext): string {
  const hindi = isLanguageHindi(language);
  const seasonLabel = SEASON_TEXT[season][hindi ? 'hi' : 'en'];
  const suggestedCrops = topCropNames.length > 0 ? topCropNames.slice(0, MAX_TOP_CROP_HINTS).join(', ') : null;

  if (hasKeyword(query, ['fertilizer', 'खाद', 'उर्वरक', 'npk'])) {
    return hindi
      ? 'पहले मिट्टी परीक्षण के आधार पर संतुलित NPK दें। एक बार में ज्यादा यूरिया देने के बजाय 2-3 भागों में दें और सिंचाई के साथ दें।'
      : 'Use balanced NPK based on your soil test. Split nitrogen into 2-3 doses instead of one heavy urea application and apply with irrigation.';
  }

  if (hasKeyword(query, ['water', 'irrigation', 'सिंचाई', 'पानी'])) {
    return hindi
      ? 'सिंचाई मिट्टी की नमी देखकर करें। सुबह या शाम पानी दें, और मल्चिंग से नमी बचती है। अधिक पानी देने से जड़ रोग बढ़ सकते हैं।'
      : 'Irrigate based on soil moisture, preferably in morning/evening. Mulching helps retain moisture, and overwatering can increase root diseases.';
  }

  if (hasKeyword(query, ['disease', 'pest', 'कीट', 'रोग'])) {
    return hindi
      ? 'रोग/कीट दिखते ही प्रभावित पत्तियाँ हटाएँ, खेत साफ रखें, और अनुशंसित दवा सही मात्रा में ही छिड़कें।'
      : 'At first signs of pest/disease, remove affected leaves, keep the field clean, and spray recommended control in the right dosage only.';
  }

  if (hasKeyword(query, ['weather', 'rain', 'मौसम', 'बारिश'])) {
    return hindi
      ? 'मौसम पूर्वानुमान देखते रहें और उसी के अनुसार सिंचाई/स्प्रे की योजना बनाएं। बारिश से पहले स्प्रे न करें और खेत में जल निकास रखें।'
      : 'Track weather forecast and plan irrigation/sprays accordingly. Avoid spraying before rain and maintain drainage to prevent waterlogging.';
  }

  if (suggestedCrops) {
    return hindi
      ? `${location ?? 'आपके क्षेत्र'} में ${seasonLabel} सीजन के लिए ${suggestedCrops} अच्छे विकल्प लग रहे हैं। लागत और पानी की उपलब्धता देखकर चुनें।`
      : `${suggestedCrops} look like strong options for ${seasonLabel} in ${location ?? 'your area'}. Choose based on your budget and water availability.`;
  }

  return hindi
    ? 'यह अच्छा सवाल है। कृपया फसल, मिट्टी, पानी, या कीट/रोग के बारे में थोड़ा और विस्तार से लिखें ताकि मैं बेहतर सुझाव दे सकूँ।'
    : 'Good question. Please add a little more detail about your crop, soil, water, or pest issue so I can suggest better next steps.';
}
