import * as SQLite from 'expo-sqlite';
import { Word, VocabularyEntry, WordList, LearningProgress, TestScore } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

// Initialize database
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('gre_vocabulary.db');
    
    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS word_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT NOT NULL,
        total_words INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        definition TEXT NOT NULL,
        list_id INTEGER NOT NULL,
        list_name TEXT NOT NULL,
        word_index INTEGER DEFAULT 0,
        FOREIGN KEY (list_id) REFERENCES word_lists(id) ON DELETE CASCADE,
        UNIQUE(word, list_id)
      );
      
      CREATE TABLE IF NOT EXISTS vocabulary (
        word TEXT PRIMARY KEY,
        short_explanation TEXT,
        long_explanation TEXT,
        synonyms TEXT,
        definition TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS learning_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        word TEXT NOT NULL,
        mastery_level TEXT NOT NULL CHECK(mastery_level IN ('dont_know', 'unsure', 'know_it')),
        last_reviewed TEXT NOT NULL,
        review_count INTEGER DEFAULT 1,
        is_bookmarked INTEGER DEFAULT 0,
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
        UNIQUE(word_id)
      );
      
      CREATE TABLE IF NOT EXISTS test_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_type TEXT NOT NULL,
        score TEXT NOT NULL,
        time_taken TEXT NOT NULL,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_words_list ON words(list_id);
      CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
      CREATE INDEX IF NOT EXISTS idx_progress_word ON learning_progress(word_id);
      CREATE INDEX IF NOT EXISTS idx_progress_mastery ON learning_progress(mastery_level);
    `);
    
    // Migration: Add is_bookmarked column if it doesn't exist
    try {
      const tableInfo = await db.getAllAsync<any>('PRAGMA table_info(learning_progress)');
      const hasBookmarkColumn = tableInfo.some((col: any) => col.name === 'is_bookmarked');
      
      if (!hasBookmarkColumn) {
        console.log('Adding is_bookmarked column to learning_progress table...');
        await db.execAsync('ALTER TABLE learning_progress ADD COLUMN is_bookmarked INTEGER DEFAULT 0');
        console.log('Migration completed: is_bookmarked column added');
      }
    } catch (migrationError) {
      console.error('Migration error:', migrationError);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Word Lists Operations
export const insertWordList = async (
  name: string,
  color: string,
  description?: string
): Promise<number> => {
  const database = getDatabase();
  const result = await database.runAsync(
    'INSERT OR IGNORE INTO word_lists (name, color, description) VALUES (?, ?, ?)',
    [name, color, description || '']
  );
  return result.lastInsertRowId;
};

export const getWordLists = async (): Promise<WordList[]> => {
  const database = getDatabase();
  const lists = await database.getAllAsync<any>(
    'SELECT * FROM word_lists ORDER BY name'
  );
  
  const wordListsWithProgress = await Promise.all(
    lists.map(async (list) => {
      const totalWords = await database.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM words WHERE list_id = ?',
        [list.id]
      );
      
      const learnedWords = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(DISTINCT lp.word_id) as count 
         FROM learning_progress lp 
         INNER JOIN words w ON lp.word_id = w.id 
         WHERE w.list_id = ? AND lp.mastery_level = 'know_it'`,
        [list.id]
      );
      
      const total = totalWords?.count ?? 0;
      const learned = learnedWords?.count ?? 0;
      const masteryPercentage = total > 0 ? Math.round((learned / total) * 100) : 0;
      
      return {
        id: list.id,
        name: list.name,
        description: list.description,
        color: list.color,
        totalWords: total,
        learnedWords: learned,
        masteryPercentage,
      };
    })
  );
  
  return wordListsWithProgress;
};

