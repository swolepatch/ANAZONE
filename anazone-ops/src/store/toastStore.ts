import { create } from 'zustand';

interface ToastState {
  message: string | null;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>(() => ({
  message: null,
}));

export function showToast(message: string): void {
  if (timeoutId) clearTimeout(timeoutId);
  useToastStore.setState({ message });
  timeoutId = setTimeout(() => useToastStore.setState({ message: null }), 2200);
}
