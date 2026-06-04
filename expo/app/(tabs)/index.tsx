import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Sprout, TrendingUp, CheckCircle, Clock, Wheat, Leaf, CloudRain, MapPin, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useCrops } from '@/contexts/CropContext';
import { useUser } from '@/contexts/UserContext';
import { STAGE_LABELS, STAGE_COLORS } from '@/types/crop';
import { formatDate, daysFromNow, getProgressPercent } from '@/utils/helpers';
import Colors from '@/constants/colors';
import { Image } from 'expo-image';
import AlertsBanner from '@/components/AlertsBanner';
import { INDIAN_STATES } from '@/mocks/cropSuggestions';
import { fetchRealtimeWeatherForecast, REGION_WEATHER_FORECAST, WEATHER_FORECAST } from '@/mocks/weatherForecast';

const WEATHER_ADVISOR_THRESHOLDS = {
  heavyRain: 60,
  moderateRain: 30,
} as const;

export default function DashboardScreen() {
  const router = useRouter();
  const { crops, activeCrops, completedCrops, allActivities, isLoading, cropsQuery } = useCrops();
  const { username, location } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const selectedState = INDIAN_STATES.find((state) => state.label === location) ?? null;
  const fallbackForecast = selectedState ? (REGION_WEATHER_FORECAST[selectedState.region] ?? WEATHER_FORECAST) : WEATHER_FORECAST;
  const weatherQuery = useQuery({
    queryKey: ['dashboard-weather', selectedState?.region ?? null],
    queryFn: () => fetchRealtimeWeatherForecast(selectedState?.region ?? null),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
  const dashboardForecast = weatherQuery.data ?? fallbackForecast;
  const weatherSummary = dashboardForecast[0];
  const rainPeak = dashboardForecast.reduce((max, day) => Math.max(max, day.rain), 0);
  const weatherAdvisorText = rainPeak >= WEATHER_ADVISOR_THRESHOLDS.heavyRain
    ? 'Heavy rain expected soon. Delay spray and clear water drainage in fields.'
    : rainPeak >= WEATHER_ADVISOR_THRESHOLDS.moderateRain
    ? 'Moderate rain possible this week. Adjust irrigation in shorter cycles.'
    : 'Dry weather likely. Plan irrigation early morning for best moisture retention.';

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
        colors={['#1B4332', '#2D6A4F', '#40916C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>Namaste, {username ?? 'Kishan'}!</Text>
          <Text style={styles.heroSubtitle}>
            {activeCrops.length > 0
              ? `You have ${activeCrops.length} active crop${activeCrops.length !== 1 ? 's' : ''} growing`
              : `Welcome to AISmartKisan, ${username ?? 'Kishan'}!`}
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
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/suggestions')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open crop advisor"
        >
          <Sparkles size={16} color={Colors.primary} />
          <Text style={styles.quickActionText}>Advisor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/weather')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="View live weather forecast"
        >
          <CloudRain size={16} color={Colors.info} />
          <Text style={styles.quickActionText}>Live Weather</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#EFF8F1' }]}>
          <Sprout size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{activeCrops.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF9EF' }]}>
          <Clock size={20} color={Colors.accent} />
          <Text style={styles.statNumber}>{stats.upcomingHarvests.length}</Text>
          <Text style={styles.statLabel}>Harvesting Soon</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0F7FE' }]}>
          <TrendingUp size={20} color={Colors.info} />
          <Text style={styles.statNumber}>{stats.totalActivities}</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
          <CheckCircle size={20} color={Colors.success} />
          <Text style={styles.statNumber}>{completedCrops.length}</Text>
          <Text style={styles.statLabel}>Harvested</Text>
        </View>
      </View>

      {activeCrops.length > 0 && (
        <View style={styles.section}>
          <AlertsBanner crops={activeCrops} />
        </View>
      )}

      <View style={styles.section}>
        <LinearGradient
          colors={['#F0F9FF', '#ECFDF5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weatherAdvisorCard}
        >
          <View style={styles.weatherAdvisorHeader}>
            <View style={styles.weatherAdvisorIcon}>
              <CloudRain size={16} color={Colors.info} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.weatherAdvisorTitle}>Live Weather Advisor</Text>
              <Text style={styles.weatherAdvisorSubtitle}>
                {weatherQuery.isSuccess ? 'Updated every 15 minutes' : 'Using latest available data'}
              </Text>
            </View>
          </View>
          {location && (
            <View style={styles.locationRow}>
              <MapPin size={13} color={Colors.textMuted} />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          )}
          {weatherSummary && (
            <Text style={styles.weatherTodayText}>
              Today: {weatherSummary.condition} · {weatherSummary.temp} · Rain {weatherSummary.rain}%
            </Text>
          )}
          <Text style={styles.weatherAdvisorText}>{weatherAdvisorText}</Text>
        </LinearGradient>
      </View>

      {activeCrops.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Crops</Text>
            <TouchableOpacity onPress={() => router.push('/crops')}>
              <Text style={styles.seeAll}>See All</Text>
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
                        {STAGE_LABELS[crop.currentStage]}
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: stageColor }]} />
                    </View>
                    <Text style={[
                      styles.daysLeftText,
                      daysLeft < 0 && { color: Colors.danger, fontWeight: '600' as const },
                    ]}>
                      {daysLeft > 0 ? `${daysLeft}d to harvest` : daysLeft < 0 ? `Overdue ${Math.abs(daysLeft)}d` : 'Ready to harvest'}
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
          <Text style={styles.sectionTitle}>Upcoming Harvests</Text>
          {stats.upcomingHarvests.map(crop => {
            const harvestDays = daysFromNow(crop.expectedHarvestDate);
            return (
              <TouchableOpacity
                key={crop.id}
                style={styles.harvestCard}
                onPress={() => router.push({ pathname: '/crop-detail', params: { id: crop.id } })}
                activeOpacity={0.7}
              >
                <View style={[styles.harvestIndicator, { backgroundColor: harvestDays < 0 ? Colors.danger : Colors.accent }]} />
                <View style={styles.harvestInfo}>
                  <Text style={styles.harvestName}>{crop.name} — {crop.variety}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.harvestDate}>
                      Expected: {formatDate(crop.expectedHarvestDate)} {' '}
                    </Text>
                    {harvestDays < 0 ? (
                      <Text style={[styles.harvestDate, { color: Colors.danger, fontWeight: '600' as const }]}>
                        (Overdue {Math.abs(harvestDays)}d)
                      </Text>
                    ) : (
                      <Text style={styles.harvestDate}>({harvestDays}d)</Text>
                    )}
                  </View>
                </View>
                <Wheat size={20} color={harvestDays < 0 ? Colors.danger : Colors.accent} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {recentActivities.length > 0 && (
        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity onPress={() => router.push('/activities')}>
              <Text style={styles.seeAll}>See All</Text>
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
          <Text style={styles.emptyTitle}>Welcome to Kishan!</Text>
          <Text style={styles.emptySubtitle}>
            Start managing your crops from sowing to harvest. Tap the + button to add your first crop.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add-crop')}
            activeOpacity={0.8}
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.emptyButtonText}>Add First Crop</Text>
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
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
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
  weatherAdvisorCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7EAF8',
    padding: 14,
    gap: 8,
  },
  weatherAdvisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weatherAdvisorIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.info + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherAdvisorTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  weatherAdvisorSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  weatherTodayText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  weatherAdvisorText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
