import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { CloudSun, Droplets, MapPin, RefreshCcw, Thermometer, Wind } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherTipsProps {
  activeCropCount: number;
}

interface WeatherSnapshot {
  locationName: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  weatherCode: number;
}

function getWeatherDescription(weatherCode: number, t: (key: string) => string): string {
  if (weatherCode === 0) return t('weather.clear');
  if ([1, 2].includes(weatherCode)) return t('weather.partlyCloudy');
  if (weatherCode === 3) return t('weather.cloudy');
  if ([45, 48].includes(weatherCode)) return t('weather.fog');
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return t('weather.drizzle');
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return t('weather.rain');
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return t('weather.snow');
  if ([95, 96, 99].includes(weatherCode)) return t('weather.storm');
  return t('weather.unknown');
}

function getCropWord(activeCropCount: number, singular: string, plural: string): string {
  return activeCropCount === 1 ? singular : plural;
}

export default function WeatherTips({ activeCropCount }: WeatherTipsProps) {
  const { t } = useLanguage();
  const [permissionState, setPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (requestPermission: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const permission = requestPermission
        ? await Location.requestForegroundPermissionsAsync()
        : await Location.getForegroundPermissionsAsync();

      if (!permission.granted) {
        setPermissionState(requestPermission ? 'denied' : 'idle');
        setWeather(null);
        setIsLoading(false);
        return;
      }

      setPermissionState('granted');

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode, response] = await Promise.all([
        Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=precipitation_probability_max&timezone=auto&forecast_days=1`
        ),
      ]);

      if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
      }

      const forecast = await response.json();
      const place = geocode[0];
      const locationName = [place?.district, place?.city, place?.subregion, place?.region]
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');

      setWeather({
        locationName: locationName || t('common.location'),
        temperature: Math.round(forecast.current.temperature_2m),
        apparentTemperature: Math.round(forecast.current.apparent_temperature),
        humidity: Math.round(forecast.current.relative_humidity_2m),
        windSpeed: Math.round(forecast.current.wind_speed_10m),
        rainChance: Math.round(forecast.daily.precipitation_probability_max?.[0] ?? 0),
        weatherCode: forecast.current.weather_code,
      });
    } catch (loadError) {
      setError(t('weather.locationUnavailable'));
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadWeather(false);
  }, [loadWeather]);

  const tips = useMemo(() => {
    if (!weather) return [];

    const suggestions: string[] = [];

    if (weather.apparentTemperature >= 35) {
      suggestions.push(t('weather.tipHeat'));
    }
    if (weather.rainChance >= 60) {
      suggestions.push(t('weather.tipRain'));
    }
    if (weather.windSpeed >= 22) {
      suggestions.push(t('weather.tipWind'));
    }
    if (weather.humidity >= 80) {
      suggestions.push(t('weather.tipHumidity'));
    }
    if (weather.temperature >= 18 && weather.temperature <= 30 && suggestions.length === 0) {
      suggestions.push(t('weather.tipCool'));
    }

    suggestions.push(t('weather.tipGeneral'));

    return suggestions.slice(0, 3);
  }, [t, weather]);

  const cropWord = getCropWord(activeCropCount, t('dashboard.cropSingular'), t('dashboard.cropPlural'));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <CloudSun size={20} color={Colors.accent} />
          <Text style={styles.title}>{t('weather.title')}</Text>
        </View>
        {weather ? (
          <TouchableOpacity onPress={() => void loadWeather(false)} activeOpacity={0.75} style={styles.refreshButton}>
            <RefreshCcw size={14} color={Colors.primary} />
            <Text style={styles.refreshText}>{t('common.refresh')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.subtitle}>{t('weather.subtitle')}</Text>

      {weather ? (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.primary} />
              <Text style={styles.locationText}>
                {t('weather.summary', {
                  description: getWeatherDescription(weather.weatherCode, t),
                  location: weather.locationName,
                })}
              </Text>
            </View>
            {activeCropCount > 0 ? (
              <Text style={styles.cropContext}>
                {t('weather.usesActiveCrops', { count: activeCropCount, cropWord })}
              </Text>
            ) : null}
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Thermometer size={16} color={Colors.warning} />
              <Text style={styles.metricLabel}>{t('weather.temperature')}</Text>
              <Text style={styles.metricValue}>{weather.temperature}°C</Text>
            </View>
            <View style={styles.metricCard}>
              <Droplets size={16} color={Colors.info} />
              <Text style={styles.metricLabel}>{t('weather.humidity')}</Text>
              <Text style={styles.metricValue}>{weather.humidity}%</Text>
            </View>
            <View style={styles.metricCard}>
              <Wind size={16} color={Colors.primary} />
              <Text style={styles.metricLabel}>{t('weather.wind')}</Text>
              <Text style={styles.metricValue}>{weather.windSpeed} km/h</Text>
            </View>
          </View>

          <View style={styles.rainBanner}>
            <Text style={styles.rainBannerText}>
              {t('weather.rainChance')}: {weather.rainChance}%
            </Text>
          </View>

          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={`${tip}-${index}`} style={styles.tipCard}>
                <Text style={styles.tipNumber}>{index + 1}</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      ) : permissionState === 'denied' ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{t('weather.permissionTitle')}</Text>
          <Text style={styles.stateText}>{t('weather.permissionDenied')}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => void loadWeather(true)} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{t('common.enable')}</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.stateText}>
            {permissionState === 'idle' ? t('weather.loadingLocation') : t('weather.loadingWeather')}
          </Text>
        </View>
      ) : (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>{t('weather.permissionTitle')}</Text>
          <Text style={styles.stateText}>{error ?? t('weather.permissionDescription')}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => void loadWeather(true)} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{error ? t('common.retry') : t('common.enable')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  cropContext: {
    marginTop: 8,
    color: Colors.textMuted,
    fontSize: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  metricValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  rainBanner: {
    marginTop: 10,
    backgroundColor: Colors.info + '12',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rainBannerText: {
    color: Colors.info,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tipsList: {
    marginTop: 12,
    gap: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  tipNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    backgroundColor: Colors.primary + '14',
    color: Colors.primary,
    fontWeight: '700' as const,
    overflow: 'hidden',
  },
  tipText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  stateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    gap: 10,
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  stateText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700' as const,
  },
});
