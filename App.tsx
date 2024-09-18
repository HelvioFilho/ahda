import "@/styles/global.css";

import { useCallback, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";

import { Routes } from "@/routes";

import { setupStartSettings, setupTrackPlayer } from "@/services/setup";

import { colors } from "@/styles/colors";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { appDataStore } from "@/services/store";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const { setStartSettings } = appDataStore();

  useEffect(() => {
    async function startPlayer() {
      await setupTrackPlayer();
      const startSetup = await setupStartSettings();
      setStartSettings(startSetup);
    }

    startPlayer();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1" onLayout={onLayoutRootView}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        {fontsLoaded && <Routes />}
      </SafeAreaView>
    </QueryClientProvider>
  );
}
