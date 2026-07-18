import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';

interface GradientPillProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export function GradientPill({ children, style, borderRadius = 999 }: GradientPillProps) {
  return (
    <LinearGradient
      colors={[colors.cyan, colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius }, style]}
    >
      {children}
    </LinearGradient>
  );
}
