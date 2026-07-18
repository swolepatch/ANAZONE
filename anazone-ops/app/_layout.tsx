import '../global.css';

import { IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toast } from '@/components/Toast';
import { addNotificationTapListener, registerForPushNotifications } from '@/lib/notifications';
import { useAuthStore } from '@/store/authStore';
import { useAppHydrated } from '@/store/useAppHydrated';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });
  const dataHydrated = useAppHydrated();
  const authInitializing = useAuthStore((s) => s.initializing);
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const ready = fontsLoaded && dataHydrated && !authInitializing;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  useEffect(() => {
    if (profile) {
      registerForPushNotifications(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    const subscription = addNotificationTapListener((data) => {
      if (data.type === 'message') {
        router.push(`/staff-ops/messages/${data.conversationId}`);
      } else if (data.type === 'incident') {
        router.push('/staff-ops/incidents');
      } else if (data.type === 'announcement') {
        router.push('/staff-ops/feed');
      }
    });
    return () => subscription.remove();
  }, [router]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }}>
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={!session}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
