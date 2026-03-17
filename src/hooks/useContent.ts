import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MODULES, Module } from '../data/modules';
import { OPPORTUNITIES, Opportunity } from '../data/opportunities';
import { CAREER_QUESTIONS, CareerQuestion } from '../data/careerQuestions';
import { useAppContext } from '../AppContext';

// Helper hook to fetch data with local fallback
function useSupabaseFallback<T>(
  tableName: string,
  fallbackData: T[],
  transformData?: (data: any[]) => T[]
) {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      // If offline, stick with fallback immediately
      if (state.isOffline) {
        if (isMounted) {
          setData(fallbackData);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: remoteData, error } = await supabase.from(tableName).select('*');
        
        if (error) throw error;

        if (remoteData && remoteData.length > 0 && isMounted) {
          setData(transformData ? transformData(remoteData) : remoteData);
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
  // Option to transform Supabase JSONB back into our specific TS interfaces if needed
  return useSupabaseFallback<Module>('modules', MODULES);
}

export function useOpportunities() {
  return useSupabaseFallback<Opportunity>('opportunities', OPPORTUNITIES);
}

export function useCareerQuestions() {
  return useSupabaseFallback<CareerQuestion>('career_questions', CAREER_QUESTIONS);
}
