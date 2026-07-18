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
import { TotalFooter } from '@/components/TotalFooter';
import { BUDGET_CATEGORIES, type BudgetCategory } from '@/data/types';
import { useBudgetStore } from '@/store/budgetStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/currency';
import { generateId } from '@/utils/id';

export default function BudgetScreen() {
  const items = useBudgetStore((s) => s.items);
  const addItem = useBudgetStore((s) => s.addItem);
  const removeItem = useBudgetStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState<BudgetCategory>('Buildout');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);
  const amountValue = parseFloat(amount);
  const canSubmit = label.trim().length > 0 && !Number.isNaN(amountValue) && amountValue > 0;

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

  function closeForm() {
    setFormOpen(false);
    setCategory('Buildout');
    setLabel('');
    setAmount('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), category, label: label.trim(), amount: amountValue });
    closeForm();
    showToast('Budget line added');
  }

  function handleRemove(id: string) {
    removeItem(id);
    showToast('Budget line deleted');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Budget" />
        <View className="px-5 gap-3">
          {items.length === 0 && (
            <EmptyState
              label="No budget lines yet."
              icon="wallet-outline"
              ctaLabel="Add Budget Line"
              onPressCta={() => setFormOpen(true)}
            />
          )}
          {items.map((row) => (
            <SwipeableRow key={row.id} onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this budget line?">
              <Card>
                <View className="flex-row items-center justify-between mb-3">
                  <CategoryTag category={row.category} />
                  <DeleteButton onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this budget line?" />
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="font-heading text-ink text-base flex-1 pr-3">{row.label}</Text>
                  <Text className="font-mono-semibold text-ink text-sm">{formatCurrency(row.amount)}</Text>
                </View>
              </Card>
            </SwipeableRow>
          ))}
        </View>
      </ScrollView>

      <TotalFooter label="Total Startup Budget" amount={total} />
      <Fab onPress={() => setFormOpen(true)} bottomOffset={92} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Budget Line">
        <FormField label="Label" value={label} onChangeText={setLabel} placeholder="e.g. HVAC upgrade" autoFocus />
        <FormField
          label="Amount (CAD)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="decimal-pad"
        />
        <CategoryPicker options={BUDGET_CATEGORIES} value={category} onChange={setCategory} />
        <PrimaryButton label="Add Budget Line" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
