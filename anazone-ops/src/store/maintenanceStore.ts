import { seedMaintenance } from '@/data/seed';
import type { MaintenanceEntry } from '@/data/types';
import { createListStore } from './createListStore';

export const useMaintenanceStore = createListStore<MaintenanceEntry>('anazone-ops.maintenance', seedMaintenance);
