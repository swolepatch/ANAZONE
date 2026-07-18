import { useEffect, useRef } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';
import { colors } from '@/theme/colors';

interface SkeletonBlockProps {
  height?: number;
  width?: DimensionValue;
  borderRadius?: number;
  style?: object;
}

export function SkeletonBlock({ height = 16, width = '100%', borderRadius = 6, style }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[{ height, width, borderRadius, backgroundColor: colors.surface, opacity }, style]} />;
}

export function CardSkeleton() {
  return (
    <View className="bg-surface border border-border rounded-xl p-4">
      <SkeletonBlock height={12} width={80} style={{ marginBottom: 12 }} />
      <SkeletonBlock height={18} width="70%" style={{ marginBottom: 8 }} />
      <SkeletonBlock height={12} width="40%" />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}
