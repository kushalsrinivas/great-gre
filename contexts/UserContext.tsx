import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/lib/types';
import {
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
  calculateStreak,
  getTodayProgress,
  incrementTodayProgress,
} from '@/lib/storage/async-storage';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  todayProgress: number;
  dailyGoal: number;
  streak: number;
  maxStreak: number;
  gems: number;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  addWordsLearned: (count: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayProgress, setTodayProgress] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      
      if (profile) {
        setUser(profile);
        
        // Calculate streak
        const streakInfo = await calculateStreak();
        if (
          streakInfo.currentStreak !== profile.streak ||
          streakInfo.maxStreak !== profile.maxStreak
        ) {
          const updatedProfile = {
            ...profile,
            streak: streakInfo.currentStreak,
            maxStreak: streakInfo.maxStreak,
          };
          setUser(updatedProfile);
        }
        
        // Load today's progress
        const progress = await getTodayProgress();
        setTodayProgress(progress?.wordsLearned ?? 0);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    try {
      const success = await updateUserProfile(updates);
      if (success && user) {
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const addWordsLearned = async (count: number) => {
    try {
      await incrementTodayProgress(count);
      const progress = await getTodayProgress();
      setTodayProgress(progress?.wordsLearned ?? 0);
    } catch (error) {
      console.error('Error adding words learned:', error);
    }
  };

  const addGems = async (amount: number) => {
    if (!user) return;
    const newGems = user.gems + amount;
    await updateUser({ gems: newGems });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        todayProgress,
        dailyGoal: user?.dailyGoal ?? 10,
        streak: user?.streak ?? 0,
        maxStreak: user?.maxStreak ?? 0,
        gems: user?.gems ?? 0,
        updateUser,
        refreshUser,
        addWordsLearned,
        addGems,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

