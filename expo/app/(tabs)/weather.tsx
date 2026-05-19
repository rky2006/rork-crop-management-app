import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CloudDrizzle, CloudSun, Sun, Wind } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useUser } from "@/contexts/UserContext";
import { INDIAN_STATES } from "@/mocks/cropSuggestions";
import { REGION_WEATHER_FORECAST, WEATHER_FORECAST } from "@/mocks/weatherForecast";

export default function WeatherScreen() {
  const { location } = useUser();
  const selectedState = INDIAN_STATES.find((state) => state.label === location) ?? null;
  const forecastData = selectedState ? (REGION_WEATHER_FORECAST[selectedState.region] ?? WEATHER_FORECAST) : WEATHER_FORECAST;
  const highestRainDay = forecastData.length > 0
    ? forecastData.reduce((max, day) => (day.rain > max.rain ? day : max), forecastData[0])
    : null;
  const tipMessage =
    highestRainDay && highestRainDay.rain >= 50
      ? `${highestRainDay.day} has high rain chances (${highestRainDay.rain}%). Postpone irrigation and keep harvested produce covered.`
      : `No heavy rain expected soon. Continue regular irrigation and monitor soil moisture in the evening.`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <CloudSun size={28} color={Colors.primary} />
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <Text style={styles.headerSubtitle}>Plan watering and field activities with upcoming conditions.</Text>
        </View>
      </View>

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
        <Text style={styles.tipText}>
          {tipMessage}
        </Text>
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
