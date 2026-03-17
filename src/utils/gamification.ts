// Re-export everything from src/lib/gamification.ts for backward compatibility
export {
  POINT_VALUES,
  TIER_SYSTEM,
  TIER_THRESHOLDS,
  ACHIEVEMENTS_DATA,
  getCurrentTier,
  getProgressToNextTier,
  getNextTierPoints,
  shouldResetWeeklyPoints,
  addPoints,
  getTierForPoints,
  checkAchievements,
} from '../lib/gamification';

export type { GamificationAction, Tier, Achievement } from '../lib/gamification';
