import { useState, useEffect } from 'react';
import {
  getTotalWordsLearned,
  getAllLearningProgress,
  getTestScores,
  getTestAccuracy,
  getWordLists,
} from '../storage/database';
import { getStatistics, getUserProfile } from '../storage/async-storage';
import { Statistics, TestScore, LearningProgress, WordList } from '../types';

export interface MasteryBreakdown {
  dontKnow: number;
  unsure: number;
  knowIt: number;
}

export interface StatsData {
  totalWordsLearned: number;
  masteryBreakdown: MasteryBreakdown;
  testHistory: TestScore[];
  testAccuracy: number;
  streakDays: number[];
  currentStreak: number;
  maxStreak: number;
  statistics: Statistics | null;
  wordLists: WordList[];
  learningVelocity: number; // words per day average
  totalReviews: number;
  daysActive: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalWordsLearned: 0,
    masteryBreakdown: { dontKnow: 0, unsure: 0, knowIt: 0 },
    testHistory: [],
    testAccuracy: 0,
    streakDays: [],
    currentStreak: 0,
    maxStreak: 0,
    statistics: null,
    wordLists: [],
    learningVelocity: 0,
    totalReviews: 0,
    daysActive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        totalWords,
        progressList,
        testScores,
        accuracy,
        statistics,
        userProfile,
        wordLists,
      ] = await Promise.all([
        getTotalWordsLearned(),
        getAllLearningProgress(),
        getTestScores(),
        getTestAccuracy(),
        getStatistics(),
        getUserProfile(),
        getWordLists(),
      ]);

      // Calculate mastery breakdown
      const masteryBreakdown: MasteryBreakdown = {
        dontKnow: 0,
        unsure: 0,
        knowIt: 0,
      };

      progressList.forEach((progress: LearningProgress) => {
        if (progress.masteryLevel === 'dont_know') {
          masteryBreakdown.dontKnow++;
        } else if (progress.masteryLevel === 'unsure') {
          masteryBreakdown.unsure++;
        } else if (progress.masteryLevel === 'know_it') {
          masteryBreakdown.knowIt++;
        }
      });

      // Calculate total reviews
      const totalReviews = progressList.reduce(
        (sum: number, progress: LearningProgress) => sum + progress.reviewCount,
        0
      );

      // Calculate days active (days since start date)
      const startDate = userProfile?.startDate
        ? new Date(userProfile.startDate)
        : new Date();
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate learning velocity (words per day)
      const learningVelocity =
        daysActive > 0 ? Number((totalWords / daysActive).toFixed(1)) : 0;

      setStats({
        totalWordsLearned: totalWords,
        masteryBreakdown,
        testHistory: testScores.slice(0, 10), // Last 10 tests
        testAccuracy: accuracy,
        streakDays: statistics?.streakDays ?? [],
        currentStreak: userProfile?.streak ?? 0,
        maxStreak: userProfile?.maxStreak ?? 0,
        statistics,
        wordLists,
        learningVelocity,
        totalReviews,
        daysActive,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const refresh = async () => {
    await loadStats();
  };

  return {
    stats,
    loading,
    error,
    refresh,
  };
};
