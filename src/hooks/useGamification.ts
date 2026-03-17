import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { 
  POINT_VALUES, 
  GamificationAction, 
  getCurrentTier, 
  shouldResetWeeklyPoints,
  addPoints as addPointsUtil,
  getProgressToNextTier,
  checkAchievements as checkAchievementsUtil
} from '../lib/gamification';

export const useGamification = () => {
  const { state, dispatch } = useAppContext();

  const addPoints = useCallback((action: GamificationAction, context?: any) => {
    const result = addPointsUtil(
      action,
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );

    // Check for new achievements
    const newlyUnlocked = checkAchievementsUtil(
      action, 
      state.progress.achievements, 
      { 
        moduleId: context?.moduleId, 
        streakDays: state.progress.streakDays,
        points: result.newTotal
      }
    );

    const updatedAchievements = [...state.progress.achievements];
    newlyUnlocked.forEach(newAch => {
      const idx = updatedAchievements.findIndex(a => a.id === newAch.id);
      if (idx !== -1) updatedAchievements[idx] = newAch;
    });

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        points: result.newTotal,
        weeklyPoints: result.newWeeklyPoints,
        lastWeeklyReset: result.newLastReset,
        tier: result.newTier.swahili,
        achievements: updatedAchievements
      }
    });

    return {
      ...result,
      unlockedAchievements: newlyUnlocked.map(a => a.name)
    };
  }, [state, dispatch]);

  const checkAndUpdateStreak = useCallback(() => {
    const { lastActiveDate, streakDays } = state.progress;
    const now = new Date();
    const lastActive = new Date(lastActiveDate);
    
    // Reset time to midnight for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return; // Already active today

    let newStreak = streakDays;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      // Offline grace logic could be complex, keeping it simple for MVP
      newStreak = 1;
    }

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        streakDays: newStreak,
        lastActiveDate: now.toISOString()
      }
    });

    // Check milestones
    let milestoneMessage = null;
    if (newStreak === 7) milestoneMessage = "One week strong! 🔥";
    if (newStreak === 30) milestoneMessage = "30 days. This is a habit now.";

    return { newStreak, milestoneMessage };
  }, [state, dispatch]);

  return {
    addPoints,
    checkAndUpdateStreak,
    getCurrentTier: () => getCurrentTier(state.progress.points),
    getProgressToNextTier: () => getProgressToNextTier(state.progress.points),
  };
};
