import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Droplets, Bug, Scissors, Sprout, Eye, Shovel, CircleDot, Zap, Check } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { ActivityType, ACTIVITY_LABELS } from '@/types/crop';
import CalendarPicker from '@/components/CalendarPicker';
import Colors from '@/constants/colors';

interface ActivityOption {
  type: ActivityType;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  { type: 'sowing', icon: <Sprout size={20} color="#8B6914" />, color: '#8B6914', bgColor: '#FEF3C7' },
  { type: 'watering', icon: <Droplets size={20} color="#0284C7" />, color: '#0284C7', bgColor: '#E0F2FE' },
  { type: 'fertilizing', icon: <Zap size={20} color="#16A34A" />, color: '#16A34A', bgColor: '#DCFCE7' },
  { type: 'pesticide', icon: <Bug size={20} color="#DC2626" />, color: '#DC2626', bgColor: '#FEE2E2' },
  { type: 'weeding', icon: <Shovel size={20} color="#D97706" />, color: '#D97706', bgColor: '#FEF3C7' },
  { type: 'pruning', icon: <Scissors size={20} color="#7C3AED" />, color: '#7C3AED', bgColor: '#EDE9FE' },
  { type: 'harvesting', icon: <Sprout size={20} color="#CA8A04" />, color: '#CA8A04', bgColor: '#FEF9C3' },
  { type: 'inspection', icon: <Eye size={20} color="#0891B2" />, color: '#0891B2', bgColor: '#CFFAFE' },
  { type: 'other', icon: <CircleDot size={20} color="#64748B" />, color: '#64748B', bgColor: '#F1F5F9' },
];

export default function AddActivityScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const router = useRouter();
  const { addActivity, getCropById } = useCrops();

  const crop = getCropById(cropId ?? '');
  const [activityType, setActivityType] = useState<ActivityType>('watering');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      Alert.alert('Missing Info', 'Please enter an activity title.');
      return;
    }
    if (!cropId) {
      Alert.alert('Error', 'No crop selected.');
      return;
    }

    addActivity(cropId, {
      type: activityType,
      title: title.trim(),
      description: description.trim(),
      date: new Date(date + 'T00:00:00').toISOString(),
      cost: cost ? parseFloat(cost) : undefined,
    });

    router.back();
  }, [cropId, activityType, title, description, date, cost, addActivity, router]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: crop ? `Log Activity — ${crop.name}` : 'Log Activity' }} />

      <View style={styles.section}>
        <Text style={styles.label}>Activity Type</Text>
        <View style={styles.typeGrid}>
          {ACTIVITY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.typeCard,
                activityType === option.type && { borderColor: option.color, backgroundColor: option.bgColor },
              ]}
              onPress={() => {
                setActivityType(option.type);
                if (!title.trim()) {
                  setTitle(ACTIVITY_LABELS[option.type]);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.typeIcon, { backgroundColor: option.bgColor }]}>
                {option.icon}
              </View>
              <Text style={[
                styles.typeLabel,
                activityType === option.type && { color: option.color, fontWeight: '700' as const },
              ]}>
                {ACTIVITY_LABELS[option.type]}
              </Text>
              {activityType === option.type && (
                <View style={[styles.checkCircle, { backgroundColor: option.color }]}>
                  <Check size={10} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Applied DAP fertilizer"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this activity..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Date</Text>
            <CalendarPicker
              value={date}
              onChange={setDate}
              placeholder="Select date"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Cost (₹)</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85} testID="save-activity">
          <Text style={styles.saveButtonText}>Log Activity</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  typeCard: {
    width: '30%' as unknown as number,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 20,
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
});
