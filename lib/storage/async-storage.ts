import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyProgress, Statistics } from '../types';

const KEYS = {
  USER_PROFILE: '@gre_app:user_profile',
  DAILY_PROGRESS: '@gre_app:daily_progress',
  STATISTICS: '@gre_app:statistics',
  ONBOARDING_COMPLETED: '@gre_app:onboarding_completed',
};

// User Profile Management
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<boolean> => {
  try {
    const currentProfile = await getUserProfile();
    if (!currentProfile) return false;
    
    const updatedProfile = { ...currentProfile, ...updates };
    await saveUserProfile(updatedProfile);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Initialize default user profile
export const initializeUserProfile = async (
  name: string,
  startDate: string,
  dailyGoal: number = 10,
  learningVibe?: 'chill' | 'intense',
  greTestDate?: string
): Promise<UserProfile> => {
  const profile: UserProfile = {
    name,
    startDate,
    dailyGoal,
    streak: 1,
    maxStreak: 1,
    gems: 0,
    lastActiveDate: new Date().toISOString(),
    onboardingCompleted: true,
    learningVibe,
    greTestDate,
  };
  
  await saveUserProfile(profile);
  return profile;
};

// Onboarding Status
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const profile = await getUserProfile();
    return profile?.onboardingCompleted ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const setOnboardingCompleted = async (): Promise<void> => {
  await updateUserProfile({ onboardingCompleted: true });
};

// Daily Progress
export const getTodayProgress = async (): Promise<DailyProgress | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(`${KEYS.DAILY_PROGRESS}:${today}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting today progress:', error);
    return null;
  }
};

export const updateTodayProgress = async (wordsLearned: number): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const profile = await getUserProfile();
    const dailyGoal = profile?.dailyGoal ?? 10;
    
    const progress: DailyProgress = {
      date: today,
      wordsLearned,
      goalMet: wordsLearned >= dailyGoal,
    };
    
    await AsyncStorage.setItem(
      `${KEYS.DAILY_PROGRESS}:${today}`,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error('Error updating today progress:', error);
  }
};

export const incrementTodayProgress = async (additionalWords: number = 1): Promise<void> => {
  try {
    const current = await getTodayProgress();
    const newTotal = (current?.wordsLearned ?? 0) + additionalWords;
    await updateTodayProgress(newTotal);
  } catch (error) {
    console.error('Error incrementing today progress:', error);
  }
};

// Statistics Management
export const getStatistics = async (): Promise<Statistics | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STATISTICS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return null;
  }
};

export const saveStatistics = async (stats: Statistics): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STATISTICS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const updateStreakDays = async (dayOfMonth: number): Promise<void> => {
  try {
    const stats = await getStatistics();
    const currentStreakDays = stats?.streakDays ?? [];
    
    // Add today if not already present
    if (!currentStreakDays.includes(dayOfMonth)) {
      const updatedStats: Statistics = {
        ...stats,
        streakDays: [...currentStreakDays, dayOfMonth],
        totalWordsLearned: stats?.totalWordsLearned ?? 0,
        averageSessionTime: stats?.averageSessionTime ?? 0,
        longestStreak: stats?.longestStreak ?? 0,
      };
      await saveStatistics(updatedStats);
    }
  } catch (error) {
    console.error('Error updating streak days:', error);
  }
};

// Streak Calculation
export const calculateStreak = async (): Promise<{
  currentStreak: number;
  maxStreak: number;
  streakDays: number[];
}> => {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return { currentStreak: 0, maxStreak: 0, streakDays: [] };
    }

    const today = new Date();
    const lastActive = new Date(profile.lastActiveDate);
    
    // Calculate days difference
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let currentStreak = profile.streak;
    let maxStreak = profile.maxStreak;
    
    if (diffDays === 0) {
      // Same day, maintain streak
      currentStreak = profile.streak;
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      currentStreak = profile.streak + 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      currentStreak = 1;
    }
    
    // Update profile with new streak
    await updateUserProfile({
      streak: currentStreak,
      maxStreak,
      lastActiveDate: today.toISOString(),
    });
    
    // Update streak days for calendar
    const dayOfMonth = today.getDate();
    await updateStreakDays(dayOfMonth);
    
    const stats = await getStatistics();
    return {
      currentStreak,
      maxStreak,
      streakDays: stats?.streakDays ?? [dayOfMonth],
    };
  } catch (error) {
    console.error('Error calculating streak:', error);
    return { currentStreak: 0, maxStreak: 0, streakDays: [] };
  }
};

// Reset all data
export const resetAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error resetting all data:', error);
  }
};

