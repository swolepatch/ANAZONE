import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  title: string;
}

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <Pressable className="absolute inset-0 bg-black/60" onPress={onClose} />
        <View
          className="bg-surface rounded-t-2xl border-t border-x border-border px-5 pt-5"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <View className="w-10 h-1 rounded-full bg-white/15 self-center mb-4" />
          <Text className="font-heading text-ink text-lg uppercase tracking-wide mb-5">{title}</Text>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
