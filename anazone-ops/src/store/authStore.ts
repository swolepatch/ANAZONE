import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface NotificationPrefs {
  messages: boolean;
  incidents: boolean;
  announcements: boolean;
}

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar_url: string | null;
  notification_prefs: NotificationPrefs;
  created_at: string;
}

interface AuthState {
  session: Session | null;
  profile: StaffProfile | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<StaffProfile, 'name' | 'avatar_url'>>) => Promise<{ error: string | null }>;
  updateNotificationPrefs: (patch: Partial<NotificationPrefs>) => Promise<{ error: string | null }>;
}

async function fetchProfile(userId: string): Promise<StaffProfile | null> {
  const { data } = await supabase.from('staff').select('*').eq('id', userId).single();
  return (data as StaffProfile | null) ?? null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  initializing: true,

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signUp: async (email, password, name, role) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  refreshProfile: async () => {
    const userId = get().session?.user.id;
    if (!userId) return;
    const profile = await fetchProfile(userId);
    set({ profile });
  },

  updateProfile: async (patch) => {
    const userId = get().session?.user.id;
    if (!userId) return { error: 'Not signed in' };
    const { data, error } = await supabase.from('staff').update(patch).eq('id', userId).select().single();
    if (error) return { error: error.message };
    set({ profile: data as StaffProfile });
    return { error: null };
  },

  updateNotificationPrefs: async (patch) => {
    const { profile } = get();
    if (!profile) return { error: 'Not signed in' };
    const notification_prefs = { ...profile.notification_prefs, ...patch };
    const { data, error } = await supabase
      .from('staff')
      .update({ notification_prefs })
      .eq('id', profile.id)
      .select()
      .single();
    if (error) return { error: error.message };
    set({ profile: data as StaffProfile });
    return { error: null };
  },
}));

supabase.auth.onAuthStateChange(async (_event, session) => {
  useAuthStore.setState({ session });
  if (session?.user) {
    const profile = await fetchProfile(session.user.id);
    useAuthStore.setState({ profile, initializing: false });
  } else {
    useAuthStore.setState({ profile: null, initializing: false });
  }
});
