import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { HubCard } from '@/components/HubCard';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function StaffOpsHub() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ScreenHeader title="Staff Ops" />
        <View className="px-5 gap-3">
          <HubCard
            icon="time-outline"
            title="Shift Schedule"
            subtitle="Who's working, and when"
            onPress={() => router.push('/staff-ops/shifts')}
          />
          <HubCard
            icon="clipboard-outline"
            title="Checklists"
            subtitle="Opening & closing routines"
            onPress={() => router.push('/staff-ops/checklists')}
          />
          <HubCard
            icon="warning-outline"
            title="Incidents"
            subtitle="Reports & resolution status"
            onPress={() => router.push('/staff-ops/incidents')}
          />
          <HubCard
            icon="chatbubbles-outline"
            title="Team Feed"
            subtitle="Announcements & shift handoffs"
            onPress={() => router.push('/staff-ops/feed')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
