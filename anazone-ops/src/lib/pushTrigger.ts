import { supabase } from '@/lib/supabase';

interface TriggerParams {
  type: 'message' | 'incident' | 'announcement';
  title: string;
  body: string;
  excludeStaffId?: string;
  conversationId?: string;
}

// Fire-and-forget: a failed push trigger shouldn't block the primary action
// (sending a message, filing a report, posting an announcement).
export async function triggerNotification(params: TriggerParams): Promise<void> {
  try {
    await supabase.functions.invoke('send-notification', { body: params });
  } catch (err) {
    console.warn('[push] Failed to trigger notification:', err);
  }
}
