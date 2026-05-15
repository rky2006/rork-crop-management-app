import type { Season } from '@/mocks/cropSuggestions';
import { getSupportedLanguage, type SupportedLanguageCode } from '@/constants/languages';

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

const SEASON_TEXT: Record<Season, Record<SupportedLanguageCode, string>> = {
  kharif: { en: 'Kharif', hi: 'खरीफ', gu: 'ખરીફ', mr: 'खरीप' },
  rabi: { en: 'Rabi', hi: 'रबी', gu: 'રબી', mr: 'रब्बी' },
  zaid: { en: 'Zaid', hi: 'जायद', gu: 'ઝાયદ', mr: 'झायड' },
};

const MAX_TOP_CROP_HINTS = 3;
const LOCATION_FALLBACK: Record<SupportedLanguageCode, string> = {
  en: 'your area',
  hi: 'आपके क्षेत्र',
  gu: 'તમારા વિસ્તારમાં',
  mr: 'तुमच्या भागात',
};

const CHATBOT_COPY: Record<
  SupportedLanguageCode,
  {
    welcome: string;
    fertilizer: string;
    irrigation: string;
    pest: string;
    weather: string;
    locationSuggestion: (locationText: string, seasonLabel: string, suggestedCrops: string) => string;
    fallback: string;
  }
> = {
  en: {
    welcome: 'Hello farmer! Ask me about crops, fertilizer, irrigation, weather, and pest control.',
    fertilizer: 'Use balanced NPK based on your soil test. Split nitrogen into 2-3 doses instead of one heavy urea application and apply with irrigation.',
    irrigation: 'Irrigate based on soil moisture, preferably in morning/evening. Mulching helps retain moisture, and overwatering can increase root diseases.',
    pest: 'At first signs of pest/disease, remove affected leaves, keep the field clean, and spray recommended control in the right dosage only.',
    weather: 'Track weather forecast and plan irrigation/sprays accordingly. Avoid spraying before rain and maintain drainage to prevent waterlogging.',
    locationSuggestion: (locationText, seasonLabel, suggestedCrops) =>
      `${suggestedCrops} look like strong options for ${seasonLabel} in ${locationText}. Choose based on your budget and water availability.`,
    fallback: 'Good question. Please add a little more detail about your crop, soil, water, or pest issue so I can suggest better next steps.',
  },
  hi: {
    welcome: 'नमस्ते किसान मित्र! आप फसल, खाद, सिंचाई, मौसम और रोग नियंत्रण से जुड़े सवाल पूछ सकते हैं।',
    fertilizer: 'पहले मिट्टी परीक्षण के आधार पर संतुलित NPK दें। एक बार में ज्यादा यूरिया देने के बजाय 2-3 भागों में दें और सिंचाई के साथ दें।',
    irrigation: 'सिंचाई मिट्टी की नमी देखकर करें। सुबह या शाम पानी दें, और मल्चिंग से नमी बचती है। अधिक पानी देने से जड़ रोग बढ़ सकते हैं।',
    pest: 'रोग/कीट दिखते ही प्रभावित पत्तियाँ हटाएँ, खेत साफ रखें, और अनुशंसित दवा सही मात्रा में ही छिड़कें।',
    weather: 'मौसम पूर्वानुमान देखते रहें और उसी के अनुसार सिंचाई/स्प्रे की योजना बनाएं। बारिश से पहले स्प्रे न करें और खेत में जल निकास रखें।',
    locationSuggestion: (locationText, seasonLabel, suggestedCrops) =>
      `${locationText} में ${seasonLabel} सीजन के लिए ${suggestedCrops} अच्छे विकल्प लग रहे हैं। लागत और पानी की उपलब्धता देखकर चुनें।`,
    fallback: 'यह अच्छा सवाल है। कृपया फसल, मिट्टी, पानी, या कीट/रोग के बारे में थोड़ा और विस्तार से लिखें ताकि मैं बेहतर सुझाव दे सकूँ।',
  },
  gu: {
    welcome: 'નમસ્તે ખેડૂત મિત્ર! તમે પાક, ખાતર, સિંચાઈ, હવામાન અને રોગ નિયંત્રણ વિશે પ્રશ્નો પૂછી શકો છો.',
    fertilizer: 'માટી પરીક્ષણના આધારે સંતુલિત NPK આપો. વધુ યુરિયા એક સાથે આપવાને બદલે 2-3 ભાગોમાં સિંચાઈ સાથે આપો.',
    irrigation: 'માટીની ભેજને ધ્યાનમાં રાખીને સિંચાઈ કરો. સવાર અથવા સાંજે પાણી આપો, અને મલ્ચિંગ ભેજ જાળવવામાં મદદ કરે છે. વધુ પાણીથી મૂળના રોગો વધી શકે છે.',
    pest: 'રોગ કે જીવાત દેખાતા જ અસરગ્રસ્ત પાંદડા દૂર કરો, ખેતર સ્વચ્છ રાખો અને ભલામણ કરેલી દવા યોગ્ય માત્રામાં જ છાંટો.',
    weather: 'હવામાનની આગાહી જુઓ અને તે મુજબ સિંચાઈ અથવા છંટકાવની યોજના બનાવો. વરસાદ પહેલાં છંટકાવ ટાળો અને પાણી નીકાસ સારું રાખો.',
    locationSuggestion: (locationText, seasonLabel, suggestedCrops) =>
      `${locationText} માટે ${seasonLabel} સીઝનમાં ${suggestedCrops} સારા વિકલ્પ લાગી રહ્યા છે. ખર્ચ અને પાણીની ઉપલબ્ધતા ધ્યાનમાં રાખીને પસંદ કરો.`,
    fallback: 'આ સારો પ્રશ્ન છે. કૃપા કરીને તમારા પાક, માટી, પાણી અથવા જીવાત/રોગ વિશે થોડું વધુ વિગતે લખો જેથી હું વધુ સારો માર્ગદર્શન આપી શકું.',
  },
  mr: {
    welcome: 'नमस्कार शेतकरी मित्रा! तुम्ही पीक, खत, सिंचन, हवामान आणि रोग नियंत्रणाबद्दल प्रश्न विचारू शकता.',
    fertilizer: 'माती परीक्षणानुसार संतुलित NPK द्या. जास्त युरिया एकदम देण्याऐवजी 2-3 भागांत सिंचनासोबत द्या.',
    irrigation: 'मातीतील ओलावा पाहून सिंचन करा. सकाळी किंवा संध्याकाळी पाणी द्या, आणि मल्चिंगमुळे ओलावा टिकतो. जास्त पाणी दिल्यास मुळांचे रोग वाढू शकतात.',
    pest: 'रोग किंवा कीड दिसताच बाधित पाने काढा, शेत स्वच्छ ठेवा आणि शिफारस केलेले औषध योग्य प्रमाणातच फवारणी करा.',
    weather: 'हवामानाचा अंदाज पाहत राहा आणि त्यानुसार सिंचन किंवा फवारणीची योजना करा. पावसापूर्वी फवारणी टाळा आणि पाण्याचा निचरा व्यवस्थित ठेवा.',
    locationSuggestion: (locationText, seasonLabel, suggestedCrops) =>
      `${locationText} मध्ये ${seasonLabel} हंगामासाठी ${suggestedCrops} हे चांगले पर्याय वाटतात. खर्च आणि पाण्याची उपलब्धता पाहून निवडा.`,
    fallback: 'हा चांगला प्रश्न आहे. कृपया तुमच्या पिकाबद्दल, मातीबद्दल, पाण्याबद्दल किंवा कीड/रोगाबद्दल थोडे अधिक लिहा म्हणजे मी अधिक चांगला सल्ला देऊ शकतो.',
  },
};

