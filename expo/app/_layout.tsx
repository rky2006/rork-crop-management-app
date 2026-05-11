import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CropProvider } from "@/contexts/CropContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Colors from "@/constants/colors";
import LanguageMenu from "@/components/LanguageMenu";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function HeaderLanguageMenu() {
  return <LanguageMenu />;
}

function RootLayoutNav() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerBackTitle: t('stack.back'),
        contentStyle: { backgroundColor: Colors.background },
        headerRight: HeaderLanguageMenu,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-crop"
        options={{
          presentation: "modal",
          title: t('stack.addCrop'),
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="crop-detail"
        options={{
          title: t('stack.cropDetail'),
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="add-activity"
        options={{
          presentation: "modal",
          title: t('stack.addActivity'),
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="soil-report"
        options={{
          presentation: "modal",
          title: t('stack.soilReport'),
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="disease-diagnosis"
        options={{
          title: t('stack.diseaseDiagnosis'),
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <LanguageProvider>
          <CropProvider>
            <RootLayoutNav />
          </CropProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
