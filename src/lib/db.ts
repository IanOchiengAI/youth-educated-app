import Dexie, { type Table } from 'dexie';
import { encryptText, decryptText } from './crypto';

const getPinHash = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ye_pin_hash');
};

export interface SyncQueueItem {
  id?: number;
  userId: string;
  actionType: 'MOOD_LOG' | 'LESSON_COMPLETE' | 'CIRCLE_RESPONSE' | 'GOAL_CREATE' | 'GOAL_COMPLETE' | 'GOAL_DELETE' | 'AI_MESSAGE' | 'POINT_TRANSACTION' | 'SAFEGUARDING_FLAG';
  payload: any;
  createdAt: string;
  synced: boolean;
}

export interface LocalModule {
  id: string;
  isDownloaded: boolean;
  updatedAt: string;
}

export interface LocalLesson {
  id: string;
  moduleId: string;
  isDownloaded: boolean;
}

export interface LocalModuleProgress {
  userId: string;
  moduleId: string;
  completedLessons: number[];
  isCompleted: boolean;
  updatedAt: string;
}

export interface LocalMoodLog {
  id?: number;
  userId: string;
  mood: string;
  energyLevel: number;
  logDate: string;
  sharedWithMentor: boolean;
  synced: boolean;
}

export interface LocalChatMessage {
  id?: number;
  userId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  synced: boolean;
}

export interface LocalCircleResponse {
  id?: number;
  circleId: string;
  userId: string;
  weekNumber: number;
  responseText: string;
  synced: boolean;
}

export interface LocalContentPack {
  packId: string;
  version: string;
  status: 'downloaded' | 'expired' | 'failed';
  downloadedAt: string;
  expiresAt?: string;
  checksum: string;
  payload: any;
}

export interface LocalEntitlementCache {
  userId: string;
  isPremium: boolean;
  lastCheckedAt: string;
  expiresAt: string;
}

export interface LocalAIModelPack {
  packId: string;
  modelVersion: string;
  status: 'downloading' | 'downloaded' | 'failed' | 'deleted';
  downloadedAt?: string;
  progressPercent?: number;
  sizeBytes: number;
  checksum: string;
  storagePath?: string;
}

export interface LocalOfflineAIQuery {
  id?: number;
  userId: string;
  message: string;
  history: any; // The conversation history
  persona: string;
  timestamp: string;
}

export class YouthEducatedDB extends Dexie {
  syncQueue!: Table<SyncQueueItem>;
  modules!: Table<LocalModule>;
  lessons!: Table<LocalLesson>;
  moduleProgress!: Table<LocalModuleProgress>;
  moodLogs!: Table<LocalMoodLog>;
  chatMessages!: Table<LocalChatMessage>;
  circleResponses!: Table<LocalCircleResponse>;
  goals!: Table<{ id?: number; remote_id?: string; userId: string; title: string; isCompleted: boolean; weekNumber: number; synced: boolean }>;
  achievements!: Table<{ id: string; userId: string; unlockedAt: string }>;
  profile!: Table<{ userId: string; data: any }, string>;
  contentPacks!: Table<LocalContentPack, string>;
  entitlementCache!: Table<LocalEntitlementCache, string>;
  aiModelPacks!: Table<LocalAIModelPack, string>;
  offlineAIQueries!: Table<LocalOfflineAIQuery>;

  constructor() {
    super('YouthEducatedDB');
    this.version(1).stores({
      syncQueue: '++id, userId, actionType, createdAt, synced',
      modules: 'id, isDownloaded, updatedAt',
      lessons: 'id, moduleId, isDownloaded',
      moduleProgress: '[userId+moduleId], userId, moduleId',
      moodLogs: '++id, userId, logDate, synced',
      chatMessages: '++id, userId, createdAt, synced',
      circleResponses: '++id, circleId, userId, weekNumber, synced',
      goals: '++id, userId, weekNumber, synced',
      achievements: 'id, userId',
      profile: 'userId'
    });
    this.version(2).stores({
      goals: '++id, remote_id, userId, weekNumber, synced'
    });
    this.version(3).stores({
      contentPacks: 'packId, status, downloadedAt, expiresAt',
      entitlementCache: 'userId, expiresAt'
    });
    this.version(4).stores({
      aiModelPacks: 'packId, status, downloadedAt'
    });
    this.version(5).stores({
      offlineAIQueries: '++id, userId'
    });

    // --- Encryption hooks for security ---
    
    // 1. circleResponses
    this.circleResponses.hook('creating', (primKey, obj) => {
      const hash = getPinHash();
      if (hash && obj.responseText) {
        obj.responseText = encryptText(obj.responseText, hash);
      }
    });
    this.circleResponses.hook('updating', (mods: any, primKey, obj) => {
      const hash = getPinHash();
      if (hash && mods.responseText) {
        mods.responseText = encryptText(mods.responseText, hash);
      }
    });
    this.circleResponses.hook('reading', (obj) => {
      const hash = getPinHash();
      if (hash && obj.responseText) {
        obj.responseText = decryptText(obj.responseText, hash);
      }
      return obj;
    });

    // 2. moodLogs
    this.moodLogs.hook('creating', (primKey, obj) => {
      const hash = getPinHash();
      if (hash && obj.mood) {
        obj.mood = encryptText(obj.mood, hash);
      }
    });
    this.moodLogs.hook('updating', (mods: any, primKey, obj) => {
      const hash = getPinHash();
      if (hash && mods.mood) {
        mods.mood = encryptText(mods.mood, hash);
      }
    });
    this.moodLogs.hook('reading', (obj) => {
      const hash = getPinHash();
      if (hash && obj.mood) {
        obj.mood = decryptText(obj.mood, hash);
      }
      return obj;
    });

    // 3. goals
    this.goals.hook('creating', (primKey, obj) => {
      const hash = getPinHash();
      if (hash && obj.title) {
        obj.title = encryptText(obj.title, hash);
      }
    });
    this.goals.hook('updating', (mods: any, primKey, obj) => {
      const hash = getPinHash();
      if (hash && mods.title) {
        mods.title = encryptText(mods.title, hash);
      }
    });
    this.goals.hook('reading', (obj) => {
      const hash = getPinHash();
      if (hash && obj.title) {
        obj.title = decryptText(obj.title, hash);
      }
      return obj;
    });

    // 4. offlineAIQueries (includes serializing the message history array)
    this.offlineAIQueries.hook('creating', (primKey, obj) => {
      const hash = getPinHash();
      if (hash) {
        if (obj.message) obj.message = encryptText(obj.message, hash);
        if (obj.history) {
          const serialized = JSON.stringify(obj.history);
          obj.history = encryptText(serialized, hash);
        }
      }
    });
    this.offlineAIQueries.hook('updating', (mods: any, primKey, obj) => {
      const hash = getPinHash();
      if (hash) {
        if (mods.message) mods.message = encryptText(mods.message, hash);
        if (mods.history) {
          const serialized = JSON.stringify(mods.history);
          mods.history = encryptText(serialized, hash);
        }
      }
    });
    this.offlineAIQueries.hook('reading', (obj) => {
      const hash = getPinHash();
      if (hash) {
        if (obj.message) obj.message = decryptText(obj.message, hash);
        if (obj.history && typeof obj.history === 'string' && obj.history.startsWith('_enc_:')) {
          const decrypted = decryptText(obj.history, hash);
          try {
            obj.history = JSON.parse(decrypted);
          } catch {
            obj.history = [];
          }
        }
      }
      return obj;
    });
  }
}

export const db = new YouthEducatedDB();
