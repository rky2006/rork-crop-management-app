import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Lightbulb, MapPin, Cloud, FlaskConical, ChevronDown, ChevronUp, Check, Info, Leaf, MessageCircle, Mic, MicOff, Send, CloudDrizzle, Wind } from 'lucide-react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from 'expo-speech-recognition';
import { useUser } from '@/contexts/UserContext';
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
import { ForecastDay, REGION_WEATHER_FORECAST, WEATHER_FORECAST } from '@/mocks/weatherForecast';
import { SoilType, SOIL_TYPE_LABELS } from '@/types/crop';
import Colors from '@/constants/colors';

const SOIL_TYPES: SoilType[] = ['clay', 'sandy', 'loamy', 'silt', 'red', 'black', 'alluvial', 'laterite'];
const SEASONS: Season[] = ['kharif', 'rabi', 'zaid'];
const MAX_CHAT_MESSAGES = 8;

const SEASON_COLORS: Record<Season, string> = {
  kharif: '#16A34A',
  rabi: '#0284C7',
  zaid: '#D97706',
};

function getScoreColor(score: number): string {
  if (score >= 75) return '#16A34A';
  if (score >= 55) return '#65A30D';
  if (score >= 40) return '#D97706';
  return '#94A3B8';
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 55) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Low';
}

