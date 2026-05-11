import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FlaskConical, Droplets, TestTube, Check, Info } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { SoilReport, SoilType, SOIL_TYPE_LABELS } from '@/types/crop';
import Colors from '@/constants/colors';

const SOIL_TYPES: SoilType[] = ['clay', 'sandy', 'loamy', 'silt', 'red', 'black', 'alluvial', 'laterite'];

interface FieldConfig {
  key: keyof SoilReport;
  label: string;
  placeholder: string;
  unit: string;
  hint: string;
  section: 'soil' | 'nutrients' | 'micro' | 'water';
}

const FIELDS: FieldConfig[] = [
  { key: 'ph', label: 'Soil pH', placeholder: '6.5', unit: '', hint: 'Ideal: 6.0 - 7.5', section: 'soil' },
  { key: 'organicCarbon', label: 'Organic Carbon', placeholder: '0.65', unit: '%', hint: 'Low <0.4, Med 0.4-0.75, High >0.75', section: 'soil' },
  { key: 'nitrogen', label: 'Available Nitrogen (N)', placeholder: '250', unit: 'kg/ha', hint: 'Low <280, Med 280-560, High >560', section: 'nutrients' },
  { key: 'phosphorus', label: 'Available Phosphorus (P)', placeholder: '18', unit: 'kg/ha', hint: 'Low <10, Med 10-25, High >25', section: 'nutrients' },
  { key: 'potassium', label: 'Available Potassium (K)', placeholder: '200', unit: 'kg/ha', hint: 'Low <110, Med 110-280, High >280', section: 'nutrients' },
  { key: 'sulphur', label: 'Sulphur (S)', placeholder: '15', unit: 'ppm', hint: 'Low <10, Med 10-20, High >20', section: 'nutrients' },
  { key: 'zinc', label: 'Zinc (Zn)', placeholder: '0.8', unit: 'ppm', hint: 'Deficient <0.6, Sufficient >1.2', section: 'micro' },
  { key: 'iron', label: 'Iron (Fe)', placeholder: '4.0', unit: 'ppm', hint: 'Deficient <2.5, Sufficient >4.5', section: 'micro' },
  { key: 'manganese', label: 'Manganese (Mn)', placeholder: '3.0', unit: 'ppm', hint: 'Deficient <2.0', section: 'micro' },
  { key: 'copper', label: 'Copper (Cu)', placeholder: '1.0', unit: 'ppm', hint: 'Deficient <0.2', section: 'micro' },
  { key: 'boron', label: 'Boron (B)', placeholder: '0.5', unit: 'ppm', hint: 'Deficient <0.5, Sufficient >1.0', section: 'micro' },
  { key: 'waterPh', label: 'Water pH', placeholder: '7.2', unit: '', hint: 'Ideal: 6.5 - 8.0', section: 'water' },
  { key: 'waterEc', label: 'Water EC', placeholder: '0.8', unit: 'dS/m', hint: 'Safe <1.0, Marginal 1-2, Saline >2', section: 'water' },
  { key: 'waterHardness', label: 'Water Hardness', placeholder: '200', unit: 'ppm', hint: 'Soft <75, Moderate 75-150, Hard >150', section: 'water' },
];

const SECTION_CONFIG = {
  soil: { title: 'Soil Properties', icon: FlaskConical, color: '#8B6914' },
  nutrients: { title: 'Major Nutrients (NPK+S)', icon: TestTube, color: '#16A34A' },
  micro: { title: 'Micronutrients', icon: TestTube, color: '#0284C7' },
  water: { title: 'Water Quality', icon: Droplets, color: '#0EA5E9' },
};

