import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@/store/toastStore';
import { colors } from '@/theme/colors';

export function Toast() {
  const message = useToastStore((s) => s.message);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [message, opacity, translateY]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: insets.bottom + 76,
        opacity,
        transform: [{ translateY }],
        zIndex: 999,
      }}
    >
      <View
        className="border border-border rounded-xl py-3 px-4 items-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="font-body-medium text-ink text-sm">{message}</Text>
      </View>
    </Animated.View>
  );
}
