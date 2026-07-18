import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
import { FEED_POST_TYPES, type FeedPost, type FeedPostType } from '@/data/types';
import { addFeedPost, fetchFeedPosts, removeFeedPost } from '@/lib/feed';
import { triggerNotification } from '@/lib/pushTrigger';
import { useAuthStore } from '@/store/authStore';
import { useStaffStore } from '@/store/staffStore';
import { formatTimestampShort } from '@/utils/date';

export default function FeedScreen() {
  const profile = useAuthStore((s) => s.profile);
  const staffById = useStaffStore((s) => s.staffById);
  const fetchStaff = useStaffStore((s) => s.fetchStaff);

  const [items, setItems] = useState<FeedPost[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState<FeedPostType>('announcement');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setItems(await fetchFeedPosts());
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const canSubmit = message.trim().length > 0 && !submitting;

  function closeForm() {
    setFormOpen(false);
    setType('announcement');
    setMessage('');
  }

  async function submit() {
    if (!canSubmit || !profile) return;
    setSubmitting(true);
    const trimmed = message.trim();
    const { post, error } = await addFeedPost({ type, authorId: profile.id, message: trimmed });
    setSubmitting(false);
    if (error) return;
    closeForm();
    load();
    if (post && type === 'announcement') {
      triggerNotification({ type: 'announcement', title: 'Team Announcement', body: trimmed, excludeStaffId: profile.id });
    }
  }

  function authorName(authorId: string): string {
    if (authorId === profile?.id) return 'You';
    return staffById(authorId)?.name ?? 'Unknown';
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Team Feed" />
        <View className="px-5 gap-3">
          {items.length === 0 && <EmptyState label="No posts yet." />}
          {items.map((row) => (
            <Card key={row.id}>
              <View className="flex-row items-center justify-between mb-3">
                <CategoryTag category={row.type} />
                <DeleteButton onConfirm={() => removeFeedPost(row.id).then(load)} confirmMessage="Delete this post?" />
              </View>
              <Text className="font-body text-ink text-[15px] mb-2">{row.message}</Text>
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {authorName(row.author_id)} · {formatTimestampShort(row.created_at)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Post">
        <CategoryPicker options={FEED_POST_TYPES} value={type} onChange={setType} label="Type" />
        <FormField label="Message" value={message} onChangeText={setMessage} placeholder="Write an update..." autoFocus />
        <PrimaryButton label={submitting ? 'Posting…' : 'Post'} onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
