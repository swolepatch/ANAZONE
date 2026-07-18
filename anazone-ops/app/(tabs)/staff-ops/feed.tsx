import { useMemo, useState } from 'react';
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
import { FEED_POST_TYPES, type FeedPostType } from '@/data/types';
import { useFeedStore } from '@/store/feedStore';
import { formatDateLong, todayIso } from '@/utils/date';
import { generateId } from '@/utils/id';

export default function FeedScreen() {
  const items = useFeedStore((s) => s.items);
  const addItem = useFeedStore((s) => s.addItem);
  const removeItem = useFeedStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [type, setType] = useState<FeedPostType>('announcement');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const sorted = useMemo(
    () => [...items].reverse().sort((a, b) => b.date.localeCompare(a.date)),
    [items]
  );
  const canSubmit = author.trim().length > 0 && message.trim().length > 0;

  function closeForm() {
    setFormOpen(false);
    setType('announcement');
    setAuthor('');
    setMessage('');
  }

  function submit() {
    if (!canSubmit) return;
    addItem({ id: generateId(), type, author: author.trim(), message: message.trim(), date: todayIso() });
    closeForm();
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScreenHeader title="Team Feed" />
        <View className="px-5 gap-3">
          {sorted.length === 0 && <EmptyState label="No posts yet." />}
          {sorted.map((row) => (
            <Card key={row.id}>
              <View className="flex-row items-center justify-between mb-3">
                <CategoryTag category={row.type} />
                <DeleteButton onConfirm={() => removeItem(row.id)} confirmMessage="Delete this post?" />
              </View>
              <Text className="font-body text-ink text-[15px] mb-2">{row.message}</Text>
              <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {row.author} · {formatDateLong(row.date)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Fab onPress={() => setFormOpen(true)} />

      <BottomSheet visible={formOpen} onClose={closeForm} title="New Post">
        <CategoryPicker options={FEED_POST_TYPES} value={type} onChange={setType} label="Type" />
        <FormField label="Author" value={author} onChangeText={setAuthor} placeholder="e.g. Jess Tremblay" autoFocus />
        <FormField label="Message" value={message} onChangeText={setMessage} placeholder="Write an update..." />
        <PrimaryButton label="Post" onPress={submit} disabled={!canSubmit} />
      </BottomSheet>
    </View>
  );
}
