import type { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

export function pressableScaleStyle(baseStyle?: StyleProp<ViewStyle>) {
  return ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    baseStyle,
    pressed ? { opacity: 0.85, transform: [{ scale: 0.97 }] } : null,
  ];
}
