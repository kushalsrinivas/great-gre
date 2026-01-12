import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { WeaknessAnalysis } from '@/lib/types';

interface WeaknessAnalysisCardProps {
  weaknessAnalysis: WeaknessAnalysis;
  onWordPress?: (wordId: number) => void;
}

export const WeaknessAnalysisCard = ({
  weaknessAnalysis,
  onWordPress,
}: WeaknessAnalysisCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weakness Analysis</Text>
        <Text style={styles.subtitle}>Areas that need attention</Text>
      </View>

      {/* Hardest Words */}
      {weaknessAnalysis.hardestWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Hardest Words</Text>
          <Text style={styles.sectionDescription}>
            Words requiring the most reviews
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.wordScroll}
            contentContainerStyle={styles.wordScrollContent}
          >
            {weaknessAnalysis.hardestWords.map((word) => (
              <TouchableOpacity
                key={word.wordId}
                style={styles.wordChip}
                onPress={() => onWordPress?.(word.wordId)}
              >
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.reviewCountText}>
                  {word.reviewCount} reviews
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Weak Lists */}
      {weaknessAnalysis.weakLists.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Lists Needing Attention</Text>
          <Text style={styles.sectionDescription}>
            Lists with lowest mastery percentage
          </Text>
          <View style={styles.listContainer}>
            {weaknessAnalysis.weakLists.map((list) => (
              <View key={list.listId} style={styles.listItem}>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{list.listName}</Text>
                  <Text style={styles.listProgress}>
                    {list.learnedWords}/{list.totalWords} words
                  </Text>
                </View>
                <View style={styles.percentageContainer}>
                  <Text
                    style={[
                      styles.percentageText,
                      {
                        color:
                          list.masteryPercentage < 30
                            ? Colors.danger
                            : list.masteryPercentage < 60
                            ? Colors.warning
                            : Colors.success,
                      },
                    ]}
                  >
                    {list.masteryPercentage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Neglected Words */}
      {weaknessAnalysis.neglectedWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Neglected Words</Text>
          <Text style={styles.sectionDescription}>
            Learned but not reviewed in 21+ days
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.wordScroll}
            contentContainerStyle={styles.wordScrollContent}
          >
            {weaknessAnalysis.neglectedWords.slice(0, 10).map((word) => (
              <TouchableOpacity
                key={word.wordId}
                style={[styles.wordChip, { borderColor: Colors.danger }]}
                onPress={() => onWordPress?.(word.wordId)}
              >
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.neglectedDaysText}>
                  {word.daysSinceReview} days ago
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  wordScroll: {
    marginHorizontal: -Spacing.lg,
  },
  wordScrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  wordChip: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 100,
  },
  wordText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reviewCountText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  neglectedDaysText: {
    fontSize: Typography.xs,
    color: Colors.danger,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  listProgress: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  percentageContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
});
