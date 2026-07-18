import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors } from '@/theme/colors';

interface AnimatedCheckboxProps {
  done: boolean;
  size?: number;
}

export function AnimatedCheckbox({ done, size = 20 }: AnimatedCheckboxProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, [done, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={done ? 'checkbox' : 'square-outline'} size={size} color={done ? colors.cyan : colors.muted} />
    </Animated.View>
  );
}
