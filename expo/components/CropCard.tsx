import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Calendar, ChevronRight } from 'lucide-react-native';
import { Crop, STAGE_LABELS, STAGE_COLORS, CATEGORY_LABELS } from '@/types/crop';
import { formatDate, getProgressPercent } from '@/utils/helpers';
import Colors from '@/constants/colors';
import StageTimeline from './StageTimeline';

interface CropCardProps {
  crop: Crop;
  onPress: () => void;
}

export default React.memo(function CropCard({ crop, onPress }: CropCardProps) {
  const progress = getProgressPercent(crop.sowingDate, crop.expectedHarvestDate);
  const stageColor = STAGE_COLORS[crop.currentStage];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`crop-card-${crop.id}`}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: crop.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.cropName} numberOfLines={1}>{crop.name}</Text>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>
          <Text style={styles.variety}>{crop.variety}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{crop.plotName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{formatDate(crop.sowingDate)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.stageRow}>
          <View style={[styles.stageBadge, { backgroundColor: stageColor + '18' }]}>
            <View style={[styles.stageDot, { backgroundColor: stageColor }]} />
            <Text style={[styles.stageText, { color: stageColor }]}>
              {STAGE_LABELS[crop.currentStage]}
            </Text>
          </View>
          <View style={[styles.categoryBadge]}>
            <Text style={styles.categoryText}>{CATEGORY_LABELS[crop.category]}</Text>
          </View>
        </View>
        <StageTimeline currentStage={crop.currentStage} compact />
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{progress}% complete</Text>
          <Text style={styles.plotSize}>{crop.plotSize}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cropName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  variety: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  stageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  plotSize: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
