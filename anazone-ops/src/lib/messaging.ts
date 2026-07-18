import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Conversation, ConversationSummary, Message } from '@/data/types';

interface StaffLite {
  id: string;
  name: string;
  avatar_url: string | null;
}

export async function fetchConversations(currentUserId: string): Promise<ConversationSummary[]> {
  const { data: participantRows } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('staff_id', currentUserId);
  const conversationIds = (participantRows ?? []).map((r) => r.conversation_id as string);
  if (conversationIds.length === 0) return [];

  const [{ data: conversations }, { data: allParticipants }, { data: recentMessages }, { data: reads }] =
    await Promise.all([
      supabase.from('conversations').select('*').in('id', conversationIds),
      supabase
        .from('conversation_participants')
        .select('conversation_id, staff_id, staff:staff_id(id, name, avatar_url)')
        .in('conversation_id', conversationIds),
      supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false }),
      supabase.from('message_reads').select('message_id').eq('staff_id', currentUserId),
    ]);

  const readIds = new Set((reads ?? []).map((r) => r.message_id as string));

  const latestByConversation = new Map<string, Message>();
  for (const message of (recentMessages ?? []) as Message[]) {
    if (!latestByConversation.has(message.conversation_id)) {
      latestByConversation.set(message.conversation_id, message);
    }
  }

  const otherParticipantByConversation = new Map<string, StaffLite>();
  for (const row of allParticipants ?? []) {
    if (row.staff_id === currentUserId) continue;
    const staff = row.staff as unknown as StaffLite | null;
    if (staff) otherParticipantByConversation.set(row.conversation_id as string, staff);
  }

  return ((conversations ?? []) as Conversation[])
    .map((conversation): ConversationSummary => {
      const lastMessage = latestByConversation.get(conversation.id) ?? null;
      const unread = !!lastMessage && lastMessage.sender_id !== currentUserId && !readIds.has(lastMessage.id);
      return {
        id: conversation.id,
        type: conversation.type,
        name: conversation.name,
        otherParticipant: otherParticipantByConversation.get(conversation.id) ?? null,
        lastMessage: lastMessage
          ? { text: lastMessage.text, created_at: lastMessage.created_at, sender_id: lastMessage.sender_id }
          : null,
        unread,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.created_at ?? '';
      const bTime = b.lastMessage?.created_at ?? '';
      return bTime.localeCompare(aTime);
    });
}

export async function fetchConversation(conversationId: string): Promise<Conversation | null> {
  const { data } = await supabase.from('conversations').select('*').eq('id', conversationId).single();
  return (data as Conversation | null) ?? null;
}

export async function fetchConversationParticipants(conversationId: string): Promise<StaffLite[]> {
  const { data } = await supabase
    .from('conversation_participants')
    .select('staff:staff_id(id, name, avatar_url)')
    .eq('conversation_id', conversationId);
  return ((data ?? []) as unknown as Array<{ staff: StaffLite }>).map((row) => row.staff);
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return (data as Message[] | null) ?? [];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<{ message: Message | null; error: string | null }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, text })
    .select()
    .single();
  return { message: (data as Message | null) ?? null, error: error?.message ?? null };
}

export async function markConversationRead(conversationId: string, staffId: string): Promise<void> {
  const { data: messages } = await supabase.from('messages').select('id').eq('conversation_id', conversationId);
  if (!messages || messages.length === 0) return;
  const rows = messages.map((m) => ({ message_id: m.id as string, staff_id: staffId }));
  await supabase.from('message_reads').upsert(rows, { onConflict: 'message_id,staff_id' });
}

export function subscribeToConversation(conversationId: string, onInsert: (message: Message) => void): RealtimeChannel {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(payload.new as Message)
    )
    .subscribe();
}

export async function findExistingDm(currentUserId: string, otherStaffId: string): Promise<string | null> {
  const { data: mine } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('staff_id', currentUserId);
  const { data: theirs } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('staff_id', otherStaffId);
  const mineIds = new Set((mine ?? []).map((r) => r.conversation_id as string));
  const sharedIds = (theirs ?? []).map((r) => r.conversation_id as string).filter((id) => mineIds.has(id));
  if (sharedIds.length === 0) return null;

  const { data: sharedConversations } = await supabase
    .from('conversations')
    .select('id, type')
    .in('id', sharedIds)
    .eq('type', 'dm');
  return sharedConversations?.[0]?.id ?? null;
}

export async function createDm(currentUserId: string, otherStaffId: string): Promise<{ id: string | null; error: string | null }> {
  const existing = await findExistingDm(currentUserId, otherStaffId);
  if (existing) return { id: existing, error: null };

  const { data, error } = await supabase.rpc('create_dm', { other_staff_id: otherStaffId });
  if (error || !data) return { id: null, error: error?.message ?? 'Failed to create conversation' };

  return { id: data as string, error: null };
}

export async function createGroup(
  currentUserId: string,
  name: string,
  participantIds: string[]
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase.rpc('create_group', {
    group_name: name,
    participant_ids: participantIds,
  });
  if (error || !data) return { id: null, error: error?.message ?? 'Failed to create conversation' };

  return { id: data as string, error: null };
}
