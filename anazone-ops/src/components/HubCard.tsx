import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { Card } from './Card';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface HubCardProps {
  icon: IoniconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function HubCard({ icon, title, subtitle, onPress }: HubCardProps) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      <Card>
        <View className="flex-row items-center" style={{ minHeight: 44 }}>
          <View
            className="items-center justify-center rounded-lg mr-3"
            style={{ width: 44, height: 44, backgroundColor: 'rgba(47,232,220,0.1)' }}
          >
            <Ionicons name={icon} size={20} color={colors.cyan} />
          </View>
          <View className="flex-1">
            <Text className="font-heading text-ink text-base mb-0.5">{title}</Text>
            <Text className="font-body text-muted text-xs">{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </Card>
    </Pressable>
  );
}
