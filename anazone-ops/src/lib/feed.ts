import type { FeedPost, FeedPostType } from '@/data/types';
import { supabase } from '@/lib/supabase';

export async function fetchFeedPosts(): Promise<FeedPost[]> {
  const { data } = await supabase.from('feed_posts').select('*').order('created_at', { ascending: false });
  return (data as FeedPost[] | null) ?? [];
}

export async function addFeedPost(params: {
  type: FeedPostType;
  authorId: string;
  message: string;
}): Promise<{ post: FeedPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from('feed_posts')
    .insert({ type: params.type, author_id: params.authorId, message: params.message })
    .select()
    .single();
  return { post: (data as FeedPost | null) ?? null, error: error?.message ?? null };
}

export async function removeFeedPost(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('feed_posts').delete().eq('id', id);
  return { error: error?.message ?? null };
}