export const getWordListByName = async (name: string): Promise<WordList | null> => {
  const database = getDatabase();
  const list = await database.getFirstAsync<any>(
    'SELECT * FROM word_lists WHERE name = ?',
    [name]
  );
  
  if (!list) return null;
  
  const totalWords = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM words WHERE list_id = ?',
    [list.id]
  );
  
  const learnedWords = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(DISTINCT lp.word_id) as count 
     FROM learning_progress lp 
     INNER JOIN words w ON lp.word_id = w.id 
     WHERE w.list_id = ? AND lp.mastery_level = 'know_it'`,
    [list.id]
  );
  
  const total = totalWords?.count ?? 0;
  const learned = learnedWords?.count ?? 0;
  const masteryPercentage = total > 0 ? Math.round((learned / total) * 100) : 0;
  
  return {
    id: list.id,
    name: list.name,
    description: list.description,
    color: list.color,
    totalWords: total,
    learnedWords: learned,
    masteryPercentage,
  };
};

// Words Operations
export const insertWord = async (
  word: string,
  definition: string,
  listId: number,
  listName: string,
  wordIndex: number = 0
): Promise<number> => {
  const database = getDatabase();
  const result = await database.runAsync(
    'INSERT OR IGNORE INTO words (word, definition, list_id, list_name, word_index) VALUES (?, ?, ?, ?, ?)',
    [word, definition, listId, listName, wordIndex]
  );
  return result.lastInsertRowId;
};

export const getWordsByList = async (
  listId: number,
  limit?: number,
  offset?: number
): Promise<Word[]> => {
  const database = getDatabase();
  let query = 'SELECT * FROM words WHERE list_id = ? ORDER BY word_index';
  const params: any[] = [listId];
  
  if (limit) {
    query += ' LIMIT ?';
    params.push(limit);
    
    if (offset) {
      query += ' OFFSET ?';
      params.push(offset);
    }
  }
  
  const words = await database.getAllAsync<Word>(query, params);
  return words;
};

export const getWordsByListName = async (
  listName: string,
  limit?: number,
  offset?: number
): Promise<Word[]> => {
  const database = getDatabase();
  let query = 'SELECT * FROM words WHERE list_name = ? ORDER BY word_index';
  const params: any[] = [listName];
  
  if (limit) {
    query += ' LIMIT ?';
    params.push(limit);
    
    if (offset) {
      query += ' OFFSET ?';
      params.push(offset);
    }
  }
  
  const words = await database.getAllAsync<Word>(query, params);
  return words;
};

export const searchWords = async (searchTerm: string): Promise<Word[]> => {
  const database = getDatabase();
  const words = await database.getAllAsync<Word>(
    'SELECT * FROM words WHERE word LIKE ? LIMIT 50',
    [`%${searchTerm}%`]
  );
  return words;
};

// Vocabulary Operations
export const insertVocabulary = async (entry: VocabularyEntry): Promise<void> => {
  const database = getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO vocabulary (word, short_explanation, long_explanation, synonyms, definition) VALUES (?, ?, ?, ?, ?)',
    [
      entry.word,
      entry.shortExplanation || '',
      entry.longExplanation || '',
      entry.synonyms || '',
      entry.definition,
    ]
  );
};

export const getVocabularyEntry = async (word: string): Promise<VocabularyEntry | null> => {
  const database = getDatabase();
  const entry = await database.getFirstAsync<any>(
    'SELECT * FROM vocabulary WHERE word = ?',
    [word]
  );
  
  if (!entry) return null;
  
  return {
    word: entry.word,
    shortExplanation: entry.short_explanation,
    longExplanation: entry.long_explanation,
    synonyms: entry.synonyms,
    definition: entry.definition,
  };
};

// Learning Progress Operations
export const saveLearningProgress = async (
  wordId: number,
  word: string,
  masteryLevel: 'dont_know' | 'unsure' | 'know_it'
): Promise<void> => {
  const database = getDatabase();
  const now = new Date().toISOString();
  
  const existing = await database.getFirstAsync<any>(
    'SELECT * FROM learning_progress WHERE word_id = ?',
    [wordId]
  );
  
  if (existing) {
    await database.runAsync(
      'UPDATE learning_progress SET mastery_level = ?, last_reviewed = ?, review_count = review_count + 1 WHERE word_id = ?',
      [masteryLevel, now, wordId]
    );
  } else {
    await database.runAsync(
      'INSERT INTO learning_progress (word_id, word, mastery_level, last_reviewed, review_count) VALUES (?, ?, ?, ?, ?)',
      [wordId, word, masteryLevel, now, 1]
    );
  }
};

export const getLearningProgress = async (wordId: number): Promise<LearningProgress | null> => {
  const database = getDatabase();
  const progress = await database.getFirstAsync<any>(
    'SELECT * FROM learning_progress WHERE word_id = ?',
    [wordId]
  );
  
  if (!progress) return null;
  
  return {
    id: progress.id,
    wordId: progress.word_id,
    word: progress.word,
    masteryLevel: progress.mastery_level,
    lastReviewed: progress.last_reviewed,
    reviewCount: progress.review_count,
    isBookmarked: progress.is_bookmarked === 1,
  };
};

export const getAllLearningProgress = async (): Promise<LearningProgress[]> => {
  const database = getDatabase();
  const progressList = await database.getAllAsync<any>(
    'SELECT * FROM learning_progress ORDER BY last_reviewed DESC'
  );
  
  return progressList.map((p) => ({
    id: p.id,
    wordId: p.word_id,
    word: p.word,
    masteryLevel: p.mastery_level,
    lastReviewed: p.last_reviewed,
    reviewCount: p.review_count,
    isBookmarked: p.is_bookmarked === 1,
  }));
};

export const getLearnedWordsByList = async (listId: number): Promise<Word[]> => {
  const database = getDatabase();
  const words = await database.getAllAsync<Word>(
    `SELECT w.* FROM words w
     INNER JOIN learning_progress lp ON w.id = lp.word_id
     WHERE w.list_id = ? AND lp.mastery_level = 'know_it'
     ORDER BY lp.last_reviewed DESC`,
    [listId]
  );
  return words;
};

export const getWordsToReview = async (limit: number = 15): Promise<Word[]> => {
  const database = getDatabase();
  const words = await database.getAllAsync<Word>(
    `SELECT w.* FROM words w
     INNER JOIN learning_progress lp ON w.id = lp.word_id
     WHERE lp.mastery_level IN ('dont_know', 'unsure')
     ORDER BY lp.last_reviewed ASC
     LIMIT ?`,
    [limit]
  );
  return words;
};

// Test Scores Operations
export const saveTestScore = async (score: TestScore): Promise<void> => {
  const database = getDatabase();
  await database.runAsync(
    'INSERT INTO test_scores (test_type, score, time_taken, date, timestamp) VALUES (?, ?, ?, ?, ?)',
    [score.testType, score.score, score.timeTaken, score.date, score.timestamp]
  );
};

export const getTestScores = async (): Promise<TestScore[]> => {
  const database = getDatabase();
  const scores = await database.getAllAsync<any>(
    'SELECT * FROM test_scores ORDER BY timestamp DESC'
  );
  
  return scores.map((s) => ({
    id: s.id,
    testType: s.test_type,
    score: s.score,
    timeTaken: s.time_taken,
    date: s.date,
    timestamp: s.timestamp,
  }));
};

// Statistics
export const getTotalWordsLearned = async (): Promise<number> => {
  const database = getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM learning_progress WHERE mastery_level = 'know_it'"
  );
  return result?.count ?? 0;
};

export const getTodayWordsLearned = async (): Promise<number> => {
  const database = getDatabase();
  const today = new Date().toISOString().split('T')[0];
  const result = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM learning_progress WHERE DATE(last_reviewed) = ? AND mastery_level = 'know_it'",
    [today]
  );
  return result?.count ?? 0;
};

// Testing Center Helpers
export const getRandomWordsForTest = async (
  count: number,
  excludeLearned: boolean = false
): Promise<Word[]> => {
  const database = getDatabase();
  let query = 'SELECT * FROM words';
  
  if (excludeLearned) {
    query += ` WHERE id NOT IN (
      SELECT word_id FROM learning_progress WHERE mastery_level = 'know_it'
    )`;
  }
  
  query += ' ORDER BY RANDOM() LIMIT ?';
  
  const words = await database.getAllAsync<Word>(query, [count]);
  return words;
};

export const getLearnedWordsForTest = async (count: number): Promise<Word[]> => {
  const database = getDatabase();
  const words = await database.getAllAsync<Word>(
    `SELECT w.* FROM words w
     INNER JOIN learning_progress lp ON w.id = lp.word_id
     WHERE lp.mastery_level = 'know_it'
     ORDER BY RANDOM()
     LIMIT ?`,
    [count]
  );
  return words;
};

export const getRandomDefinitions = async (
  excludeWord: string,
  count: number
): Promise<string[]> => {
  const database = getDatabase();
  const results = await database.getAllAsync<{ definition: string }>(
    'SELECT DISTINCT definition FROM words WHERE word != ? ORDER BY RANDOM() LIMIT ?',
    [excludeWord, count]
  );
  return results.map((r) => r.definition);
};

export const getTestAccuracy = async (): Promise<number> => {
  const database = getDatabase();
  const scores = await getTestScores();
  
  if (scores.length === 0) return 0;
  
  // Calculate average from recent 10 tests
  const recentScores = scores.slice(0, 10);
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  recentScores.forEach((score) => {
    const [correct, total] = score.score.split('/').map(Number);
    totalCorrect += correct;
    totalQuestions += total;
  });
  
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
};

// Bookmarking Operations
export const toggleBookmark = async (wordId: number, word: string): Promise<boolean> => {
  const database = getDatabase();
  
  // Check if progress entry exists
  const existing = await database.getFirstAsync<any>(
    'SELECT * FROM learning_progress WHERE word_id = ?',
    [wordId]
  );
  
  if (existing) {
    // Toggle bookmark
    const newBookmarkState = existing.is_bookmarked === 1 ? 0 : 1;
    await database.runAsync(
      'UPDATE learning_progress SET is_bookmarked = ? WHERE word_id = ?',
      [newBookmarkState, wordId]
    );
    return newBookmarkState === 1;
  } else {
    // Create new entry with bookmark
    const now = new Date().toISOString();
    await database.runAsync(
      'INSERT INTO learning_progress (word_id, word, mastery_level, last_reviewed, review_count, is_bookmarked) VALUES (?, ?, ?, ?, ?, ?)',
      [wordId, word, 'dont_know', now, 0, 1]
    );
    return true;
  }
};

export const getBookmarkedWords = async (): Promise<LearningProgress[]> => {
  const database = getDatabase();
  const bookmarked = await database.getAllAsync<any>(
    'SELECT * FROM learning_progress WHERE is_bookmarked = 1 ORDER BY last_reviewed DESC'
  );
  
  return bookmarked.map((p) => ({
    id: p.id,
    wordId: p.word_id,
    word: p.word,
    masteryLevel: p.mastery_level,
    lastReviewed: p.last_reviewed,
    reviewCount: p.review_count,
    isBookmarked: true,
  }));
};

export const isWordBookmarked = async (wordId: number): Promise<boolean> => {
  const database = getDatabase();
  const result = await database.getFirstAsync<any>(
    'SELECT is_bookmarked FROM learning_progress WHERE word_id = ?',
    [wordId]
  );
  return result?.is_bookmarked === 1;
};

// Advanced Statistics Functions

// Get words at risk of being forgotten
export const getForgettingRiskWords = async (): Promise<any[]> => {
  const database = getDatabase();
  const now = new Date();
  
  const words = await database.getAllAsync<any>(
    `SELECT lp.*, w.word 
     FROM learning_progress lp
     INNER JOIN words w ON lp.word_id = w.id
     WHERE lp.mastery_level IN ('unsure', 'know_it')
     ORDER BY lp.last_reviewed ASC`
  );
  
  return words.map((word) => {
    const lastReviewed = new Date(word.last_reviewed);
    const daysSinceReview = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
    
    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (daysSinceReview >= 14) riskLevel = 'high';
    else if (daysSinceReview >= 7) riskLevel = 'medium';
    
    return {
      word: word.word,
      wordId: word.word_id,
      daysSinceReview,
      riskLevel,
      lastReviewed: word.last_reviewed,
      masteryLevel: word.mastery_level,
    };
  });
};

// Get words reviewed in the last N days
export const getWordsReviewedInLastNDays = async (days: number): Promise<number> => {
  const database = getDatabase();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const result = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count 
     FROM learning_progress 
     WHERE DATE(last_reviewed) >= DATE(?)`,
    [cutoffDate.toISOString()]
  );
  
  return result?.count ?? 0;
};

