import type { Shift, StaffRole } from '@/data/types';
import { supabase } from '@/lib/supabase';

export async function fetchShifts(): Promise<Shift[]> {
  const { data } = await supabase.from('shifts').select('*').order('date').order('start_time');
  return (data as Shift[] | null) ?? [];
}

export async function addShift(params: {
  staffId: string;
  role: StaffRole;
  date: string;
  startTime: string;
  endTime: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('shifts').insert({
    staff_id: params.staffId,
    role: params.role,
    date: params.date,
    start_time: params.startTime,
    end_time: params.endTime,
  });
  return { error: error?.message ?? null };
}

export async function removeShift(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('shifts').delete().eq('id', id);
  return { error: error?.message ?? null };
}
