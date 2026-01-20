// Core data types for the GRE Vocabulary App

export interface Word {
  id: number;
  word: string;
  definition: string;
  listName: string;
}

export interface VocabularyEntry {
  word: string;
  shortExplanation?: string;
  longExplanation?: string;
  synonyms?: string;
  definition: string;
}

export interface WordList {
  id: number;
  name: string;
  description?: string;
  color: string;
  totalWords: number;
  learnedWords: number;
  masteryPercentage: number;
}

export interface LearningProgress {
  id?: number;
  wordId: number;
  word: string;
  masteryLevel: 'dont_know' | 'unsure' | 'know_it';
  lastReviewed: string; // ISO date string
  reviewCount: number;
  isBookmarked?: boolean;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  startDate: string; // ISO date string
  dailyGoal: number;
  streak: number;
  maxStreak: number;
  gems: number;
  lastActiveDate: string; // ISO date string
  onboardingCompleted: boolean;
  learningVibe?: 'chill' | 'intense';
  greTestDate?: string; // ISO date string
}

export interface DailyProgress {
  date: string; // ISO date string
  wordsLearned: number;
  goalMet: boolean;
}

export interface Statistics {
  streakDays: number[]; // Array of day numbers in current month
  totalWordsLearned: number;
  averageSessionTime: number; // in seconds
  longestStreak: number;
}

export interface TestScore {
  id?: number;
  testType: string;
  score: string; // "X/Y" format
  timeTaken: string; // "HH:MM:SS" format
  date: string; // ISO date string
  timestamp: string; // Full timestamp
}

export interface LearningSession {
  listId: number;
  listName: string;
  words: Word[];
  currentIndex: number;
  totalWords: number;
  startTime: number;
  mode: 'learn' | 'review';
  results: {
    dontKnow: number;
    unsure: number;
    knowIt: number;
  };
  sessionSettings: {
    wordCount: number;
    order: 'random' | 'serial';
    startIndex?: number;
  };
}

export interface SessionSummary {
  listName: string;
  totalWords: number;
  timeTaken: string;
  results: {
    dontKnow: number;
    unsure: number;
    knowIt: number;
  };
  wordsReviewed: {
    word: string;
    definition: string;
    masteryLevel: 'dont_know' | 'unsure' | 'know_it';
  }[];
}

// Advanced Statistics Types
export interface ForgettingRiskWord {
  word: string;
  wordId: number;
  daysSinceReview: number;
  riskLevel: 'high' | 'medium' | 'low';
  lastReviewed: string;
  masteryLevel: 'dont_know' | 'unsure' | 'know_it';
}

export interface RetentionHealth {
  score: number; // 0-100
  status: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  wordsReviewedLast7Days: number;
  wordsReviewedLast14Days: number;
  totalLearnedWords: number;
}

export interface LearningEfficiency {
  reviewsPerLearnedWord: number;
  masteryConversionFunnel: {
    dontKnow: number;
    unsure: number;
    knowIt: number;
  };
  averageReviewsToMaster: number;
}

export interface GREReadiness {
  score: number; // 0-100
  status: 'Exam Ready' | 'On Track' | 'Needs Work' | 'Just Starting';
  vocabularyCoverage: number; // percentage
  retentionScore: number;
  testAccuracy: number;
  consistencyScore: number;
}

export interface WeaknessAnalysis {
  hardestWords: {
    word: string;
    wordId: number;
    reviewCount: number;
    masteryLevel: 'dont_know' | 'unsure' | 'know_it';
  }[];
  weakLists: {
    listName: string;
    listId: number;
    masteryPercentage: number;
    totalWords: number;
    learnedWords: number;
  }[];
  neglectedWords: {
    word: string;
    wordId: number;
    daysSinceReview: number;
    lastReviewed: string;
  }[];
}

export interface ConsistencyMetrics {
  score: number; // 0-100
  activeDaysLast30: number;
  streakStability: number;
  bestLearningDays: {
    day: string; // 'Monday', 'Tuesday', etc.
    wordCount: number;
    percentage: number;
  }[];
}

export interface BookmarkEffectiveness {
  totalBookmarked: number;
  bookmarkedMastered: number;
  effectivenessPercentage: number;
  insight: string;
}

export interface ProgressQuality {
  learningDepth: number; // review_count / mastered_words
  speedVsStability: {
    category: 'Fast & Stable' | 'Fast & Fragile' | 'Slow & Stable' | 'Slow & Fragile';
    wordsPerDay: number;
    retentionRate: number;
  };
}

export interface MicroInsight {
  title: string;
  message: string;
  type: 'positive' | 'neutral' | 'suggestion';
  icon: string;
}

export interface AdvancedStats {
  forgettingRisk: {
    highRisk: ForgettingRiskWord[];
    mediumRisk: ForgettingRiskWord[];
    safeWords: number;
  };
  retentionHealth: RetentionHealth;
  learningEfficiency: LearningEfficiency;
  greReadiness: GREReadiness;
  weaknessAnalysis: WeaknessAnalysis;
  consistencyMetrics: ConsistencyMetrics;
  bookmarkEffectiveness: BookmarkEffectiveness;
  progressQuality: ProgressQuality;
  microInsights: MicroInsight[];
  accuracyVsTimeMetrics: {
    recentTests: {
      accuracy: number;
      timeTaken: number; // in seconds
      date: string;
    }[];
    trend: 'improving' | 'stable' | 'declining';
    insight: string;
  };
}

// GRE Verbal Practice Types
export interface GREPracticeSession {
  id: number;
  mode: string;
  questionTypes: string[];
  questionCount: number;
  startedAt: number; // epoch ms
  endedAt: number | null; // epoch ms
}

export interface GREQuestionAttempt {
  id?: number;
  sessionId: number | null;
  questionKey: string;
  questionType: string;
  questionText: string;
  explanationText: string;
  optionsJson: string;
  correctJson: string;
  selectedJson: string;
  isCorrect: boolean;
  timeMs: number;
  createdAt: number; // epoch ms
}

export interface GREPracticeStatsSummary {
  totalAttempts: number;
  accuracy: number; // 0-100
  byType: Array<{
    questionType: string;
    totalAttempts: number;
    accuracy: number; // 0-100
  }>;
  recent: Array<{
    isCorrect: boolean;
    timeMs: number;
    createdAt: number;
    questionType: string;
  }>;
  trend: 'improving' | 'stable' | 'declining';
}
