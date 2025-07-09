import { Platform } from "react-native";
import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SettingsProps } from "./store";

const ASYNC_KEY = process.env.EXPO_PUBLIC_ASYNC_KEY;

export async function setupTrackPlayer(): Promise<boolean> {
  let isSetup = false;

  try {
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch (error) {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [Capability.Play, Capability.Pause],
      notificationCapabilities: [Capability.Play, Capability.Pause],
    });
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function verifyNotifications(): Promise<boolean> {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const { granted } = await Notifications.getPermissionsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  if (granted) {
    return granted;
  }

  const { granted: newGranted, ios } =
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: true,
      },
    });

  return (
    newGranted ||
    ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleNotifications(): Promise<boolean> {
  const weekdays = [2, 3, 4, 5, 6] as const;

  try {
    await Promise.all(
      weekdays.map((weekday) =>
        Notifications.scheduleNotificationAsync({
          identifier: `program${weekday}`,
          content: {
            title: "A hora do anjo",
            body: "O programa começará em 5 minutos.",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: 17,
            minute: 55,
          },
        })
      )
    );
    return true;
  } catch (error) {
    console.log(
      `Algo deu errado e não foi possível registrar notificações: ${error}`
    );
    return false;
  }
}

export async function checkActiveNotifications() {
  const settings = await Notifications.getAllScheduledNotificationsAsync();
  if (settings.length < 4) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await scheduleNotifications();
  }
}

export async function setupStartSettings(): Promise<SettingsProps> {
  try {
    const response = await AsyncStorage.getItem(ASYNC_KEY as string);
    const settings: SettingsProps = response ? JSON.parse(response) : {};

    if (Object.keys(settings).length !== 0 && settings.notification === true) {
      await checkActiveNotifications();
    }

    return settings;
  } catch (error) {
    console.log(error);
    return {} as SettingsProps;
  }
}
