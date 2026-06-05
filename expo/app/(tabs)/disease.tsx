import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import {
  Camera, ImagePlus, Scan, Leaf, FlaskConical,
  Shield, AlertTriangle, X, Share2, ClipboardPlus,
  CheckCircle2, ChevronDown, MessageCircle
} from 'lucide-react-native';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import Colors from '@/constants/colors';
import { DiseaseDiagnosis, SEVERITY_COLORS } from '@/types/crop';
import { useCrops } from '@/contexts/CropContext';
import { useTranslation } from '@/utils/i18n';

const diagnosisSchema = z.object({
  diseaseName: z.string(),
  localName: z.string().describe('Common name used by Indian farmers'),
  confidence: z.string(),
  description: z.string(),
  symptoms: z.array(z.string()),
  affectedPart: z.string(),
  severity: z.enum(['mild', 'moderate', 'severe']),
  urgency: z.string().describe('How quickly the farmer must act'),
  organicTreatments: z.array(z.object({
    method: z.string(),
    details: z.string().describe('Practical instructions like dosage per 15L pump'),
    applicationTiming: z.string(),
  })),
  chemicalTreatments: z.array(z.object({
    method: z.string(),
    details: z.string().describe('Practical instructions like dosage per 15L pump'),
    applicationTiming: z.string(),
  })),
  preventionTips: z.array(z.string()),
});

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  gu: 'Gujarati (ગુજરાતી)',
  mr: 'Marathi (मराठी)',
};

