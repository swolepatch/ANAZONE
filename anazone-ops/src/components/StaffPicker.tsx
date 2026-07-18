import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import type { StaffProfile } from '@/store/authStore';
import { colors } from '@/theme/colors';

interface StaffPickerProps {
  label?: string;
  staff: StaffProfile[];
  value: string | null;
  onChange: (staffId: string) => void;
}

export function StaffPicker({ label = 'Staff', staff, value, onChange }: StaffPickerProps) {
  return (
    <View className="mb-4">
      <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">{label}</Text>
      <View style={{ maxHeight: 200 }}>
        <ScrollView>
          {staff.map((person) => {
            const selected = person.id === value;
            return (
              <Pressable key={person.id} onPress={() => onChange(person.id)} className="flex-row items-center py-2">
                <Avatar name={person.name} avatarUrl={person.avatar_url} size={32} />
                <Text className="font-body text-ink text-[15px] ml-3 flex-1">{person.name}</Text>
                {selected && <Ionicons name="checkmark-circle" size={20} color={colors.cyan} />}
              </Pressable>
            );
          })}
          {staff.length === 0 && <Text className="font-body text-muted text-sm py-2">No staff yet.</Text>}
        </ScrollView>
      </View>
    </View>
  );
}