const KEYWORDS_BY_TOPIC = {
  fertilizer: ['fertilizer', 'खाद', 'उर्वरक', 'ખાતર', 'खत', 'npk'],
  irrigation: ['water', 'irrigation', 'सिंचाई', 'પાણી', 'સિંચાઈ', 'पाणी', 'सिंचन'],
  pest: ['disease', 'pest', 'कीट', 'रोग', 'જીવાત', 'રોગ', 'कीड'],
  weather: ['weather', 'rain', 'मौसम', 'बारिश', 'હવામાન', 'વરસાદ', 'हवामान', 'पाऊस'],
} as const;

function hasKeyword(query: string, keywords: readonly string[]): boolean {
  const normalized = query.toLowerCase();
  return keywords.some(keyword => normalized.includes(keyword));
}

export function createBotWelcomeMessage(language: string | null): ChatMessage {
  const selectedLanguage = getSupportedLanguage(language);
  return {
    id: 'welcome',
    role: 'bot',
    text: CHATBOT_COPY[selectedLanguage].welcome,
  };
}

export function getFarmerChatbotReply({
  query,
  language,
  season,
  location,
  topCropNames,
}: ReplyContext): string {
  const selectedLanguage = getSupportedLanguage(language);
  const seasonLabel = SEASON_TEXT[season][selectedLanguage];
  const suggestedCrops = topCropNames.length > 0 ? topCropNames.slice(0, MAX_TOP_CROP_HINTS).join(', ') : null;
  const copy = CHATBOT_COPY[selectedLanguage];

  if (hasKeyword(query, KEYWORDS_BY_TOPIC.fertilizer)) {
    return copy.fertilizer;
  }

  if (hasKeyword(query, KEYWORDS_BY_TOPIC.irrigation)) {
    return copy.irrigation;
  }

  if (hasKeyword(query, KEYWORDS_BY_TOPIC.pest)) {
    return copy.pest;
  }

  if (hasKeyword(query, KEYWORDS_BY_TOPIC.weather)) {
    return copy.weather;
  }

  if (suggestedCrops) {
    const locationText = location ?? LOCATION_FALLBACK[selectedLanguage];
    return copy.locationSuggestion(locationText, seasonLabel, suggestedCrops);
  }

  return copy.fallback;
}
