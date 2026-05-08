import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
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
  jabariVoice: string;
  aiPersona: 'amara' | 'jabari';
  isPremium: boolean;
  mentorPairId: string | null;
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
  jabariGoals: string[];
  jabariAgenda: string;
}

function deriveAccess(ageBracket: string) {
  const canAccessSRH = ageBracket === '16-18' || ageBracket === '19-22';
  const canAccessDrugModule =
    ageBracket === '13-15' || ageBracket === '16-18' || ageBracket === '19-22';
  return { canAccessSRH, canAccessDrugModule };
}

// Strips sensitive personal fields before persisting to localStorage
function sanitizeForStorage(state: AppState): AppState {
  if (!state.user) return state;
  const { guardianPhone: _gp, guardianConsentAt: _gca, ...safeUser } = state.user;
  return { ...state, user: safeUser as User };
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
  | { type: 'SET_JABARI_GOALS'; payload: { goals: string[]; agenda: string } }
  | { type: 'SET_MENTOR_PAIR'; payload: string | null }
  | { type: 'SET_JABARI_VOICE'; payload: string }
  | { type: 'SET_AI_PERSONA'; payload: 'amara' | 'jabari' }
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
  jabariGoals: [],
  jabariAgenda: '',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Pure reducer — no side effects
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER': {
      if (!action.payload) return { ...state, user: null };
      const access = deriveAccess(action.payload.ageBracket);
      return { ...state, user: action.payload, ...access };
    }
    case 'ADD_POINTS': {
      const { points } = action.payload;
      return {
        ...state,
        progress: { ...state.progress, points: state.progress.points + points },
      };
    }
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
    case 'UPDATE_MODULE_PROGRESS': {
      const { moduleId, progress } = action.payload;
      return {
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
    }
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
    case 'SET_CAREER_RESULTS':
      return { ...state, careerResults: action.payload };
    case 'SET_CIRCLE_TYPE':
      return { ...state, circleType: action.payload };
    case 'SET_JABARI_GOALS':
      return { ...state, jabariGoals: action.payload.goals, jabariAgenda: action.payload.agenda };
    case 'SET_MENTOR_PAIR':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, mentorPairId: action.payload } };
    case 'SET_JABARI_VOICE':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, jabariVoice: action.payload } };
    case 'SET_AI_PERSONA':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, aiPersona: action.payload } };
    case 'HYDRATE': {
      const hydrated = action.payload;
      if (hydrated.user) {
        const access = deriveAccess(hydrated.user.ageBracket);
        return { ...hydrated, ...access, isOffline: !navigator.onLine };
      }
      return { ...hydrated, isOffline: !navigator.onLine };
    }
    case 'SYNC_FROM_SUPABASE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, rawDispatch] = useReducer(appReducer, initialState);

  // Stable refs so effects and the enhanced dispatcher always read latest values
  // without needing to re-register listeners on every state update.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Enhanced dispatcher: runs Supabase side-effects BEFORE handing off to the pure reducer.
  // Reading from stateRef gives us the pre-action state, which is exactly what we need
  // (e.g. to compute the new point total for the profiles update).
  const dispatch = useCallback((action: Action) => {
    const currentState = stateRef.current;

    if (action.type === 'ADD_POINTS' && currentState.user) {
      const { points, reason } = action.payload;
      const newTotal = currentState.progress.points + points;
      if (!currentState.isOffline) {
        supabase
          .from('point_transactions')
          .insert({ user_id: currentState.user.id, points, reason })
          .then(({ error }) => {
            if (error) queueOfflineAction(currentState.user!.id, 'POINT_TRANSACTION', { points, reason });
          });
        supabase
          .from('profiles')
          .update({ points: newTotal })
          .eq('id', currentState.user.id);
      } else {
        queueOfflineAction(currentState.user.id, 'POINT_TRANSACTION', { points, reason });
      }
    }

    if (action.type === 'UPDATE_MODULE_PROGRESS' && currentState.user) {
      const { moduleId, progress } = action.payload;
      const existingProgress = currentState.modules.moduleProgress[moduleId] || {
        currentLesson: 1,
        completedLessons: [],
        insights: {},
      };
      const mergedLessons = progress.completedLessons ?? existingProgress.completedLessons;
      const payload = {
        module_id: moduleId,
        completed_lessons: mergedLessons,
        is_completed: currentState.modules.completed.includes(moduleId),
      };
      if (!currentState.isOffline) {
        supabase
          .from('user_module_progress')
          .upsert(
            { user_id: currentState.user.id, ...payload, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,module_id' }
          )
          .then(({ error }) => {
            if (error) queueOfflineAction(currentState.user!.id, 'LESSON_COMPLETE', payload);
          });
      } else {
        queueOfflineAction(currentState.user.id, 'LESSON_COMPLETE', payload);
      }
    }

    if (action.type === 'SET_AI_PERSONA' && currentState.user) {
      supabase
        .from('profiles')
        .update({ ai_persona: action.payload })
        .eq('id', currentState.user.id)
        .then(({ error }) => {
          if (error) console.error('[AppContext] Failed to persist ai_persona:', error.message);
        });
    }

    rawDispatch(action);
  }, []); // stable — reads state via ref, no dependencies needed

  // 1. Initial hydration from localStorage (fastest path)
  useEffect(() => {
    const savedState = localStorage.getItem('youth_educated_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as AppState;
        if (parsed && parsed.user !== undefined && parsed.progress && parsed.modules) {
          dispatch({ type: 'HYDRATE', payload: parsed });
        }
      } catch (e) {
        console.error('Failed to parse saved state — clearing cache', e);
        localStorage.removeItem('youth_educated_state');
      }
    }
  }, []);

  // 2. Auth state listener — registered ONCE with [] deps.
  //    Reads latest state via stateRef.current (no stale closure).
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
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
            jabariVoice: profile.jabari_voice || 'default_female',
            aiPersona: (profile.ai_persona as 'amara' | 'jabari') || 'amara',
            isPremium: profile.is_premium ?? false,
            mentorPairId: null,
          };
          dispatch({ type: 'SET_USER', payload: user });

          const { data: progressRows } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', session.user.id);

          if (progressRows) {
            const latestModules = stateRef.current.modules;
            const latestProgress = stateRef.current.progress;

            const moduleProgress: { [moduleId: string]: ModuleProgress } = {};
            const completed: string[] = [];
            const inProgress: string[] = [];

            progressRows.forEach((p: any) => {
              moduleProgress[p.module_id] = {
                currentLesson: latestModules.moduleProgress[p.module_id]?.currentLesson ?? 1,
                completedLessons: p.completed_lessons ?? [],
                insights: latestModules.moduleProgress[p.module_id]?.insights ?? {},
              };
              if (p.is_completed) completed.push(p.module_id);
              else inProgress.push(p.module_id);
            });

            dispatch({
              type: 'SYNC_FROM_SUPABASE',
              payload: {
                modules: {
                  ...latestModules,
                  moduleProgress: { ...latestModules.moduleProgress, ...moduleProgress },
                  completed: Array.from(new Set([...latestModules.completed, ...completed])),
                  inProgress: Array.from(new Set([...latestModules.inProgress, ...inProgress])),
                },
                progress: {
                  ...latestProgress,
                  points: profile.points ?? latestProgress.points,
                  streakDays: profile.streak_days ?? latestProgress.streakDays,
                  lastActiveDate: profile.last_active_date ?? latestProgress.lastActiveDate,
                },
              },
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'SET_USER', payload: null });
        localStorage.removeItem('youth_educated_state');
      }
    });

    return () => subscription.unsubscribe();
  }, []); // intentionally empty — register the Supabase listener exactly once

  // 3. Persist to localStorage (debounced) — strips sensitive fields before writing
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('youth_educated_state', JSON.stringify(sanitizeForStorage(state)));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  // 4. Persist to Dexie for offline access
  useEffect(() => {
    if (state.user) {
      db.profile.put({ userId: state.user.id, data: state });
    }
  }, [state]);

  // 5. Online/Offline listeners
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
