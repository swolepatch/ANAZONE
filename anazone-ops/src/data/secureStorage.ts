import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

// SecureStore enforces a ~2048 byte ceiling per value on Android, and lists
// in this app grow past that quickly. Values are split into chunks stored
// under indexed keys, transparent to the zustand `persist` middleware above it.
const CHUNK_SIZE = 1800;

async function chunkCount(key: string): Promise<number> {
  const raw = await SecureStore.getItemAsync(`${key}__meta`);
  return raw ? Number(raw) : 0;
}

export const secureJsonStorage: StateStorage = {
  getItem: async (key) => {
    const count = await chunkCount(key);
    if (count === 0) return null;
    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.getItemAsync(`${key}__${i}`))
    );
    if (parts.some((part) => part === null)) return null;
    return parts.join('');
  },
  setItem: async (key, value) => {
    const previousCount = await chunkCount(key);
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    await Promise.all(chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}__${i}`, chunk)));
    for (let i = chunks.length; i < previousCount; i++) {
      await SecureStore.deleteItemAsync(`${key}__${i}`);
    }
    await SecureStore.setItemAsync(`${key}__meta`, String(chunks.length));
  },
  removeItem: async (key) => {
    const count = await chunkCount(key);
    await Promise.all(
      Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(`${key}__${i}`))
    );
    await SecureStore.deleteItemAsync(`${key}__meta`);
  },
};
