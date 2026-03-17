export const POINT_VALUES = {
  COMPLETE_LESSON: 20,
  COMPLETE_MODULE: 150,
  DAILY_CHECKIN: 10,
  WEEKLY_REFLECTION: 40,
  AI_INTERACTION: 15,
  MENTOR_SESSION: 75,
  ENDORSEMENT_RECEIVED: 100,
  ONBOARDING_COMPLETE: 50,
  MOOD_CHECKIN: 10,
  CAREER_ASSESSMENT: 75,
  OPPORTUNITY_APPLICATION: 50,
  CIRCLE_RESPONSE: 30,
  BK_CIRCLE_RESPONSE: 35,
  CIRCLE_STREAK_BONUS: 50,
} as const;

export type GamificationAction = keyof typeof POINT_VALUES;

export interface Tier {
  name: string;
  swahili: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
}

export const TIER_THRESHOLDS = {
  mchanga: { min: 0, max: 299 },
  mwanzo: { min: 300, max: 899 },
  msimamo: { min: 900, max: 2199 },
  nguvu: { min: 2200, max: 4999 },
  kiongozi: { min: 5000, max: Infinity },
} as const;

export const TIER_SYSTEM: Tier[] = [
  { name: 'Seedling', swahili: 'MCHANGA', icon: '🌱', minPoints: 0, maxPoints: 299 },
  { name: 'Beginning', swahili: 'MWANZO', icon: '⚡', minPoints: 300, maxPoints: 899 },
  { name: 'Grounded', swahili: 'MSIMAMO', icon: '🌿', minPoints: 900, maxPoints: 2199 },
  { name: 'Strength', swahili: 'NGUVU', icon: '🔥', minPoints: 2200, maxPoints: 4999 },
  { name: 'Leader', swahili: 'KIONGOZI', icon: '🏆', minPoints: 5000, maxPoints: Infinity },
];

export const ACHIEVEMENTS_DATA = [
  { id: 'first_step', name: 'First Step', description: "You showed up. That's where everything starts.", icon: '🌱' },
  { id: 'moto', name: 'Moto (Fire)', description: "Seven days in a row. That's not luck — that's character.", icon: '🔥' },
  { id: 'voice_found', name: 'Voice Found', description: 'You found the words. Now use them.', icon: '🗣️' },
  { id: 'mkutano', name: 'Mkutano', description: 'You showed up for someone who showed up for you.', icon: '🤝' },
  { id: 'mentors_choice', name: "Mentor's Choice", description: 'A mentor noticed. Remember this moment.', icon: '⭐' },
  { id: 'kiongozi_wa_kwanza', name: 'Kiongozi wa Kwanza', description: 'First. Not last. Never settling.', icon: '🏆' },
];

export function getTierForPoints(points: number): string {
  for (const [name, range] of Object.entries(TIER_THRESHOLDS)) {
    if (points >= range.min && points <= range.max) return name;
  }
  return 'mchanga';
}

export const getCurrentTier = (points: number): Tier => {
  return TIER_SYSTEM.find((t) => points >= t.minPoints && points <= t.maxPoints) || TIER_SYSTEM[0];
};

export const getProgressToNextTier = (points: number) => {
  const currentTier = getCurrentTier(points);
  const nextTier = TIER_SYSTEM[TIER_SYSTEM.indexOf(currentTier) + 1];
  if (!nextTier) return { percent: 100, nextTier: null };
  const range = nextTier.minPoints - currentTier.minPoints;
  const progress = points - currentTier.minPoints;
  return {
    percent: Math.min(Math.round((progress / range) * 100), 100),
    nextTier
  };
};

export const getNextTierPoints = (points: number): number | null => {
  const currentTier = getCurrentTier(points);
  const nextTier = TIER_SYSTEM[TIER_SYSTEM.indexOf(currentTier) + 1];
  return nextTier ? nextTier.minPoints : null;
};

export const shouldResetWeeklyPoints = (lastResetDate: string): boolean => {
  const lastReset = new Date(lastResetDate);
  const now = new Date();
  const lastMonday = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  lastMonday.setDate(diff);
  lastMonday.setHours(0, 0, 0, 0);
  return lastReset < lastMonday;
};

export const addPoints = (
  action: GamificationAction,
  currentPoints: number,
  currentWeeklyPoints: number,
  lastWeeklyReset: string
) => {
  const pointsToAdd = POINT_VALUES[action];
  let newWeeklyPoints = currentWeeklyPoints;
  let newLastReset = lastWeeklyReset;

  if (shouldResetWeeklyPoints(lastWeeklyReset)) {
    newWeeklyPoints = pointsToAdd;
    newLastReset = new Date().toISOString();
  } else {
    newWeeklyPoints += pointsToAdd;
  }

  const newTotal = currentPoints + pointsToAdd;
  const oldTier = getCurrentTier(currentPoints);
  const newTier = getCurrentTier(newTotal);
  const upgraded = newTier.swahili !== oldTier.swahili;

  return {
    pointsAdded: pointsToAdd,
    newTotal,
    newWeeklyPoints,
    newLastReset,
    upgraded,
    newTier,
  };
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  unlocked: boolean;
}

export function checkAchievements(
  action: GamificationAction,
  achievements: Achievement[],
  context?: { moduleId?: string; streakDays?: number; points?: number }
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  const tryUnlock = (id: string) => {
    const ach = achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked) {
      newlyUnlocked.push({ ...ach, unlocked: true, unlockedAt: new Date().toISOString() });
    }
  };

  if (action === 'COMPLETE_LESSON') tryUnlock('first_step');
  if ((context?.streakDays ?? 0) >= 7) tryUnlock('moto');
  if (action === 'COMPLETE_MODULE' && context?.moduleId === 'communication') tryUnlock('voice_found');
  if (action === 'MENTOR_SESSION') tryUnlock('mkutano');
  if (action === 'ENDORSEMENT_RECEIVED') tryUnlock('mentors_choice');

  const tier = getCurrentTier(context?.points ?? 0);
  if (tier.swahili === 'NGUVU' || tier.swahili === 'KIONGOZI') tryUnlock('kiongozi_wa_kwanza');

  return newlyUnlocked;
}
