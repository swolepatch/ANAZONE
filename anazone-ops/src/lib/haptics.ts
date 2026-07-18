import * as Haptics from 'expo-haptics';

// expo-haptics no-ops safely where unsupported (web without navigator.vibrate,
// simulators, etc.) — safe to call unconditionally everywhere.
export function hapticLight(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticSuccess(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
