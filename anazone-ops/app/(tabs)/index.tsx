import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CategoryTag } from '@/components/CategoryTag';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useBudgetStore } from '@/store/budgetStore';
import { useChecklistStore } from '@/store/checklistStore';
import { useEquipmentStore } from '@/store/equipmentStore';
import { useIncidentStore } from '@/store/incidentStore';
import { useMilestoneStore } from '@/store/milestoneStore';
import { useShiftStore } from '@/store/shiftStore';
import { formatCurrency } from '@/utils/currency';
import { daysUntil, formatDateLong, todayIso } from '@/utils/date';

function countdownLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return '1 day overdue';
  return `${Math.abs(days)} days overdue`;
}

export default function HomeScreen() {
  const checklistItems = useChecklistStore((s) => s.items);
  const equipmentItems = useEquipmentStore((s) => s.items);
  const budgetItems = useBudgetStore((s) => s.items);
  const milestoneItems = useMilestoneStore((s) => s.items);
  const shiftItems = useShiftStore((s) => s.items);
  const incidentItems = useIncidentStore((s) => s.items);

  const completion = useMemo(() => {
    if (checklistItems.length === 0) return { done: 0, total: 0, pct: 0 };
    const done = checklistItems.filter((i) => i.done).length;
    return { done, total: checklistItems.length, pct: done / checklistItems.length };
  }, [checklistItems]);

  const nextMilestone = useMemo(() => {
    const upcoming = milestoneItems
      .filter((m) => daysUntil(m.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] ?? null;
  }, [milestoneItems]);

  const totalEquipmentCost = useMemo(
    () => equipmentItems.reduce((sum, i) => sum + i.price, 0),
    [equipmentItems]
  );
  const totalBudget = useMemo(() => budgetItems.reduce((sum, i) => sum + i.amount, 0), [budgetItems]);

  const todaysShiftCount = useMemo(() => {
    const today = todayIso();
    return shiftItems.filter((s) => s.date === today).length;
  }, [shiftItems]);

  const openIncidentCount = useMemo(
    () => incidentItems.filter((i) => !i.resolved).length,
    [incidentItems]
  );

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ScreenHeader title="Dashboard" />
        <View className="px-5 gap-4">
          <Card>
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
              Startup Checklist
            </Text>
            <View className="flex-row items-end justify-between mb-3">
              <Text className="font-heading text-ink text-4xl">{Math.round(completion.pct * 100)}%</Text>
              <Text className="font-body text-muted text-sm mb-1">
                {completion.done}/{completion.total} tasks
              </Text>
            </View>
            <ProgressBar progress={completion.pct} />
          </Card>

          <Card>
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
              Next Milestone
            </Text>
            {nextMilestone ? (
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <CategoryTag category={nextMilestone.category} />
                  <Text className="font-mono text-cyan text-xs uppercase tracking-widest">
                    {countdownLabel(daysUntil(nextMilestone.date))}
                  </Text>
                </View>
                <Text className="font-heading text-ink text-lg mb-1">{nextMilestone.title}</Text>
                <Text className="font-body text-muted text-sm">{formatDateLong(nextMilestone.date)}</Text>
              </View>
            ) : (
              <EmptyState label="No upcoming milestones" />
            )}
          </Card>

          <View className="flex-row gap-4">
            <Card className="flex-1">
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                Today's Shifts
              </Text>
              <Text className="font-heading text-ink text-2xl">{todaysShiftCount}</Text>
            </Card>
            <Card className="flex-1">
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                Open Incidents
              </Text>
              <Text className="font-heading text-ink text-2xl">{openIncidentCount}</Text>
            </Card>
          </View>

          <View className="flex-row gap-4">
            <Card className="flex-1">
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                Equipment Cost
              </Text>
              <Text className="font-heading text-ink text-2xl">{formatCurrency(totalEquipmentCost)}</Text>
            </Card>
            <Card className="flex-1">
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                Total Budget
              </Text>
              <Text className="font-heading text-ink text-2xl">{formatCurrency(totalBudget)}</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
