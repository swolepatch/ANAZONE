import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { secureJsonStorage } from '@/data/secureStorage';

interface WithId {
  id: string;
}

export interface ListState<T extends WithId> {
  items: T[];
  hasHydrated: boolean;
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<T>) => void;
}

// Screens only ever talk to the store hook returned here (items + actions).
// Swapping local persistence for a real backend later means changing what
// happens inside these actions, not how any screen reads or calls them.
export function createListStore<T extends WithId>(key: string, seed: () => T[]) {
  const useStore = create<ListState<T>>()(
    persist(
      (set) => ({
        items: seed(),
        hasHydrated: false,
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
        updateItem: (id, patch) =>
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
          })),
      }),
      {
        name: key,
        storage: createJSONStorage(() => secureJsonStorage),
        partialize: (state) => ({ items: state.items }) as ListState<T>,
      }
    )
  );

  useStore.persist.onFinishHydration(() => useStore.setState({ hasHydrated: true }));
  if (useStore.persist.hasHydrated()) {
    useStore.setState({ hasHydrated: true });
  }

  return useStore;
}