// Get hardest words (most reviews but not mastered)
export const getHardestWords = async (limit: number = 10): Promise<any[]> => {
  const database = getDatabase();
  
  const words = await database.getAllAsync<any>(
    `SELECT lp.word_id as wordId, lp.word, lp.review_count as reviewCount, lp.mastery_level as masteryLevel
     FROM learning_progress lp
     WHERE lp.mastery_level != 'know_it'
     ORDER BY lp.review_count DESC
     LIMIT ?`,
    [limit]
  );
  
  return words;
};

// Get lists with lowest mastery percentage
export const getWeakestLists = async (limit: number = 5): Promise<any[]> => {
  const database = getDatabase();
  
  const lists = await database.getAllAsync<any>(
    'SELECT id, name FROM word_lists'
  );
  
  const listsWithProgress = await Promise.all(
    lists.map(async (list) => {
      const totalWords = await database.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM words WHERE list_id = ?',
        [list.id]
      );
      
      const learnedWords = await database.getFirstAsync<{ count: number }>(
        `SELECT COUNT(DISTINCT lp.word_id) as count 
         FROM learning_progress lp 
         INNER JOIN words w ON lp.word_id = w.id 
         WHERE w.list_id = ? AND lp.mastery_level = 'know_it'`,
        [list.id]
      );
      
      const total = totalWords?.count ?? 0;
      const learned = learnedWords?.count ?? 0;
      const masteryPercentage = total > 0 ? Math.round((learned / total) * 100) : 0;
      
      return {
        listId: list.id,
        listName: list.name,
        totalWords: total,
        learnedWords: learned,
        masteryPercentage,
      };
    })
  );
  
  return listsWithProgress
    .filter(list => list.totalWords > 0)
    .sort((a, b) => a.masteryPercentage - b.masteryPercentage)
    .slice(0, limit);
};

