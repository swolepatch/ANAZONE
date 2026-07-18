import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { Card } from '@/components/Card';
import { CategoryTag } from '@/components/CategoryTag';
import { DeleteButton } from '@/components/DeleteButton';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SwipeableRow } from '@/components/SwipeableRow';
import type { MaintenanceStatus } from '@/data/types';
import { hapticLight } from '@/lib/haptics';
import { pressableScaleStyle } from '@/lib/pressableStyle';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

const STATUS_ORDER: MaintenanceStatus[] = ['open', 'in-progress', 'resolved'];

export default function MaintenanceScreen() {
  const items = useMaintenanceStore((s) => s.items);
  const addItem = useMaintenanceStore((s) => s.addItem);
  const updateItem = useMaintenanceStore((s) => s.updateItem);
  const removeItem = useMaintenanceStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [issue, setIssue] = useState('');
  const [notes, setNotes] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.dateReported.localeCompare(a.dateReported)),
    [items]
  );
  const canSubmit = equipmentName.trim().length > 0 && issue.trim().length > 0;

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

  function closeForm() {
    setFormOpen(false);
    setEquipmentName('');
    setIssue('');
    setNotes('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({
      id: generateId(),
      equipmentName: equipmentName.trim(),
      issue: issue.trim(),
      dateReported: todayIso(),
      dateServiced: null,
      status: 'open',
      notes: notes.trim(),
    });
    closeForm();
    showToast('Maintenance entry added');
  }

  function handleRemove(id: string) {
    removeItem(id);
    showToast('Maintenance entry deleted');
  }

  function advanceStatus(id: string, status: MaintenanceStatus) {
    hapticLight();
    const idx = STATUS_ORDER.indexOf(status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    updateItem(id, { status: next, dateServiced: next === 'resolved' ? todayIso() : null });
    if (next === 'resolved') showToast('Marked resolved');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Maintenance Log" />
        <View className="px-5 gap-3">
          {sorted.length === 0 && (
            <EmptyState
              label="No maintenance entries yet."
              icon="hammer-outline"
              ctaLabel="Add Entry"
              onPressCta={() => setFormOpen(true)}
            />
          )}
          {sorted.map((row) => (
            <SwipeableRow key={row.id} onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this maintenance entry?">
              <Card>
                <View className="flex-row items-center justify-between mb-3">
                  <CategoryTag category={row.status} />
                  <DeleteButton onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this maintenance entry?" />
                </View>
                <Pressable onPress={() => advanceStatus(row.id, row.status)} style={pressableScaleStyle()}>
                  <Text className="font-heading text-ink text-base mb-1">{row.equipmentName}</Text>
                  <Text className="font-body text-muted text-sm mb-2">{row.issue}</Text>
                  {row.notes.length > 0 && (
                    <Text className="font-body text-muted text-xs mb-2">{row.notes}</Text>
                  )}
                  <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Reported {formatDateLong(row.dateReported)}
                    {row.dateServiced ? ` · Serviced ${formatDateLong(row.dateServiced)}` : ''}
                  </Text>
                </Pressable>
              </Card>
            </SwipeableRow>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Maintenance Entry">
        <FormField
          label="Equipment"
          value={equipmentName}
          onChangeText={setEquipmentName}
          placeholder="e.g. RowErg #3"
          autoFocus
        />
        <FormField label="Issue" value={issue} onChangeText={setIssue} placeholder="What's wrong?" />
        <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="e.g. Parts on order" />
        <PrimaryButton label="Add Entry" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
