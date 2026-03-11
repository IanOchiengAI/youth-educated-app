import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';

export interface User {
  name: string;
  ageBracket: string;
  county: string;
  language: 'English' | 'Kiswahili';
  goals: string[];
  joinedAt: string;
  consent?: {
    granted: boolean;
    timestamp: string;
    guardianPhone?: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  unlocked: boolean;
}

export interface Progress {
  points: number;
  weeklyPoints: number;
  lastWeeklyReset: string;
  tier: string;
  streakDays: number;
  lastActiveDate: string;
  achievements: Achievement[];
}

export interface ModuleProgress {
  currentLesson: number;
  completedLessons: number[];
  insights: { [lessonId: number]: string };
}

export interface ModulesState {
  downloaded: string[];
  inProgress: string[];
  completed: string[];
  moduleProgress: { [moduleId: string]: ModuleProgress };
}

export interface AppState {
  user: User | null;
  progress: Progress;
  modules: ModulesState;
  notifications: {
    unreadChat: boolean;
    unreadMentor: boolean;
  };
  isOffline: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<Progress> }
  | { type: 'DOWNLOAD_MODULE'; payload: string }
  | { type: 'START_MODULE'; payload: string }
  | { type: 'COMPLETE_MODULE'; payload: string }
  | { type: 'UPDATE_MODULE_PROGRESS'; payload: { moduleId: string; progress: Partial<ModuleProgress> } }
  | { type: 'SET_OFFLINE'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Partial<AppState['notifications']> }
  | { type: 'HYDRATE'; payload: AppState };

const initialState: AppState = {
  user: null,
  progress: {
    points: 0,
    weeklyPoints: 0,
    lastWeeklyReset: new Date().toISOString(),
    tier: 'MCHANGA',
    streakDays: 0,
    lastActiveDate: new Date().toISOString(),
    achievements: [
      { id: 'first_step', name: 'First Step', description: 'You showed up. That\'s where everything starts.', icon: '🌱', unlocked: false },
      { id: 'moto', name: 'Moto (Fire)', description: 'Seven days in a row. That\'s not luck — that\'s character.', icon: '🔥', unlocked: false },
      { id: 'voice_found', name: 'Voice Found', description: 'You found the words. Now use them.', icon: '🗣️', unlocked: false },
      { id: 'mkutano', name: 'Mkutano', description: 'You showed up for someone who showed up for you.', icon: '🤝', unlocked: false },
      { id: 'mentors_choice', name: 'Mentor\'s Choice', description: 'A mentor noticed. Remember this moment.', icon: '⭐', unlocked: false },
      { id: 'kiongozi_wa_kwanza', name: 'Kiongozi wa Kwanza', description: 'First. Not last. Never settling.', icon: '🏆', unlocked: false },
    ],
  },
  modules: {
    downloaded: [],
    inProgress: [],
    completed: [],
    moduleProgress: {},
  },
  notifications: {
    unreadChat: false,
    unreadMentor: false,
  },
  isOffline: !navigator.onLine,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_POINTS':
      return {
        ...state,
        progress: { ...state.progress, points: state.progress.points + action.payload },
      };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'DOWNLOAD_MODULE':
      if (state.modules.downloaded.includes(action.payload)) return state;
      return {
        ...state,
        modules: { ...state.modules, downloaded: [...state.modules.downloaded, action.payload] },
      };
    case 'START_MODULE':
      if (state.modules.inProgress.includes(action.payload)) return state;
      return {
        ...state,
        modules: {
          ...state.modules,
          inProgress: [...state.modules.inProgress, action.payload],
          moduleProgress: {
            ...state.modules.moduleProgress,
            [action.payload]: state.modules.moduleProgress[action.payload] || {
              currentLesson: 1,
              completedLessons: [],
              insights: {},
            },
          },
        },
      };
    case 'UPDATE_MODULE_PROGRESS':
      return {
        ...state,
        modules: {
          ...state.modules,
          moduleProgress: {
            ...state.modules.moduleProgress,
            [action.payload.moduleId]: {
              ...(state.modules.moduleProgress[action.payload.moduleId] || {
                currentLesson: 1,
                completedLessons: [],
                insights: {},
              }),
              ...action.payload.progress,
            },
          },
        },
      };
    case 'COMPLETE_MODULE':
      return {
        ...state,
        modules: {
          ...state.modules,
          inProgress: state.modules.inProgress.filter((id) => id !== action.payload),
          completed: [...state.modules.completed, action.payload],
        },
      };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Rehydrate from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('youth_educated_state');
    if (savedState) {
      try {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(savedState) });
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('youth_educated_state', JSON.stringify(state));
  }, [state]);

  // Online/Offline listeners
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_OFFLINE', payload: false });
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
