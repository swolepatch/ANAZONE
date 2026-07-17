import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { GradientPill } from './GradientPill';

interface FabProps {
  onPress: () => void;
  bottomOffset?: number;
}

export function Fab({ onPress, bottomOffset = 24 }: FabProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="absolute right-5 active:opacity-80"
      style={{
        bottom: bottomOffset,
        shadowColor: '#2FE8DC',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <GradientPill style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="add" size={28} color="#0A0A0D" />
      </GradientPill>
    </Pressable>
  );
}
