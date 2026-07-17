import { seedCleaningTasks } from '@/data/seed';
import type { CleaningTask } from '@/data/types';
import { createListStore } from './createListStore';

export const useCleaningStore = createListStore<CleaningTask>('anazone-ops.cleaning', seedCleaningTasks);
