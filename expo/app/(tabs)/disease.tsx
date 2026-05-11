import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, Scan, Leaf, FlaskConical, Shield, AlertTriangle, X, Bug } from 'lucide-react-native';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import Colors from '@/constants/colors';
import { DiseaseDiagnosis, SEVERITY_COLORS } from '@/types/crop';
import { useCrops } from '@/contexts/CropContext';

const diagnosisSchema = z.object({
  diseaseName: z.string(),
  confidence: z.string(),
  description: z.string(),
  symptoms: z.array(z.string()),
  affectedPart: z.string(),
  severity: z.enum(['mild', 'moderate', 'severe']),
  organicTreatments: z.array(z.object({
    method: z.string(),
    details: z.string(),
    applicationTiming: z.string(),
  })),
  chemicalTreatments: z.array(z.object({
    method: z.string(),
    details: z.string(),
    applicationTiming: z.string(),
  })),
  preventionTips: z.array(z.string()),
});

export default function DiseaseScreen() {
  const { crops } = useCrops();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const showResults = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      setError(null);
      setDiagnosis(null);
      fadeAnim.setValue(0);
      slideAnim.setValue(30);

      let result: ImagePicker.ImagePickerResult;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          base64: true,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Gallery permission is needed to select photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 ?? null);
        console.log('Disease scan: Image selected successfully');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image. Please try again.');
    }
  };

  const analyzeCrop = async () => {
    if (!imageBase64) {
      setError('Please select an image first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    startPulse();

    try {
      const selectedCrop = selectedCropId ? crops.find(c => c.id === selectedCropId) : null;
      const cropContext = selectedCrop
        ? `The farmer is growing ${selectedCrop.name} (${selectedCrop.variety}), currently in ${selectedCrop.currentStage} stage, farming type: ${selectedCrop.farmingType}.`
        : 'The farmer has uploaded a photo of their crop.';

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: `data:image/jpeg;base64,${imageBase64}`,
              },
              {
                type: 'text',
                text: `You are an expert agricultural plant pathologist. Analyze this crop photo for any diseases, pests, or health issues. ${cropContext}

Provide a detailed diagnosis including:
1. Disease/pest name and confidence level (like "High", "Medium", "Low")
2. Description of the issue
3. Visible symptoms (list at least 3)
4. Which part of the plant is affected
5. Severity (mild/moderate/severe)
6. At least 3 organic/natural treatment methods with detailed application instructions and dosages
7. At least 3 chemical/non-organic treatment methods with detailed application instructions and dosages
8. At least 4 prevention tips for future

If the plant looks healthy, still provide the diagnosis as "Healthy Plant" with severity as "mild" and include preventive care tips.
Be specific with product names, dosages, and application methods that Indian farmers can easily follow.`,
              },
            ],
          },
        ],
        schema: diagnosisSchema,
      });

      console.log('Disease diagnosis result:', result);
      setDiagnosis(result);
      showResults();
    } catch (err) {
      console.error('Error analyzing crop:', err);
      setError('Failed to analyze the image. Please try again with a clearer photo.');
    } finally {
      setIsAnalyzing(false);
      pulseAnim.setValue(1);
    }
  };

  const clearImage = () => {
    setImageUri(null);
    setImageBase64(null);
    setDiagnosis(null);
    setError(null);
    setSelectedCropId(null);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {!imageUri ? (
        <View style={styles.uploadSection}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconRow}>
              <View style={styles.heroIconBg}>
                <Bug size={28} color={Colors.primary} />
              </View>
              <View style={styles.heroIconBgSmall}>
                <Scan size={20} color={Colors.accent} />
              </View>
            </View>
            <Text style={styles.uploadTitle}>Crop Disease Scanner</Text>
            <Text style={styles.uploadSubtitle}>
              Upload a photo of your crop{"'"} affected area and get instant AI-powered diagnosis with both organic and chemical treatment solutions
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage('camera')}
              activeOpacity={0.7}
              testID="disease-camera-button"
            >
              <View style={styles.uploadButtonIcon}>
                <Camera size={26} color="#fff" />
              </View>
              <Text style={styles.uploadButtonText}>Take Photo</Text>
              <Text style={styles.uploadButtonHint}>Use camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, styles.galleryButton]}
              onPress={() => pickImage('gallery')}
              activeOpacity={0.7}
              testID="disease-gallery-button"
            >
              <View style={[styles.uploadButtonIcon, styles.galleryButtonIcon]}>
                <ImagePlus size={26} color={Colors.primary} />
              </View>
              <Text style={[styles.uploadButtonText, styles.galleryButtonText]}>Gallery</Text>
              <Text style={[styles.uploadButtonHint, styles.galleryHintText]}>Choose photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Tips for Accurate Results</Text>
            {[
              'Take a close-up of the affected leaf, stem or fruit',
              'Use natural daylight — avoid flash or shadows',
              'Include both healthy and diseased parts if possible',
              'Keep the camera steady to avoid blurry images',
              'For insects/pests, capture them clearly on the plant',
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
            <TouchableOpacity style={styles.clearButton} onPress={clearImage} testID="disease-clear-image">
              <X size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {crops.length > 0 && !diagnosis && !isAnalyzing && (
            <View style={styles.cropSelectSection}>
              <Text style={styles.cropSelectLabel}>Link to your crop (optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropChipScroll}>
                <TouchableOpacity
                  style={[styles.cropChip, !selectedCropId && styles.cropChipActive]}
                  onPress={() => setSelectedCropId(null)}
                >
                  <Text style={[styles.cropChipText, !selectedCropId && styles.cropChipTextActive]}>None</Text>
                </TouchableOpacity>
                {crops.map(crop => (
                  <TouchableOpacity
                    key={crop.id}
                    style={[styles.cropChip, selectedCropId === crop.id && styles.cropChipActive]}
                    onPress={() => setSelectedCropId(crop.id)}
                  >
                    <Text style={[styles.cropChipText, selectedCropId === crop.id && styles.cropChipTextActive]}>
                      {crop.name} — {crop.variety}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {!diagnosis && !isAnalyzing && (
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeCrop}
              activeOpacity={0.7}
              testID="disease-analyze-button"
            >
              <Scan size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyze for Diseases</Text>
            </TouchableOpacity>
          )}

          {isAnalyzing && (
            <Animated.View style={[styles.analyzingContainer, { transform: [{ scale: pulseAnim }] }]}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.analyzingText}>Scanning your crop...</Text>
              <Text style={styles.analyzingSubtext}>AI is examining the photo for diseases, pests & health issues</Text>
            </Animated.View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <AlertTriangle size={20} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {diagnosis && (
            <Animated.View style={[styles.resultSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.diagnosisHeader}>
                <View style={styles.diagnosisNameRow}>
                  <Text style={styles.diagnosisName}>{diagnosis.diseaseName}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[diagnosis.severity] + '18' }]}>
                    <Text style={[styles.severityText, { color: SEVERITY_COLORS[diagnosis.severity] }]}>
                      {diagnosis.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>Confidence: {diagnosis.confidence}</Text>
                <Text style={styles.diagnosisDescription}>{diagnosis.description}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Affected Part</Text>
                <Text style={styles.infoCardValue}>{diagnosis.affectedPart}</Text>
              </View>

              <View style={styles.symptomsCard}>
                <Text style={styles.sectionTitle}>Symptoms Identified</Text>
                {diagnosis.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.symptomRow}>
                    <View style={styles.symptomDot} />
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.treatmentSection}>
                <Text style={styles.sectionTitle}>Treatment Methods</Text>
                <View style={styles.tabBar}>
                  <TouchableOpacity
                    style={[styles.tab, activeTab === 'organic' && styles.activeTab]}
                    onPress={() => setActiveTab('organic')}
                    testID="organic-tab"
                  >
                    <Leaf size={16} color={activeTab === 'organic' ? '#fff' : Colors.primary} />
                    <Text style={[styles.tabText, activeTab === 'organic' && styles.activeTabText]}>Organic</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, activeTab === 'chemical' && styles.activeChemicalTab]}
                    onPress={() => setActiveTab('chemical')}
                    testID="chemical-tab"
                  >
                    <FlaskConical size={16} color={activeTab === 'chemical' ? '#fff' : Colors.info} />
                    <Text style={[styles.tabText, activeTab === 'chemical' && styles.activeTabText]}>Chemical</Text>
                  </TouchableOpacity>
                </View>

                {(activeTab === 'organic' ? diagnosis.organicTreatments : diagnosis.chemicalTreatments).map((treatment, index) => (
                  <View key={index} style={styles.treatmentCard}>
                    <View style={styles.treatmentHeader}>
                      <View style={[styles.treatmentIndex, activeTab === 'organic' ? styles.organicIndex : styles.chemicalIndex]}>
                        <Text style={[styles.treatmentIndexText, activeTab === 'chemical' && styles.chemicalIndexText]}>{index + 1}</Text>
                      </View>
                      <Text style={styles.treatmentMethod}>{treatment.method}</Text>
                    </View>
                    <Text style={styles.treatmentDetails}>{treatment.details}</Text>
                    <View style={styles.timingRow}>
                      <Text style={styles.timingLabel}>When to apply:</Text>
                      <Text style={styles.timingValue}>{treatment.applicationTiming}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.preventionSection}>
                <View style={styles.preventionHeader}>
                  <Shield size={20} color={Colors.primary} />
                  <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Prevention Tips</Text>
                </View>
                {diagnosis.preventionTips.map((tip, index) => (
                  <View key={index} style={styles.preventionRow}>
                    <View style={styles.preventionNumber}>
                      <Text style={styles.preventionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.preventionText}>{tip}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={clearImage}
                activeOpacity={0.7}
                testID="scan-again-button"
              >
                <Camera size={18} color={Colors.primary} />
                <Text style={styles.scanAgainText}>Scan Another Crop</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  uploadSection: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  heroIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconBgSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
    marginTop: 16,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 6,
  },
  galleryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary + '25',
  },
  uploadButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  galleryButtonIcon: {
    backgroundColor: Colors.primary + '10',
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  galleryButtonText: {
    color: Colors.text,
  },
  uploadButtonHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  galleryHintText: {
    color: Colors.textMuted,
  },
  tipsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipNumberText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  imagePreviewContainer: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 280,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropSelectSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cropSelectLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  cropChipScroll: {
    flexGrow: 0,
  },
  cropChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  cropChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cropChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  cropChipTextActive: {
    color: '#fff',
  },
  analyzeButton: {
    marginHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  analyzingContainer: {
    margin: 16,
    padding: 36,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  analyzingText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  analyzingSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.danger + '08',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.danger + '18',
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    flex: 1,
  },
  resultSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  diagnosisHeader: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  diagnosisNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  diagnosisName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  confidenceText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  diagnosisDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoCardTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  symptomsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  symptomDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.warning,
    marginTop: 6,
  },
  symptomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 21,
  },
  treatmentSection: {
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 11,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  activeChemicalTab: {
    backgroundColor: Colors.info,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  treatmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  treatmentIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organicIndex: {
    backgroundColor: Colors.primary + '15',
  },
  chemicalIndex: {
    backgroundColor: Colors.info + '15',
  },
  treatmentIndexText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  chemicalIndexText: {
    color: Colors.info,
  },
  treatmentMethod: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  treatmentDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  timingLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  timingValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  preventionSection: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  preventionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  preventionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  preventionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preventionNumberText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  preventionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 21,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
    marginBottom: 20,
  },
  scanAgainText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
