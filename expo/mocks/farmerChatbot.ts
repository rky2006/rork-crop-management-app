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

const CHATBOT_COPY: Record<SupportedLanguageCode, any> = {
  en: {
    welcome: 'Hello! I am your KrishiChat AI. I can help with crop selection, pest control, fertilizers, and weather impact. How can I help you today?',
    fertilizer: 'For optimal growth, use balanced NPK. If your leaves are turning yellow, it might be Nitrogen deficiency. Apply 25kg Urea per acre with irrigation for quick recovery.',
    pest: 'Seeing spots on leaves? It could be Fungal Blight. Remove infected parts immediately and avoid overhead watering. Use Neem oil spray (5ml/L) as an organic control.',
    weather: 'The current forecast shows rain in 2 days. I suggest you postpone any fertilizer application or pesticide spray until the weather clears to avoid runoff.',
    crops: (crops: string) => `Based on your profile, growing ${crops} is highly recommended. Ensure you have proper drainage if you're in a high-rainfall zone.`,
    fallback: 'That’s a specific query! To give you the best advice, could you tell me which crop you are currently concerned about?',
  },
  hi: {
    welcome: 'नमस्ते! मैं आपका कृषिचैट AI हूँ। मैं फसल चयन, कीट नियंत्रण, खाद और मौसम के प्रभाव में आपकी मदद कर सकता हूँ। आज मैं आपकी क्या सहायता करूँ?',
    fertilizer: 'बेहतर विकास के लिए संतुलित NPK का उपयोग करें। यदि पत्तियां पीली हो रही हैं, तो यह नाइट्रोजन की कमी हो सकती है। त्वरित सुधार के लिए सिंचाई के साथ 25 किलो यूरिया प्रति एकड़ डालें।',
    pest: 'पत्तियों पर धब्बे दिख रहे हैं? यह फंगल ब्लाइट हो सकता है। संक्रमित हिस्सों को तुरंत हटा दें। जैविक नियंत्रण के रूप में नीम के तेल का स्प्रे (5ml/L) उपयोग करें।',
    weather: 'अगले 2 दिनों में बारिश का अनुमान है। मेरा सुझाव है कि आप बारिश रुकने तक किसी भी खाद या कीटनाशक के छिड़काव को टाल दें।',
    crops: (crops: string) => `आपकी जानकारी के अनुसार, ${crops} उगाना बहुत फायदेमंद रहेगा। यदि आप अधिक वर्षा वाले क्षेत्र में हैं तो जल निकासी का उचित प्रबंध रखें।`,
    fallback: 'यह एक महत्वपूर्ण सवाल है! आपको सटीक सलाह देने के लिए, क्या आप बता सकते हैं कि आप अभी किस फसल के बारे में पूछ रहे हैं?',
  },
  gu: {
    welcome: 'નમસ્તે! હું તમારો કૃષિચેટ AI છું. હું પાક પસંદગી, જીવાત નિયંત્રણ, ખાતર અને હવામાનની અસરમાં તમારી મદદ કરી શકું છું. આજે હું તમારી શું મદદ કરી શકું?',
    fertilizer: 'શ્રેષ્ઠ વૃદ્ધિ માટે, સંતુલિત NPK નો ઉપયોગ કરો. જો તમારા પાંદડા પીળા થઈ રહ્યા હોય, તો તે નાઇટ્રોજનની ઉણપ હોઈ શકે છે. ઝડપી સુધારા માટે સિંચાઈ સાથે એકર દીઠ 25 કિલો યુરિયા આપો.',
    pest: 'પાંદડા પર ડાઘ દેખાય છે? તે ફૂગના કારણે હોઈ શકે છે. ચેપગ્રસ્ત ભાગોને તરત જ દૂર કરો. જૈવિક નિયંત્રણ તરીકે લીમડાના તેલનો સ્પ્રે (5ml/L) વાપરો.',
    weather: 'હવામાનની આગાહી મુજબ 2 દિવસમાં વરસાદની શક્યતા છે. હું સૂચન આપું છું કે વરસાદ રોકાય ત્યાં સુધી ખાતર કે જંતુનાશક દવા છાંટવાનું મુલતવી રાખો.',
    crops: (crops: string) => `તમારી વિગતો મુજબ, ${crops} ઉગાડવું ખૂબ જ ફાયદાકારક રહેશે. જો તમે વધુ વરસાદવાળા વિસ્તારમાં હોવ તો ડ્રેનેજની યોગ્ય વ્યવસ્થા રાખો.`,
    fallback: 'આ એક મહત્વપૂર્ણ પ્રશ્ન છે! તમને ચોક્કસ સલાહ આપવા માટે, શું તમે કહી શકો છો કે તમે અત્યારે કયા પાક વિશે પૂછી રહ્યા છો?',
  },
  mr: {
    welcome: 'नमस्कार! मी तुमचा कृषीचॅट AI आहे. मी पीक निवड, कीड नियंत्रण, खते आणि हवामानाचा प्रभाव यात तुमची मदत करू शकतो. आज मी तुम्हाला काय मदत करू शकतो?',
    fertilizer: 'उत्તમ वाढી માટે, संतुलित NPK वापरा. जर तुमची पाने पिवळी पडत असतील, तर ती नायट्रोजनची कमतरતા असू शकते. जलद सुधारणेसाठी सिंचनासोबत प्रति एकर २५ किलो युरिया द्या.',
    pest: 'पानांवर डाग दिसत आहेत? ते बुरशीजन्य रोगामुळे असू शकतात. संक्रमित भाग त्वरित काढून टाका. जैविक नियंत्रणासाठी कडुनिंबाच्या तेलाची फवारणी (5ml/L) वापरा.',
    weather: 'हवामान अंदाजानुसार २ दिवसात पाऊस पडण्याची शक्यता आहे. मी सुचवतो की पाऊस थांबेपर्यंत खत किंवा कीटकनाशक फवारणी पुढे ढकला.',
    crops: (crops: string) => `तुमच्या माहितीनुसार, ${crops} लागवड करणे खूप फायदेशीर ठरेल. तुम्ही जास्त पावसाच्या भागात असल्यास पाण्याचा निचरा होण्याची योग्य व्यवस्था ठेवा.`,
    fallback: 'हा एक महत्त्वाचा प्रश्न आहे! तुम्हाला अचૂक सल्ला देण्यासाठी, तुम्ही सांगू शकता का की तुम्ही सध्या कोणत्या पिकाबद्दल विचारत आहात?',
  },
};

