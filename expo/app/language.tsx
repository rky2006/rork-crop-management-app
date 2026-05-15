import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Languages } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { LANGUAGE_OPTIONS, getSupportedLanguage } from '@/constants/languages';

const LANGUAGE_SCREEN_COPY = {
  en: {
    title: 'Choose Language',
    subtitle: 'Select your preferred language before login',
    continue: 'Continue',
  },
  hi: {
    title: 'भाषा चुनें',
    subtitle: 'लॉगिन से पहले अपनी पसंदीदा भाषा चुनें',
    continue: 'आगे बढ़ें',
  },
  gu: {
    title: 'ભાષા પસંદ કરો',
    subtitle: 'લૉગિન પહેલાં તમારી પસંદની ભાષા પસંદ કરો',
    continue: 'આગળ વધો',
  },
  mr: {
    title: 'भाषा निवडा',
    subtitle: 'लॉगिनपूर्वी आपली पसंतीची भाषा निवडा',
    continue: 'पुढे जा',
  },
} as const;

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { language, setLanguage } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState(language ?? '');
  const activeLanguage = getSupportedLanguage(selectedLanguage || language);
  const copy = LANGUAGE_SCREEN_COPY[activeLanguage];

  const canContinue = useMemo(() => !!selectedLanguage, [selectedLanguage]);

  const handleContinue = () => {
    if (!selectedLanguage) return;
    setLanguage(selectedLanguage);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#2D6A4F', '#40916C', '#52B788']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.iconContainer}>
          <Languages size={42} color="#fff" />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = selectedLanguage === option.code;
            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => setSelectedLanguage(option.code)}
                activeOpacity={0.85}
              >
                <View>
                  <Text style={styles.optionName}>{option.name}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                {isSelected ? <Check size={20} color={Colors.primary} /> : null}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>{copy.continue}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 90,
    paddingBottom: 56,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '800' as const,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop: -32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF8F3',
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  optionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  continueButton: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
