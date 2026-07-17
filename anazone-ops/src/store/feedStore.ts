import { seedFeedPosts } from '@/data/seed';
import type { FeedPost } from '@/data/types';
import { createListStore } from './createListStore';

export const useFeedStore = createListStore<FeedPost>('anazone-ops.feed', seedFeedPosts);
