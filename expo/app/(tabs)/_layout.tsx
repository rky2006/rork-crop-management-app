import { Tabs } from "expo-router";
import { House, CloudSun, ClipboardList, User } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

const TAB_BAR_HEIGHT = 70;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          height: TAB_BAR_HEIGHT,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => <CloudSun size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      {/* Hidden from Tab Bar but accessible via Dashboard */}
      <Tabs.Screen name="crops" options={{ href: null }} />
      <Tabs.Screen name="disease" options={{ href: null }} />
      <Tabs.Screen name="suggestions" options={{ href: null }} />
    </Tabs>
  );
}
