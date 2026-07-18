import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { HubCard } from '@/components/HubCard';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function FacilityHub() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ScreenHeader title="Facility" />
        <View className="px-5 gap-3">
          <HubCard
            icon="hammer-outline"
            title="Maintenance Log"
            subtitle="Equipment issues & repair status"
            onPress={() => router.push('/facility/maintenance')}
          />
          <HubCard
            icon="sparkles-outline"
            title="Cleaning Schedule"
            subtitle="Daily & weekly area rotations"
            onPress={() => router.push('/facility/cleaning')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
