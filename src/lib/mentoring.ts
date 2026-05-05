import { supabase } from './supabase';

// ── Types ──

export interface MentorPair {
  pairId: string;
  jabariGoals: string[];
  jabariAgenda: string;
  mentorId: string;
}

export interface AvailableMentor {
  id: string;
  displayName: string;
  bio: string | null;
  expertise: string[];
  county: string | null;
  avatarUrl: string | null;
}

// ── Queries ──

/**
 * Fetch the active mentor pairing for a student.
 * Returns null if the student has no active match.
 */
export async function fetchActiveMentorPair(
  studentId: string
): Promise<MentorPair | null> {
  const { data, error } = await supabase
    .from('mentor_matches')
    .select('id, jabari_goals, jabari_agenda, mentor_id')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[mentoring] fetchActiveMentorPair failed:', error.message);
    return null;
  }

  if (!data) return null;

  return {
    pairId: data.id,
    jabariGoals: data.jabari_goals ?? [],
    jabariAgenda: data.jabari_agenda ?? '',
    mentorId: data.mentor_id,
  };
}

/**
 * Upsert jabari_goals and jabari_agenda on an existing mentor_matches row.
 * Caller must be the mentor (RLS enforced).
 */
export async function updateMentorGoals(
  pairId: string,
  goals: string[],
  agenda: string
): Promise<boolean> {
  const { error } = await supabase
    .from('mentor_matches')
    .update({
      jabari_goals: goals,
      jabari_agenda: agenda,
    })
    .eq('id', pairId);

  if (error) {
    console.error('[mentoring] updateMentorGoals failed:', error.message);
    return false;
  }

  return true;
}

/**
 * Fetch all available mentors joined with their profile display name.
 */
export async function fetchAvailableMentors(): Promise<AvailableMentor[]> {
  const { data, error } = await supabase
    .from('mentor_profiles')
    .select(`
      id,
      bio,
      expertise,
      county,
      avatar_url,
      profiles!inner ( name )
    `)
    .eq('is_verified', true);

  if (error) {
    console.error('[mentoring] fetchAvailableMentors failed:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    displayName: row.profiles?.name ?? 'Mentor',
    bio: row.bio,
    expertise: row.expertise ?? [],
    county: row.county,
    avatarUrl: row.avatar_url,
  }));
}

/**
 * Insert a new mentor match request with status 'pending'.
 * Caller must be the student (RLS enforced via student_id = auth.uid()).
 */
export async function requestMentorMatch(
  studentId: string,
  mentorId: string
): Promise<{ id: string } | null> {
  // Idempotency guard — prevent duplicate pending/active matches
  const { data: existing } = await supabase
    .from('mentor_matches')
    .select('id, status')
    .eq('student_id', studentId)
    .eq('mentor_id', mentorId)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (existing) {
    console.log('[mentoring] requestMentorMatch: match already exists, returning existing id');
    return { id: existing.id };
  }

  const { data, error } = await supabase
    .from('mentor_matches')
    .insert({
      student_id: studentId,
      mentor_id: mentorId,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[mentoring] requestMentorMatch:', error.message);
    return null;
  }

  return { id: data.id };
}
