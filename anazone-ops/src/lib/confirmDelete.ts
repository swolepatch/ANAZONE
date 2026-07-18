import { Alert } from 'react-native';
import { hapticLight } from '@/lib/haptics';

export function confirmDelete(onConfirm: () => void, confirmMessage = 'Delete this item?'): void {
  Alert.alert('Delete', confirmMessage, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: () => {
        hapticLight();
        onConfirm();
      },
    },
  ]);
}
