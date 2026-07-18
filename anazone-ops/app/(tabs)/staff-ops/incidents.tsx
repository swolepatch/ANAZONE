import { useEffect, useMemo, useState } from 'react';
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
import { INCIDENT_SEVERITIES, type IncidentSeverity } from '@/data/types';
import { useAuthStore } from '@/store/authStore';
import { useIncidentStore } from '@/store/incidentStore';
import { useStaffStore } from '@/store/staffStore';
import { categoryColor, colors } from '@/theme/colors';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

export default function IncidentsScreen() {
  const items = useIncidentStore((s) => s.items);
  const addItem = useIncidentStore((s) => s.addItem);
  const updateItem = useIncidentStore((s) => s.updateItem);
  const removeItem = useIncidentStore((s) => s.removeItem);

  const profile = useAuthStore((s) => s.profile);
  const staffById = useStaffStore((s) => s.staffById);
  const fetchStaff = useStaffStore((s) => s.fetchStaff);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('low');

  const sorted = useMemo(() => [...items].sort((a, b) => b.date.localeCompare(a.date)), [items]);
  const canSubmit = title.trim().length > 0 && description.trim().length > 0 && location.trim().length > 0;

  function closeForm() {
    setFormOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
    setSeverity('low');
  }

  function submit() {
    if (!canSubmit || !profile) return;
    addItem({
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      severity,
      reportedById: profile.id,
      date: todayIso(),
      resolved: false,
    });
    closeForm();
  }

  function reporterName(reportedById: string): string {
    if (reportedById === profile?.id) return 'You';
    return staffById(reportedById)?.name ?? 'Unknown';
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Incidents" />
        <View className="px-5 gap-3">
          {sorted.length === 0 && <EmptyState label="No incident reports yet." />}
          {sorted.map((row) => (
            <Card key={row.id} style={{ borderLeftWidth: 3, borderLeftColor: categoryColor(row.severity) }}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <CategoryTag category={row.severity} />
                  <Text
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: row.resolved ? colors.muted : categoryColor(row.severity) }}
                  >
                    {row.resolved ? 'Resolved' : 'Unresolved'}
                  </Text>
                </View>
                <DeleteButton onConfirm={() => removeItem(row.id)} confirmMessage="Delete this incident report?" />
              </View>
              <Pressable onPress={() => updateItem(row.id, { resolved: !row.resolved })}>
                <Text
                  className="font-heading text-base mb-1"
                  style={{ color: row.resolved ? colors.muted : colors.ink }}
                >
                  {row.title}
                </Text>
                <Text className="font-body text-muted text-sm mb-2">{row.description}</Text>
                <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {row.location} · {reporterName(row.reportedById)} · {formatDateLong(row.date)}
                </Text>
              </Pressable>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Incident Report">
        <FormField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Torn cable" autoFocus />
        <FormField label="Description" value={description} onChangeText={setDescription} placeholder="What happened?" />
        <FormField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Strength Floor" />
        <CategoryPicker options={INCIDENT_SEVERITIES} value={severity} onChange={setSeverity} label="Severity" />
        <PrimaryButton label="Add Report" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
