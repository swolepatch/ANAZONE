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
import { EQUIPMENT_CATEGORIES, type EquipmentCategory } from '@/data/types';
import { useEquipmentStore } from '@/store/equipmentStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils/currency';
import { generateId } from '@/utils/id';

export default function EquipmentScreen() {
  const items = useEquipmentStore((s) => s.items);
  const addItem = useEquipmentStore((s) => s.addItem);
  const removeItem = useEquipmentStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState<EquipmentCategory>('Cardio');
  const [item, setItem] = useState('');
  const [vendor, setVendor] = useState('');
  const [price, setPrice] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);
  const priceValue = parseFloat(price);
  const canSubmit = item.trim().length > 0 && vendor.trim().length > 0 && !Number.isNaN(priceValue) && priceValue > 0;

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }

  function closeForm() {
    setFormOpen(false);
    setCategory('Cardio');
    setItem('');
    setVendor('');
    setPrice('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), category, item: item.trim(), vendor: vendor.trim(), price: priceValue });
    closeForm();
    showToast('Equipment added');
  }

  function handleRemove(id: string) {
    removeItem(id);
    showToast('Equipment deleted');
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Equipment" />
        <View className="px-5 gap-3">
          {items.length === 0 && (
            <EmptyState
              label="No equipment logged yet."
              icon="barbell-outline"
              ctaLabel="Add Equipment"
              onPressCta={() => setFormOpen(true)}
            />
          )}
          {items.map((row) => (
            <SwipeableRow key={row.id} onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this equipment entry?">
              <Card>
                <View className="flex-row items-center justify-between mb-3">
                  <CategoryTag category={row.category} />
                  <DeleteButton onConfirm={() => handleRemove(row.id)} confirmMessage="Delete this equipment entry?" />
                </View>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-heading text-ink text-base mb-1">{row.item}</Text>
                    <Text className="font-body text-muted text-sm">{row.vendor}</Text>
                  </View>
                  <Text className="font-mono-semibold text-ink text-sm">{formatCurrency(row.price)}</Text>
                </View>
              </Card>
            </SwipeableRow>
          ))}
        </View>
      </ScrollView>

      <TotalFooter label="Total Equipment Cost" amount={total} />
      <Fab onPress={() => setFormOpen(true)} bottomOffset={92} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Equipment">
        <FormField label="Item" value={item} onChangeText={setItem} placeholder="e.g. Power Rack (x4)" autoFocus />
        <FormField label="Vendor" value={vendor} onChangeText={setVendor} placeholder="e.g. Rogue Fitness" />
        <FormField
          label="Price (CAD)"
          value={price}
          onChangeText={setPrice}
          placeholder="0"
          keyboardType="decimal-pad"
        />
        <CategoryPicker options={EQUIPMENT_CATEGORIES} value={category} onChange={setCategory} />
        <PrimaryButton label="Add Equipment" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
