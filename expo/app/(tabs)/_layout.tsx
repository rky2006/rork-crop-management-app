import { Tabs } from "expo-router";
import { House, MessageSquareMore, Sprout } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

const TAB_BAR_HEIGHT = 74;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F68A1E",
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: "SmartFarm",
          tabBarIcon: ({ color, size }) => <Sprout size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: "KrishiExpert",
          tabBarIcon: ({ color, size }) => <MessageSquareMore size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="activities" options={{ href: null }} />
      <Tabs.Screen name="disease" options={{ href: null }} />
      <Tabs.Screen name="weather" options={{ href: null }} />
    </Tabs>
  );
}
