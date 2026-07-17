import { View } from 'react-native';
import { GradientPill } from './GradientPill';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View className="h-2 rounded-full bg-bg overflow-hidden">
      {pct > 0 && <GradientPill borderRadius={999} style={{ width: `${pct * 100}%`, height: '100%' }} />}
    </View>
  );
}
