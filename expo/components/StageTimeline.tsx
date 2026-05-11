import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GROWTH_STAGES, STAGE_LABELS, STAGE_COLORS, GrowthStage } from '@/types/crop';
import Colors from '@/constants/colors';

interface StageTimelineProps {
  currentStage: GrowthStage;
  compact?: boolean;
}

export default function StageTimeline({ currentStage, compact = false }: StageTimelineProps) {
  const currentIndex = GROWTH_STAGES.indexOf(currentStage);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {GROWTH_STAGES.map((stage, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <View key={stage} style={styles.compactDotWrapper}>
              <View
                style={[
                  styles.compactDot,
                  isActive && { backgroundColor: STAGE_COLORS[stage] },
                  isCurrent && styles.compactDotCurrent,
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {GROWTH_STAGES.map((stage, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === GROWTH_STAGES.length - 1;

        return (
          <View key={stage} style={styles.stageRow}>
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.dot,
                  isActive && { backgroundColor: STAGE_COLORS[stage] },
                  isCurrent && styles.dotCurrent,
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    isActive && index < currentIndex && { backgroundColor: STAGE_COLORS[stage] },
                  ]}
                />
              )}
            </View>
            <View style={[styles.labelContainer, isCurrent && styles.labelContainerActive]}>
              <Text
                style={[
                  styles.stageLabel,
                  isActive && styles.stageLabelActive,
                  isCurrent && { color: STAGE_COLORS[stage], fontWeight: '700' as const },
                ]}
              >
                {STAGE_LABELS[stage]}
              </Text>
              {isCurrent && (
                <View style={[styles.currentBadge, { backgroundColor: STAGE_COLORS[stage] + '18' }]}>
                  <Text style={[styles.currentBadgeText, { color: STAGE_COLORS[stage] }]}>Current</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  line: {
    width: 2,
    height: 28,
    backgroundColor: Colors.borderLight,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    flex: 1,
  },
  labelContainerActive: {
    paddingBottom: 18,
  },
  stageLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  stageLabelActive: {
    color: Colors.text,
  },
  currentBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactDotWrapper: {
    flex: 1,
  },
  compactDot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
  },
  compactDotCurrent: {
    height: 6,
    borderRadius: 3,
  },
});