export default function SoilReportScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const router = useRouter();
  const { getCropById, updateCrop } = useCrops();

  const crop = getCropById(cropId ?? '');
  const existingReport = crop?.soilReport;

  const [soilType, setSoilType] = useState<SoilType>(existingReport?.soilType ?? 'loamy');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    FIELDS.forEach(f => {
      initial[f.key] = existingReport ? (existingReport[f.key] as string) ?? '' : '';
    });
    return initial;
  });

  const handleValueChange = useCallback((key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleSave = useCallback(() => {
    const hasAnyValue = Object.values(values).some(v => v.trim() !== '');
    if (!hasAnyValue) {
      Alert.alert('No Data', 'Please enter at least some soil or water test values.');
      return;
    }

    const report: SoilReport = {
      ph: values.ph ?? '',
      nitrogen: values.nitrogen ?? '',
      phosphorus: values.phosphorus ?? '',
      potassium: values.potassium ?? '',
      organicCarbon: values.organicCarbon ?? '',
      sulphur: values.sulphur ?? '',
      zinc: values.zinc ?? '',
      iron: values.iron ?? '',
      manganese: values.manganese ?? '',
      copper: values.copper ?? '',
      boron: values.boron ?? '',
      soilType,
      waterPh: values.waterPh ?? '',
      waterEc: values.waterEc ?? '',
      waterHardness: values.waterHardness ?? '',
    };

    if (crop) {
      updateCrop(crop.id, { soilReport: report });
      console.log('Soil report saved for crop:', crop.name);
      Alert.alert(
        'Report Saved',
        'Soil & water report saved. Fertilizer suggestions have been updated based on your report.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, [values, soilType, crop, updateCrop, router]);

  if (!crop) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Soil Report' }} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Crop not found</Text>
        </View>
      </View>
    );
  }

  const sections = ['soil', 'nutrients', 'micro', 'water'] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Soil Report - ${crop.name}` }} />

      <View style={styles.header}>
        <View style={styles.headerIconBg}>
          <FlaskConical size={24} color="#8B6914" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Soil & Water Analysis</Text>
          <Text style={styles.headerSubtitle}>
            Enter your soil test lab report values. We'll suggest the right fertilizers for {crop.name}.
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Info size={16} color={Colors.info} />
        <Text style={styles.infoText}>
          Leave fields blank if not tested. Suggestions will be based on available data. Get soil tested from nearest Krishi Vigyan Kendra or soil testing lab.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soil Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soilTypeScroll}>
          {SOIL_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.soilTypeChip, soilType === type && styles.soilTypeChipActive]}
              onPress={() => setSoilType(type)}
              activeOpacity={0.7}
            >
              {soilType === type && <Check size={14} color="#fff" />}
              <Text style={[styles.soilTypeText, soilType === type && styles.soilTypeTextActive]}>
                {SOIL_TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {sections.map(sectionKey => {
        const config = SECTION_CONFIG[sectionKey];
        const sectionFields = FIELDS.filter(f => f.section === sectionKey);
        const IconComp = config.icon;

        return (
          <View key={sectionKey} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <IconComp size={18} color={config.color} />
              <Text style={[styles.sectionTitle, { color: config.color }]}>{config.title}</Text>
            </View>

            {sectionFields.map(field => (
              <View key={field.key} style={styles.fieldRow}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  {field.unit ? <Text style={styles.fieldUnit}>({field.unit})</Text> : null}
                </View>
                <TextInput
                  style={styles.fieldInput}
                  value={values[field.key] ?? ''}
                  onChangeText={(val) => handleValueChange(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.fieldHint}>{field.hint}</Text>
              </View>
            ))}
          </View>
        );
      })}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85} testID="save-soil-report">
        <FlaskConical size={18} color="#fff" />
        <Text style={styles.saveButtonText}>Save Report & Get Suggestions</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
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
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#075985',
    lineHeight: 17,
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  soilTypeScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  soilTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 5,
  },
  soilTypeChipActive: {
    backgroundColor: '#8B6914',
    borderColor: '#8B6914',
  },
  soilTypeText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  soilTypeTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  fieldRow: {
    marginBottom: 14,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  fieldUnit: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  fieldInput: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fieldHint: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#8B6914',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
