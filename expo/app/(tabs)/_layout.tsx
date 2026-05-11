import { Tabs } from "expo-router";
import { LayoutDashboard, Wheat, ClipboardList, ScanLine } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";
import LanguageMenu from "@/components/LanguageMenu";
import { useLanguage } from "@/contexts/LanguageContext";

function HeaderLanguageMenu() {
  return <LanguageMenu />;
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        headerRight: HeaderLanguageMenu,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: t('tabs.crops'),
          tabBarIcon: ({ color, size }) => <Wheat size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: t('tabs.activities'),
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="disease"
        options={{
          title: t('tabs.disease'),
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
