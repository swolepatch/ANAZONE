import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { StaffProfile } from './authStore';

interface StaffState {
  staff: StaffProfile[];
  loading: boolean;
  fetchStaff: () => Promise<void>;
  staffById: (id: string) => StaffProfile | undefined;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: [],
  loading: false,
  fetchStaff: async () => {
    set({ loading: true });
    const { data } = await supabase.from('staff').select('*').order('name');
    set({ staff: (data as StaffProfile[] | null) ?? [], loading: false });
  },
  staffById: (id) => get().staff.find((s) => s.id === id),
}));
