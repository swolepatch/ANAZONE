import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

// SecureStore enforces a ~2048 byte ceiling per value on Android, and lists
// in this app grow past that quickly. Values are split into chunks stored
// under indexed keys, transparent to the zustand `persist` middleware above it.
const CHUNK_SIZE = 1800;

async function chunkCount(key: string): Promise<number> {
  const raw = await SecureStore.getItemAsync(`${key}__meta`);
  return raw ? Number(raw) : 0;
}

const nativeSecureStorage: StateStorage = {
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

// The Keychain/Keystore that SecureStore wraps has no browser equivalent —
// expo-secure-store's web platform file is a stub, so every call rejects
// there. localStorage is the standard fallback for web-only persistence.
const webLocalStorage: StateStorage = {
  getItem: async (key) => globalThis.localStorage?.getItem(key) ?? null,
  setItem: async (key, value) => {
    globalThis.localStorage?.setItem(key, value);
  },
  removeItem: async (key) => {
    globalThis.localStorage?.removeItem(key);
  },
};

export const secureJsonStorage: StateStorage = Platform.OS === 'web' ? webLocalStorage : nativeSecureStorage;
