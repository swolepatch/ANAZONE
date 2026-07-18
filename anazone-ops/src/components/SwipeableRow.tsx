import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { confirmDelete } from '@/lib/confirmDelete';
import { colors } from '@/theme/colors';

interface SwipeableRowProps extends PropsWithChildren {
  onConfirm: () => void;
  confirmMessage?: string;
}

// Swipe-to-delete, additive to the existing trash-icon button on each row —
// both paths go through the same confirm dialog.
export function SwipeableRow({ children, onConfirm, confirmMessage }: SwipeableRowProps) {
  function renderRightActions() {
    return (
      <View className="justify-center items-center" style={{ width: 76 }}>
        <Pressable
          onPress={() => confirmDelete(onConfirm, confirmMessage)}
          className="items-center justify-center rounded-xl active:opacity-80"
          style={{ backgroundColor: colors.pink, width: 56, height: '86%' }}
        >
          <Ionicons name="trash" size={20} color={colors.bg} />
        </Pressable>
      </View>
    );
  }

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false} rightThreshold={40} friction={2}>
      {children}
    </Swipeable>
  );
}
