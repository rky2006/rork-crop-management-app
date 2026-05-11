import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Sprout, TrendingUp, CheckCircle, Clock, Wheat, Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCrops } from '@/contexts/CropContext';
import { useUser } from '@/contexts/UserContext';
import { STAGE_COLORS } from '@/types/crop';
import { formatDate, daysFromNow, getProgressPercent } from '@/utils/helpers';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStageLabel } from '@/constants/localization';
import WeatherTips from '@/components/WeatherTips';

const DEFAULT_USERNAME = 'Kishan';

export default function DashboardScreen() {
  const router = useRouter();
  const { crops, activeCrops, completedCrops, allActivities, isLoading, cropsQuery } = useCrops();
  const { username } = useUser();
  const { language, t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => {
    const upcomingHarvests = activeCrops.filter(c => {
      const days = daysFromNow(c.expectedHarvestDate);
      return days >= 0 && days <= 30;
    });
    const totalActivities = allActivities.length;
    const categoryCount: Record<string, number> = {};
    activeCrops.forEach(c => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });
    return { upcomingHarvests, totalActivities, categoryCount };
  }, [activeCrops, allActivities]);

  const recentActivities = useMemo(() => allActivities.slice(0, 5), [allActivities]);
  const cropWord = activeCrops.length === 1 ? t('dashboard.cropSingular') : t('dashboard.cropPlural');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cropsQuery.refetch();
    setRefreshing(false);
  }, [cropsQuery]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <LinearGradient
        colors={['#2D6A4F', '#40916C', '#52B788']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>{t('dashboard.greeting', { name: username ?? DEFAULT_USERNAME })}</Text>
          <Text style={styles.heroSubtitle}>
            {activeCrops.length > 0
              ? t('dashboard.activeCropsGrowing', { count: activeCrops.length, cropWord })
              : t('dashboard.addFirstCropPrompt', { name: username ?? DEFAULT_USERNAME })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-crop')}
          activeOpacity={0.85}
        >
          <Plus size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <WeatherTips activeCropCount={activeCrops.length} />

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#EFF8F1' }]}>
          <Sprout size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{activeCrops.length}</Text>
          <Text style={styles.statLabel}>{t('dashboard.active')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF9EF' }]}>
          <Clock size={20} color={Colors.accent} />
          <Text style={styles.statNumber}>{stats.upcomingHarvests.length}</Text>
          <Text style={styles.statLabel}>{t('dashboard.harvestingSoon')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0F7FE' }]}>
          <TrendingUp size={20} color={Colors.info} />
          <Text style={styles.statNumber}>{stats.totalActivities}</Text>
          <Text style={styles.statLabel}>{t('dashboard.activities')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
          <CheckCircle size={20} color={Colors.success} />
          <Text style={styles.statNumber}>{completedCrops.length}</Text>
          <Text style={styles.statLabel}>{t('dashboard.harvested')}</Text>
        </View>
      </View>

      {activeCrops.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.activeCrops')}</Text>
            <TouchableOpacity onPress={() => router.push('/crops')}>
              <Text style={styles.seeAll}>{t('dashboard.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropScroll}>
            {activeCrops.slice(0, 6).map(crop => {
              const progress = getProgressPercent(crop.sowingDate, crop.expectedHarvestDate);
              const stageColor = STAGE_COLORS[crop.currentStage];
              const daysLeft = daysFromNow(crop.expectedHarvestDate);
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={styles.cropMiniCard}
                  onPress={() => router.push({ pathname: '/crop-detail', params: { id: crop.id } })}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: crop.imageUrl }} style={styles.cropMiniImage} contentFit="cover" />
                  <View style={styles.cropMiniInfo}>
                    <Text style={styles.cropMiniName} numberOfLines={1}>{crop.name}</Text>
                    <Text style={styles.cropMiniVariety} numberOfLines={1}>{crop.variety}</Text>
                    <View style={[styles.miniStageBadge, { backgroundColor: stageColor + '18' }]}>
                      <View style={[styles.miniStageDot, { backgroundColor: stageColor }]} />
                      <Text style={[styles.miniStageText, { color: stageColor }]}>
                        {getStageLabel(language, crop.currentStage)}
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: stageColor }]} />
                    </View>
                    <Text style={[
                      styles.daysLeftText,
                      daysLeft < 0 && { color: Colors.danger, fontWeight: '600' as const },
                    ]}>
                      {daysLeft > 0
                        ? t('dashboard.daysToHarvest', { count: daysLeft })
                        : daysLeft < 0
                          ? t('dashboard.overdueBy', { count: Math.abs(daysLeft) })
                          : t('dashboard.readyToHarvest')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {stats.upcomingHarvests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.upcomingHarvests')}</Text>
          {stats.upcomingHarvests.map(crop => {
            const harvestDays = daysFromNow(crop.expectedHarvestDate);
            const isOverdue = harvestDays < 0;

            return (
              <TouchableOpacity
                key={crop.id}
                style={styles.harvestCard}
                onPress={() => router.push({ pathname: '/crop-detail', params: { id: crop.id } })}
                activeOpacity={0.7}
              >
                <View style={[styles.harvestIndicator, { backgroundColor: isOverdue ? Colors.danger : Colors.accent }]} />
                <View style={styles.harvestInfo}>
                  <Text style={styles.harvestName}>{crop.name} — {crop.variety}</Text>
                  <Text style={[styles.harvestDate, isOverdue && styles.harvestDateOverdue]}>
                    {isOverdue
                      ? t('dashboard.expectedHarvestOverdue', {
                          date: formatDate(crop.expectedHarvestDate),
                          count: -harvestDays,
                        })
                      : t('dashboard.expectedHarvest', {
                          date: formatDate(crop.expectedHarvestDate),
                          days: harvestDays,
                        })}
                  </Text>
                </View>
                <Wheat size={20} color={isOverdue ? Colors.danger : Colors.accent} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {recentActivities.length > 0 && (
        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.recentActivities')}</Text>
            <TouchableOpacity onPress={() => router.push('/activities')}>
              <Text style={styles.seeAll}>{t('dashboard.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {recentActivities.map(activity => (
            <View key={activity.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
              </View>
              {activity.cost !== undefined && activity.cost > 0 && (
                <Text style={styles.activityCost}>₹{activity.cost}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {crops.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Leaf size={40} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>{t('dashboard.welcomeTitle')}</Text>
          <Text style={styles.emptySubtitle}>
            {t('dashboard.welcomeSubtitle')}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add-crop')}
            activeOpacity={0.8}
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.emptyButtonText}>{t('dashboard.addFirstCrop')}</Text>
          </TouchableOpacity>
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
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    paddingBottom: 24,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
  },
  heroContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%' as unknown as number,
    padding: 14,
    borderRadius: 14,
    alignItems: 'flex-start',
    gap: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  cropScroll: {
    paddingRight: 16,
    gap: 12,
  },
  cropMiniCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cropMiniImage: {
    width: '100%',
    height: 80,
    backgroundColor: Colors.surfaceAlt,
  },
  cropMiniInfo: {
    padding: 10,
    gap: 3,
  },
  cropMiniName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  cropMiniVariety: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  miniStageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginTop: 3,
  },
  miniStageDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  miniStageText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  daysLeftText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
  },
  harvestCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  harvestIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  harvestInfo: {
    flex: 1,
  },
  harvestName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  harvestDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  harvestDateOverdue: {
    color: Colors.danger,
    fontWeight: '600' as const,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  activityCost: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