// Get neglected words (learned but not reviewed in 21+ days)
export const getNeglectedWords = async (limit: number = 20): Promise<any[]> => {
  const database = getDatabase();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 21);
  
  const words = await database.getAllAsync<any>(
    `SELECT lp.word_id as wordId, lp.word, lp.last_reviewed as lastReviewed
     FROM learning_progress lp
     WHERE lp.mastery_level = 'know_it' 
     AND DATE(lp.last_reviewed) < DATE(?)
     ORDER BY lp.last_reviewed ASC
     LIMIT ?`,
    [cutoffDate.toISOString(), limit]
  );
  
  const now = new Date();
  return words.map((word) => {
    const lastReviewed = new Date(word.lastReviewed);
    const daysSinceReview = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...word,
      daysSinceReview,
    };
  });
};

// Get average reviews needed to master a word
export const getAverageReviewsToMaster = async (): Promise<number> => {
  const database = getDatabase();
  
  const result = await database.getFirstAsync<{ avgReviews: number }>(
    `SELECT AVG(review_count) as avgReviews
     FROM learning_progress
     WHERE mastery_level = 'know_it'`
  );
  
  return Math.round(result?.avgReviews ?? 0);
};

// Get learning activity by day of week
export const getLearningActivityByDay = async (): Promise<any[]> => {
  const database = getDatabase();
  
  const activities = await database.getAllAsync<any>(
    `SELECT last_reviewed FROM learning_progress`
  );
  
  const dayCount: { [key: string]: number } = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  
  activities.forEach((activity) => {
    const date = new Date(activity.last_reviewed);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    dayCount[dayName] = (dayCount[dayName] || 0) + 1;
  });
  
  const total = Object.values(dayCount).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(dayCount).map(([day, count]) => ({
    day,
    wordCount: count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  })).sort((a, b) => b.wordCount - a.wordCount);
};

