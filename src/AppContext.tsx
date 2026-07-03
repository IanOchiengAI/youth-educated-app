import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { db } from './lib/db';
import { queueOfflineAction } from './lib/sync';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { ADMIN_EMAILS } from './lib/auth';
import { shouldResetWeeklyPoints, getCurrentTier } from './lib/gamification';
import type { Session } from '@supabase/supabase-js';

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
  isHydrating: boolean;
}

function deriveAccess(ageBracket: string) {
  const canAccessSRH = ageBracket === '16-18' || ageBracket === '19-22' || ageBracket === '23+';
  const canAccessDrugModule =
    ageBracket === '13-15' || ageBracket === '16-18' || ageBracket === '19-22' || ageBracket === '23+';
  return { canAccessSRH, canAccessDrugModule };
}

// Strips sensitive personal fields before persisting to localStorage.
function sanitizeForStorage(state: AppState): AppState {
  if (!state.user) return state;
  const { guardianPhone: _guardianPhone, guardianConsentAt: _guardianConsentAt, ...safeUser } = state.user;
  return { ...state, user: safeUser as User };
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_POINTS'; payload: { points: number; reason: string; weeklyPoints?: number; lastWeeklyReset?: string; tier?: string; achievements?: Achievement[] } }
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
  | { type: 'SET_LANGUAGE'; payload: 'English' | 'Kiswahili' }
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SYNC_FROM_SUPABASE'; payload: Partial<AppState> }
  | { type: 'SET_HYDRATION_COMPLETE' };

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
  isHydrating: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

type ProfileRow = {
  id?: string;
  name?: string | null;
  age_bracket?: string | null;
  gender?: User['gender'] | null;
  county?: string | null;
  language?: User['language'] | null;
  goals?: string[] | null;
  school_id?: string | null;
  guardian_consent?: boolean | null;
  guardian_consent_at?: string | null;
  guardian_phone?: string | null;
  onboarding_completed?: boolean | null;
  joined_at?: string | null;
  role?: User['role'] | null;
  jabari_voice?: string | null;
  ai_persona?: 'amara' | 'jabari' | null;
  is_premium?: boolean | null;
};

function userFromSession(session: Session, profile: ProfileRow | null, role: User['role']): User {
  return {
    id: profile?.id || session.user.id,
    name:
      profile?.name ||
      session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      '',
    ageBracket: profile?.age_bracket || '',
    gender: profile?.gender || 'prefer_not_to_say',
    county: profile?.county || '',
    language: profile?.language || 'English',
    goals: profile?.goals || [],
    schoolId: profile?.school_id || undefined,
    guardianConsent: profile?.guardian_consent ?? false,
    guardianConsentAt: profile?.guardian_consent_at || undefined,
    guardianPhone: profile?.guardian_phone || undefined,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    joinedAt: profile?.joined_at || session.user.created_at || new Date().toISOString(),
    role,
    jabariVoice: profile?.jabari_voice || 'default_female',
    aiPersona: profile?.ai_persona || 'amara',
    isPremium: profile?.is_premium ?? false,
    mentorPairId: null,
  };
}

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const OAUTH_EXCHANGE_TIMEOUT_MS = 15000;
const LAST_OAUTH_CALLBACK_KEY = 'ye_last_oauth_callback_key';

function getOAuthCallbackKey(url: string) {
  let hash = 0;
  for (let i = 0; i < url.length; i += 1) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  return `${url.length}:${Math.abs(hash).toString(36)}`;
}

// Pure reducer — no side effects
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER': {
      if (!action.payload) return { ...state, user: null };
      const access = deriveAccess(action.payload.ageBracket);
      return { ...state, user: action.payload, ...access };
    }
    case 'ADD_POINTS': {
      const { points, weeklyPoints, lastWeeklyReset, tier, achievements } = action.payload;
      const newTotal = state.progress.points + points;
      
      let newWeekly = weeklyPoints;
      let newReset = lastWeeklyReset;

      if (newWeekly === undefined || newReset === undefined) {
        if (shouldResetWeeklyPoints(state.progress.lastWeeklyReset)) {
          newWeekly = points;
          newReset = new Date().toISOString();
        } else {
          newWeekly = state.progress.weeklyPoints + points;
          newReset = state.progress.lastWeeklyReset;
        }
      }

      const newTier = tier || getCurrentTier(newTotal).swahili;

      return {
        ...state,
        progress: { 
          ...state.progress, 
          points: newTotal,
          weeklyPoints: newWeekly,
          lastWeeklyReset: newReset,
          tier: newTier,
          ...(achievements && { achievements })
        },
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
    case 'SET_LANGUAGE':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, language: action.payload } };
    case 'HYDRATE': {
      const hydrated = action.payload;
      if (hydrated.user) {
        const access = deriveAccess(hydrated.user.ageBracket);
        return { ...hydrated, ...access, isOffline: !navigator.onLine, isHydrating: false };
      }
      return { ...hydrated, isOffline: !navigator.onLine, isHydrating: false };
    }
    case 'SET_HYDRATION_COMPLETE':
      return { ...state, isHydrating: false };
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
  const processedOAuthCallbackKeysRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Enhanced dispatcher: runs Supabase side-effects BEFORE handing off to the pure reducer.
  // Reading from stateRef gives us the pre-action state, which is exactly what we need
  // (e.g. to compute the new point total for the profiles update).
  const dispatch = useCallback((action: Action) => {
    const currentState = stateRef.current;

    if (action.type === 'ADD_POINTS' && currentState.user) {
      const { points, reason, weeklyPoints, lastWeeklyReset } = action.payload;
      const newTotal = currentState.progress.points + points;
      
      let newWeekly = weeklyPoints;
      let newReset = lastWeeklyReset;

      if (newWeekly === undefined || newReset === undefined) {
        if (shouldResetWeeklyPoints(currentState.progress.lastWeeklyReset)) {
          newWeekly = points;
          newReset = new Date().toISOString();
        } else {
          newWeekly = currentState.progress.weeklyPoints + points;
          newReset = currentState.progress.lastWeeklyReset;
        }
      }

      if (!currentState.isOffline) {
        supabase
          .from('point_transactions')
          .insert({ user_id: currentState.user.id, points, reason })
          .then(({ error }) => {
            if (error) queueOfflineAction(currentState.user!.id, 'POINT_TRANSACTION', { points, reason });
          });
        supabase
          .from('profiles')
          .update({ 
            points: newTotal,
            weekly_points: newWeekly,
            weekly_points_reset_at: newReset
          })
          .eq('id', currentState.user.id);
      } else {
        queueOfflineAction(currentState.user.id, 'POINT_TRANSACTION', { points, reason });
      }
    }

    if (action.type === 'UPDATE_PROGRESS' && currentState.user) {
      const { streakDays, lastActiveDate } = action.payload;
      if (streakDays !== undefined || lastActiveDate !== undefined) {
        const updates: any = {};
        if (streakDays !== undefined) updates.streak_days = streakDays;
        if (lastActiveDate !== undefined) updates.last_active_date = lastActiveDate;
        
        if (!currentState.isOffline) {
          supabase.from('profiles').update(updates).eq('id', currentState.user.id).then(({ error }) => {
            if (error) console.error('[AppContext] Failed to sync streak to Supabase:', error.message);
          });
        }
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

    if (action.type === 'SET_LANGUAGE' && currentState.user) {
      supabase
        .from('profiles')
        .update({ language: action.payload })
        .eq('id', currentState.user.id)
        .then(({ error }) => {
          if (error) console.error('[AppContext] Failed to persist language:', error.message);
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
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved state — clearing cache', e);
        localStorage.removeItem('youth_educated_state');
      }
    }
    dispatch({ type: 'SET_HYDRATION_COMPLETE' });
  }, []);

  // 2. Auth state listener — registered ONCE with [] deps.
  //    Reads latest state via stateRef.current (no stale closure).
  useEffect(() => {
    const loadSessionUser = async (session: Session) => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[auth] Failed to fetch profile after sign-in:', profileError.message);
      }

      const userEmail = session.user.email?.toLowerCase() ?? '';
      const isAdminEmail = ADMIN_EMAILS.map(e => e.toLowerCase()).includes(userEmail);
      let resolvedRole = (profile?.role || 'student') as User['role'];

      if (isAdminEmail) {
        resolvedRole = 'admin';
        if (profile?.role !== 'admin') {
          const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', session.user.id);

          if (error) {
            console.error('[auth] Failed to persist admin role:', error.message);
          }
        }
      }

      // If they are an admin, let them override their role based on the selected sign-in intent
      if (resolvedRole === 'admin') {
        const savedIntent = localStorage.getItem('ye_signin_intent');
        if (savedIntent === 'student') {
          resolvedRole = 'student';
        } else if (savedIntent === 'mentor') {
          resolvedRole = 'mentor';
        }
      }

      if (!profile) {
        console.warn('[auth] Signed in but no profile row was available; routing to onboarding.');
      }

      const user = userFromSession(session, profile, resolvedRole);
      const latestUser = stateRef.current.user;
      const shouldPreserveCompletedOnboarding =
        latestUser?.id === session.user.id &&
        latestUser.onboardingCompleted &&
        !user.onboardingCompleted;

      dispatch({
        type: 'SET_USER',
        payload: shouldPreserveCompletedOnboarding
          ? { ...user, ...latestUser, role: resolvedRole, onboardingCompleted: true }
          : user,
      });

      const { data: progressRows, error: progressError } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', session.user.id);

      if (progressError) {
        console.error('[auth] Failed to fetch module progress:', progressError.message);
        return;
      }

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
              points: profile?.points ?? latestProgress.points,
              streakDays: profile?.streak_days ?? latestProgress.streakDays,
              lastActiveDate: profile?.last_active_date ?? latestProgress.lastActiveDate,
            },
          },
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        // Run asynchronously to avoid deadlock in Supabase client state transitions
        setTimeout(() => {
          void loadSessionUser(session);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'SET_USER', payload: null });
        localStorage.removeItem('youth_educated_state');
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[auth] Failed to restore existing session:', error.message);
        return;
      }
      if (data.session) {
        loadSessionUser(data.session);
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
      db.profile.put({ userId: state.user.id, data: sanitizeForStorage(state) });
    }
  }, [state]);

  // Deep-link / appUrlOpen listener — handles the OAuth callback on Android.
  // When Google redirects to org.youtheducated.app://login-callback?... the Capacitor
  // App plugin fires the appUrlOpen event. We close the in-app browser and hand
  // the URL to Supabase so it can exchange the code for a session.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => void } | null = null;

    const handleDeepLink = async (url: string) => {
      let code: string | null = null;
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      try {
        const parsedUrl = new URL(url);
        code = parsedUrl.searchParams.get('code');
        
        if (parsedUrl.hash) {
          const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
        }
      } catch (e) {
        const codeMatch = url.match(/[?&]code=([^&#]+)/);
        if (codeMatch) code = codeMatch[1];
        
        const tokenMatch = url.match(/[#&]access_token=([^&#]+)/);
        const refreshMatch = url.match(/[#&]refresh_token=([^&#]+)/);
        if (tokenMatch) accessToken = tokenMatch[1];
        if (refreshMatch) refreshToken = refreshMatch[1];
      }

      const isOAuthRedirect = url.includes('login-callback') || !!(code || (accessToken && refreshToken));

      if (!isOAuthRedirect) {
        return;
      }

      const callbackKey = getOAuthCallbackKey(url);
      const lastCallbackKey = localStorage.getItem(LAST_OAUTH_CALLBACK_KEY);
      if (processedOAuthCallbackKeysRef.current.has(callbackKey) || lastCallbackKey === callbackKey) {
        console.warn('[auth] Ignoring duplicate OAuth callback.');
        window.dispatchEvent(new CustomEvent('oauth-finished'));
        return;
      }

      processedOAuthCallbackKeysRef.current.add(callbackKey);
      localStorage.setItem(LAST_OAUTH_CALLBACK_KEY, callbackKey);
      window.dispatchEvent(new CustomEvent('oauth-processing'));

      // Close the in-app browser sheet
      try {
        await Browser.close();
      } catch (e) {
        // Browser might already be closed
      }

      const fireOAuthError = (msg: string) => {
        console.error('[auth]', msg);
        window.dispatchEvent(new CustomEvent('oauth-error', { detail: { message: msg } }));
      };

      if (code) {
        try {
          const { error } = await withTimeout(
            supabase.auth.exchangeCodeForSession(code),
            OAUTH_EXCHANGE_TIMEOUT_MS,
            'Google sign-in callback'
          );
          if (error) {
            fireOAuthError(`Google sign-in failed: ${error.message}. Please try again.`);
          } else {
            window.dispatchEvent(new CustomEvent('oauth-finished'));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Google sign-in failed';
          fireOAuthError(`${message}. Please try again.`);
        }
      } else if (accessToken && refreshToken) {
        try {
          const { error } = await withTimeout(
            supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
            OAUTH_EXCHANGE_TIMEOUT_MS,
            'Google sign-in session'
          );
          if (error) {
            fireOAuthError(`Google sign-in failed: ${error.message}. Please try again.`);
          } else {
            window.dispatchEvent(new CustomEvent('oauth-finished'));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Google sign-in failed';
          fireOAuthError(`${message}. Please try again.`);
        }
      } else {
        fireOAuthError('Sign-in did not complete. Please try again.');
      }
    };

    // 1. Listen for active app URL transitions (warm starts)
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      handleDeepLink(url);
    }).then(listener => { handle = listener; });

    // 2. Check if the app was launched by a deep link (cold starts)
    CapApp.getLaunchUrl().then(launchData => {
      if (launchData?.url) {
        handleDeepLink(launchData.url);
      }
    });

    return () => { handle?.remove(); };
  }, []);

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
