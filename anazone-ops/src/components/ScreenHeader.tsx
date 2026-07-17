import { Text, View } from 'react-native';
import { Logo } from './Logo';

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="px-5 pt-3 pb-4">
      <View className="flex-row items-center mb-2">
        <Logo size={18} />
        <Text className="font-heading text-ink text-[11px] uppercase tracking-[3px] ml-2">
          Anazone Ops
        </Text>
      </View>
      <Text className="font-heading text-ink text-2xl uppercase tracking-wide">{title}</Text>
    </View>
  );
}
