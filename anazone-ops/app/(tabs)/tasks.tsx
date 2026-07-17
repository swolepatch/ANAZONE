import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Card } from '@/components/Card';
import { DeleteButton } from '@/components/DeleteButton';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useChecklistStore } from '@/store/checklistStore';
import { CHECKLIST_CATEGORIES, type ChecklistCategory } from '@/data/types';
import { colors } from '@/theme/colors';
import { generateId } from '@/utils/id';

export default function TasksScreen() {
  const items = useChecklistStore((s) => s.items);
  const addItem = useChecklistStore((s) => s.addItem);
  const removeItem = useChecklistStore((s) => s.removeItem);
  const toggleItem = useChecklistStore((s) => s.toggleItem);

  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<ChecklistCategory>('Branding');

  const grouped = useMemo(() => {
    return CHECKLIST_CATEGORIES.map((cat) => ({
      category: cat,
      items: items.filter((i) => i.category === cat),
    })).filter((group) => group.items.length > 0);
  }, [items]);

  function closeForm() {
    setFormOpen(false);
    setText('');
    setCategory('Branding');
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addItem({ id: generateId(), category, text: trimmed, done: false });
    closeForm();
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Tasks" />
        <View className="px-5 gap-5">
          {grouped.length === 0 && <EmptyState label="No tasks yet. Add one to get started." />}
          {grouped.map((group) => (
            <View key={group.category}>
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {group.category} · {group.items.filter((i) => i.done).length}/{group.items.length}
              </Text>
              <Card className="p-0 overflow-hidden">
                {group.items.map((item, idx) => (
                  <View
                    key={item.id}
                    className="flex-row items-center px-4"
                    style={{
                      minHeight: 56,
                      borderTopWidth: idx === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                    }}
                  >
                    <Pressable
                      onPress={() => toggleItem(item.id)}
                      className="flex-row items-center flex-1 py-3"
                      hitSlop={4}
                    >
                      <Ionicons
                        name={item.done ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={item.done ? colors.cyan : colors.muted}
                      />
                      <Text
                        className="font-body text-ink text-[15px] ml-3 flex-1"
                        style={item.done ? { color: colors.muted, textDecorationLine: 'line-through' } : undefined}
                      >
                        {item.text}
                      </Text>
                    </Pressable>
                    <DeleteButton onConfirm={() => removeItem(item.id)} confirmMessage="Delete this task?" />
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Task">
        <FormField label="Task" value={text} onChangeText={setText} placeholder="e.g. Order signage" autoFocus />
        <CategoryPicker options={CHECKLIST_CATEGORIES} value={category} onChange={setCategory} />
        <PrimaryButton label="Add Task" onPress={submit} disabled={!text.trim()} />
      </BottomSheet>
    </View>
  );
}
