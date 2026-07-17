import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { Card } from '@/components/Card';
import { CategoryPicker } from '@/components/CategoryPicker';
import { CategoryTag } from '@/components/CategoryTag';
import { DeleteButton } from '@/components/DeleteButton';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { STAFF_ROLES, type StaffRole } from '@/data/types';
import { useShiftStore } from '@/store/shiftStore';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export default function ShiftsScreen() {
  const items = useShiftStore((s) => s.items);
  const addItem = useShiftStore((s) => s.addItem);
  const removeItem = useShiftStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState<StaffRole>('Coach');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const today = todayIso();

  const grouped = useMemo(() => {
    const byDate = new Map<string, typeof items>();
    for (const item of items) {
      const arr = byDate.get(item.date) ?? [];
      arr.push(item);
      byDate.set(item.date, arr);
    }
    return [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([groupDate, shifts]) => ({
        date: groupDate,
        shifts: [...shifts].sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
  }, [items]);

  const canSubmit =
    staffName.trim().length > 0 &&
    DATE_PATTERN.test(date) &&
    TIME_PATTERN.test(startTime) &&
    TIME_PATTERN.test(endTime);

  function closeForm() {
    setFormOpen(false);
    setStaffName('');
    setRole('Coach');
    setDate('');
    setStartTime('');
    setEndTime('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), staffName: staffName.trim(), role, date, startTime, endTime });
    closeForm();
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Shift Schedule" />
        <View className="px-5 gap-5">
          {grouped.length === 0 && <EmptyState label="No shifts scheduled yet." />}
          {grouped.map((group) => (
            <View key={group.date}>
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {group.date === today ? 'Today · ' : ''}
                {formatDateLong(group.date)}
              </Text>
              <View className="gap-3">
                {group.shifts.map((shift) => (
                  <Card key={shift.id}>
                    <View className="flex-row items-center justify-between mb-3">
                      <CategoryTag category={shift.role} />
                      <DeleteButton onConfirm={() => removeItem(shift.id)} confirmMessage="Delete this shift?" />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="font-heading text-ink text-base">{shift.staffName}</Text>
                      <Text className="font-mono text-muted text-xs uppercase tracking-widest">
                        {shift.startTime}–{shift.endTime}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Shift">
        <FormField label="Staff Name" value={staffName} onChangeText={setStaffName} placeholder="e.g. Jess Tremblay" autoFocus />
        <FormField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder={today} />
        <FormField label="Start Time (HH:MM)" value={startTime} onChangeText={setStartTime} placeholder="09:00" />
        <FormField label="End Time (HH:MM)" value={endTime} onChangeText={setEndTime} placeholder="17:00" />
        <CategoryPicker options={STAFF_ROLES} value={role} onChange={setRole} label="Role" />
        <PrimaryButton label="Add Shift" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
