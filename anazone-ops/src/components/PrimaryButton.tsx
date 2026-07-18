import { Pressable, Text } from 'react-native';
import { GradientPill } from './GradientPill';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} className="active:opacity-80" style={{ opacity: disabled ? 0.4 : 1 }}>
      <GradientPill borderRadius={12} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="font-heading text-bg text-sm uppercase tracking-widest">{label}</Text>
      </GradientPill>
    </Pressable>
  );
}
