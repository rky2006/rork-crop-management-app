import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin, Calendar, Trash2, Plus, ChevronRight,
  ArrowUpCircle, BarChart3, FlaskConical, Leaf, Factory
} from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import {
  GROWTH_STAGES, STAGE_LABELS, STAGE_COLORS, CATEGORY_LABELS,
  ACTIVITY_LABELS, GrowthStage
} from '@/types/crop';
import { formatDate, daysFromNow, getProgressPercent } from '@/utils/helpers';
import StageTimeline from '@/components/StageTimeline';
import FarmingTips from '@/components/FarmingTips';
import FertilizerSuggestions from '@/components/FertilizerSuggestions';
import { FARMING_TYPE_LABELS } from '@/types/crop';
import Colors from '@/constants/colors';

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCropById, updateStage, deleteCrop } = useCrops();
  const [showStageSelector, setShowStageSelector] = useState(false);

  const crop = getCropById(id ?? '');

  const progress = useMemo(() => {
    if (!crop) return 0;
    return getProgressPercent(crop.sowingDate, crop.expectedHarvestDate);
  }, [crop]);

  const daysLeft = useMemo(() => {
    if (!crop) return 0;
    return daysFromNow(crop.expectedHarvestDate);
  }, [crop]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Crop',
      `Are you sure you want to delete ${crop?.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (crop) {
              deleteCrop(crop.id);
              router.back();
            }
          },
        },
      ]
    );
  }, [crop, deleteCrop, router]);

  const handleStageChange = useCallback((stage: GrowthStage) => {
    if (crop) {
      updateStage(crop.id, stage);
      setShowStageSelector(false);
    }
  }, [crop, updateStage]);

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

  const stageColor = STAGE_COLORS[crop.currentStage];
  const currentStageIndex = GROWTH_STAGES.indexOf(crop.currentStage);
  const nextStage = currentStageIndex < GROWTH_STAGES.length - 1 ? GROWTH_STAGES[currentStageIndex + 1] : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: crop.name }} />

      <View style={styles.heroSection}>
        <Image source={{ uri: crop.imageUrl }} style={styles.heroImage} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroOverlay}
        >
          <View style={styles.heroContent}>
            <View style={[styles.stageBadgeLarge, { backgroundColor: stageColor }]}>
              <Text style={styles.stageBadgeText}>{STAGE_LABELS[crop.currentStage]}</Text>
            </View>
            <Text style={styles.heroName}>{crop.name}</Text>
            <Text style={styles.heroVariety}>{crop.variety} · {CATEGORY_LABELS[crop.category]}</Text>
            <View style={styles.farmingBadgeRow}>
              {crop.farmingType === 'organic' ? (
                <View style={[styles.farmingBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Leaf size={12} color="#16A34A" />
                  <Text style={[styles.farmingBadgeText, { color: '#16A34A' }]}>Organic</Text>
                </View>
              ) : (
                <View style={[styles.farmingBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Factory size={12} color="#fff" />
                  <Text style={[styles.farmingBadgeText, { color: '#fff' }]}>Non-Organic</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{daysLeft > 0 ? daysLeft : 0}</Text>
          <Text style={styles.statLabel}>Days Left</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{crop.activities.length}</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: stageColor }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressDateLabel}>Sowed: {formatDate(crop.sowingDate)}</Text>
          <Text style={styles.progressDateLabel}>Harvest: {formatDate(crop.expectedHarvestDate)}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.textMuted} />
          <Text style={styles.infoLabel}>Plot</Text>
          <Text style={styles.infoValue}>{crop.plotName}</Text>
        </View>
        <View style={styles.infoRow}>
          <BarChart3 size={16} color={Colors.textMuted} />
          <Text style={styles.infoLabel}>Size</Text>
          <Text style={styles.infoValue}>{crop.plotSize}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.textMuted} />
          <Text style={styles.infoLabel}>Added</Text>
          <Text style={styles.infoValue}>{formatDate(crop.createdAt)}</Text>
        </View>
      </View>

      {crop.notes ? (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{crop.notes}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Growth Timeline</Text>
          <TouchableOpacity
            onPress={() => setShowStageSelector(!showStageSelector)}
            style={styles.updateStageBtn}
            activeOpacity={0.7}
          >
            <ArrowUpCircle size={16} color={Colors.primary} />
            <Text style={styles.updateStageText}>Update Stage</Text>
          </TouchableOpacity>
        </View>

        {showStageSelector && (
          <View style={styles.stageSelector}>
            {GROWTH_STAGES.map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.stageSelectorItem,
                  crop.currentStage === stage && { backgroundColor: STAGE_COLORS[stage] + '18' },
                ]}
                onPress={() => handleStageChange(stage)}
                activeOpacity={0.7}
              >
                <View style={[styles.stageSelectorDot, { backgroundColor: STAGE_COLORS[stage] }]} />
                <Text style={[
                  styles.stageSelectorText,
                  crop.currentStage === stage && { color: STAGE_COLORS[stage], fontWeight: '700' as const },
                ]}>
                  {STAGE_LABELS[stage]}
                </Text>
                {crop.currentStage === stage && <Text style={styles.currentLabel}>Current</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <StageTimeline currentStage={crop.currentStage} />

        {nextStage && (
          <TouchableOpacity
            style={[styles.advanceButton, { backgroundColor: STAGE_COLORS[nextStage] }]}
            onPress={() => handleStageChange(nextStage)}
            activeOpacity={0.85}
          >
            <ArrowUpCircle size={18} color="#fff" />
            <Text style={styles.advanceButtonText}>
              Advance to {STAGE_LABELS[nextStage]}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activities ({crop.activities.length})</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/add-activity', params: { cropId: crop.id } })}
            style={styles.addActivityBtn}
            activeOpacity={0.7}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.addActivityText}>Log Activity</Text>
          </TouchableOpacity>
        </View>

        {crop.activities.length === 0 ? (
          <View style={styles.noActivities}>
            <Text style={styles.noActivitiesText}>No activities logged yet</Text>
          </View>
        ) : (
          [...crop.activities]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(activity => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityLeft}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityMeta}>
                    {ACTIVITY_LABELS[activity.type]} · {formatDate(activity.date)}
                  </Text>
                  {activity.description ? (
                    <Text style={styles.activityDesc} numberOfLines={2}>{activity.description}</Text>
                  ) : null}
                </View>
                {activity.cost !== undefined && activity.cost > 0 && (
                  <Text style={styles.activityCost}>₹{activity.cost}</Text>
                )}
              </View>
            ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Soil & Water Report</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/soil-report', params: { cropId: crop.id } })}
            style={styles.soilReportBtn}
            activeOpacity={0.7}
          >
            <FlaskConical size={16} color="#8B6914" />
            <Text style={styles.soilReportBtnText}>{crop.soilReport ? 'Update Report' : 'Add Report'}</Text>
          </TouchableOpacity>
        </View>

        {!crop.soilReport ? (
          <TouchableOpacity
            style={styles.addReportCard}
            onPress={() => router.push({ pathname: '/soil-report', params: { cropId: crop.id } })}
            activeOpacity={0.7}
          >
            <View style={styles.addReportIcon}>
              <FlaskConical size={28} color="#8B6914" />
            </View>
            <Text style={styles.addReportTitle}>Add Soil & Water Report</Text>
            <Text style={styles.addReportDesc}>
              Enter your soil test lab values to get personalized {crop.farmingType === 'organic' ? 'organic ' : ''}fertilizer suggestions for {crop.name}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.reportSummaryCard}>
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Soil Type</Text>
              <Text style={styles.reportValue}>{crop.soilReport.soilType.charAt(0).toUpperCase() + crop.soilReport.soilType.slice(1)}</Text>
            </View>
            {crop.soilReport.ph ? (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Soil pH</Text>
                <Text style={styles.reportValue}>{crop.soilReport.ph}</Text>
              </View>
            ) : null}
            {crop.soilReport.nitrogen ? (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>N-P-K</Text>
                <Text style={styles.reportValue}>{crop.soilReport.nitrogen} - {crop.soilReport.phosphorus || '?'} - {crop.soilReport.potassium || '?'} kg/ha</Text>
              </View>
            ) : null}
            {crop.soilReport.organicCarbon ? (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Organic Carbon</Text>
                <Text style={styles.reportValue}>{crop.soilReport.organicCarbon}%</Text>
              </View>
            ) : null}
            {crop.soilReport.waterPh ? (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Water pH</Text>
                <Text style={styles.reportValue}>{crop.soilReport.waterPh}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      {crop.soilReport && (
        <View style={styles.section}>
          <FertilizerSuggestions crop={crop} />
        </View>
      )}

      <View style={styles.section}>
        <FarmingTips currentStage={crop.currentStage} category={crop.category} cropName={crop.name} />
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
          <Trash2 size={16} color={Colors.danger} />
          <Text style={styles.deleteText}>Delete Crop</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  heroSection: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceAlt,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroContent: {
    gap: 4,
  },
  stageBadgeLarge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  heroName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
  },
  heroVariety: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  progressSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressDateLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    width: 50,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  notesSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  updateStageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primary + '12',
  },
  updateStageText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  stageSelector: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  stageSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
  },
  stageSelectorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stageSelectorText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  currentLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  advanceButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700' as const,
  },
  addActivityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  addActivityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  noActivities: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  noActivitiesText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  activityLeft: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activityMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  activityCost: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.accent,
    marginLeft: 8,
    alignSelf: 'center',
  },
  dangerSection: {
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
    backgroundColor: Colors.danger + '08',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.danger,
  },
  farmingBadgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  farmingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  farmingBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  soilReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
  soilReportBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#8B6914',
  },
  addReportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addReportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReportTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  addReportDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 260,
  },
  reportSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  reportValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
