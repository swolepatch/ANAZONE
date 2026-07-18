import { seedIncidents } from '@/data/seed';
import type { IncidentReport } from '@/data/types';
import { createListStore } from './createListStore';

export const useIncidentStore = createListStore<IncidentReport>('anazone-ops.incidents', seedIncidents);
