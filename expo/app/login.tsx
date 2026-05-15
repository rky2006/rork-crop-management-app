import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Sprout, ArrowRight, Languages } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { LANGUAGE_OPTIONS, getSupportedLanguage } from '@/constants/languages';

const LOGIN_COPY = {
  en: {
    tagline: 'Smart Crop Management for Every Farmer',
    welcome: 'Welcome!',
    subtitle: 'Enter your name to get started',
    selectedLanguage: 'Selected language',
    changeLanguage: 'Change language',
    inputLabel: 'Your Name',
    placeholder: 'e.g. Ram Singh',
    button: 'Get Started',
    hint: 'Manage your crops from sowing to harvest with AI-powered suggestions',
  },
  hi: {
    tagline: 'हर किसान के लिए स्मार्ट फसल प्रबंधन',
    welcome: 'स्वागत है!',
    subtitle: 'शुरू करने के लिए अपना नाम दर्ज करें',
    selectedLanguage: 'चुनी गई भाषा',
    changeLanguage: 'भाषा बदलें',
    inputLabel: 'आपका नाम',
    placeholder: 'जैसे राम सिंह',
    button: 'शुरू करें',
    hint: 'बुवाई से कटाई तक अपनी फसलों को AI आधारित सुझावों के साथ संभालें',
  },
  gu: {
    tagline: 'દરેક ખેડૂત માટે સ્માર્ટ પાક વ્યવસ્થાપન',
    welcome: 'સ્વાગત છે!',
    subtitle: 'શરૂ કરવા માટે તમારું નામ દાખલ કરો',
    selectedLanguage: 'પસંદ કરેલી ભાષા',
    changeLanguage: 'ભાષા બદલો',
    inputLabel: 'તમારું નામ',
    placeholder: 'દા.ત. રમેશભાઈ પટેલ',
    button: 'શરૂ કરો',
    hint: 'વાવેતરથી લઈ કાપણી સુધી તમારા પાકનું AI આધારિત સૂચનો સાથે સંચાલન કરો',
  },
  mr: {
    tagline: 'प्रत्येक शेतकऱ्यासाठी स्मार्ट पीक व्यवस्थापन',
    welcome: 'स्वागत आहे!',
    subtitle: 'सुरू करण्यासाठी आपले नाव टाका',
    selectedLanguage: 'निवडलेली भाषा',
    changeLanguage: 'भाषा बदला',
    inputLabel: 'आपले नाव',
    placeholder: 'उदा. राम पाटील',
    button: 'सुरू करा',
    hint: 'पेरणीपासून कापणीपर्यंत AI-आधारित सूचनांसह आपल्या पिकांचे व्यवस्थापन करा',
  },
} as const;

export default function LoginScreen() {
  const router = useRouter();
  const { setUsername, language } = useUser();
  const [name, setName] = useState('');
  const activeLanguage = getSupportedLanguage(language);
  const copy = LOGIN_COPY[activeLanguage];
  const selectedLanguageName = LANGUAGE_OPTIONS.find(option => option.code === activeLanguage)?.name ?? 'English';

  const handleLogin = useCallback(() => {
    if (!name.trim()) return;
    setUsername(name.trim());
    router.replace('/(tabs)');
  }, [name, setUsername, router]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#2D6A4F', '#40916C', '#52B788']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.iconContainer}>
            <Sprout size={48} color="#fff" />
          </View>
          <Text style={styles.appName}>AISmartKisan</Text>
          <Text style={styles.tagline}>{copy.tagline}</Text>
        </LinearGradient>

        <View style={styles.formCard}>
          <Text style={styles.welcomeText}>{copy.welcome}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.languageRow}>
            <View style={styles.languageBadge}>
              <Languages size={16} color={Colors.primary} />
              <View>
                <Text style={styles.languageLabel}>{copy.selectedLanguage}</Text>
                <Text style={styles.languageValue}>{selectedLanguageName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/language')} activeOpacity={0.85}>
              <Text style={styles.languageAction}>{copy.changeLanguage}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{copy.inputLabel}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={copy.placeholder}
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              autoFocus
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, !name.trim() && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={!name.trim()}
          >
            <Text style={styles.loginButtonText}>{copy.button}</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.hint}>
            {copy.hint}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    marginHorizontal: 20,
    marginTop: -30,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  languageBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  languageValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 2,
  },
  languageAction: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700' as const,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
