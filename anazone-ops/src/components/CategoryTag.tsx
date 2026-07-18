import { Text, View } from 'react-native';
import { categoryColor } from '@/theme/colors';

interface CategoryTagProps {
  category: string;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const color = categoryColor(category);
  return (
    <View
      className="flex-row items-center self-start rounded-full px-2 py-1"
      style={{ backgroundColor: `${color}1F` }}
    >
      <View className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />
      <Text
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color, letterSpacing: 1.2 }}
      >
        {category}
      </Text>
    </View>
  );
}
