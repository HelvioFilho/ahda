import "@/styles/global.css";

import { SafeAreaView, StatusBar } from "react-native";

import { Routes } from "@/routes";

import { colors } from "@/styles/colors";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <Routes />
    </SafeAreaView>
  );
}
