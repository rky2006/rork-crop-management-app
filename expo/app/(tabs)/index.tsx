import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Bot,
  CircleUserRound,
  CloudRain,
  Menu,
  MessageCircle,
  Plus,
  Sprout,
  Camera,
  FlaskConical,
  LayoutGrid,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { useCrops } from '@/contexts/CropContext';
import { useUser } from '@/contexts/UserContext';
import { INDIAN_STATES } from '@/mocks/cropSuggestions';
import { fetchRealtimeWeatherForecast, REGION_WEATHER_FORECAST, WEATHER_FORECAST } from '@/mocks/weatherForecast';

export default function DashboardScreen() {
  const router = useRouter();
  const { activeCrops, allActivities } = useCrops();
  const { location, username, profileImage } = useUser();

  const selectedState = INDIAN_STATES.find((state) => state.label === location) ?? null;
  const fallbackForecast = selectedState ? (REGION_WEATHER_FORECAST[selectedState.region] ?? WEATHER_FORECAST) : WEATHER_FORECAST;

  const weatherQuery = useQuery({
    queryKey: ['dashboard-weather-simple', selectedState?.region ?? null],
    queryFn: () => fetchRealtimeWeatherForecast(selectedState?.region ?? null),
    staleTime: 5 * 60 * 1000,
  });

  const todayWeather = weatherQuery.data?.[0] ?? fallbackForecast[0];
  const recentActivities = useMemo(() => allActivities.slice(0, 3), [allActivities]);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.greetingText}>Namaste,</Text>
            <Text style={styles.usernameText}>{username || 'Farmer'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.headerProfileImage} />
            ) : (
              <CircleUserRound size={48} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/disease-diagnosis')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
              <Camera size={24} color="#0288D1" />
            </View>
            <Text style={styles.actionLabel}>Disease Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/soil-report')}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <FlaskConical size={24} color="#7B1FA2" />
            </View>
            <Text style={styles.actionLabel}>Soil Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/crops')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <LayoutGrid size={24} color="#2E7D32" />
            </View>
            <Text style={styles.actionLabel}>My Farm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/add-crop')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Plus size={24} color="#E65100" />
            </View>
            <Text style={styles.actionLabel}>Add Crop</Text>
          </TouchableOpacity>
        </View>

        {/* Active Crops Carousel */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Crops</Text>
            <TouchableOpacity onPress={() => router.push('/crops')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {activeCrops.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropsScroll}>
              {activeCrops.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  style={styles.cropCard}
                  onPress={() => router.push({ pathname: '/crop-detail', params: { id: crop.id } })}
                >
                  <View style={styles.cropIconWrap}>
                    <Sprout size={32} color={Colors.primary} />
                  </View>
                  <Text style={styles.cropName} numberOfLines={1}>{crop.name}</Text>
                  <Text style={styles.cropStage}>{crop.currentStage}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.emptyCrops} onPress={() => router.push('/add-crop')}>
              <Sprout size={40} color={Colors.textMuted} />
              <Text style={styles.emptyCropsText}>No active crops. Add your first crop!</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* AI Chat Entry */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.chatCard} activeOpacity={0.9} onPress={() => router.push('/suggestions')}>
            <View style={styles.chatInfo}>
              <Text style={styles.chatTitle}>KrishiChat AI</Text>
              <Text style={styles.chatSubtitle}>Ask any farming questions</Text>
            </View>
            <View style={styles.chatBotIcon}>
              <Bot size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Weather Card */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Weather Update</Text>
          <TouchableOpacity style={styles.weatherCard} activeOpacity={0.85} onPress={() => router.push('/weather')}>
            <View style={styles.weatherMain}>
              <View>
                <Text style={styles.weatherLocation}>{location || 'Location not set'}</Text>
                <Text style={styles.weatherCondition}>{todayWeather?.condition || 'Check forecast'}</Text>
              </View>
              <Text style={styles.weatherTemp}>{todayWeather?.temp.split('/')[0].trim() || '--'}</Text>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailItem}>
                <CloudRain size={16} color={Colors.primary} />
                <Text style={styles.weatherDetailText}>Rain: {todayWeather?.rain ?? '--'}%</Text>
              </View>
              <Text style={styles.weatherDetailDivider}>|</Text>
              <Text style={styles.weatherDetailText}>Wind: {todayWeather?.wind ?? '--'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <View style={[styles.sectionContainer, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
            </View>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Clock size={16} color={Colors.textMuted} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{new Date(activity.date).toLocaleDateString()}</Text>
                </View>
                <ChevronRight size={18} color={Colors.border} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  topHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -25,
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  cropsScroll: {
    paddingRight: 20,
    gap: 12,
  },
  cropCard: {
    width: 120,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cropIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cropName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  cropStage: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emptyCrops: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    gap: 10,
  },
  emptyCropsText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  chatCard: {
    backgroundColor: '#F68A1E',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  chatBotIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherCard: {
    backgroundColor: '#FDF7E7',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FAE5B4',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  weatherDetailDivider: {
    color: '#D8D8D8',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  lastSection: {
    marginBottom: 40,
  },
});
