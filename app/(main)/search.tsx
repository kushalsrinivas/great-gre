import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Word } from '@/lib/types';
import { searchWords, getAllWords } from '@/lib/storage/database';

// Simple fuzzy search implementation
const fuzzySearch = (searchTerm: string, words: Word[]): Word[] => {
  if (!searchTerm.trim()) return [];
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Score each word based on matching quality
  const scoredWords = words.map(word => {
    const lowerWord = word.word.toLowerCase();
    let score = 0;
    
    // Exact match - highest priority
    if (lowerWord === lowerSearchTerm) {
      score = 1000;
    }
    // Starts with search term - high priority
    else if (lowerWord.startsWith(lowerSearchTerm)) {
      score = 500;
    }
    // Contains search term - medium priority
    else if (lowerWord.includes(lowerSearchTerm)) {
      score = 250;
    }
    // Fuzzy matching - check if all characters in search term appear in order
    else {
      let searchIndex = 0;
      let wordIndex = 0;
      let consecutiveMatches = 0;
      
      while (searchIndex < lowerSearchTerm.length && wordIndex < lowerWord.length) {
        if (lowerSearchTerm[searchIndex] === lowerWord[wordIndex]) {
          searchIndex++;
          consecutiveMatches++;
          score += consecutiveMatches * 2; // Bonus for consecutive matches
        } else {
          consecutiveMatches = 0;
        }
        wordIndex++;
      }
      
      // If we didn't match all characters, no match
      if (searchIndex < lowerSearchTerm.length) {
        score = 0;
      }
    }
    
    // Bonus for shorter words (more relevant)
    if (score > 0) {
      score += Math.max(0, 50 - word.word.length);
    }
    
    return { ...word, score };
  });
  
  // Filter out non-matches and sort by score
  return scoredWords
    .filter(w => w.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50); // Limit to top 50 results
};

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState('');
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load words on mount
  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setInitialLoad(true);
      // Load all words for fuzzy search (with a reasonable limit)
      const words = await getAllWords(2000);
      setAllWords(words);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setInitialLoad(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      
      // Use fuzzy search on all loaded words for better results
      const fuzzyResults = fuzzySearch(searchTerm, allWords);
      
      setSearchResults(fuzzyResults);
    } catch (error) {
      console.error('Error searching words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word: Word) => {
    // Navigate to learning session with this specific word
    // Or show word detail modal
    router.push({
      pathname: '/(main)/learning-session',
      params: { 
        listName: word.listName,
        startWord: word.word
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderWordItem = ({ item }: { item: Word }) => (
    <TouchableOpacity onPress={() => handleWordPress(item)} activeOpacity={0.7}>
      <Card style={styles.wordCard}>
        <View style={styles.wordContent}>
          <View style={styles.wordInfo}>
            <Text style={styles.wordText}>{item.word}</Text>
            <Text style={styles.definitionText} numberOfLines={2}>
              {item.definition}
            </Text>
            <Text style={styles.listNameText}>{item.listName}</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (initialLoad) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Loading words...</Text>
        </View>
      );
    }

    if (!searchTerm.trim()) {
      return (
        <View style={styles.emptyState}>
          <IconSymbol name="magnifyingglass" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>Search for GRE Words</Text>
          <Text style={styles.emptyText}>
            Type any word or partial word to find matching vocabulary
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Try searching:</Text>
            <View style={styles.exampleChips}>
              {['abate', 'benev', 'cogn', 'ephemeral'].map((example) => (
                <TouchableOpacity
                  key={example}
                  style={styles.exampleChip}
                  onPress={() => setSearchTerm(example)}
                >
                  <Text style={styles.exampleChipText}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <IconSymbol name="exclamationmark.magnifyingglass" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No words found</Text>
          <Text style={styles.emptyText}>
            Try a different search term or check your spelling
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for words..."
            placeholderTextColor={Colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results count */}
      {searchResults.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {searchResults.length} {searchResults.length === 1 ? 'word' : 'words'} found
          </Text>
        </View>
      )}

      {/* Results List */}
      <FlatList
        data={searchResults}
        renderItem={renderWordItem}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    padding: 0,
  },
  resultsHeader: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
  },
  resultsCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  listContent: {
    paddingHorizontal: Spacing['2xl'],
  },
  wordCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  wordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  definitionText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  listNameText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingTop: Spacing['4xl'],
    gap: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  examplesContainer: {
    marginTop: Spacing['2xl'],
    alignItems: 'center',
  },
  examplesTitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  exampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  exampleChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  exampleChipText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
});
