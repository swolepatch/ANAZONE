import { useBudgetStore } from './budgetStore';
import { useChecklistStore } from './checklistStore';
import { useCleaningStore } from './cleaningStore';
import { useDailyTaskCompletionStore } from './dailyTaskCompletionStore';
import { useDailyTaskTemplateStore } from './dailyTaskTemplateStore';
import { useEquipmentStore } from './equipmentStore';
import { useIncidentStore } from './incidentStore';
import { useMaintenanceStore } from './maintenanceStore';
import { useMilestoneStore } from './milestoneStore';

export function useAppHydrated(): boolean {
  const checklist = useChecklistStore((s) => s.hasHydrated);
  const equipment = useEquipmentStore((s) => s.hasHydrated);
  const budget = useBudgetStore((s) => s.hasHydrated);
  const milestones = useMilestoneStore((s) => s.hasHydrated);
  const dailyTaskTemplates = useDailyTaskTemplateStore((s) => s.hasHydrated);
  const dailyTaskCompletions = useDailyTaskCompletionStore((s) => s.hasHydrated);
  const incidents = useIncidentStore((s) => s.hasHydrated);
  const maintenance = useMaintenanceStore((s) => s.hasHydrated);
  const cleaning = useCleaningStore((s) => s.hasHydrated);
  return (
    checklist &&
    equipment &&
    budget &&
    milestones &&
    dailyTaskTemplates &&
    dailyTaskCompletions &&
    incidents &&
    maintenance &&
    cleaning
  );
}
