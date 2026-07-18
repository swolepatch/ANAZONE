import { Text, View } from 'react-native';

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16">
      <Text className="font-body text-muted text-sm">{label}</Text>
    </View>
  );
}
