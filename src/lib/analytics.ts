import { supabase } from './supabase';

export type EventName = 
  | 'page_view'
  | 'module_started'
  | 'module_completed'
  | 'lesson_completed'
  | 'lifekit_article_read'
  | 'career_assessment_completed'
  | 'opportunity_saved'
  | 'ai_chat_started'
  | 'voice_chat_used';

/**
 * Logs an analytics event to Supabase.
 * Fails silently to prevent disrupting the UX.
 */
export async function trackEvent(
  eventName: EventName, 
  eventData: Record<string, any> = {}
) {
  try {
    // Attempt to get the current user ID
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // We purposely don't await this to keep UI snappy
    supabase.from('analytics_events').insert({
      user_id: userId,
      event_name: eventName,
      event_data: eventData
    }).then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn('Analytics tracking failed:', error.message);
      }
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('Analytics setup failed:', err);
    }
  }
}
