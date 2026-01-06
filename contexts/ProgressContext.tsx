import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LearningSession, Word, VocabularyEntry } from '@/lib/types';
import {
  getWordsByListName,
  saveLearningProgress,
  getVocabularyEntry,
  getTotalWordsLearned,
} from '@/lib/storage/database';
import { shuffleArray } from '@/lib/utils';

interface ProgressContextType {
  currentSession: LearningSession | null;
  startSession: (
    listName: string,
    wordCount: number,
    order: 'random' | 'serial',
    startIndex?: number
  ) => Promise<void>;
  answerWord: (masteryLevel: 'dont_know' | 'unsure' | 'know_it') => Promise<void>;
  getCurrentWord: () => Word | null;
  getCurrentVocabulary: () => Promise<VocabularyEntry | null>;
  endSession: () => void;
  isSessionActive: boolean;
  totalWordsLearned: number;
  refreshTotalWordsLearned: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [totalWordsLearned, setTotalWordsLearned] = useState(0);

  const startSession = async (
    listName: string,
    wordCount: number,
    order: 'random' | 'serial',
    startIndex: number = 0
  ) => {
    try {
      // Fetch words from the list
      const allWords = await getWordsByListName(listName);
      
      let selectedWords: Word[];
      
      if (order === 'random') {
        // Randomly select words
        selectedWords = shuffleArray(allWords).slice(0, wordCount);
      } else {
        // Serial order
        selectedWords = allWords.slice(startIndex, startIndex + wordCount);
      }
      
      // Create session
      const session: LearningSession = {
        listId: selectedWords[0]?.listName ? 0 : 0, // Will be set properly when fetching
        listName,
        words: selectedWords,
        currentIndex: 0,
        totalWords: selectedWords.length,
        startTime: Date.now(),
        results: {
          dontKnow: 0,
          unsure: 0,
          knowIt: 0,
        },
        sessionSettings: {
          wordCount,
          order,
          startIndex,
        },
      };
      
      setCurrentSession(session);
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  };

  const answerWord = async (masteryLevel: 'dont_know' | 'unsure' | 'know_it') => {
    if (!currentSession) return;
    
    const currentWord = currentSession.words[currentSession.currentIndex];
    
    // Save progress
    await saveLearningProgress(currentWord.id, currentWord.word, masteryLevel);
    
    // Update results
    const updatedResults = { ...currentSession.results };
    if (masteryLevel === 'dont_know') updatedResults.dontKnow++;
    else if (masteryLevel === 'unsure') updatedResults.unsure++;
    else if (masteryLevel === 'know_it') updatedResults.knowIt++;
    
    // Move to next word
    const nextIndex = currentSession.currentIndex + 1;
    
    setCurrentSession({
      ...currentSession,
      currentIndex: nextIndex,
      results: updatedResults,
    });
  };

  const getCurrentWord = (): Word | null => {
    if (!currentSession || currentSession.currentIndex >= currentSession.totalWords) {
      return null;
    }
    return currentSession.words[currentSession.currentIndex];
  };

  const getCurrentVocabulary = async (): Promise<VocabularyEntry | null> => {
    const currentWord = getCurrentWord();
    if (!currentWord) return null;
    
    return await getVocabularyEntry(currentWord.word);
  };

  const endSession = () => {
    setCurrentSession(null);
  };

  const refreshTotalWordsLearned = async () => {
    const total = await getTotalWordsLearned();
    setTotalWordsLearned(total);
  };

  return (
    <ProgressContext.Provider
      value={{
        currentSession,
        startSession,
        answerWord,
        getCurrentWord,
        getCurrentVocabulary,
        endSession,
        isSessionActive: currentSession !== null,
        totalWordsLearned,
        refreshTotalWordsLearned,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

