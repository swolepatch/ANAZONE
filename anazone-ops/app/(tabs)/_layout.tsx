import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { GradientPill } from '@/components/GradientPill';
import { hapticLight } from '@/lib/haptics';
import { colors } from '@/theme/colors';

type IoniconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  if (focused) {
    return (
      <GradientPill borderRadius={10} style={{ width: 36, height: 28, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={name} size={17} color={colors.bg} />
      </GradientPill>
    );
  }
  return (
    <View style={{ width: 36, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={17} color={colors.muted} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenListeners={{
        tabPress: () => hapticLight(),
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexMono_500Medium',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pre-launch"
        options={{
          title: 'Pre-Launch',
          tabBarIcon: ({ focused }) => <TabIcon name="rocket-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="staff-ops"
        options={{
          title: 'Staff Ops',
          tabBarIcon: ({ focused }) => <TabIcon name="people-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="facility"
        options={{
          title: 'Facility',
          tabBarIcon: ({ focused }) => <TabIcon name="construct-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings-outline" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
