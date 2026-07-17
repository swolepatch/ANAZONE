import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { secureJsonStorage } from '@/data/secureStorage';
import { seedChecklist } from '@/data/seed';
import type { ChecklistItem } from '@/data/types';

interface ChecklistState {
  items: ChecklistItem[];
  hasHydrated: boolean;
  addItem: (item: ChecklistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      items: seedChecklist(),
      hasHydrated: false,
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        })),
    }),
    {
      name: 'anazone-ops.checklist',
      storage: createJSONStorage(() => secureJsonStorage),
      partialize: (state) => ({ items: state.items }) as ChecklistState,
    }
  )
);

useChecklistStore.persist.onFinishHydration(() => useChecklistStore.setState({ hasHydrated: true }));
if (useChecklistStore.persist.hasHydrated()) {
  useChecklistStore.setState({ hasHydrated: true });
}
