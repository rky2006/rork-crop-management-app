import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CloudDrizzle, CloudSun, Sun, Wind } from "lucide-react-native";
import Colors from "@/constants/colors";

const FORECAST = [
  { day: "Today", condition: "Partly Cloudy", temp: "31° / 24°", rain: "20%", wind: "11 km/h" },
  { day: "Tomorrow", condition: "Light Rain", temp: "29° / 23°", rain: "60%", wind: "16 km/h" },
  { day: "Sunday", condition: "Sunny", temp: "33° / 25°", rain: "5%", wind: "9 km/h" },
  { day: "Monday", condition: "Cloudy", temp: "30° / 24°", rain: "30%", wind: "12 km/h" },
];

export default function WeatherScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <CloudSun size={28} color={Colors.primary} />
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <Text style={styles.headerSubtitle}>Plan watering and field activities with upcoming conditions.</Text>
        </View>
      </View>

      {FORECAST.map((item) => (
        <View key={item.day} style={styles.card}>
          <View style={styles.dayRow}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={styles.temp}>{item.temp}</Text>
          </View>
          <Text style={styles.condition}>{item.condition}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <CloudDrizzle size={16} color={Colors.info} />
              <Text style={styles.metaText}>Rain: {item.rain}</Text>
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
          Rain chances are higher tomorrow. Consider postponing irrigation and keep harvested produce covered.
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
