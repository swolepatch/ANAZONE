import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { GradientPill } from '@/components/GradientPill';
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
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => <TabIcon name="checkbox-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: 'Equipment',
          tabBarIcon: ({ focused }) => <TabIcon name="barbell-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ focused }) => <TabIcon name="wallet-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar-outline" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
