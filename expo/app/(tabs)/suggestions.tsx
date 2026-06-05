import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Platform, KeyboardAvoidingView, Keyboard
} from 'react-native';
import { Image } from 'expo-image';
import {
  Lightbulb, MapPin, Cloud, FlaskConical, ChevronDown, ChevronUp,
  Check, Info, Leaf, MessageCircle, Mic, MicOff, Send,
  CloudDrizzle, Wind, LocateFixed, Sparkles, Bot
} from 'lucide-react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from 'expo-speech-recognition';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';
import { useCrops } from '@/contexts/CropContext';
import {
  CROP_PROFILES,
  INDIAN_STATES,
  SEASON_LABELS,
  REGION_LABELS,
  getCropSuggestions,
  getCurrentSeason,
  CropSuggestion,
  Season,
} from '@/mocks/cropSuggestions';
import { ChatMessage, createBotWelcomeMessage, getFarmerChatbotReply } from '@/mocks/farmerChatbot';
import { fetchRealtimeWeatherForecast, ForecastDay, REGION_WEATHER_FORECAST, WEATHER_FORECAST, WeatherCoordinates } from '@/mocks/weatherForecast';
import { SoilType, SOIL_TYPE_LABELS } from '@/types/crop';
import Colors from '@/constants/colors';
import { SPEECH_LANGUAGE_LOCALE, getSupportedLanguage } from '@/constants/languages';

const SOIL_TYPES: SoilType[] = ['clay', 'sandy', 'loamy', 'silt', 'red', 'black', 'alluvial', 'laterite'];
const SEASONS: Season[] = ['kharif', 'rabi', 'zaid'];
const MAX_CHAT_MESSAGES = 15;

const CHAT_COPY = {
  en: {
    chatTitle: 'KrishiChat AI',
    chatSubtitle: 'Your 24/7 Farming Assistant',
    advisorTitle: 'Crop Advisor',
    advisorSubtitle: 'Scientific recommendations',
    placeholder: 'Ask about seeds, pests, or weather...',
    quickQuestions: ['What should I sow now?', 'Pest control tips', 'Fertilizer for Rice'],
  },
  hi: {
    chatTitle: 'कृषिचैट AI',
    chatSubtitle: 'आपका 24/7 खेती सहायक',
    advisorTitle: 'फसल सलाहकार',
    advisorSubtitle: 'वैज्ञानिक सिफारिशें',
    placeholder: 'बीज, कीट या मौसम के बारे में पूछें...',
    quickQuestions: ['अभी क्या बोना चाहिए?', 'कीट नियंत्रण टिप्स', 'धान के लिए खाद'],
  },
  gu: {
    chatTitle: 'કૃષિચેટ AI',
    chatSubtitle: 'તમારા 24/7 ખેતી સહાયક',
    advisorTitle: 'પાક સલાહકાર',
    advisorSubtitle: 'વૈજ્ઞાનિક ભલામણો',
    placeholder: 'બીજ, જીવાત કે હવામાન વિશે પૂછો...',
    quickQuestions: ['અત્યારે શું વાવવું જોઈએ?', 'જીવાત નિયંત્રણ ટિપ્સ', 'ડાંગર માટે ખાતર'],
  },
  mr: {
    chatTitle: 'कृषीचॅट AI',
    chatSubtitle: 'तुमचा 24/7 शेती सहाय्यક',
    advisorTitle: 'पीक सल्लागार',
    advisorSubtitle: 'वैज्ञानिक शिफारसी',
    placeholder: 'बियाणे, कीड किंवा हवामानाबद्दल विचारा...',
    quickQuestions: ['आता काय पेरावे?', 'कीड नियंत्रण टिप्स', 'भातासाठी खत'],
  },
} as any;

