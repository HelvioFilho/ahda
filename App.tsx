import "@/styles/global.css";

import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";

import { Routes } from "@/routes";

import {
  CheckActiveNotifications,
  SetupNotifications,
  SetupStartSettings,
  SetupTrackPlayer,
} from "@/services/setup";
import { appDataStore } from "@/services/store";

import { colors } from "@/styles/colors";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [player, setPlayer] = useState(false);
  const [notification, setNotification] = useState(false);
  const { setBible, setStartSettings } = appDataStore();

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  async function getSetup() {
    const isSettings = await SetupStartSettings();
    const isPlayer = await SetupTrackPlayer();
    const isNotification = await SetupNotifications();
    if (isSettings) {
      if (isSettings.settings.notification) {
        await CheckActiveNotifications();
      }
    }

    setBible(isSettings.bible);
    setStartSettings(isSettings.settings);
    setPlayer(isPlayer);
    setNotification(isNotification);

    SplashScreen.hideAsync();
  }

  useEffect(() => {
    if (!player && !notification) {
      getSetup();
    }
  }, [notification]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1">
        <StatusBar
          backgroundColor={colors.background}
          barStyle="dark-content"
        />
        <Routes />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
