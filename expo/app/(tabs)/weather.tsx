import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { fetchRealtimeWeatherForecast, ForecastDay, REGION_WEATHER_FORECAST } from '@/mocks/weatherForecast';

export default function WeatherScreen() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission not granted. Showing region forecast instead.');
          setForecast(REGION_WEATHER_FORECAST.northern_plains); // fallback region
          setLoading(false);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Fetch live forecast
        const data = await fetchRealtimeWeatherForecast(null, { latitude, longitude });
        setForecast(data);
      } catch (err: any) {
        // Fallback to static region forecast
        setError(`Live weather unavailable. Showing region forecast instead.`);
        setForecast(REGION_WEATHER_FORECAST.central); // fallback region
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Fetching live weather forecast...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={forecast}
      keyExtractor={(item) => item.day}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.day}>{item.day}</Text>
          <Text style={styles.condition}>{item.condition}</Text>
          <Text style={styles.temp}>{item.temp}</Text>
          <Text style={styles.detail}>🌧 Rain: {item.rain}%</Text>
          <Text style={styles.detail}>💨 Wind: {item.wind}</Text>
        </View>
      )}
      ListHeaderComponent={
        error ? <Text style={styles.error}>⚠️ {error}</Text> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  temp: {
    fontSize: 16,
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 8,
  },
});
