import { seedShifts } from '@/data/seed';
import type { Shift } from '@/data/types';
import { createListStore } from './createListStore';

export const useShiftStore = createListStore<Shift>('anazone-ops.shifts', seedShifts);
