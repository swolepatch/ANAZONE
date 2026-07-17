import { seedDailyTaskTemplates } from '@/data/seed';
import type { DailyTaskTemplate } from '@/data/types';
import { createListStore } from './createListStore';

export const useDailyTaskTemplateStore = createListStore<DailyTaskTemplate>(
  'anazone-ops.daily-task-templates',
  seedDailyTaskTemplates
);
