import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { LANGUAGE_OPTIONS, getSupportedLanguage } from '@/constants/languages';

const GRID_PADDING = 16;
const CARD_GAP = 10;

const CONTINUE_COPY: Record<string, string> = {
  en: 'Continue',
  hi: 'आगे बढ़ें',
  gu: 'આગળ વધો',
  mr: 'पुढे जा',
};

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { language, setLanguage } = useUser();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - GRID_PADDING * 2 - CARD_GAP) / 2;
  const [selectedLanguage, setSelectedLanguage] = useState(language ?? '');
  const activeLanguage = getSupportedLanguage(selectedLanguage || language);
  const continueLabel = CONTINUE_COPY[activeLanguage] ?? CONTINUE_COPY.en;

  const canContinue = useMemo(() => !!selectedLanguage, [selectedLanguage]);

  const handleContinue = () => {
    if (!selectedLanguage) return;
    setLanguage(selectedLanguage);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.subtitle}>अपनी भाषा चुनें</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = selectedLanguage === option.code;
            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.card, isSelected && styles.cardSelected, { width: cardWidth }]}
                onPress={() => setSelectedLanguage(option.code)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.greeting, isSelected && styles.greetingSelected]}
                  numberOfLines={2}
                >
                  {option.greeting}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.nativeName, isSelected && styles.nameSelected]}>
                    {option.nativeName}
                  </Text>
                  <Text style={[styles.englishName, isSelected && styles.nameSelected]}>
                    {option.englishName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>{continueLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: GRID_PADDING,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    gap: CARD_GAP,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 28,
  },
  greetingSelected: {
    color: '#fff',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  nativeName: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  englishName: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  nameSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  continueButton: {
    marginHorizontal: GRID_PADDING,
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
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
