import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { AnimatedCheckbox } from '@/components/AnimatedCheckbox';
import { BottomSheet } from '@/components/BottomSheet';
import { Card } from '@/components/Card';
import { CategoryPicker } from '@/components/CategoryPicker';
import { DeleteButton } from '@/components/DeleteButton';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CHECKLIST_TYPES, type DailyChecklistType } from '@/data/types';
import { hapticLight } from '@/lib/haptics';
import { pressableScaleStyle } from '@/lib/pressableStyle';
import { useDailyTaskCompletionStore } from '@/store/dailyTaskCompletionStore';
import { useDailyTaskTemplateStore } from '@/store/dailyTaskTemplateStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

const SECTION_LABEL: Record<DailyChecklistType, string> = {
  opening: 'Opening',
  closing: 'Closing',
};

export default function ChecklistsScreen() {
  const templates = useDailyTaskTemplateStore((s) => s.items);
  const addTemplate = useDailyTaskTemplateStore((s) => s.addItem);
  const removeTemplate = useDailyTaskTemplateStore((s) => s.removeItem);

  const completions = useDailyTaskCompletionStore((s) => s.items);
  const addCompletion = useDailyTaskCompletionStore((s) => s.addItem);
  const updateCompletion = useDailyTaskCompletionStore((s) => s.updateItem);

  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState('');
  const [checklistType, setChecklistType] = useState<DailyChecklistType>('opening');
  const [refreshing, setRefreshing] = useState(false);

  const today = todayIso();

  const sections = useMemo(() => {
    return CHECKLIST_TYPES.map((type) => ({
      type,
      tasks: templates.filter((t) => t.checklistType === type).sort((a, b) => a.order - b.order),
    }));
  }, [templates]);

  function isDoneToday(taskId: string): boolean {
    const completion = completions.find((c) => c.taskId === taskId && c.date === today);
    return completion?.done ?? false;
  }

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

  function toggleTask(taskId: string) {
    hapticLight();
    const existing = completions.find((c) => c.taskId === taskId && c.date === today);
    if (existing) {
      updateCompletion(existing.id, { done: !existing.done });
    } else {
      addCompletion({ id: generateId(), taskId, date: today, done: true });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setText('');
    setChecklistType('opening');
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const order = templates.filter((t) => t.checklistType === checklistType).length + 1;
    addTemplate({ id: generateId(), checklistType, text: trimmed, order });
    closeForm();
    showToast('Task added');
  }

  function handleRemove(id: string) {
    removeTemplate(id);
    showToast('Task removed');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Checklists" />
        <View className="px-5 gap-5">
          {sections.map((section) => (
            <View key={section.type}>
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {SECTION_LABEL[section.type]} · {section.tasks.filter((t) => isDoneToday(t.id)).length}/
                {section.tasks.length}
              </Text>
              {section.tasks.length === 0 ? (
                <EmptyState
                  label={`No ${SECTION_LABEL[section.type].toLowerCase()} tasks yet.`}
                  icon="clipboard-outline"
                  ctaLabel="Add Task"
                  onPressCta={() => {
                    setChecklistType(section.type);
                    setFormOpen(true);
                  }}
                />
              ) : (
                <Card className="p-0 overflow-hidden">
                  {section.tasks.map((task, idx) => {
                    const done = isDoneToday(task.id);
                    return (
                      <View
                        key={task.id}
                        className="flex-row items-center px-4"
                        style={{
                          minHeight: 56,
                          borderTopWidth: idx === 0 ? 0 : 1,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Pressable
                          onPress={() => toggleTask(task.id)}
                          style={pressableScaleStyle()}
                          className="flex-row items-center flex-1 py-3"
                          hitSlop={4}
                        >
                          <AnimatedCheckbox done={done} />
                          <Text
                            className="font-body text-ink text-[15px] ml-3 flex-1"
                            style={done ? { color: colors.muted, textDecorationLine: 'line-through' } : undefined}
                          >
                            {task.text}
                          </Text>
                        </Pressable>
                        <DeleteButton
                          onConfirm={() => handleRemove(task.id)}
                          confirmMessage="Remove this checklist task?"
                        />
                      </View>
                    );
                  })}
                </Card>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Checklist Task">
        <FormField label="Task" value={text} onChangeText={setText} placeholder="e.g. Restock towels" autoFocus />
        <CategoryPicker options={CHECKLIST_TYPES} value={checklistType} onChange={setChecklistType} label="Section" />
        <PrimaryButton label="Add Task" onPress={submit} disabled={!text.trim()} />
      </BottomSheet>
    </View>
  );
}
