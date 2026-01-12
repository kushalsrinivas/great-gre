import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import {
  insertWordList,
  insertWord,
  insertVocabulary,
  getWordLists,
} from './database';
import { Colors } from '../constants/theme';

interface GREWordListData {
  [listName: string]: Array<{
    word: string;
    Definition: string;
  }>;
}

interface VocabularyData {
  [word: string]: {
    'Short Explanation'?: string;
    'Long Explanation'?: string;
    Synonyms?: string;
    Definition: string;
  };
}

const LIST_COLORS: { [key: string]: string } = {
  'Manhattan GRE Complete': Colors.listColors.orange,
  'GRE Complete Vocabulary List': Colors.listColors.blue,
  "Barron's 333": Colors.listColors.blue,
  '900+ Essential GRE Words': Colors.listColors.purple,
  'Word Power Made Easy': Colors.listColors.green,
  'GRE101': Colors.listColors.pink,
  'High Frequency Words': Colors.listColors.yellow,
};

const LIST_DESCRIPTIONS: { [key: string]: string } = {
  'Manhattan GRE Complete': '500 Essential Words',
  'GRE Complete Vocabulary List': 'Complete GRE vocabulary',
  "Barron's 333": 'Targeting High-Frequency Words',
  '900+ Essential GRE Words': 'Essential vocabulary for GRE',
  'Word Power Made Easy': 'Build your word power',
  'GRE101': 'Foundational GRE words',
  'High Frequency Words': 'Most commonly tested words',
};

export const importWordLists = async (forceReimport: boolean = false): Promise<boolean> => {
  try {
    console.log('Starting word list import...');
    
    // Check if data already exists (unless force re-import is requested)
    if (!forceReimport) {
      const existingLists = await getWordLists();
      if (existingLists.length > 0) {
        console.log('Word lists already imported');
        return true;
      }
    }
    
    // Load GRE word lists
    const greWordListPath = `${FileSystem.documentDirectory}../../reference/GREWordList.json`;
    let greWordListData: GREWordListData;
    
    try {
      // Try to read from file system
      const greContent = await FileSystem.readAsStringAsync(
        '/Users/kushalsrinivas/apps/gre-pres/reference/GREWordList.json'
      );
      greWordListData = JSON.parse(greContent);
    } catch (error) {
      console.error('Error loading GREWordList.json:', error);
      // Use require as fallback
      greWordListData = require('../../reference/GREWordList.json');
    }
    
    // Import word lists and words
    let totalWordsImported = 0;
    
    for (const [listName, words] of Object.entries(greWordListData)) {
      console.log(`Importing list: ${listName} (${words.length} words)`);
      
      const color = LIST_COLORS[listName] || Colors.listColors.blue;
      const description = LIST_DESCRIPTIONS[listName] || '';
      
      const listId = await insertWordList(listName, color, description);
      
      // Import words for this list
      for (let i = 0; i < words.length; i++) {
        const wordEntry = words[i];
        await insertWord(
          wordEntry.word,
          wordEntry.Definition,
          listId,
          listName,
          i
        );
      }
      
      totalWordsImported += words.length;
    }
    
    console.log(`Imported ${totalWordsImported} words across ${Object.keys(greWordListData).length} lists`);
    
    // Load vocabulary details
    console.log('Importing vocabulary details...');
    let vocabularyData: VocabularyData;
    
    try {
      const vocabContent = await FileSystem.readAsStringAsync(
        '/Users/kushalsrinivas/apps/gre-pres/reference/vocabulary.json'
      );
      vocabularyData = JSON.parse(vocabContent);
    } catch (error) {
      console.error('Error loading vocabulary.json:', error);
      vocabularyData = require('../../reference/vocabulary.json');
    }
    
    let vocabEntriesImported = 0;
    for (const [word, details] of Object.entries(vocabularyData)) {
      await insertVocabulary({
        word,
        shortExplanation: details['Short Explanation'],
        longExplanation: details['Long Explanation'],
        synonyms: details.Synonyms,
        definition: details.Definition,
      });
      vocabEntriesImported++;
      
      // Log progress every 500 words
      if (vocabEntriesImported % 500 === 0) {
        console.log(`Imported ${vocabEntriesImported} vocabulary entries...`);
      }
    }
    
    console.log(`Imported ${vocabEntriesImported} vocabulary entries`);
    console.log('Data import completed successfully!');
    
    return true;
  } catch (error) {
    console.error('Error importing word lists:', error);
    return false;
  }
};

export const checkDataImportStatus = async (): Promise<boolean> => {
  try {
    const lists = await getWordLists();
    return lists.length > 0;
  } catch (error) {
    console.error('Error checking data import status:', error);
    return false;
  }
};

export const reimportWordLists = async (): Promise<boolean> => {
  try {
    console.log('Re-importing word lists...');
    
    // Get database instance
    const { getDatabase } = await import('./database');
    const db = getDatabase();
    
    // Clear existing word lists and words (but preserve user progress)
    await db.execAsync(`
      DELETE FROM words;
      DELETE FROM word_lists;
      DELETE FROM vocabulary;
    `);
    
    console.log('Cleared existing word data');
    
    // Re-import with force flag
    const success = await importWordLists(true);
    
    if (success) {
      console.log('Word lists re-imported successfully');
    }
    
    return success;
  } catch (error) {
    console.error('Error re-importing word lists:', error);
    return false;
  }
};
