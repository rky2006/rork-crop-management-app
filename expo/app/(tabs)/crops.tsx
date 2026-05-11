import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Filter } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { CropCategory, CATEGORY_LABELS } from '@/types/crop';
import CropCard from '@/components/CropCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

const FILTER_OPTIONS: (CropCategory | 'all')[] = ['all', 'grain', 'horticulture', 'pulse', 'oilseed', 'spice'];

export default function CropsScreen() {
  const router = useRouter();
  const { crops, isLoading } = useCrops();
  const [filter, setFilter] = useState<CropCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredCrops = useMemo(() => {
    let result = crops;
    if (filter !== 'all') {
      result = result.filter(c => c.category === filter);
    }
    if (!showCompleted) {
      result = result.filter(c => c.currentStage !== 'completed');
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [crops, filter, showCompleted]);

  const handleCropPress = useCallback((id: string) => {
    router.push({ pathname: '/crop-detail', params: { id } });
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === item && styles.filterChipActive]}
              onPress={() => setFilter(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item === 'all' ? 'All' : CATEGORY_LABELS[item]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, showCompleted && styles.toggleButtonActive]}
          onPress={() => setShowCompleted(!showCompleted)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, showCompleted && styles.toggleTextActive]}>
            Show Harvested
          </Text>
        </TouchableOpacity>
        <Text style={styles.countText}>{filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={filteredCrops}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CropCard crop={item} onPress={() => handleCropPress(item.id)} />
        )}
        contentContainerStyle={filteredCrops.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No Crops Found"
            subtitle={filter !== 'all' ? 'No crops in this category yet.' : 'Add your first crop to get started!'}
            actionLabel="Add Crop"
            onAction={() => router.push('/add-crop')}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-crop')}
        activeOpacity={0.85}
        testID="add-crop-fab"
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary + '18',
  },
  toggleText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  countText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
