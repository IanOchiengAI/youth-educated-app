import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MODULES, Module } from '../data/modules';
import { PREMIUM_MODULE_IDS } from '../data/moduleMetadata';
import { OPPORTUNITIES, Opportunity } from '../data/opportunities';
import { CAREER_QUESTIONS, CareerQuestion } from '../data/careerQuestions';
import { LIFEKIT_ARTICLES, LifeKitArticle } from '../data/lifekit';
import { useAppContext } from '../AppContext';
import {
  hasPremiumPackAccess,
  loadPremiumModulesFromPack,
  mergeModuleBodies,
} from '../lib/contentPacks';

// Helper hook to fetch data with local fallback
function useSupabaseFallback<T>(
  tableName: string,
  fallbackData: T[],
  transformData?: (data: any[]) => T[],
  querySelect: string = '*'
) {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      // If offline or Supabase not configured, stick with fallback immediately
      if (state.isOffline || !isSupabaseConfigured) {
        if (isMounted) {
          setData(fallbackData);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: remoteData, error } = await supabase.from(tableName).select(querySelect);
        
        if (error) throw error;

        if (remoteData && remoteData.length > 0 && isMounted) {
          setData(transformData ? transformData(remoteData) : remoteData as unknown as T[]);
        } else if (isMounted) {
          // Empty table, use fallback
          setData(fallbackData);
        }
      } catch (e) {
        console.warn(`Failed to fetch from ${tableName}, using fallback.`, e);
        if (isMounted) setData(fallbackData);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tableName, state.isOffline]);

  return { data, loading };
}

export function useModules() {
  const [data, setData] = useState<Module[]>(MODULES);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    const mapRemoteModules = (remoteModules: any[]): Module[] => remoteModules.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      icon: m.icon,
      min_age: m.min_age,
      is_sensitive: m.is_sensitive,
      brothers_keepers_variant: m.brothers_keepers_variant,
      isPremium: m.is_premium ?? m.isPremium ?? PREMIUM_MODULE_IDS.includes(m.id),
      lessons: m.lessons,
      duration: m.duration,
      competency: m.competency,
      difficulty: m.difficulty,
      content: (m.content as any[])
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration,
          sections: l.sections || [],
        })) ?? [],
    }));

    const stripPremiumBodies = (modules: Module[]) =>
      modules.map((module) =>
        module.isPremium ? { ...module, content: [] } : module
      );

    async function fetchModules() {
      setLoading(true);
      const userId = state.user?.id;
      const isPremiumNow = state.user?.isPremium ?? false;
      const canUsePremiumPack = await hasPremiumPackAccess(userId, isPremiumNow, {
        canRefreshEntitlement: !state.isOffline && isSupabaseConfigured,
      });
      let nextModules = MODULES;

      if (!state.isOffline && isSupabaseConfigured) {
        try {
          const { data: remoteData, error } = await supabase
            .from('modules')
            .select('*, content(*)');

          if (error) throw error;

          if (remoteData && remoteData.length > 0) {
            nextModules = mapRemoteModules(remoteData);
          }
        } catch (e) {
          console.warn('Failed to fetch from modules, using fallback.', e);
          nextModules = MODULES;
        }
      }

      if (canUsePremiumPack) {
        try {
          nextModules = mergeModuleBodies(nextModules, await loadPremiumModulesFromPack());
        } catch (e) {
          console.warn('Failed to load premium content pack.', e);
        }
      } else {
        nextModules = stripPremiumBodies(nextModules);
      }

      if (isMounted) {
        setData(nextModules);
        setLoading(false);
      }
    }

    fetchModules();

    return () => {
      isMounted = false;
    };
  }, [state.isOffline, state.user?.id, state.user?.isPremium]);

  return { data, loading };
}

export function useOpportunities() {
  return useSupabaseFallback<Opportunity>(
    'opportunities',
    OPPORTUNITIES,
    (data) => data.map(o => ({
      ...o,
      pointsRequired: o.points_required,
      minAge: o.min_age,
      maxAge: o.max_age
    }))
  );
}

export function useCareerQuestions() {
  return useSupabaseFallback<CareerQuestion>(
    'career_questions', 
    CAREER_QUESTIONS,
    (data) => data.sort((a, b) => a.sort_order - b.sort_order)
  );
}

export function useLifeKitArticles() {
  return useSupabaseFallback<LifeKitArticle>(
    'lifekit_articles', 
    LIFEKIT_ARTICLES,
    (data) => data.map(a => ({
      id: a.id,
      title: a.title,
      title_sw: a.title_sw,
      category: a.category,
      tags: a.tags,
      emoji: a.emoji,
      readTime: a.read_time,
      body: a.body,
      body_sw: a.body_sw,
      month: a.month,
    }))
  );
}
