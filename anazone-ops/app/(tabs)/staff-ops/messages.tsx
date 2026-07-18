import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { BottomSheet } from '@/components/BottomSheet';
import { Card } from '@/components/Card';
import { CategoryPicker } from '@/components/CategoryPicker';
import { EmptyState } from '@/components/EmptyState';
import { Fab } from '@/components/Fab';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SkeletonList } from '@/components/Skeleton';
import type { ConversationSummary } from '@/data/types';
import { createDm, createGroup, fetchConversations } from '@/lib/messaging';
import { pressableScaleStyle } from '@/lib/pressableStyle';
import { useAuthStore } from '@/store/authStore';
import { useStaffStore } from '@/store/staffStore';
import { showToast } from '@/store/toastStore';
import { colors } from '@/theme/colors';
import { formatTimestampShort } from '@/utils/date';

const CONVERSATION_MODES = ['dm', 'group'] as const;
type ConversationMode = (typeof CONVERSATION_MODES)[number];

export default function MessagesScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const staff = useStaffStore((s) => s.staff);
  const fetchStaff = useStaffStore((s) => s.fetchStaff);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<ConversationMode>('dm');
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    const data = await fetchConversations(profile.id);
    setConversations(data);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function onRefresh() {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }

  function closeForm() {
    setFormOpen(false);
    setMode('dm');
    setGroupName('');
    setSelectedIds([]);
    setError(null);
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function startDm(otherStaffId: string) {
    if (!profile) return;
    setSubmitting(true);
    const { id, error: createError } = await createDm(profile.id, otherStaffId);
    setSubmitting(false);
    if (createError || !id) {
      setError(createError ?? 'Could not start conversation');
      return;
    }
    closeForm();
    router.push(`/staff-ops/messages/${id}`);
  }

  async function submitGroup() {
    if (!profile || groupName.trim().length === 0 || selectedIds.length === 0) return;
    setSubmitting(true);
    const { id, error: createError } = await createGroup(profile.id, groupName.trim(), selectedIds);
    setSubmitting(false);
    if (createError || !id) {
      setError(createError ?? 'Could not create group');
      return;
    }
    closeForm();
    showToast('Group created');
    router.push(`/staff-ops/messages/${id}`);
  }

  const otherStaff = staff.filter((s) => s.id !== profile?.id);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cyan} />}
      >
        <ScreenHeader title="Messages" />
        <View className="px-5 gap-3">
          {loading ? (
            <SkeletonList />
          ) : (
            <>
              {conversations.length === 0 && (
                <EmptyState
                  label="No conversations yet. Start one with the + button."
                  icon="chatbox-ellipses-outline"
                />
              )}
              {conversations.map((row) => {
                const title = row.type === 'group' ? (row.name ?? 'Team Chat') : (row.otherParticipant?.name ?? 'Unknown');
                const avatarName = row.type === 'group' ? title : (row.otherParticipant?.name ?? '?');
                const previewSender =
                  row.lastMessage?.sender_id === profile?.id
                    ? 'You: '
                    : row.type === 'group' && row.lastMessage
                      ? ''
                      : '';
                return (
                  <Pressable
                    key={row.id}
                    onPress={() => router.push(`/staff-ops/messages/${row.id}`)}
                    style={pressableScaleStyle()}
                  >
                    <Card>
                      <View className="flex-row items-center">
                        <Avatar name={avatarName} avatarUrl={row.type === 'dm' ? row.otherParticipant?.avatar_url : null} />
                        <View className="flex-1 ml-3">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="font-heading text-ink text-base" numberOfLines={1}>
                              {title}
                            </Text>
                            {row.lastMessage && (
                              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                                {formatTimestampShort(row.lastMessage.created_at)}
                              </Text>
                            )}
                          </View>
                          <View className="flex-row items-center justify-between">
                            <Text className="font-body text-muted text-sm flex-1 mr-2" numberOfLines={1}>
                              {row.lastMessage ? `${previewSender}${row.lastMessage.text}` : 'No messages yet'}
                            </Text>
                            {row.unread && (
                              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.cyan }} />
                            )}
                          </View>
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Conversation">
        <CategoryPicker options={CONVERSATION_MODES} value={mode} onChange={setMode} label="Type" />

        {mode === 'group' && (
          <FormField label="Group Name" value={groupName} onChangeText={setGroupName} placeholder="e.g. Front Desk Team" />
        )}

        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
          {mode === 'dm' ? 'Message' : 'Participants'}
        </Text>
        <View className="gap-2 mb-4" style={{ maxHeight: 260 }}>
          <ScrollView>
            {otherStaff.map((person) => {
              const selected = selectedIds.includes(person.id);
              return (
                <Pressable
                  key={person.id}
                  onPress={() => (mode === 'dm' ? startDm(person.id) : toggleSelected(person.id))}
                  className="flex-row items-center py-2"
                >
                  <Avatar name={person.name} avatarUrl={person.avatar_url} size={32} />
                  <Text className="font-body text-ink text-[15px] ml-3 flex-1">{person.name}</Text>
                  {mode === 'group' && (
                    <View
                      className="w-5 h-5 rounded items-center justify-center border"
                      style={{ borderColor: selected ? colors.cyan : colors.border }}
                    >
                      {selected && <View className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.cyan }} />}
                    </View>
                  )}
                </Pressable>
              );
            })}
            {otherStaff.length === 0 && <Text className="font-body text-muted text-sm py-2">No other staff yet.</Text>}
          </ScrollView>
        </View>

        {error && <Text className="font-body text-pink text-sm mb-4">{error}</Text>}

        {mode === 'group' && (
          <PrimaryButton
            label={submitting ? 'Creating…' : 'Create Group'}
            onPress={submitGroup}
            disabled={submitting || groupName.trim().length === 0 || selectedIds.length === 0}
          />
        )}
      </BottomSheet>
    </View>
  );
}