function SuggestionCard({ suggestion }: { suggestion: CropSuggestion }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = getScoreColor(suggestion.score);

  return (
    <TouchableOpacity
      style={styles.suggCard}
      onPress={() => setExpanded(prev => !prev)}
      activeOpacity={0.75}
    >
      <View style={styles.suggCardTop}>
        <Image source={{ uri: suggestion.crop.imageUrl }} style={styles.suggImage} contentFit="cover" />
        <View style={styles.suggInfo}>
          <View style={styles.suggTitleRow}>
            <Text style={styles.suggName}>{suggestion.crop.name}</Text>
            <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '18' }]}>
              <Text style={[styles.scoreText, { color: scoreColor }]}>{suggestion.score}%</Text>
            </View>
          </View>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>{getScoreLabel(suggestion.score)} Match</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{suggestion.crop.category}</Text>
          </View>
          <Text style={styles.suggDays}>~{suggestion.crop.avgDaysToHarvest} days to harvest</Text>
        </View>
        {expanded ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
      </View>

      {/* Score bar */}
      <View style={styles.scoreBarBg}>
        <View style={[styles.scoreBarFill, { width: `${suggestion.score}%`, backgroundColor: scoreColor }]} />
      </View>

      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.expandDesc}>{suggestion.crop.description}</Text>

          {suggestion.matchReasons.length > 0 && (
            <View style={styles.reasonsBlock}>
              <Text style={styles.reasonsTitle}>Why it suits you</Text>
              {suggestion.matchReasons.map((r, i) => (
                <View key={i} style={styles.reasonRow}>
                  <Check size={12} color="#16A34A" />
                  <Text style={styles.reasonText}>{r}</Text>
                </View>
              ))}
            </View>
          )}

          {suggestion.warnings.length > 0 && (
            <View style={styles.warningsBlock}>
              <Text style={styles.warningsTitle}>Considerations</Text>
              {suggestion.warnings.map((w, i) => (
                <View key={i} style={styles.warningRow}>
                  <Info size={12} color={Colors.warning} />
                  <Text style={styles.warningText}>{w}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.varietiesBlock}>
            <Text style={styles.varietiesTitle}>Recommended Varieties</Text>
            <View style={styles.varietiesRow}>
              {suggestion.crop.topVarieties.slice(0, 4).map((v, i) => (
                <View key={i} style={styles.varietyChip}>
                  <Text style={styles.varietyText}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SuggestionsScreen() {
  const { location, setLocation, language } = useUser();

  const detectedSeason = useMemo(() => getCurrentSeason(), []);
  const [season, setSeason] = useState<Season>(detectedSeason);
  const [soilType, setSoilType] = useState<SoilType | null>(null);
  const [ph, setPh] = useState('');
  const [waterEc, setWaterEc] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [createBotWelcomeMessage(language)]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const messageIdCounterRef = useRef(0);

  const selectedState = INDIAN_STATES.find(s => s.label === location) ?? null;
  const forecastData = selectedState ? REGION_WEATHER_FORECAST[selectedState.region] : WEATHER_FORECAST;

  const handleSelectState = useCallback((stateName: string) => {
    setLocation(stateName);
    setShowStatePicker(false);
    setHasAnalyzed(false);
  }, [setLocation]);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    // Slight delay for UX feedback
    setTimeout(() => {
      const results = getCropSuggestions({
        season,
        soilType,
        ph,
        waterEc,
        nitrogen,
        region: selectedState?.region ?? null,
      });
      setSuggestions(results);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 400);
  }, [season, soilType, ph, waterEc, nitrogen, selectedState]);

  const topSuggestions = useMemo(() => suggestions.filter(s => s.score >= 40), [suggestions]);
  const otherSuggestions = useMemo(() => suggestions.filter(s => s.score < 40), [suggestions]);
  const topCropNames = useMemo(() => topSuggestions.map(s => s.crop.name), [topSuggestions]);
  const isHindi = language === 'hi';

  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [createBotWelcomeMessage(language)];
      }
      return prev;
    });
  }, [language]);

  useSpeechRecognitionEvent('start', () => {
    setIsListening(true);
    setSpeechError(null);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event: ExpoSpeechRecognitionResultEvent) => {
    const transcript = event.results.length > 0 ? event.results[0].transcript.trim() : '';
    if (transcript) {
      setChatInput(transcript);
    }
  });

  useSpeechRecognitionEvent('error', (event: ExpoSpeechRecognitionErrorEvent) => {
    setIsListening(false);
    setSpeechError(event.message);
  });

  const handleStartListening = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setSpeechError(isHindi ? 'वॉइस इनपुट अभी केवल Android पर उपलब्ध है।' : 'Voice input is currently available on Android only.');
      return;
    }

    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setSpeechError(isHindi ? 'आपके डिवाइस में स्पीच रिकग्निशन उपलब्ध नहीं है।' : 'Speech recognition is not available on this device.');
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setSpeechError(isHindi ? 'वॉइस उपयोग के लिए माइक्रोफोन अनुमति दें।' : 'Please grant microphone permission to use voice input.');
      return;
    }

    setSpeechError(null);
    ExpoSpeechRecognitionModule.start({
      lang: isHindi ? 'hi-IN' : 'en-IN',
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
    });
  }, [isHindi]);

  const handleStopListening = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const generateMessageId = useCallback((role: 'user' | 'bot') => {
    messageIdCounterRef.current += 1;
    return `${role}-${Date.now()}-${messageIdCounterRef.current}`;
  }, []);

  const handleSendChatMessage = useCallback(() => {
    const question = chatInput.trim();
    if (!question) return;

    const userMessage: ChatMessage = {
      id: generateMessageId('user'),
      role: 'user',
      text: question,
    };

    const botMessage: ChatMessage = {
      id: generateMessageId('bot'),
      role: 'bot',
      text: getFarmerChatbotReply({
        query: question,
        language,
        season,
        location,
        topCropNames,
      }),
    };

    setChatMessages(prev => [...prev, userMessage, botMessage].slice(-MAX_CHAT_MESSAGES));
    setChatInput('');
  }, [chatInput, generateMessageId, language, season, location, topCropNames]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconBg}>
          <Lightbulb size={24} color="#D97706" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Crop Advisor</Text>
          <Text style={styles.headerSubtitle}>
            Get smart crop recommendations based on your soil, water quality, location, and season.
          </Text>
        </View>
      </View>

      {/* Season Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Cloud size={16} color={SEASON_COLORS[season]} />
          <Text style={[styles.sectionTitle, { color: SEASON_COLORS[season] }]}>Season</Text>
        </View>
        <Text style={styles.sectionHint}>Auto-detected from current month. You can override.</Text>
        <View style={styles.chipsRow}>
          {SEASONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, season === s && { backgroundColor: SEASON_COLORS[s], borderColor: SEASON_COLORS[s] }]}
              onPress={() => { setSeason(s); setHasAnalyzed(false); }}
              activeOpacity={0.7}
            >
              {season === s && <Check size={12} color="#fff" />}
              <Text style={[styles.chipText, season === s && styles.chipTextActive]}>
                {SEASON_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <MapPin size={16} color={Colors.info} />
          <Text style={[styles.sectionTitle, { color: Colors.info }]}>Your Location</Text>
        </View>
        <TouchableOpacity
          style={styles.locationPicker}
          onPress={() => setShowStatePicker(v => !v)}
          activeOpacity={0.8}
        >
          <Text style={[styles.locationText, !location && { color: Colors.textMuted }]}>
            {location ?? 'Select your state…'}
          </Text>
          {showStatePicker ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
        </TouchableOpacity>

        {showStatePicker && (
          <ScrollView
            style={styles.stateList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {INDIAN_STATES.map(s => (
              <TouchableOpacity
                key={s.label}
                style={[styles.stateItem, location === s.label && styles.stateItemActive]}
                onPress={() => handleSelectState(s.label)}
                activeOpacity={0.7}
              >
                {location === s.label && <Check size={13} color={Colors.primary} />}
                <View style={styles.stateItemContent}>
                  <Text style={[styles.stateLabel, location === s.label && { color: Colors.primary, fontWeight: '600' }]}>
                    {s.label}
                  </Text>
                  <Text style={styles.regionLabel}>{REGION_LABELS[s.region]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Weather Forecast */}
      {!showStatePicker && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Cloud size={16} color={Colors.info} />
            <Text style={[styles.sectionTitle, { color: Colors.info }]}>
              {selectedState ? `Weather Forecast · ${location}` : 'Weather Forecast'}
            </Text>
          </View>
          {!selectedState && (
            <Text style={styles.sectionHint}>Select your state to get region-specific forecast.</Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastScroll}>
            {forecastData.map((item: ForecastDay) => (
              <View key={item.day} style={styles.forecastCard}>
                <Text style={styles.forecastDay}>{item.day}</Text>
                <Text style={styles.forecastCondition}>{item.condition}</Text>
                <Text style={styles.forecastTemp}>{item.temp}</Text>
                <View style={styles.forecastMeta}>
                  <CloudDrizzle size={12} color={Colors.info} />
                  <Text style={styles.forecastMetaText}>{item.rain}%</Text>
                </View>
                <View style={styles.forecastMeta}>
                  <Wind size={12} color={Colors.textMuted} />
                  <Text style={styles.forecastMetaText}>{item.wind}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Soil Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <FlaskConical size={16} color="#8B6914" />
          <Text style={[styles.sectionTitle, { color: '#8B6914' }]}>Soil & Water Profile</Text>
        </View>
        <Text style={styles.sectionHint}>Optional – leave blank if you do not have a lab report.</Text>

        <Text style={styles.fieldLabel}>Soil Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soilTypeScroll}>
          {SOIL_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, soilType === t && styles.chipActiveSoil]}
              onPress={() => { setSoilType(soilType === t ? null : t); setHasAnalyzed(false); }}
              activeOpacity={0.7}
            >
              {soilType === t && <Check size={12} color="#fff" />}
              <Text style={[styles.chipText, soilType === t && styles.chipTextActive]}>
                {SOIL_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputsGrid}>
          <View style={styles.inputItem}>
            <Text style={styles.inputLabel}>Soil pH</Text>
            <TextInput
              style={styles.input}
              value={ph}
              onChangeText={v => { setPh(v); setHasAnalyzed(false); }}
              placeholder="e.g. 6.5"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.inputItem}>
            <Text style={styles.inputLabel}>Water EC (dS/m)</Text>
            <TextInput
              style={styles.input}
              value={waterEc}
              onChangeText={v => { setWaterEc(v); setHasAnalyzed(false); }}
              placeholder="e.g. 0.8"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.inputItem}>
            <Text style={styles.inputLabel}>Nitrogen (kg/ha)</Text>
            <TextInput
              style={styles.input}
              value={nitrogen}
              onChangeText={v => { setNitrogen(v); setHasAnalyzed(false); }}
              placeholder="e.g. 250"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      {/* Analyze Button */}
      <TouchableOpacity
        style={styles.analyzeButton}
        onPress={handleAnalyze}
        activeOpacity={0.85}
        disabled={isAnalyzing}
      >
        {isAnalyzing
          ? <ActivityIndicator color="#fff" size="small" />
          : <Lightbulb size={18} color="#fff" />}
        <Text style={styles.analyzeButtonText}>
          {isAnalyzing ? 'Analyzing…' : 'Get Crop Suggestions'}
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {hasAnalyzed && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsMeta}>
            <Text style={styles.resultsTitle}>
              {CROP_PROFILES.filter(c => c.seasons.includes(season)).length} crops checked for {SEASON_LABELS[season]}
            </Text>
            {location && <Text style={styles.resultsSubtitle}>📍 {location}</Text>}
          </View>

          {topSuggestions.length === 0 && (
            <View style={styles.emptyResults}>
              <Leaf size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No strong matches found. Try adjusting your soil type or season.</Text>
            </View>
          )}

          {topSuggestions.length > 0 && (
            <>
              <Text style={styles.groupLabel}>Recommended Crops</Text>
              {topSuggestions.map(s => (
                <SuggestionCard key={s.crop.name} suggestion={s} />
              ))}
            </>
          )}

          {otherSuggestions.length > 0 && (
            <>
              <Text style={[styles.groupLabel, { color: Colors.textMuted, marginTop: 16 }]}>
                Other {SEASON_LABELS[season]} Crops (Low Match)
              </Text>
              {otherSuggestions.map(s => (
                <SuggestionCard key={s.crop.name} suggestion={s} />
              ))}
            </>
          )}
        </View>
      )}

      <View style={styles.chatSection}>
        <View style={styles.chatHeader}>
          <MessageCircle size={18} color={Colors.primary} />
          <View style={styles.chatHeaderText}>
            <Text style={styles.chatTitle}>{isHindi ? 'किसान चैट सहायक' : 'Farmer Chat Assistant'}</Text>
            <Text style={styles.chatSubtitle}>
              {isHindi ? 'अपनी भाषा में सवाल पूछें और सुझाव पाएँ।' : 'Ask farming queries in your language and get suggestions.'}
            </Text>
          </View>
        </View>

        <View style={styles.chatMessagesBox}>
          {chatMessages.slice(-MAX_CHAT_MESSAGES).map(message => (
            <View
              key={message.id}
              style={[
                styles.chatBubble,
                message.role === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={[styles.chatBubbleText, message.role === 'user' && styles.userBubbleText]}>
                {message.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder={isHindi ? 'अपना सवाल लिखें...' : 'Type your farming question...'}
            placeholderTextColor={Colors.textMuted}
            multiline
          />
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={isListening ? handleStopListening : handleStartListening}
            activeOpacity={0.85}
          >
            {isListening ? <MicOff size={18} color="#fff" /> : <Mic size={18} color="#fff" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendChatMessage} activeOpacity={0.85}>
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        {speechError ? <Text style={styles.speechErrorText}>{speechError}</Text> : null}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerContent: {
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    alignItems: 'center',
  },
  headerIconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  sectionHint: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 5,
  },
  chipActiveSoil: {
    backgroundColor: '#8B6914',
    borderColor: '#8B6914',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  locationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500' as const,
    flex: 1,
    paddingRight: 8,
  },
  stateList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 6,
    maxHeight: 280,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  stateItemActive: {
    backgroundColor: Colors.primary + '0A',
  },
  stateItemContent: {
    flex: 1,
  },
  stateLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  regionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  forecastScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  forecastCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    minWidth: 110,
    gap: 4,
    alignItems: 'center',
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  forecastCondition: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 15,
  },
  forecastTemp: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginTop: 2,
  },
  forecastMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 3,
  },
  forecastMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  soilTypeScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 14,
  },
  inputsGrid: {
    gap: 12,
  },
  inputItem: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  resultsSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  resultsMeta: {
    marginBottom: 12,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  resultsSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  suggCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  suggCardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  suggImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
  },
  suggInfo: {
    flex: 1,
    gap: 3,
  },
  suggTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  suggName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.primary + '14',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  suggDays: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  scoreBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    marginTop: 10,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 10,
  },
  expandDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  reasonsBlock: {
    gap: 5,
  },
  reasonsTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  warningsBlock: {
    gap: 5,
  },
  warningsTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  varietiesBlock: {
    gap: 6,
  },
  varietiesTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  varietiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  varietyChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  varietyText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  chatSection: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    gap: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  chatSubtitle: {
    marginTop: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatMessagesBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 10,
    gap: 8,
  },
  chatBubble: {
    maxWidth: '92%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  chatBubbleText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  userBubbleText: {
    color: '#fff',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 96,
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  voiceButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  voiceButtonActive: {
    backgroundColor: Colors.warning,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
  },
  speechErrorText: {
    fontSize: 12,
    color: Colors.warning,
  },
});
