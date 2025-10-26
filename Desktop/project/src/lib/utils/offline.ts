/**
 * Offline/IndexedDB utilities for queuing actions when offline
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { ControlAction } from '@types';

interface SenergyDB extends DBSchema {
  actions: {
    key: string;
    value: {
      id: string;
      action: ControlAction;
      timestamp: string;
      retries: number;
    };
    indexes: never;
  };
  cache: {
    key: string;
    value: {
      key: string;
      data: unknown;
      timestamp: string;
      ttl: number; // seconds
    };
    indexes: { timestamp: string };
  };
}

let dbInstance: IDBPDatabase<SenergyDB> | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBPDatabase<SenergyDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SenergyDB>('senergy-db', 1, {
    upgrade(db) {
      // Actions queue store
      if (!db.objectStoreNames.contains('actions')) {
        db.createObjectStore('actions', { keyPath: 'id' });
      }

      // Cache store
      if (!db.objectStoreNames.contains('cache')) {
        const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
        cacheStore.createIndex('timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
}

/**
 * Queue an action for later execution (when offline)
 */
export async function queueAction(action: ControlAction): Promise<string> {
  const db = await initDB();
  const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await db.add('actions', {
    id,
    action: { ...action, queuedOffline: true },
    timestamp: new Date().toISOString(),
    retries: 0,
  });

  return id;
}

/**
 * Get all queued actions
 */
export async function getQueuedActions() {
  const db = await initDB();
  return db.getAll('actions');
}

/**
 * Remove action from queue
 */
export async function removeQueuedAction(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('actions', id);
}

/**
 * Clear all queued actions
 */
export async function clearActionQueue(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('actions', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

/**
 * Cache data with TTL
 */
export async function cacheData(key: string, data: unknown, ttlSeconds = 3600): Promise<void> {
  const db = await initDB();
  await db.put('cache', {
    key,
    data,
    timestamp: new Date().toISOString(),
    ttl: ttlSeconds,
  });
}

/**
 * Get cached data (returns null if expired or not found)
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  const db = await initDB();
  const cached = await db.get('cache', key);

  if (!cached) return null;

  const age = (Date.now() - new Date(cached.timestamp).getTime()) / 1000;
  if (age > cached.ttl) {
    // Expired, delete it
    await db.delete('cache', key);
    return null;
  }

  return cached.data as T;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Set up online/offline event listeners
 */
export function setupNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
