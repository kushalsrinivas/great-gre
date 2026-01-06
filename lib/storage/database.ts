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

