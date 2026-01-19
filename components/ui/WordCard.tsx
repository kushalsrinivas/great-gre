import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';
import { VocabularyEntry } from '@/lib/types';

interface WordCardProps {
  word: string;
  definition: string;
  vocabularyEntry?: VocabularyEntry | null;
  partOfSpeech?: string;
  pronunciation?: string;
  example?: string;
  showBookmark?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  hideDefinition?: boolean;
  onRevealDefinition?: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  definition,
  vocabularyEntry,
  partOfSpeech,
  pronunciation,
  example,
  showBookmark = true,
  onBookmark,
  isBookmarked = false,
  hideDefinition = false,
  onRevealDefinition,
}) => {
  // Generate example if not provided
  const displayExample =
    example ||
    vocabularyEntry?.longExplanation?.split('.')[0] ||
    `Example usage of "${word}" in a sentence.`;

  return (
    <View style={styles.card}>
      {showBookmark && (
        <TouchableOpacity style={styles.bookmarkButton} onPress={onBookmark}>
          <IconSymbol 
            name={isBookmarked ? 'pin.fill' : 'bookmark'} 
            size={24} 
            color={isBookmarked ? Colors.primary : Colors.textSecondary} 
          />
        </TouchableOpacity>
      )}

      {partOfSpeech && (
        <View style={styles.partOfSpeechBadge}>
          <Text style={styles.partOfSpeechText}>{partOfSpeech.toUpperCase()}</Text>
        </View>
      )}

      <Text style={styles.word}>{word.toUpperCase()}</Text>

      {pronunciation && (
        <View style={styles.pronunciationContainer}>
          <IconSymbol name="speaker.wave.2.fill" size={20} color={Colors.primary} />
          <Text style={styles.pronunciation}>/{pronunciation}/</Text>
        </View>
      )}

      {hideDefinition ? (
        <View style={styles.hiddenDefinitionContainer}>
          <Text style={styles.hiddenDefinitionText}>
            Try to recall the definition before revealing
          </Text>
          <TouchableOpacity style={styles.revealButton} onPress={onRevealDefinition}>
            <Text style={styles.revealButtonText}>REVEAL DEFINITION</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>DEFINITION</Text>
          </View>

          <Text style={styles.definition}>{definition}</Text>

          {vocabularyEntry?.shortExplanation && (
            <Text style={styles.explanation}>{vocabularyEntry.shortExplanation}</Text>
          )}

          {displayExample && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>EXAMPLE</Text>
              <Text style={styles.exampleText}>
                {/* Highlight the word in the example */}
                {displayExample.split(new RegExp(`(${word})`, 'gi')).map((part, index) =>
                  part.toLowerCase() === word.toLowerCase() ? (
                    <Text key={index} style={styles.highlightedWord}>
                      {part}
                    </Text>
                  ) : (
                    <Text key={index}>{part}</Text>
                  )
                )}
              </Text>
            </View>
          )}

          {vocabularyEntry?.synonyms && (
            <View style={styles.synonymsContainer}>
              <Text style={styles.synonymsLabel}>SYNONYMS</Text>
              <Text style={styles.synonymsText}>{vocabularyEntry.synonyms}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing['3xl'],
    marginHorizontal: Spacing.lg,
    position: 'relative',
  },
  bookmarkButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    padding: Spacing.sm,
    zIndex: 1,
  },
  partOfSpeechBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBackgroundLight,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  partOfSpeechText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  word: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  pronunciation: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  divider: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    marginVertical: Spacing.md,
  },
  dividerText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  definition: {
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  explanation: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  exampleContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: Spacing.lg,
    marginTop: Spacing.lg,
  },
  exampleLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  exampleText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  highlightedWord: {
    color: Colors.primary,
    fontWeight: Typography.bold,
    fontStyle: 'normal',
  },
  synonymsContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
  },
  synonymsLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  synonymsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  hiddenDefinitionContainer: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
    gap: Spacing.xl,
  },
  hiddenDefinitionText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  revealButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.md,
  },
  revealButtonText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.background,
    letterSpacing: 1,
  },
});

