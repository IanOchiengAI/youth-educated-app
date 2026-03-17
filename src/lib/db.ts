import Dexie, { type Table } from 'dexie';

export interface SyncQueueItem {
  id?: number;
  userId: string;
  actionType: 'MOOD_LOG' | 'LESSON_COMPLETE' | 'CIRCLE_RESPONSE' | 'GOAL_CREATE' | 'GOAL_COMPLETE' | 'AI_MESSAGE' | 'POINT_TRANSACTION';
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

export class YouthEducatedDB extends Dexie {
  syncQueue!: Table<SyncQueueItem>;
  modules!: Table<LocalModule>;
  lessons!: Table<LocalLesson>;
  moduleProgress!: Table<LocalModuleProgress>;
  moodLogs!: Table<LocalMoodLog>;
  chatMessages!: Table<LocalChatMessage>;
  circleResponses!: Table<LocalCircleResponse>;
  goals!: Table<{ id?: number; userId: string; title: string; isCompleted: boolean; weekNumber: number; synced: boolean }>;
  achievements!: Table<{ id: string; userId: string; unlockedAt: string }>;
  profile!: Table<{ userId: string; data: any }, string>;

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
  }
}

export const db = new YouthEducatedDB();