function SuggestionCard({ suggestion }: { suggestion: CropSuggestion }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = suggestion.score >= 75 ? '#16A34A' : suggestion.score >= 40 ? '#D97706' : '#94A3B8';

  return (
    <TouchableOpacity
      style={styles.suggCard}
      onPress={() => setExpanded(prev => !prev)}
      activeOpacity={0.75}
    >
      <View style={styles.suggCardTop}>
        <Image source={{ uri: suggestion.crop.imageUrl }} style={styles.suggImage} contentFit="cover" />
        <View style={styles.suggInfo}>
          <Text style={styles.suggName}>{suggestion.crop.name}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '18' }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{suggestion.score}% Match</Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
      </View>
      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.expandDesc}>{suggestion.crop.description}</Text>
          <View style={styles.reasonsBlock}>
            {suggestion.matchReasons.map((r, i) => (
              <View key={i} style={styles.reasonRow}><Check size={12} color="#16A34A" /><Text style={styles.reasonText}>{r}</Text></View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SuggestionsScreen() {
  const { location, setLocation, language, username } = useUser();
  const { activeCrops } = useCrops();

  const [activeTab, setActiveTab] = useState<'chat' | 'advisor'>('chat');
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [soilType, setSoilType] = useState<SoilType | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [createBotWelcomeMessage(language)]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatScrollRef = useRef<ScrollView>(null);

  const activeLanguage = getSupportedLanguage(language);
  const copy = CHAT_COPY[activeLanguage] || CHAT_COPY.en;

  // Sync welcome message when language changes
  useEffect(() => {
    setChatMessages([createBotWelcomeMessage(language)]);
  }, [language]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSuggestions(getCropSuggestions({ season, soilType, region: 'central' })); // Mock region
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 800);
  };

  const handleSendMessage = useCallback((text?: string) => {
    const question = text || chatInput.trim();
    if (!question) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: question };
    const botMsg: ChatMessage = {
      id: `b-${Date.now()}`,
      role: 'bot',
      text: getFarmerChatbotReply({
        query: question,
        language,
        season,
        location,
        topCropNames: activeCrops.map(c => c.name)
      })
    };

    setChatMessages(prev => [...prev, userMsg, botMsg].slice(-MAX_CHAT_MESSAGES));
    setChatInput('');
    Keyboard.dismiss();
    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [chatInput, language, season, location, activeCrops]);

  const handleStartListening = async () => {
    if (Platform.OS !== 'android') return;
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    setIsListening(true);
    ExpoSpeechRecognitionModule.start({ lang: SPEECH_LANGUAGE_LOCALE[activeLanguage], interimResults: true });
  };

  useSpeechRecognitionEvent('result', (e) => {
    if (e.results[0]) setChatInput(e.results[0].transcript);
  });

  useSpeechRecognitionEvent('end', () => setIsListening(false));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chat' && styles.activeTabButton]}
          onPress={() => setActiveTab('chat')}
        >
          <MessageCircle size={18} color={activeTab === 'chat' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.tabButtonText, activeTab === 'chat' && styles.activeTabButtonText]}>KrishiChat AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'advisor' && styles.activeTabButton]}
          onPress={() => setActiveTab('advisor')}
        >
          <Sparkles size={18} color={activeTab === 'advisor' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.tabButtonText, activeTab === 'advisor' && styles.activeTabButtonText]}>Crop Advisor</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chat' ? (
        <View style={styles.chatContainer}>
          <ScrollView
            ref={chatScrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeInfo}>
              <View style={styles.botAvatarLarge}>
                <Bot size={32} color="#fff" />
              </View>
              <Text style={styles.welcomeTitle}>{username ? `Namaste, ${username}!` : 'Namaste!'}</Text>
              <Text style={styles.welcomeSubtitle}>{copy.chatSubtitle}</Text>
            </View>

            {chatMessages.map(msg => (
              <View key={msg.id} style={[styles.messageRow, msg.role === 'user' ? styles.userRow : styles.botRow]}>
                {msg.role === 'bot' && (
                  <View style={styles.botAvatarSmall}><Bot size={14} color="#fff" /></View>
                )}
                <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>{msg.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatFooter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
              {copy.quickQuestions.map((q: string, i: number) => (
                <TouchableOpacity key={i} style={styles.quickActionBtn} onPress={() => handleSendMessage(q)}>
                  <Text style={styles.quickActionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder={copy.placeholder}
                placeholderTextColor={Colors.textMuted}
                multiline
              />
              <TouchableOpacity
                style={[styles.iconButton, isListening && styles.micActive]}
                onPress={isListening ? () => ExpoSpeechRecognitionModule.stop() : handleStartListening}
              >
                {isListening ? <MicOff size={20} color="#fff" /> : <Mic size={20} color="#fff" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.sendButton, !chatInput.trim() && styles.sendDisabled]}
                onPress={() => handleSendMessage()}
                disabled={!chatInput.trim()}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.advisorContainer} contentContainerStyle={styles.advisorContent}>
          <View style={styles.advisorHeader}>
            <View style={styles.advisorIconBg}><Sparkles size={24} color={Colors.primary} /></View>
            <View>
              <Text style={styles.advisorTitle}>{copy.advisorTitle}</Text>
              <Text style={styles.advisorSubtitle}>{copy.advisorSubtitle}</Text>
            </View>
          </View>

          <View style={styles.advisorSection}>
            <Text style={styles.label}>Select Season</Text>
            <View style={styles.chipRow}>
              {SEASONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, season === s && styles.activeChip]}
                  onPress={() => setSeason(s)}
                >
                  <Text style={[styles.chipText, season === s && styles.activeChipText]}>{SEASON_LABELS[s]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Soil Type (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soilRow}>
              {SOIL_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, soilType === t && styles.activeChip]}
                  onPress={() => setSoilType(soilType === t ? null : t)}
                >
                  <Text style={[styles.chipText, soilType === t && styles.activeChipText]}>{SOIL_TYPE_LABELS[t]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeBtnText}>Get Recommendations</Text>}
            </TouchableOpacity>
          </View>

          {hasAnalyzed && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Recommended for you</Text>
              {suggestions.slice(0, 5).map(s => <SuggestionCard key={s.crop.name} suggestion={s} />)}
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabHeader: { flexDirection: 'row', backgroundColor: Colors.surface, padding: 4, margin: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.borderLight },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 8, borderRadius: 8 },
  activeTabButton: { backgroundColor: Colors.primary + '10' },
  tabButtonText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  activeTabButtonText: { color: Colors.primary },

  // Chat Styles
  chatContainer: { flex: 1 },
  chatScroll: { flex: 1 },
  chatScrollContent: { padding: 16, paddingBottom: 20 },
  welcomeInfo: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  botAvatarLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12, elevation: 4 },
  welcomeTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  welcomeSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  messageRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  botRow: { alignSelf: 'flex-start' },
  botAvatarSmall: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 4 },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  userBubble: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.borderLight },
  bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  userBubbleText: { color: '#fff' },
  chatFooter: { backgroundColor: Colors.surface, padding: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  quickActions: { gap: 8, paddingBottom: 12 },
  quickActionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  quickActionText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  textInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  micActive: { backgroundColor: Colors.danger },
  sendButton: { backgroundColor: Colors.primary },
  sendDisabled: { opacity: 0.5 },

  // Advisor Styles
  advisorContainer: { flex: 1 },
  advisorContent: { padding: 16 },
  advisorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  advisorIconBg: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  advisorTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  advisorSubtitle: { fontSize: 13, color: Colors.textSecondary },
  advisorSection: { backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.borderLight },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  soilRow: { gap: 10, marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.textSecondary },
  activeChipText: { color: '#fff', fontWeight: '600' },
  analyzeBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  analyzeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultsContainer: { marginTop: 24, gap: 12 },
  resultsTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  suggCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: Colors.borderLight },
  suggCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  suggImage: { width: 50, height: 50, borderRadius: 10 },
  suggInfo: { flex: 1, gap: 4 },
  suggName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  scoreBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  scoreText: { fontSize: 12, fontWeight: '700' },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  expandDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  reasonsBlock: { gap: 6 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reasonText: { fontSize: 13, color: Colors.textSecondary },
});
