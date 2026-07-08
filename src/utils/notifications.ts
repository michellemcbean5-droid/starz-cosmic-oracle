import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyHoroscope(hour: number = 8): Promise<string> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: '✨ Your Daily Cosmic Guidance',
      body: 'Your stars have aligned. Check today's horoscope and cosmic insights.',
      sound: 'default',
    },
    trigger: { hour, minute: 0, repeats: true },
  });
}

export async function scheduleMoonEvent(title: string, body: string, date: Date): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: { date },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
