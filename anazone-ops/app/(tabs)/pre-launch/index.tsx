import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { HubCard } from '@/components/HubCard';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function PreLaunchHub() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ScreenHeader title="Pre-Launch" />
        <View className="px-5 gap-3">
          <HubCard
            icon="checkbox-outline"
            title="Tasks"
            subtitle="Startup checklist by category"
            onPress={() => router.push('/pre-launch/tasks')}
          />
          <HubCard
            icon="barbell-outline"
            title="Equipment"
            subtitle="Vendor orders & running cost"
            onPress={() => router.push('/pre-launch/equipment')}
          />
          <HubCard
            icon="wallet-outline"
            title="Budget"
            subtitle="Startup budget line items"
            onPress={() => router.push('/pre-launch/budget')}
          />
          <HubCard
            icon="calendar-outline"
            title="Calendar"
            subtitle="Project milestones"
            onPress={() => router.push('/pre-launch/calendar')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
