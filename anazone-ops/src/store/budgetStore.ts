import { seedBudget } from '@/data/seed';
import type { BudgetItem } from '@/data/types';
import { createListStore } from './createListStore';

export const useBudgetStore = createListStore<BudgetItem>('anazone-ops.budget', seedBudget);
