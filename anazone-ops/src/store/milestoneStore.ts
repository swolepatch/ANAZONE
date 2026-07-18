import { seedMilestones } from '@/data/seed';
import type { Milestone } from '@/data/types';
import { createListStore } from './createListStore';

export const useMilestoneStore = createListStore<Milestone>('anazone-ops.milestones', seedMilestones);
