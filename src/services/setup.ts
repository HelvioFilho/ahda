import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function VerifyNotifications() {
  const settings = await Notifications.getPermissionsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function SetupNotifications(): Promise<boolean> {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });

  return true;
}

export async function ScheduleNotifications(): Promise<boolean> {
  const days = [2, 3, 4, 5, 6];
  return await Promise.all(
    days.map(async (day) => {
      await Notifications.scheduleNotificationAsync({
        identifier: `program${day}`,
        content: {
          title: "A hora do anjo",
          body: "O programa começará em 5 minutos.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 17,
          minute: 55,
          weekday: day,
          repeats: true,
        },
      });
    })
  )
    .then(() => true)
    .catch((error) => {
      console.log(`Algo deu errado e não foi possível registrar: ${error}`);
      return false;
    });
}

export async function CheckActiveNotifications() {
  const settings = await Notifications.getAllScheduledNotificationsAsync();
  if (settings.length < 4) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await ScheduleNotifications();
  }
}
