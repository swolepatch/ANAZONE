import { Pressable, Text, View } from 'react-native';
import { categoryColor, colors } from '@/theme/colors';

interface CategoryPickerProps<T extends string> {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

export function CategoryPicker<T extends string>({
  label = 'Category',
  options,
  value,
  onChange,
}: CategoryPickerProps<T>) {
  return (
    <View className="mb-4">
      <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          const color = categoryColor(option);
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              className="rounded-full px-3 py-2 border"
              style={{
                borderColor: active ? color : colors.border,
                backgroundColor: active ? `${color}1F` : 'transparent',
              }}
            >
              <Text
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: active ? color : colors.muted }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
