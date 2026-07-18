import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Expo push tokens are only meaningful on a real iOS/Android device with an
// EAS-built dev client — web has no equivalent flow here, and simulators
// can't register at all, so both are silently skipped rather than erroring.
export async function registerForPushNotifications(staffId: string): Promise<void> {
  if (Platform.OS === 'web' || !Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.warn('[notifications] No EAS projectId configured (extra.eas.projectId); skipping push token registration.');
    return;
  }

  try {
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
    await supabase
      .from('push_tokens')
      .upsert(
        { staff_id: staffId, expo_push_token: expoPushToken, updated_at: new Date().toISOString() },
        { onConflict: 'staff_id,expo_push_token' }
      );
  } catch (err) {
    console.warn('[notifications] Failed to register push token:', err);
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export type NotificationDeepLinkData =
  | { type: 'message'; conversationId: string }
  | { type: 'incident' }
  | { type: 'announcement' };

export function addNotificationTapListener(onTap: (data: NotificationDeepLinkData) => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as NotificationDeepLinkData | undefined;
    if (data?.type) onTap(data);
  });
}
