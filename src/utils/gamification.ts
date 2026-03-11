
export const POINT_VALUES = {
  COMPLETE_LESSON: 20,
  COMPLETE_MODULE: 150,
  DAILY_CHECKIN: 10,
  WEEKLY_REFLECTION: 40,
  AI_INTERACTION: 15,
  MENTOR_SESSION: 75,
  ACCOUNTABILITY_UPDATE: 10,
  ENDORSEMENT_RECEIVED: 100,
  ONBOARDING_COMPLETE: 50,
} as const;

export type GamificationAction = keyof typeof POINT_VALUES;

export interface Tier {
  name: string;
  swahili: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
}

export const TIER_SYSTEM: Tier[] = [
  { name: "Seedling", swahili: "MCHANGA", icon: "🌱", minPoints: 0, maxPoints: 299 },
  { name: "Beginning", swahili: "MWANZO", icon: "⚡", minPoints: 300, maxPoints: 899 },
  { name: "Grounded", swahili: "MSIMAMO", icon: "🌿", minPoints: 900, maxPoints: 2199 },
  { name: "Strength", swahili: "NGUVU", icon: "🔥", minPoints: 2200, maxPoints: 4999 },
  { name: "Leader", swahili: "KIONGOZI", icon: "🏆", minPoints: 5000, maxPoints: Infinity },
];

export const ACHIEVEMENTS_DATA = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'You showed up. That\'s where everything starts.',
    icon: '🌱',
  },
  {
    id: 'moto',
    name: 'Moto (Fire)',
    description: 'Seven days in a row. That\'s not luck — that\'s character.',
    icon: '🔥',
  },
  {
    id: 'voice_found',
    name: 'Voice Found',
    description: 'You found the words. Now use them.',
    icon: '🗣️',
  },
  {
    id: 'mkutano',
    name: 'Mkutano',
    description: 'You showed up for someone who showed up for you.',
    icon: '🤝',
  },
  {
    id: 'mentors_choice',
    name: 'Mentor\'s Choice',
    description: 'A mentor noticed. Remember this moment.',
    icon: '⭐',
  },
  {
    id: 'kiongozi_wa_kwanza',
    name: 'Kiongozi wa Kwanza',
    description: 'First. Not last. Never settling.',
    icon: '🏆',
  },
];

export const getCurrentTier = (points: number): Tier => {
  return TIER_SYSTEM.find(t => points >= t.minPoints && points <= t.maxPoints) || TIER_SYSTEM[0];
};

export const getProgressToNextTier = (points: number): number => {
  const currentTier = getCurrentTier(points);
  const nextTier = TIER_SYSTEM[TIER_SYSTEM.indexOf(currentTier) + 1];
  
  if (!nextTier) return 100;
  
  const range = nextTier.minPoints - currentTier.minPoints;
  const progress = points - currentTier.minPoints;
  return Math.min(Math.round((progress / range) * 100), 100);
};

export const getNextTierPoints = (points: number): number | null => {
  const currentTier = getCurrentTier(points);
  const nextTier = TIER_SYSTEM[TIER_SYSTEM.indexOf(currentTier) + 1];
  return nextTier ? nextTier.minPoints : null;
};

export const shouldResetWeeklyPoints = (lastResetDate: string): boolean => {
  const lastReset = new Date(lastResetDate);
  const now = new Date();
  
  // Get last Monday 00:00
  const lastMonday = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  lastMonday.setDate(diff);
  lastMonday.setHours(0, 0, 0, 0);
  
  return lastReset < lastMonday;
};

export const addPoints = (action: GamificationAction, currentPoints: number, currentWeeklyPoints: number, lastWeeklyReset: string) => {
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
    newTier
  };
};