// Get bookmark effectiveness metrics
export const getBookmarkEffectiveness = async (): Promise<any> => {
  const database = getDatabase();
  
  const totalBookmarked = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM learning_progress WHERE is_bookmarked = 1'
  );
  
  const bookmarkedMastered = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM learning_progress 
     WHERE is_bookmarked = 1 AND mastery_level = 'know_it'`
  );
  
  const total = totalBookmarked?.count ?? 0;
  const mastered = bookmarkedMastered?.count ?? 0;
  
  const effectivenessPercentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
  
  let insight = '';
  if (effectivenessPercentage >= 60) {
    insight = 'Bookmarked words are mastered faster! Your bookmarking strategy is working well.';
  } else if (effectivenessPercentage >= 30) {
    insight = 'Bookmarks are moderately effective. Try reviewing bookmarked words more frequently.';
  } else if (total > 0) {
    insight = 'Bookmarks need more attention. Consider reviewing them in dedicated sessions.';
  } else {
    insight = 'Start bookmarking challenging words to track them more effectively.';
  }
  
  return {
    totalBookmarked: total,
    bookmarkedMastered: mastered,
    effectivenessPercentage,
    insight,
  };
};

// Get active days in last N days
export const getActiveDaysInLastNDays = async (days: number = 30): Promise<number> => {
  const database = getDatabase();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const result = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(DISTINCT DATE(last_reviewed)) as count
     FROM learning_progress
     WHERE DATE(last_reviewed) >= DATE(?)`,
    [cutoffDate.toISOString()]
  );
  
  return result?.count ?? 0;
};

// Get total words available across all lists
export const getTotalWordsAvailable = async (): Promise<number> => {
  const database = getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM words'
  );
  return result?.count ?? 0;
};
