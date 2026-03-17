import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { db } from './lib/db';
import { queueOfflineAction } from './lib/sync';

export interface User {
  id: string;
  name: string;
  ageBracket: string;
  gender: 'male' | 'female' | 'prefer_not_to_say';
  county: string;
  language: 'English' | 'Kiswahili';
  goals: string[];
  schoolId?: string;
  guardianConsent: boolean;
  guardianConsentAt?: string;
  guardianPhone?: string;
  onboardingCompleted: boolean;
  joinedAt: string;
  role: 'student' | 'mentor' | 'admin' | 'dsl';
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

export interface CareerResults {
  stem: number;
  arts: number;
  social: number;
  tvet: number;
  topPathway: string;
  completedAt: string;
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
  canAccessSRH: boolean;
  canAccessDrugModule: boolean;
  careerResults: CareerResults | null;
  circleType: 'mixed' | 'brothers_keepers';
}

function deriveAccess(ageBracket: string) {
  const canAccessSRH = ageBracket === '16-18' || ageBracket === '19-22';
  const canAccessDrugModule =
    ageBracket === '13-15' || ageBracket === '16-18' || ageBracket === '19-22';
  return { canAccessSRH, canAccessDrugModule };
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_POINTS'; payload: { points: number; reason: string } }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<Progress> }
  | { type: 'DOWNLOAD_MODULE'; payload: string }
  | { type: 'START_MODULE'; payload: string }
  | { type: 'COMPLETE_MODULE'; payload: string }
  | { type: 'UPDATE_MODULE_PROGRESS'; payload: { moduleId: string; progress: Partial<ModuleProgress> } }
  | { type: 'SET_OFFLINE'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Partial<AppState['notifications']> }
  | { type: 'SET_CAREER_RESULTS'; payload: CareerResults }
  | { type: 'SET_CIRCLE_TYPE'; payload: 'mixed' | 'brothers_keepers' }
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SYNC_FROM_SUPABASE'; payload: Partial<AppState> };

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
      { id: 'first_step', name: 'First Step', description: "You showed up. That's where everything starts.", icon: '🌱', unlocked: false },
      { id: 'moto', name: 'Moto (Fire)', description: "Seven days in a row. That's not luck — that's character.", icon: '🔥', unlocked: false },
      { id: 'voice_found', name: 'Voice Found', description: 'You found the words. Now use them.', icon: '🗣️', unlocked: false },
      { id: 'mkutano', name: 'Mkutano', description: 'You showed up for someone who showed up for you.', icon: '🤝', unlocked: false },
      { id: 'mentors_choice', name: "Mentor's Choice", description: 'A mentor noticed. Remember this moment.', icon: '⭐', unlocked: false },
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
  canAccessSRH: false,
  canAccessDrugModule: false,
  careerResults: null,
  circleType: 'mixed',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  let newState = state;

  switch (action.type) {
    case 'SET_USER': {
      if (!action.payload) return { ...state, user: null };
      const access = deriveAccess(action.payload.ageBracket);
      newState = { ...state, user: action.payload, ...access };
      break;
    }
    case 'ADD_POINTS': {
      const { points, reason } = action.payload;
      newState = {
        ...state,
        progress: { ...state.progress, points: state.progress.points + points },
      };
      
      // Sync point transaction
      if (state.user) {
        if (!state.isOffline) {
          supabase.from('point_transactions').insert({
            user_id: state.user.id,
            points,
            reason
          }).then(({ error }) => {
            if (error) queueOfflineAction(state.user!.id, 'POINT_TRANSACTION', { points, reason });
          });
          // Also update profile points
          supabase.from('profiles').update({ points: newState.progress.points }).eq('id', state.user.id);
        } else {
          queueOfflineAction(state.user.id, 'POINT_TRANSACTION', { points, reason });
        }
      }
      break;
    }
    case 'UPDATE_PROGRESS':
      newState = { ...state, progress: { ...state.progress, ...action.payload } };
      break;
    case 'DOWNLOAD_MODULE':
      if (state.modules.downloaded.includes(action.payload)) return state;
      newState = {
        ...state,
        modules: { ...state.modules, downloaded: [...state.modules.downloaded, action.payload] },
      };
      break;
    case 'START_MODULE':
      if (state.modules.inProgress.includes(action.payload)) return state;
      newState = {
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
      break;
    case 'UPDATE_MODULE_PROGRESS': {
      const { moduleId, progress } = action.payload;
      newState = {
        ...state,
        modules: {
          ...state.modules,
          moduleProgress: {
            ...state.modules.moduleProgress,
            [moduleId]: {
              ...(state.modules.moduleProgress[moduleId] || {
                currentLesson: 1,
                completedLessons: [],
                insights: {},
              }),
              ...progress,
            },
          },
        },
      };

      // Sync module progress
      if (state.user) {
        const payload = {
          module_id: moduleId,
          completed_lessons: newState.modules.moduleProgress[moduleId].completedLessons,
          is_completed: newState.modules.completed.includes(moduleId)
        };
        
        if (!state.isOffline) {
          supabase.from('user_module_progress').upsert({
            user_id: state.user.id,
            ...payload,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,module_id' }).then(({ error }) => {
            if (error) queueOfflineAction(state.user!.id, 'LESSON_COMPLETE', payload);
          });
        } else {
          queueOfflineAction(state.user.id, 'LESSON_COMPLETE', payload);
        }
      }
      break;
    }
    case 'COMPLETE_MODULE':
      newState = {
        ...state,
        modules: {
          ...state.modules,
          inProgress: state.modules.inProgress.filter((id) => id !== action.payload),
          completed: [...state.modules.completed, action.payload],
        },
      };
      break;
    case 'SET_OFFLINE':
      newState = { ...state, isOffline: action.payload };
      break;
    case 'SET_NOTIFICATIONS':
      newState = { ...state, notifications: { ...state.notifications, ...action.payload } };
      break;
    case 'SET_CAREER_RESULTS':
      newState = { ...state, careerResults: action.payload };
      break;
    case 'SET_CIRCLE_TYPE':
      newState = { ...state, circleType: action.payload };
      break;
    case 'HYDRATE': {
      const hydrated = action.payload;
      if (hydrated.user) {
        const access = deriveAccess(hydrated.user.ageBracket);
        return { ...hydrated, ...access, isOffline: !navigator.onLine };
      }
      return { ...hydrated, isOffline: !navigator.onLine };
    }
    case 'SYNC_FROM_SUPABASE':
      newState = { ...state, ...action.payload };
      break;
    default:
      return state;
  }

  // Persist to local DB for offline access
  if (newState.user) {
    db.profile.put({ userId: newState.user.id, data: newState });
  }

  return newState;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 1. Initial hydration from localStorage (fastest)
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

  // 2. Auth State Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch fresh profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.name || '',
            ageBracket: profile.age_bracket || '',
            gender: profile.gender || 'prefer_not_to_say',
            county: profile.county || '',
            language: profile.language || 'English',
            goals: profile.goals || [],
            schoolId: profile.school_id,
            guardianConsent: profile.guardian_consent,
            guardianConsentAt: profile.guardian_consent_at,
            guardianPhone: profile.guardian_phone,
            onboardingCompleted: profile.onboarding_completed,
            joinedAt: profile.joined_at,
            role: profile.role || 'student',
          };
          dispatch({ type: 'SET_USER', payload: user });
          
          // Fetch additional progress
          const { data: progress } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', session.user.id);

          if (progress) {
            const moduleProgress: { [moduleId: string]: ModuleProgress } = {};
            const completed: string[] = [];
            const inProgress: string[] = [];

            progress.forEach((p: any) => {
              moduleProgress[p.module_id] = {
                currentLesson: 1, // Default fallback
                completedLessons: p.completed_lessons,
                insights: {}
              };
              if (p.is_completed) completed.push(p.module_id);
              else inProgress.push(p.module_id);
            });

            dispatch({ 
              type: 'SYNC_FROM_SUPABASE', 
              payload: { 
                modules: { 
                  ...state.modules, 
                  moduleProgress: { ...state.modules.moduleProgress, ...moduleProgress },
                  completed: Array.from(new Set([...state.modules.completed, ...completed])),
                  inProgress: Array.from(new Set([...state.modules.inProgress, ...inProgress]))
                },
                progress: {
                  ...state.progress,
                  points: profile.points || 0,
                  streakDays: profile.streak_days || 0,
                  lastActiveDate: profile.last_active_date || new Date().toISOString()
                }
              } 
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'SET_USER', payload: null });
        localStorage.removeItem('youth_educated_state');
      }
    });

    return () => subscription.unsubscribe();
  }, [state.modules, state.progress]);

  // 3. Persist to localStorage
  useEffect(() => {
    localStorage.setItem('youth_educated_state', JSON.stringify(state));
  }, [state]);

  // 4. Online/Offline listeners
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
