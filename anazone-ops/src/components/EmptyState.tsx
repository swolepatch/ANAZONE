import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  label: string;
  icon?: IoniconName;
  ctaLabel?: string;
  onPressCta?: () => void;
}

export function EmptyState({ label, icon = 'file-tray-outline', ctaLabel, onPressCta }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16">
      <View
        className="items-center justify-center rounded-full mb-4"
        style={{ width: 56, height: 56, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
      >
        <Ionicons name={icon} size={24} color={colors.muted} />
      </View>
      <Text className="font-body text-muted text-sm text-center px-8">{label}</Text>
      {ctaLabel && onPressCta && (
        <Pressable
          onPress={onPressCta}
          className="mt-4 rounded-full px-4 py-2 border active:opacity-70"
          style={{ borderColor: colors.cyan }}
        >
          <Text className="font-mono text-[11px] uppercase tracking-widest" style={{ color: colors.cyan }}>
            {ctaLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
