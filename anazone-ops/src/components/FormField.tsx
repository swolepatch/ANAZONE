import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { colors } from '@/theme/colors';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
}

export function FormField({ label, value, onChangeText, placeholder, keyboardType, autoFocus }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        className="bg-bg border border-border rounded-lg px-3 h-11 text-ink font-body text-[15px]"
      />
    </View>
  );
}
