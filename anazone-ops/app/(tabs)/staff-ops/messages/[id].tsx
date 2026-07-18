import { Ionicons } from '@expo/vector-icons';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import type { Conversation, Message } from '@/data/types';
import {
  fetchConversation,
  fetchConversationParticipants,
  fetchMessages,
  markConversationRead,
  sendMessage,
  subscribeToConversation,
} from '@/lib/messaging';
import { supabase } from '@/lib/supabase';
import { hapticLight } from '@/lib/haptics';
import { triggerNotification } from '@/lib/pushTrigger';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { formatTime } from '@/utils/date';

interface StaffLite {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default function ConversationThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useAuthStore((s) => s.profile);
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [participants, setParticipants] = useState<StaffLite[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id || !profile) return;
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    (async () => {
      const [conv, parts, msgs] = await Promise.all([
        fetchConversation(id),
        fetchConversationParticipants(id),
        fetchMessages(id),
      ]);
      if (cancelled) return;
      setConversation(conv);
      setParticipants(parts);
      setMessages(msgs);
      await markConversationRead(id, profile.id);

      channel = subscribeToConversation(id, (message) => {
        setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
        if (message.sender_id !== profile.id) {
          markConversationRead(id, profile.id);
        }
      });
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [id, profile]);

  function senderName(senderId: string): string {
    if (senderId === profile?.id) return 'You';
    return participants.find((p) => p.id === senderId)?.name ?? 'Unknown';
  }

  async function submit() {
    const trimmed = text.trim();
    if (!id || !profile || trimmed.length === 0) return;
    hapticLight();
    setText('');
    setSending(true);
    const { message, error } = await sendMessage(id, profile.id, trimmed);
    setSending(false);
    if (error) {
      setText(trimmed);
      return;
    }
    if (message) {
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      triggerNotification({
        type: 'message',
        title: profile.name,
        body: trimmed,
        excludeStaffId: profile.id,
        conversationId: id,
      });
    }
  }

  const title =
    conversation?.type === 'group'
      ? (conversation.name ?? 'Team Chat')
      : (participants.find((p) => p.id !== profile?.id)?.name ?? 'Conversation');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bg"
      keyboardVerticalOffset={80}
    >
      <ScreenHeader title={title} />
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-5"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {messages.map((m) => {
          const isOwn = m.sender_id === profile?.id;
          return (
            <View key={m.id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '80%', marginBottom: 12 }}>
              {!isOwn && conversation?.type === 'group' && (
                <Text className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
                  {senderName(m.sender_id)}
                </Text>
              )}
              <View
                className="rounded-2xl px-3 py-2"
                style={{
                  backgroundColor: isOwn ? colors.cyan : colors.surface,
                  borderWidth: isOwn ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text className="font-body text-[15px]" style={{ color: isOwn ? colors.bg : colors.ink }}>
                  {m.text}
                </Text>
              </View>
              <Text
                className="font-mono text-[9px] uppercase tracking-widest text-muted mt-1"
                style={{ textAlign: isOwn ? 'right' : 'left' }}
              >
                {formatTime(m.created_at)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        className="flex-row items-center px-4 pt-2 border-t border-border bg-surface"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor={colors.muted}
          className="flex-1 bg-bg border border-border rounded-full px-4 h-11 text-ink font-body text-[15px] mr-2"
          multiline={false}
          onSubmitEditing={submit}
          returnKeyType="send"
        />
        <Pressable
          onPress={submit}
          disabled={sending || text.trim().length === 0}
          className="items-center justify-center w-11 h-11 rounded-full"
          style={{ backgroundColor: colors.cyan, opacity: text.trim().length === 0 ? 0.4 : 1 }}
        >
          <Ionicons name="send" size={18} color={colors.bg} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
