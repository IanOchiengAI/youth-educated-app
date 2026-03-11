
import { useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { 
  POINT_VALUES, 
  GamificationAction, 
  getCurrentTier, 
  shouldResetWeeklyPoints,
  addPoints as addPointsUtil,
  getProgressToNextTier
} from '../utils/gamification';

export const useGamification = () => {
  const { state, dispatch } = useAppContext();

  const checkAchievements = useCallback((action: GamificationAction, context?: any) => {
    const { progress } = state;
    const newAchievements = [...progress.achievements];
    let unlockedAny = false;
    const newlyUnlocked: string[] = [];

    const unlock = (id: string) => {
      const index = newAchievements.findIndex(a => a.id === id);
      if (index !== -1 && !newAchievements[index].unlocked) {
        newAchievements[index] = {
          ...newAchievements[index],
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        unlockedAny = true;
        newlyUnlocked.push(newAchievements[index].name);
      }
    };

    // 1. first_step: Complete first micro-lesson
    if (action === 'COMPLETE_LESSON') {
      unlock('first_step');
    }

    // 2. moto: 7-day activity streak
    if (progress.streakDays >= 7) {
      unlock('moto');
    }

    // 3. voice_found: Complete Communication Skills module
    if (action === 'COMPLETE_MODULE' && context?.moduleId === 'communication') {
      unlock('voice_found');
    }

    // 4. mkutano: First mentor session attended
    if (action === 'MENTOR_SESSION') {
      unlock('mkutano');
    }

    // 5. mentors_choice: Receive first endorsement card
    if (action === 'ENDORSEMENT_RECEIVED') {
      unlock('mentors_choice');
    }

    // 6. kiongozi_wa_kwanza: First in cohort to reach Nguvu tier
    const currentTier = getCurrentTier(progress.points);
    if (currentTier.swahili === 'NGUVU' || currentTier.swahili === 'KIONGOZI') {
      unlock('kiongozi_wa_kwanza');
    }

    if (unlockedAny) {
      dispatch({ type: 'UPDATE_PROGRESS', payload: { achievements: newAchievements } });
      return newlyUnlocked;
    }
    return [];
  }, [state, dispatch]);

  const addPoints = useCallback((action: GamificationAction, context?: any) => {
    const result = addPointsUtil(
      action,
      state.progress.points,
      state.progress.weeklyPoints,
      state.progress.lastWeeklyReset
    );

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        points: result.newTotal,
        weeklyPoints: result.newWeeklyPoints,
        lastWeeklyReset: result.newLastReset,
        tier: result.newTier.swahili
      }
    });

    // Check achievements after adding points
    const unlockedNames = checkAchievements(action, context);

    return {
      ...result,
      unlockedAchievements: unlockedNames
    };
  }, [state, dispatch, checkAchievements]);

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
      // Check offline grace
      const offlinePeriods = JSON.parse(localStorage.getItem('youth_educated_offline_periods') || '[]');
      const wasOfflineDuringGap = offlinePeriods.some((p: any) => {
        const start = new Date(p.start);
        const end = new Date(p.end);
        return start <= last && end >= today;
      });

      if (!wasOfflineDuringGap) {
        newStreak = 1;
      }
      // If was offline, we keep the streak (grace)
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
    if (newStreak === 14) milestoneMessage = "Two weeks! You're building something real.";
    if (newStreak === 30) milestoneMessage = "30 days. This is a habit now.";
    if (newStreak === 60) milestoneMessage = "Extraordinary. You're in the top 1%.";

    return { newStreak, milestoneMessage };
  }, [state, dispatch]);

  return {
    addPoints,
    checkAndUpdateStreak,
    getCurrentTier: () => getCurrentTier(state.progress.points),
    getProgressToNextTier: () => getProgressToNextTier(state.progress.points),
  };
};
