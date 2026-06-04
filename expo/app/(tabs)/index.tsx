import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bot, CircleUserRound, CloudRain, Menu, MessageCircle, Plus, Sprout } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { useCrops } from '@/contexts/CropContext';
import { useUser } from '@/contexts/UserContext';
import { INDIAN_STATES } from '@/mocks/cropSuggestions';
import { fetchRealtimeWeatherForecast, REGION_WEATHER_FORECAST, WEATHER_FORECAST } from '@/mocks/weatherForecast';

export default function DashboardScreen() {
  const router = useRouter();
  const { activeCrops } = useCrops();
  const { location } = useUser();

  const selectedState = INDIAN_STATES.find((state) => state.label === location) ?? null;
  const fallbackForecast = selectedState ? (REGION_WEATHER_FORECAST[selectedState.region] ?? WEATHER_FORECAST) : WEATHER_FORECAST;

  const weatherQuery = useQuery({
    queryKey: ['dashboard-weather-simple', selectedState?.region ?? null],
    queryFn: () => fetchRealtimeWeatherForecast(selectedState?.region ?? null),
    staleTime: 5 * 60 * 1000,
  });

  const todayWeather = weatherQuery.data?.[0] ?? fallbackForecast[0];

  const primaryCrop = useMemo(() => activeCrops[0], [activeCrops]);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View accessibilityLabel="Menu icon">
            <Menu size={34} color="#fff" />
          </View>
          <View accessibilityLabel="Profile icon">
            <CircleUserRound size={46} color="#fff" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My crops.</Text>
          <View style={styles.cropRow}>
            <TouchableOpacity
              style={styles.cropTile}
              activeOpacity={0.8}
              onPress={() => router.push(primaryCrop ? { pathname: '/crop-detail', params: { id: primaryCrop.id } } : '/crops')}
            >
              <View style={styles.cropTileIconWrap}>
                <Sprout size={48} color={Colors.primary} />
              </View>
              <Text style={styles.cropTileText}>{primaryCrop?.name ?? 'No crop'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cropTile}
              activeOpacity={0.8}
              onPress={() => router.push('/add-crop')}
            >
              <View style={[styles.cropTileIconWrap, styles.addTileIconWrap]}>
                <Plus size={42} color={Colors.primary} />
              </View>
              <Text style={styles.cropTileText}>Add/Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>KrishiChat AI.</Text>
          <TouchableOpacity style={styles.chatEntry} activeOpacity={0.85} onPress={() => router.push('/suggestions')}>
            <View style={styles.chatEntryIcon}>
              <Bot size={26} color="#fff" />
            </View>
            <Text style={styles.chatEntryText}>Click to ask about crops</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Weather.</Text>
          <TouchableOpacity style={styles.weatherCard} activeOpacity={0.85} onPress={() => router.push('/weather')}>
            <View style={styles.weatherIconWrap}>
              <CloudRain size={34} color="#F97316" />
            </View>
            <Text style={styles.weatherTitle}>Location access needed</Text>
            <Text style={styles.weatherText}>
              {location
                ? `Today in ${location}: ${todayWeather?.condition ?? 'Forecast unavailable'} · ${todayWeather?.temp ?? '--'} · Rain ${todayWeather?.rain ?? '--'}%`
                : 'Your location is needed to provide the weather forecast of your farm.'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingAiButton} activeOpacity={0.9} onPress={() => router.push('/suggestions')}>
        <MessageCircle size={20} color="#fff" />
        <Text style={styles.floatingAiText}>KrishiChat AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  contentContainer: {
    paddingBottom: 140,
  },
  topHeader: {
    backgroundColor: '#07833A',
    height: 136,
    paddingHorizontal: 24,
    paddingTop: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionCard: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
  },
  sectionTitle: {
    fontSize: 56 / 3,
    fontWeight: '800' as const,
    color: '#101114',
    marginBottom: 20,
  },
  cropRow: {
    flexDirection: 'row',
    gap: 18,
  },
  cropTile: {
    width: 160,
    alignItems: 'center',
  },
  cropTileIconWrap: {
    width: 112,
    height: 112,
    borderRadius: 20,
    backgroundColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  addTileIconWrap: {
    backgroundColor: '#F4F4F4',
  },
  cropTileText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4B4F56',
    fontWeight: '500' as const,
  },
  chatEntry: {
    height: 78,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  chatEntryIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F68A1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatEntryText: {
    fontSize: 18,
    color: '#50545A',
    fontWeight: '500' as const,
  },
  weatherCard: {
    borderRadius: 20,
    backgroundColor: '#F4DEAF',
    paddingHorizontal: 18,
    paddingVertical: 24,
    alignItems: 'center',
  },
  weatherIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F7ECD8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#151515',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherText: {
    fontSize: 17,
    color: '#404040',
    lineHeight: 24,
    textAlign: 'center',
  },
  lastSection: {
    paddingBottom: 12,
  },
  floatingAiButton: {
    position: 'absolute',
    right: 18,
    bottom: 84,
    backgroundColor: '#07B25A',
    borderRadius: 34,
    height: 68,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingAiText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
