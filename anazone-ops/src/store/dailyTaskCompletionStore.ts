import { seedDailyTaskCompletions } from '@/data/seed';
import type { DailyTaskCompletion } from '@/data/types';
import { createListStore } from './createListStore';

export const useDailyTaskCompletionStore = createListStore<DailyTaskCompletion>(
  'anazone-ops.daily-task-completions',
  seedDailyTaskCompletions
);
