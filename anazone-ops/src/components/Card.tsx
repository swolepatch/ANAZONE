import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <View
      className={`bg-surface border border-border rounded-xl p-4 ${className ?? ''}`}
      style={style}
    >
      {children}
    </View>
  );
}
