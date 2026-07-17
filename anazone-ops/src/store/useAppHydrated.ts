import { useBudgetStore } from './budgetStore';
import { useChecklistStore } from './checklistStore';
import { useEquipmentStore } from './equipmentStore';
import { useMilestoneStore } from './milestoneStore';

export function useAppHydrated(): boolean {
  const checklist = useChecklistStore((s) => s.hasHydrated);
  const equipment = useEquipmentStore((s) => s.hasHydrated);
  const budget = useBudgetStore((s) => s.hasHydrated);
  const milestones = useMilestoneStore((s) => s.hasHydrated);
  return checklist && equipment && budget && milestones;
}
