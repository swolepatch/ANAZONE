import { useMemo, useState } from 'react';
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
import { SwipeableRow } from '@/components/SwipeableRow';
import { MILESTONE_CATEGORIES, type MilestoneCategory } from '@/data/types';
import { useMilestoneStore } from '@/store/milestoneStore';
import { showToast } from '@/store/toastStore';
import { categoryColor, colors } from '@/theme/colors';
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
  const [refreshing, setRefreshing] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => a.date.localeCompare(b.date)), [items]);
  const canSubmit = DATE_PATTERN.test(date) && title.trim().length > 0;

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

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
    showToast('Milestone added');
  }

  function handleRemove(id: string) {
    removeItem(id);
    showToast('Milestone deleted');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Calendar" />
        <View className="px-5 gap-3">
          {sorted.length === 0 && (
            <EmptyState
              label="No milestones yet."
              icon="calendar-outline"
              ctaLabel="Add Milestone"
              onPressCta={() => setFormOpen(true)}
            />
          )}
          {sorted.map((row) => (
            <SwipeableRow key={row.id} onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this milestone?">
              <Card style={{ borderLeftWidth: 3, borderLeftColor: categoryColor(row.category) }}>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {formatDateLong(row.date)}
                  </Text>
                  <DeleteButton onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this milestone?" />
                </View>
                <Text className="font-heading text-ink text-base mb-2">{row.title}</Text>
                <CategoryTag category={row.category} />
              </Card>
            </SwipeableRow>
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
