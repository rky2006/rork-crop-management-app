import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Check, Leaf, Factory } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { CropCategory, CATEGORY_LABELS, GrowthStage, FarmingType, FARMING_TYPE_LABELS } from '@/types/crop';
import { CROP_TEMPLATES } from '@/mocks/crops';
import CalendarPicker from '@/components/CalendarPicker';
import Colors from '@/constants/colors';

export default function EditCropScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCropById, updateCrop } = useCrops();

  const crop = getCropById(id ?? '');

  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [plotName, setPlotName] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<CropCategory>('grain');
  const [farmingType, setFarmingType] = useState<FarmingType>('non-organic');
  const [currentStage, setCurrentStage] = useState<GrowthStage>('sowing');

  useEffect(() => {
    if (crop) {
      setName(crop.name);
      setVariety(crop.variety);
      setPlotName(crop.plotName);
      setPlotSize(crop.plotSize);
      setSowingDate(crop.sowingDate.split('T')[0]);
      setExpectedHarvestDate(crop.expectedHarvestDate.split('T')[0]);
      setNotes(crop.notes);
      setCategory(crop.category);
      setFarmingType(crop.farmingType);
      setCurrentStage(crop.currentStage);
    }
  }, [crop]);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a crop name.');
      return;
    }
    if (!plotName.trim()) {
      Alert.alert('Missing Info', 'Please enter a plot/field name.');
      return;
    }
    if (!sowingDate || !expectedHarvestDate) {
      Alert.alert('Missing Info', 'Please enter sowing and expected harvest dates.');
      return;
    }

    updateCrop(id, {
      name: name.trim(),
      category,
      variety: variety.trim(),
      plotName: plotName.trim(),
      plotSize: plotSize.trim(),
      sowingDate: new Date(sowingDate + 'T00:00:00').toISOString(),
      expectedHarvestDate: new Date(expectedHarvestDate + 'T00:00:00').toISOString(),
      currentStage,
      notes: notes.trim(),
      farmingType,
    });

    router.back();
  }, [id, name, category, variety, plotName, plotSize, sowingDate, expectedHarvestDate, currentStage, notes, farmingType, updateCrop, router]);

  if (!crop) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Crop Not Found' }} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Crop not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Edit ${crop.name}` }} />

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Crop Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Wheat, Tomato"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Variety</Text>
          <TextInput
            style={styles.input}
            value={variety}
            onChangeText={setVariety}
            placeholder="e.g. HD-2967, Pusa Ruby"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {(['grain', 'horticulture', 'pulse', 'oilseed', 'spice'] as CropCategory[]).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Plot / Field Name *</Text>
          <TextInput
            style={styles.input}
            value={plotName}
            onChangeText={setPlotName}
            placeholder="e.g. North Field, Plot A"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Plot Size</Text>
          <TextInput
            style={styles.input}
            value={plotSize}
            onChangeText={setPlotSize}
            placeholder="e.g. 2.5"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.plotSizeUnit}>Acres</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Farming Type</Text>
          <View style={styles.farmingTypeRow}>
            <TouchableOpacity
              style={[
                styles.farmingTypeCard,
                farmingType === 'organic' && styles.farmingTypeCardActive,
                farmingType === 'organic' && { borderColor: '#16A34A' },
              ]}
              onPress={() => setFarmingType('organic')}
              activeOpacity={0.7}
            >
              <View style={[styles.farmingTypeIcon, { backgroundColor: farmingType === 'organic' ? '#DCFCE7' : Colors.surfaceAlt }]}>
                <Leaf size={22} color={farmingType === 'organic' ? '#16A34A' : Colors.textMuted} />
              </View>
              <Text style={[styles.farmingTypeLabel, farmingType === 'organic' && { color: '#16A34A', fontWeight: '700' as const }]}>Organic</Text>
              <Text style={styles.farmingTypeDesc}>Natural inputs only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.farmingTypeCard,
                farmingType === 'non-organic' && styles.farmingTypeCardActive,
                farmingType === 'non-organic' && { borderColor: Colors.primary },
              ]}
              onPress={() => setFarmingType('non-organic')}
              activeOpacity={0.7}
            >
              <View style={[styles.farmingTypeIcon, { backgroundColor: farmingType === 'non-organic' ? '#E8F5E9' : Colors.surfaceAlt }]}>
                <Factory size={22} color={farmingType === 'non-organic' ? Colors.primary : Colors.textMuted} />
              </View>
              <Text style={[styles.farmingTypeLabel, farmingType === 'non-organic' && { color: Colors.primary, fontWeight: '700' as const }]}>Non-Organic</Text>
              <Text style={styles.farmingTypeDesc}>Chemical fertilizers</Text>
            </TouchableOpacity>
          </View>
          {farmingType === 'organic' && (
            <View style={styles.organicHint}>
              <Leaf size={14} color="#16A34A" />
              <Text style={styles.organicHintText}>All suggestions will be organic-certified inputs only</Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Sowing Date</Text>
            <CalendarPicker
              value={sowingDate}
              onChange={setSowingDate}
              placeholder="Select sowing date"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Harvest Date</Text>
            <CalendarPicker
              value={expectedHarvestDate}
              onChange={setExpectedHarvestDate}
              placeholder="Select harvest date"
              minDate={sowingDate}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional notes..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
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
  plotSizeUnit: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  farmingTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  farmingTypeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  farmingTypeCardActive: {
    backgroundColor: '#FAFFF9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  farmingTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  farmingTypeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  farmingTypeDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  organicHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  organicHintText: {
    fontSize: 12,
    color: '#15803D',
    flex: 1,
    lineHeight: 16,
  },
});
