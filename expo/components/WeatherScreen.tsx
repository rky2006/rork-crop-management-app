import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { CloudDrizzle, CloudSun, LocateFixed, Sun, Wind } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import Colors from "@/constants/colors";
import { useUser } from "@/contexts/UserContext";
import { INDIAN_STATES } from "@/mocks/cropSuggestions";
import {
  fetchRealtimeWeatherForecast,
  ForecastDay,
  REGION_WEATHER_FORECAST,
  WEATHER_FORECAST,
  WeatherCoordinates,
} from "@/mocks/weatherForecast";

function detectStateFromAddress(address?: Location.LocationGeocodedAddress | null): string | null {
  if (!address) return null;
  const possible = [address.region, address.subregion, address.district]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim().toLowerCase());
  if (!possible.length) return null;
  const match = INDIAN_STATES.find((state) =>
    possible.some((value) => value.includes(state.label.toLowerCase())),
  );
  return match?.label ?? null;
}

export default function WeatherScreen() {
  const { location, setLocation } = useUser();
  const [liveCoordinates, setLiveCoordinates] = useState<WeatherCoordinates | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatusText, setLocationStatusText] = useState<string | null>(null);

  const selectedState = INDIAN_STATES.find((state) => state.label === location) ?? null;
  const regionalFallbackForecast = selectedState
    ? (REGION_WEATHER_FORECAST[selectedState.region] ?? WEATHER_FORECAST)
    : WEATHER_FORECAST;

  const weatherQuery = useQuery({
    queryKey: [
      "weather-forecast-live",
      selectedState?.region ?? null,
      liveCoordinates?.latitude.toFixed(2) ?? null,
      liveCoordinates?.longitude.toFixed(2) ?? null,
    ],
    queryFn: () => fetchRealtimeWeatherForecast(selectedState?.region ?? null, liveCoordinates),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    refetchIntervalInBackground: false,
  });

  const handleUseLiveLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    setLocationStatusText(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationStatusText("Location permission denied. Enable location access to fetch live weather.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const nextCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLiveCoordinates(nextCoordinates);

      const reverseGeocode = await Location.reverseGeocodeAsync(nextCoordinates);
      const detectedState = reverseGeocode.length > 0 ? detectStateFromAddress(reverseGeocode[0]) : null;
      if (detectedState) {
        setLocation(detectedState);
        setLocationStatusText(`Live location detected: ${detectedState}`);
      } else {
        setLocationStatusText("Live location detected. State could not be matched automatically.");
      }
    } catch {
      setLocationStatusText("Could not detect your live location. Try again in a few moments.");
    } finally {
      setIsDetectingLocation(false);
    }
  }, [setLocation]);

  const forecastData = weatherQuery.data ?? regionalFallbackForecast;
  let highestRainDay: ForecastDay | null = null;
  for (const day of forecastData) {
    if (!highestRainDay || day.rain > highestRainDay.rain) {
      highestRainDay = day;
    }
  }

  let tipMessage = "Forecast data is unavailable. Use your live location to view local weather.";
  if (highestRainDay) {
    tipMessage =
      highestRainDay.rain >= 50
        ? `${highestRainDay.day} has high rain chances (${highestRainDay.rain}%). Postpone irrigation and keep harvested produce covered.`
        : "No heavy rain expected soon. Continue regular irrigation and monitor soil moisture in the evening.";
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <CloudSun size={28} color={Colors.primary} />
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <Text style={styles.headerSubtitle}>
            {weatherQuery.isSuccess
              ? "Live weather updates every 15 minutes for your location."
              : "Fetch live weather for your farm and plan field activities."}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Use live location to fetch weather"
        style={styles.locationButton}
        onPress={handleUseLiveLocation}
        disabled={isDetectingLocation}
      >
        <LocateFixed size={16} color={Colors.surface} />
        <Text style={styles.locationButtonText}>
          {isDetectingLocation ? "Detecting live location..." : "Use Live Location"}
        </Text>
        {isDetectingLocation && <ActivityIndicator size="small" color={Colors.surface} />}
      </TouchableOpacity>

      {locationStatusText && <Text style={styles.locationStatusText}>{locationStatusText}</Text>}

      {weatherQuery.isLoading && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Loading live forecast...</Text>
        </View>
      )}

      {weatherQuery.isError && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            Unable to fetch live weather data. Check your internet connection; fallback forecast is shown.
          </Text>
        </View>
      )}

      {forecastData.map((item) => (
        <View key={item.day} style={styles.card}>
          <View style={styles.dayRow}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.temp}>{item.temp}</Text>
          </View>
          <Text style={styles.condition}>{item.condition}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <CloudDrizzle size={16} color={Colors.info} />
              <Text style={styles.metaText}>Rain: {item.rain}%</Text>
            </View>
            <View style={styles.metaItem}>
              <Wind size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{item.wind}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.tipCard}>
        <View style={styles.tipTitleRow}>
          <Sun size={18} color={Colors.accent} />
          <Text style={styles.tipTitle}>Field Tip</Text>
        </View>
        <Text style={styles.tipText}>{tipMessage}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  headerSubtitle: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  locationButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  locationButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "700" as const,
  },
  locationStatusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  day: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  temp: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  condition: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  tipCard: {
    backgroundColor: Colors.warningBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    gap: 6,
  },
  statusCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  tipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
