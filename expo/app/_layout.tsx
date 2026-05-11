import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CropProvider } from "@/contexts/CropContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";
import LanguageMenu from "@/components/LanguageMenu";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function HeaderLanguageMenu() {
  return <LanguageMenu />;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'login';
    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, segments, router]);

  return <>{children}</>;
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
        name="login"
        options={{ headerShown: false }}
      />
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
        name="edit-crop"
        options={{
          presentation: "modal",
          title: t('stack.editCrop'),
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
        <UserProvider>
          <LanguageProvider>
            <CropProvider>
              <AuthGuard>
                <RootLayoutNav />
              </AuthGuard>
            </CropProvider>
          </LanguageProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
