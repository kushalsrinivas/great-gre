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
  wordsReviewed: Array<{
    word: string;
    definition: string;
    masteryLevel: 'dont_know' | 'unsure' | 'know_it';
  }>;
}

