import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency } from '@/utils/currency';

interface TotalFooterProps {
  label: string;
  amount: number;
}

export function TotalFooter({ label, amount }: TotalFooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between px-5 pt-3 bg-surface border-t border-border"
      style={{ paddingBottom: insets.bottom + 12 }}
    >
      <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</Text>
      <Text className="font-heading text-ink text-xl">{formatCurrency(amount)}</Text>
    </View>
  );
}
