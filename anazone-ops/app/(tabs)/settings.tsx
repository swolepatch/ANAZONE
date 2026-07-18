import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { CategoryTag } from '@/components/CategoryTag';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const PREF_ROWS: Array<{ key: 'messages' | 'incidents' | 'announcements'; label: string }> = [
  { key: 'messages', label: 'Messages' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'announcements', label: 'Announcements' },
];

export default function SettingsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const updateNotificationPrefs = useAuthStore((s) => s.updateNotificationPrefs);
  const signOut = useAuthStore((s) => s.signOut);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  function startEditing() {
    setName(profile!.name);
    setAvatarUrl(profile!.avatar_url ?? '');
    setError(null);
    setEditing(true);
  }

  async function saveProfile() {
    if (name.trim().length === 0) return;
    setSaving(true);
    const { error: saveError } = await updateProfile({
      name: name.trim(),
      avatar_url: avatarUrl.trim().length > 0 ? avatarUrl.trim() : null,
    });
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    setEditing(false);
  }

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <ScreenHeader title="Settings" />
        <View className="px-5 gap-4">
          <Card>
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">Profile</Text>
            {editing ? (
              <View>
                <FormField label="Name" value={name} onChangeText={setName} placeholder="Your name" autoFocus />
                <FormField label="Avatar URL" value={avatarUrl} onChangeText={setAvatarUrl} placeholder="https://…" />
                {error && <Text className="font-body text-pink text-sm mb-4">{error}</Text>}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <PrimaryButton
                      label={saving ? 'Saving…' : 'Save'}
                      onPress={saveProfile}
                      disabled={saving || name.trim().length === 0}
                    />
                  </View>
                </View>
                <Text
                  className="font-mono text-[10px] uppercase tracking-widest text-muted text-center mt-4"
                  onPress={() => setEditing(false)}
                >
                  Cancel
                </Text>
              </View>
            ) : (
              <View>
                <View className="flex-row items-center mb-4">
                  <Avatar name={profile.name} avatarUrl={profile.avatar_url} size={56} />
                  <View className="ml-3 flex-1">
                    <Text className="font-heading text-ink text-lg mb-1">{profile.name}</Text>
                    <CategoryTag category={profile.role} />
                  </View>
                </View>
                <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Email</Text>
                <Text className="font-body text-ink text-[15px] mb-4">{profile.email}</Text>
                <Text
                  className="font-mono text-[10px] uppercase tracking-widest text-cyan"
                  onPress={startEditing}
                  style={{ color: colors.cyan }}
                >
                  Edit Profile
                </Text>
              </View>
            )}
          </Card>

          <Card>
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
              Notification Preferences
            </Text>
            {PREF_ROWS.map((row, idx) => (
              <View
                key={row.key}
                className="flex-row items-center justify-between py-3"
                style={{ borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: colors.border }}
              >
                <Text className="font-body text-ink text-[15px]">{row.label}</Text>
                <Switch
                  value={profile.notification_prefs[row.key]}
                  onValueChange={(value) => {
                    updateNotificationPrefs({ [row.key]: value });
                  }}
                  trackColor={{ false: colors.border, true: colors.cyan }}
                  thumbColor={colors.ink}
                />
              </View>
            ))}
          </Card>

          <Card>
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">App Info</Text>
            <Text className="font-body text-ink text-[15px] mb-1">Anazone Ops v{appVersion}</Text>
            <Text className="font-body text-muted text-sm">Anazone Strength Labs — Internal Ops.</Text>
          </Card>

          <Pressable
            onPress={signOut}
            className="items-center justify-center h-12 rounded-lg border border-border active:opacity-70 mt-2"
          >
            <Text className="font-heading text-pink text-sm uppercase tracking-widest" style={{ color: colors.pink }}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
