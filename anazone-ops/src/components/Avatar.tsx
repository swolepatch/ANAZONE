import { Image, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}

export function Avatar({ name, avatarUrl, size = 40 }: AvatarProps) {
  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      className="items-center justify-center border border-border"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface }}
    >
      <Text className="font-heading text-ink" style={{ fontSize: size * 0.42 }}>
        {initial}
      </Text>
    </View>
  );
}