export default function DiseaseScreen() {
  const router = useRouter();
  const { crops, addActivity } = useCrops();
  const { t, lang } = useTranslation();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const selectedCrop = useMemo(() =>
    crops.find(c => c.id === selectedCropId), [crops, selectedCropId]
  );

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, Record<string, string>> = {
      hi: { mild: 'हल्का', moderate: 'मध्यम', severe: 'गंभीर' },
      gu: { mild: 'હળવો', moderate: 'મધ્યમ', severe: 'ગંભીર' },
      mr: { mild: 'सौम्य', moderate: 'मध्यम', severe: 'गंभीर' },
    };
    return labels[lang]?.[severity] || severity.toUpperCase();
  };

  const getShareMessage = () => {
    if (!diagnosis) return '';
    const treatment = activeTab === 'organic' ? diagnosis.organicTreatments[0] : diagnosis.chemicalTreatments[0];

    return `*🌿 KishanSmart AI Health Report*\n\n` +
      `*Crop:* ${selectedCrop?.name || 'Field Crop'} (${selectedCrop?.variety || 'General'})\n` +
      `*Disease:* ${diagnosis.diseaseName}\n` +
      `*Local Name:* ${diagnosis.localName}\n` +
      `*Severity:* ${diagnosis.severity.toUpperCase()}\n\n` +
      `*Description:* ${diagnosis.description}\n\n` +
      `*✅ Suggested Treatment:* \n${treatment?.method}\n${treatment?.details}\n\n` +
      `_Sent via KishanSmart App_`;
  };

  const handleWhatsAppShare = async () => {
    const message = getShareMessage();
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const handleGeneralShare = async () => {
    try {
      await Share.share({ message: getShareMessage() });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = (treatment: any) => {
    if (!selectedCropId) {
      Alert.alert('Select Crop', 'Please select a crop from the top menu to save this task.');
      return;
    }

    addActivity(selectedCropId, {
      title: `Treat: ${diagnosis.diseaseName}`,
      type: activeTab === 'organic' ? 'other' : 'pest_control',
      date: new Date().toISOString(),
      description: `${treatment.method}: ${treatment.details}`,
      cost: 0,
    });

    Alert.alert('Success', 'Treatment added to your tasks.');
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      setError(null);
      setDiagnosis(null);

      let result: ImagePicker.ImagePickerResult;
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.6,
          base64: true,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.6,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 ?? null);
      }
    } catch (err) {
      setError('Error picking image');
    }
  };

  const analyzeCrop = async () => {
    if (!imageBase64) return;

    setIsAnalyzing(true);
    setError(null);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    try {
      const cropContext = selectedCrop
        ? `Farmer is growing ${selectedCrop.name} (${selectedCrop.variety}) in stage ${selectedCrop.currentStage}.`
        : 'Photo of an unknown crop.';

      const targetLanguageName = LANGUAGE_NAMES[lang] || 'English';

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', image: `data:image/jpeg;base64,${imageBase64}` },
              {
                type: 'text',
                text: `You are an expert Indian Agricultural Pathologist. Analyze this crop for diseases. ${cropContext}

                IMPORTANT: Provide the response in ${targetLanguageName}.
                Use practical terms for Indian farmers (e.g. dosage per 15L spray pump, or matchbox size).
                Provide a local common name for the disease.`
              },
            ],
          },
        ],
        schema: diagnosisSchema,
      });

      setDiagnosis(result);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    } catch (err) {
      setError(t.diseaseDiagnosis.analyzeError);
    } finally {
      setIsAnalyzing(false);
      pulseAnim.setValue(1);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'Health Check',
        headerRight: () => diagnosis ? (
          <View style={{ flexDirection: 'row', gap: 12, marginRight: 16 }}>
             <TouchableOpacity onPress={handleWhatsAppShare}>
              <MessageCircle size={24} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGeneralShare}>
              <Share2 size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : null
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Step 1: Crop Selection */}
        <View style={styles.cropSelectorContainer}>
          <Text style={styles.selectorLabel}>Select your crop (Important for accuracy):</Text>
          <TouchableOpacity
            style={styles.cropPicker}
            onPress={() => setShowCropPicker(!showCropPicker)}
          >
            <Leaf size={18} color={Colors.primary} />
            <Text style={styles.cropPickerText}>
              {selectedCrop ? `${selectedCrop.name} (${selectedCrop.variety})` : 'Choose from my farm...'}
            </Text>
            <ChevronDown size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          {showCropPicker && (
            <View style={styles.cropList}>
              {crops.map(crop => (
                <TouchableOpacity
                  key={crop.id}
                  style={[styles.cropItem, selectedCropId === crop.id && styles.selectedCropItem]}
                  onPress={() => {
                    setSelectedCropId(crop.id);
                    setShowCropPicker(false);
                  }}
                >
                  <Text style={[styles.cropItemText, selectedCropId === crop.id && { color: Colors.primary, fontWeight: '700' }]}>
                    {crop.name} - {crop.variety}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.cropItem} onPress={() => { setSelectedCropId(null); setShowCropPicker(false); }}>
                <Text style={styles.cropItemText}>Other / Not Listed</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!imageUri ? (
          <View style={styles.uploadSection}>
            <View style={styles.scanHero}>
              <View style={styles.scanIconBg}><Scan size={42} color={Colors.primary} /></View>
              <Text style={styles.scanTitle}>Disease Detector</Text>
              <Text style={styles.scanSubtitle}>Take a clear photo of leaves or stems with spots, holes, or abnormal color.</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.mainButton} onPress={() => pickImage('camera')}>
                <Camera size={24} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mainButton, styles.secondaryButton]} onPress={() => pickImage('gallery')}>
                <ImagePlus size={24} color={Colors.primary} />
                <Text style={[styles.buttonText, { color: Colors.text }]}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
              <TouchableOpacity style={styles.clearButton} onPress={() => { setImageUri(null); setDiagnosis(null); }}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {!diagnosis && !isAnalyzing && (
              <TouchableOpacity style={styles.analyzeButton} onPress={analyzeCrop}>
                <Scan size={22} color="#fff" />
                <Text style={styles.analyzeButtonText}>Start AI Analysis</Text>
              </TouchableOpacity>
            )}

            {isAnalyzing && (
              <Animated.View style={[styles.analyzingCard, { transform: [{ scale: pulseAnim }] }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.analyzingText}>AI is scanning for pests & diseases...</Text>
              </Animated.View>
            )}

            {diagnosis && (
              <Animated.View style={[styles.resultSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.diagnosisCard}>
                  <View style={styles.diagnosisHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.diseaseName}>{diagnosis.diseaseName}</Text>
                      <Text style={styles.localName}>Known locally as: {diagnosis.localName}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[diagnosis.severity] + '20' }]}>
                      <Text style={[styles.severityText, { color: SEVERITY_COLORS[diagnosis.severity] }]}>
                        {getSeverityLabel(diagnosis.severity)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.urgencyBox}>
                    <AlertTriangle size={18} color={Colors.warning} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.urgencyTitle}>AI Warning</Text>
                      <Text style={styles.urgencyText}>{diagnosis.urgency}</Text>
                    </View>
                  </View>

                  <Text style={styles.description}>{diagnosis.description}</Text>

                  <View style={styles.shareOptionsRow}>
                    <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppShare}>
                      <MessageCircle size={18} color="#fff" />
                      <Text style={styles.whatsappBtnText}>WhatsApp Expert</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareSimpleBtn} onPress={handleGeneralShare}>
                      <Share2 size={18} color={Colors.info} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Treatment Options</Text>
                  <View style={styles.tabBar}>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'organic' && styles.activeTab]}
                      onPress={() => setActiveTab('organic')}
                    >
                      <Text style={[styles.tabText, activeTab === 'organic' && styles.activeTabText]}>Organic (safe)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 'chemical' && styles.activeTabChem]}
                      onPress={() => setActiveTab('chemical')}
                    >
                      <Text style={[styles.tabText, activeTab === 'chemical' && styles.activeTabText]}>Chemical</Text>
                    </TouchableOpacity>
                  </View>

                  {(activeTab === 'organic' ? diagnosis.organicTreatments : diagnosis.chemicalTreatments).map((tr: any, i: number) => (
                    <View key={i} style={styles.treatmentCard}>
                      <View style={styles.treatmentHeader}>
                        <Text style={styles.treatmentMethod}>{tr.method}</Text>
                        <TouchableOpacity style={styles.addTaskBtn} onPress={() => handleAddTask(tr)}>
                          <ClipboardPlus size={16} color={Colors.primary} />
                          <Text style={styles.addTaskText}>Add Task</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.treatmentDetails}>{tr.details}</Text>
                      <View style={styles.timingBadge}>
                        <CheckCircle2 size={12} color={Colors.textMuted} />
                        <Text style={styles.timingText}>{tr.applicationTiming}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.resetBtn} onPress={() => { setImageUri(null); setDiagnosis(null); }}>
                  <Camera size={20} color={Colors.primary} />
                  <Text style={styles.resetBtnText}>New Scan</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 60 },
  cropSelectorContainer: { padding: 16, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  selectorLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 10, fontWeight: '700' },
  cropPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  cropPickerText: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
  cropList: { marginTop: 8, backgroundColor: Colors.background, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, elevation: 3 },
  cropItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  selectedCropItem: { backgroundColor: Colors.primary + '10' },
  cropItemText: { fontSize: 15, color: Colors.textSecondary },
  uploadSection: { padding: 30, alignItems: 'center' },
  scanHero: { alignItems: 'center', marginBottom: 40 },
  scanIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primary + '12', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  scanTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  scanSubtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  buttonRow: { flexDirection: 'row', gap: 16, width: '100%' },
  mainButton: { flex: 1, backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, elevation: 3 },
  secondaryButton: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  imagePreviewContainer: { margin: 16, borderRadius: 28, overflow: 'hidden', elevation: 5 },
  imagePreview: { width: '100%', height: 350 },
  clearButton: { position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  analyzeButton: { marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, elevation: 4 },
  analyzeButtonText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  analyzingCard: { margin: 16, padding: 50, backgroundColor: Colors.surface, borderRadius: 28, alignItems: 'center', gap: 20, elevation: 2 },
  analyzingText: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  resultSection: { padding: 16 },
  diagnosisCard: { backgroundColor: Colors.surface, borderRadius: 28, padding: 24, marginBottom: 16, elevation: 3 },
  diagnosisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  diseaseName: { fontSize: 24, fontWeight: '800', color: Colors.text, flex: 1 },
  localName: { fontSize: 16, color: Colors.primary, fontWeight: '700', marginTop: 4 },
  severityBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  severityText: { fontSize: 12, fontWeight: '900' },
  urgencyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF4F4', padding: 16, borderRadius: 16, marginBottom: 20, gap: 14, borderWidth: 1, borderColor: '#FFE3E3' },
  urgencyTitle: { fontSize: 14, fontWeight: '800', color: Colors.danger, marginBottom: 2 },
  urgencyText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  description: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  shareOptionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 20 },
  whatsappBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 12, borderRadius: 12, gap: 8 },
  whatsappBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  shareSimpleBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: 28, padding: 24, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 20 },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 16, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  activeTab: { backgroundColor: Colors.primary },
  activeTabChem: { backgroundColor: Colors.info },
  tabText: { fontSize: 15, fontWeight: '700', color: Colors.textMuted },
  activeTabText: { color: '#fff' },
  treatmentCard: { backgroundColor: Colors.background, borderRadius: 20, padding: 18, marginBottom: 14, borderLeftWidth: 5, borderLeftColor: Colors.primary },
  treatmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  treatmentMethod: { fontSize: 17, fontWeight: '800', color: Colors.text, flex: 1 },
  addTaskBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary + '40' },
  addTaskText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  treatmentDetails: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  timingBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timingText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 20, backgroundColor: Colors.surface, borderRadius: 20, borderWidth: 2, borderColor: Colors.primary + '50', marginBottom: 20 },
  resetBtnText: { fontSize: 17, fontWeight: '800', color: Colors.primary },
});
