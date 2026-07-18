import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable } from 'react-native';
import { colors } from '@/theme/colors';

interface DeleteButtonProps {
  onConfirm: () => void;
  confirmMessage?: string;
}

export function DeleteButton({ onConfirm, confirmMessage = 'Delete this item?' }: DeleteButtonProps) {
  return (
    <Pressable
      hitSlop={10}
      onPress={() =>
        Alert.alert('Delete', confirmMessage, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onConfirm },
        ])
      }
      className="items-center justify-center w-11 h-11 rounded-lg active:bg-white/5"
    >
      <Ionicons name="trash-outline" size={18} color={colors.muted} />
    </Pressable>
  );
}