export function createBotWelcomeMessage(language: string | null): ChatMessage {
  const lang = getSupportedLanguage(language);
  const copy = CHATBOT_COPY[lang] || CHATBOT_COPY.en;
  return { id: 'welcome', role: 'bot', text: copy.welcome };
}

export function getFarmerChatbotReply({ query, language, location, topCropNames }: ReplyContext): string {
  const lang = getSupportedLanguage(language);
  const q = query.toLowerCase();
  const copy = CHATBOT_COPY[lang] || CHATBOT_COPY.en;

  if (q.includes('fertilizer') || q.includes('खाद') || q.includes('urea') || q.includes('યૂરિયા') || q.includes('खात') || q.includes('युरिया')) return copy.fertilizer;
  if (q.includes('pest') || q.includes('कीट') || q.includes('disease') || q.includes('જીવાત') || q.includes('रोग') || q.includes('कीड')) return copy.pest;
  if (q.includes('weather') || q.includes('मौसम') || q.includes('rain') || q.includes('વરસાદ') || q.includes('पाऊस') || q.includes('बारिश')) return copy.weather;
  if (q.includes('sow') || q.includes('crop') || q.includes('બોના') || q.includes('लागवड') || q.includes('फसल')) {
    const crops = topCropNames.length > 0 ? topCropNames.slice(0, 3).join(', ') : 'Wheat, Rice, or Mustard';
    return copy.crops(crops);
  }

  return copy.fallback;
}
