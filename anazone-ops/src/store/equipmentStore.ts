import { seedEquipment } from '@/data/seed';
import type { EquipmentItem } from '@/data/types';
import { createListStore } from './createListStore';

export const useEquipmentStore = createListStore<EquipmentItem>('anazone-ops.equipment', seedEquipment);
