// Deno runtime (Supabase Edge Functions) — not part of the Expo/Node build.
// Deploy with: supabase functions deploy send-notification
import { createClient } from 'npm:@supabase/supabase-js@2';

interface NotificationPayload {
  type: 'message' | 'incident' | 'announcement';
  title: string;
  body: string;
  excludeStaffId?: string;
  conversationId?: string;
}

const PREF_KEY: Record<NotificationPayload['type'], string> = {
  message: 'messages',
  incident: 'incidents',
  announcement: 'announcements',
};

Deno.serve(async (req: Request) => {
  try {
    const payload = (await req.json()) as NotificationPayload;

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: allStaff } = await supabase.from('staff').select('id, notification_prefs');
    const prefKey = PREF_KEY[payload.type];

    const targetStaffIds = (allStaff ?? [])
      .filter((s) => s.id !== payload.excludeStaffId)
      .filter((s) => s.notification_prefs?.[prefKey] !== false)
      .map((s) => s.id);

    if (targetStaffIds.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { 'Content-Type': 'application/json' } });
    }

    const { data: tokenRows } = await supabase
      .from('push_tokens')
      .select('expo_push_token')
      .in('staff_id', targetStaffIds);

    const pushTokens = Array.from(new Set((tokenRows ?? []).map((t) => t.expo_push_token as string)));

    if (pushTokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { 'Content-Type': 'application/json' } });
    }

    const messages = pushTokens.map((to) => ({
      to,
      title: payload.title,
      body: payload.body,
      data: {
        type: payload.type,
        ...(payload.conversationId ? { conversationId: payload.conversationId } : {}),
      },
    }));

    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(messages),
    });
    const result = await expoResponse.json();

    return new Response(JSON.stringify({ sent: pushTokens.length, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
