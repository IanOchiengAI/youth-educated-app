import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MODULES, Module } from '../data/modules';
import { OPPORTUNITIES, Opportunity } from '../data/opportunities';
import { CAREER_QUESTIONS, CareerQuestion } from '../data/careerQuestions';
import { LIFEKIT_ARTICLES, LifeKitArticle } from '../data/lifekit';
import { useAppContext } from '../AppContext';

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
  return useSupabaseFallback<Module>(
    'modules',
    MODULES,
    (data) => data.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      icon: m.icon,
      min_age: m.min_age,
      is_sensitive: m.is_sensitive,
      brothers_keepers_variant: m.brothers_keepers_variant,
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
    })),
    '*, content(*)'
  );
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
