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
import { MILESTONE_CATEGORIES, type MilestoneCategory } from '@/data/types';
import { useMilestoneStore } from '@/store/milestoneStore';
import { categoryColor } from '@/theme/colors';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function CalendarScreen() {
  const items = useMilestoneStore((s) => s.items);
  const addItem = useMilestoneStore((s) => s.addItem);
  const removeItem = useMilestoneStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<MilestoneCategory>('Branding');
  const [title, setTitle] = useState('');

  const sorted = useMemo(() => [...items].sort((a, b) => a.date.localeCompare(b.date)), [items]);
  const canSubmit = DATE_PATTERN.test(date) && title.trim().length > 0;

  function closeForm() {
    setFormOpen(false);
    setDate('');
    setCategory('Branding');
    setTitle('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), date, category, title: title.trim() });
    closeForm();
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Calendar" />
        <View className="px-5 gap-3">
          {sorted.length === 0 && <EmptyState label="No milestones yet." />}
          {sorted.map((row) => (
            <Card
              key={row.id}
              style={{ borderLeftWidth: 3, borderLeftColor: categoryColor(row.category) }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {formatDateLong(row.date)}
                </Text>
                <DeleteButton onConfirm={() => removeItem(row.id)} confirmMessage="Delete this milestone?" />
              </View>
              <Text className="font-heading text-ink text-base mb-2">{row.title}</Text>
              <CategoryTag category={row.category} />
            </Card>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Milestone">
        <FormField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Grand opening event" autoFocus />
        <FormField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder={todayIso()} />
        <CategoryPicker options={MILESTONE_CATEGORIES} value={category} onChange={setCategory} />
        <PrimaryButton label="Add Milestone" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
