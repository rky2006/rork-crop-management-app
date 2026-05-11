import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronDown, Check, Plus } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { CropCategory, CATEGORY_LABELS, GrowthStage, FarmingType, FARMING_TYPE_LABELS } from '@/types/crop';
import { CROP_TEMPLATES, CropTemplate } from '@/mocks/crops';
import { Leaf, Factory } from 'lucide-react-native';
import CalendarPicker from '@/components/CalendarPicker';
import Colors from '@/constants/colors';

export default function AddCropScreen() {
  const router = useRouter();
  const { addCrop } = useCrops();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<CropTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CropCategory | 'all'>('all');

  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [plotName, setPlotName] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<CropCategory>('grain');
  const [selectedVarietyIndex, setSelectedVarietyIndex] = useState(0);
  const [isCustomVariety, setIsCustomVariety] = useState(false);
  const [customVariety, setCustomVariety] = useState('');
  const [farmingType, setFarmingType] = useState<FarmingType>('non-organic');

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return CROP_TEMPLATES;
    return CROP_TEMPLATES.filter(t => t.category === categoryFilter);
  }, [categoryFilter]);

  const autoFillHarvestDate = useCallback((sowDate: string, avgDays: number) => {
    if (!sowDate || !avgDays) return;
    const sow = new Date(sowDate + 'T00:00:00');
    sow.setDate(sow.getDate() + avgDays);
    setExpectedHarvestDate(sow.toISOString().split('T')[0]);
    console.log('Auto-filled harvest date:', sow.toISOString().split('T')[0]);
  }, []);

  const handleSowingDateChange = useCallback((date: string) => {
    setSowingDate(date);
    if (selectedTemplate) {
      autoFillHarvestDate(date, selectedTemplate.avgDaysToHarvest);
    }
  }, [selectedTemplate, autoFillHarvestDate]);

  const handleSelectTemplate = useCallback((template: CropTemplate) => {
    setSelectedTemplate(template);
    setName(template.name);
    setCategory(template.category);
    setImageUrl(template.imageUrl);
    setSelectedVarietyIndex(0);
    setVariety(template.varieties[0]);
    setIsCustomVariety(false);
    setCustomVariety('');

    const sow = new Date();
    const sowStr = sow.toISOString().split('T')[0];
    setSowingDate(sowStr);
    autoFillHarvestDate(sowStr, template.avgDaysToHarvest);

    setStep(2);
    console.log('Selected template:', template.name);
  }, [autoFillHarvestDate]);

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

    const finalVariety = isCustomVariety ? customVariety.trim() : variety.trim();

    addCrop({
      name: name.trim(),
      category,
      variety: finalVariety,
      plotName: plotName.trim(),
      plotSize: plotSize.trim() || 'N/A',
      sowingDate: new Date(sowingDate + 'T00:00:00').toISOString(),
      expectedHarvestDate: new Date(expectedHarvestDate + 'T00:00:00').toISOString(),
      currentStage: 'sowing' as GrowthStage,
      notes: notes.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      farmingType,
    });

    router.back();
  }, [name, category, variety, customVariety, isCustomVariety, plotName, plotSize, sowingDate, expectedHarvestDate, notes, imageUrl, farmingType, addCrop, router]);

  const categories: (CropCategory | 'all')[] = ['all', 'grain', 'horticulture', 'pulse', 'oilseed', 'spice'];

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Select Crop' }} />
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, categoryFilter === cat && styles.filterChipActive]}
                onPress={() => setCategoryFilter(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, categoryFilter === cat && styles.filterTextActive]}>
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.templateGrid}>
          {filteredTemplates.map((template, index) => (
            <TouchableOpacity
              key={`${template.name}-${index}`}
              style={styles.templateCard}
              onPress={() => handleSelectTemplate(template)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: template.imageUrl }} style={styles.templateImage} contentFit="cover" />
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateCategory}>{CATEGORY_LABELS[template.category]}</Text>
                <Text style={styles.templateDays}>~{template.avgDaysToHarvest} days</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.templateCard, styles.customCard]}
            onPress={() => {
              setSelectedTemplate(null);
              setStep(2);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.customIcon}>
              <Text style={styles.customIconText}>+</Text>
            </View>
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>Custom Crop</Text>
              <Text style={styles.templateCategory}>Enter manually</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: selectedTemplate ? `Add ${selectedTemplate.name}` : 'Add Custom Crop' }} />

      {selectedTemplate && (
        <View style={styles.selectedHeader}>
          <Image source={{ uri: selectedTemplate.imageUrl }} style={styles.selectedImage} contentFit="cover" />
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedName}>{selectedTemplate.name}</Text>
            <Text style={styles.selectedCat}>{CATEGORY_LABELS[selectedTemplate.category]}</Text>
          </View>
          <TouchableOpacity onPress={() => setStep(1)} style={styles.changeButton}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.form}>
        {!selectedTemplate && (
          <>
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
          </>
        )}

        {selectedTemplate && selectedTemplate.varieties.length > 0 && (
          <View style={styles.field}>
            <Text style={styles.label}>Variety</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.varietyScroll}>
              {selectedTemplate.varieties.map((v, i) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.varietyChip, !isCustomVariety && selectedVarietyIndex === i && styles.varietyChipActive]}
                  onPress={() => { setSelectedVarietyIndex(i); setVariety(v); setIsCustomVariety(false); }}
                  activeOpacity={0.7}
                >
                  {!isCustomVariety && selectedVarietyIndex === i && <Check size={14} color="#fff" />}
                  <Text style={[styles.varietyText, !isCustomVariety && selectedVarietyIndex === i && styles.varietyTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.varietyChip, styles.customVarietyChip, isCustomVariety && styles.varietyChipActive]}
                onPress={() => setIsCustomVariety(true)}
                activeOpacity={0.7}
              >
                <Plus size={14} color={isCustomVariety ? '#fff' : Colors.primary} />
                <Text style={[styles.varietyText, { color: isCustomVariety ? '#fff' : Colors.primary }]}>Custom</Text>
              </TouchableOpacity>
            </ScrollView>
            {isCustomVariety && (
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={customVariety}
                onChangeText={setCustomVariety}
                placeholder="Enter your variety name"
                placeholderTextColor={Colors.textMuted}
                autoFocus
              />
            )}
          </View>
        )}

        {!selectedTemplate && (
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
        )}

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
              onChange={handleSowingDateChange}
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85} testID="save-crop">
          <Text style={styles.saveButtonText}>Add Crop</Text>
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
  filterRow: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 40,
    gap: 10,
  },
  templateCard: {
    width: '47%' as unknown as number,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  templateImage: {
    width: '100%',
    height: 90,
    backgroundColor: Colors.surfaceAlt,
  },
  templateInfo: {
    padding: 10,
  },
  templateName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  templateCategory: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  templateDays: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '500' as const,
    marginTop: 2,
  },
  customCard: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 140,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  customIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customIconText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 14,
    borderRadius: 14,
  },
  selectedImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  selectedCat: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  changeButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 4,
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
  varietyScroll: {
    gap: 8,
    paddingRight: 8,
  },
  varietyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  varietyChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  customVarietyChip: {
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  varietyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  varietyTextActive: {
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
