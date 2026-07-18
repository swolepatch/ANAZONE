import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
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
import { SkeletonList } from '@/components/Skeleton';
import { StaffPicker } from '@/components/StaffPicker';
import { STAFF_ROLES, type Shift, type StaffRole } from '@/data/types';
import { addShift, fetchShifts, removeShift } from '@/lib/shifts';
import { useStaffStore } from '@/store/staffStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { formatDateLong, todayIso } from '@/utils/date';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export default function ShiftsScreen() {
  const staff = useStaffStore((s) => s.staff);
  const fetchStaff = useStaffStore((s) => s.fetchStaff);
  const staffById = useStaffStore((s) => s.staffById);

  const [items, setItems] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [role, setRole] = useState<StaffRole>('Coach');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const today = todayIso();

  const load = useCallback(async () => {
    setItems(await fetchShifts());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function onRefresh() {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }

  const grouped = useMemo(() => {
    const byDate = new Map<string, Shift[]>();
    for (const item of items) {
      const arr = byDate.get(item.date) ?? [];
      arr.push(item);
      byDate.set(item.date, arr);
    }
    return [...byDate.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([groupDate, shifts]) => ({
        date: groupDate,
        shifts: [...shifts].sort((a, b) => a.start_time.localeCompare(b.start_time)),
      }));
  }, [items]);

  const canSubmit = !!staffId && DATE_PATTERN.test(date) && TIME_PATTERN.test(startTime) && TIME_PATTERN.test(endTime);

  function closeForm() {
    setFormOpen(false);
    setStaffId(null);
    setRole('Coach');
    setDate('');
    setStartTime('');
    setEndTime('');
  }

  async function submit() {
    if (!canSubmit || !staffId) return;
    const { error } = await addShift({ staffId, role, date, startTime, endTime });
    if (!error) {
      closeForm();
      load();
      showToast('Shift added');
    }
  }

  async function handleRemove(id: string) {
    await removeShift(id);
    load();
    showToast('Shift deleted');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Shift Schedule" />
        <View className="px-5 gap-5">
          {loading ? (
            <SkeletonList />
          ) : (
            <>
              {grouped.length === 0 && (
                <EmptyState
                  label="No shifts scheduled yet."
                  icon="time-outline"
                  ctaLabel="Add Shift"
                  onPressCta={() => setFormOpen(true)}
                />
              )}
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
                          <DeleteButton onConfirm={() => handleRemove(shift.id)} confirmMessage="Delete this shift?" />
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="font-heading text-ink text-base">
                            {staffById(shift.staff_id)?.name ?? 'Unknown'}
                          </Text>
                          <Text className="font-mono text-muted text-xs uppercase tracking-widest">
                            {shift.start_time}–{shift.end_time}
                          </Text>
                        </View>
                      </Card>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Shift">
        <StaffPicker staff={staff} value={staffId} onChange={setStaffId} label="Staff" />
        <FormField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder={today} />
        <FormField label="Start Time (HH:MM)" value={startTime} onChangeText={setStartTime} placeholder="09:00" />
        <FormField label="End Time (HH:MM)" value={endTime} onChangeText={setEndTime} placeholder="17:00" />
        <CategoryPicker options={STAFF_ROLES} value={role} onChange={setRole} label="Role" />
        <PrimaryButton label="Add Shift" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
