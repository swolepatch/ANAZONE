import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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
import { CLEANING_FREQUENCIES, type CleaningFrequency } from '@/data/types';
import { useCleaningStore } from '@/store/cleaningStore';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

export default function CleaningScreen() {
  const items = useCleaningStore((s) => s.items);
  const addItem = useCleaningStore((s) => s.addItem);
  const updateItem = useCleaningStore((s) => s.updateItem);
  const removeItem = useCleaningStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [area, setArea] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [frequency, setFrequency] = useState<CleaningFrequency>('daily');

  const sections = useMemo(() => {
    return CLEANING_FREQUENCIES.map((freq) => ({
      frequency: freq,
      tasks: items.filter((i) => i.frequency === freq).sort((a, b) => a.area.localeCompare(b.area)),
    }));
  }, [items]);

  const canSubmit = area.trim().length > 0 && assignedTo.trim().length > 0;

  function closeForm() {
    setFormOpen(false);
    setArea('');
    setAssignedTo('');
    setFrequency('daily');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), area: area.trim(), frequency, assignedTo: assignedTo.trim(), lastCompleted: null });
    closeForm();
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Cleaning Schedule" />
        <View className="px-5 gap-5">
          {items.length === 0 && <EmptyState label="No cleaning areas yet." />}
          {sections.map(
            (section) =>
              section.tasks.length > 0 && (
                <View key={section.frequency}>
                  <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                    {section.frequency}
                  </Text>
                  <View className="gap-3">
                    {section.tasks.map((row) => (
                      <Card key={row.id}>
                        <View className="flex-row items-center justify-between mb-3">
                          <CategoryTag category={row.frequency} />
                          <DeleteButton
                            onConfirm={() => removeItem(row.id)}
                            confirmMessage="Delete this cleaning task?"
                          />
                        </View>
                        <Pressable onPress={() => updateItem(row.id, { lastCompleted: todayIso() })}>
                          <Text className="font-heading text-ink text-base mb-1">{row.area}</Text>
                          <Text className="font-body text-muted text-sm mb-2">{row.assignedTo}</Text>
                          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                            {row.lastCompleted ? `Last done ${formatDateLong(row.lastCompleted)}` : 'Never completed'}
                          </Text>
                        </Pressable>
                      </Card>
                    ))}
                  </View>
                </View>
              )
          )}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Cleaning Task">
        <FormField label="Area" value={area} onChangeText={setArea} placeholder="e.g. Front Entrance Glass" autoFocus />
        <FormField label="Assigned To" value={assignedTo} onChangeText={setAssignedTo} placeholder="e.g. Priya Chandra" />
        <CategoryPicker options={CLEANING_FREQUENCIES} value={frequency} onChange={setFrequency} label="Frequency" />
        <PrimaryButton label="Add Task" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
