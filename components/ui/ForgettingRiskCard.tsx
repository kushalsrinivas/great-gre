import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { ForgettingRiskWord } from '@/lib/types';

interface ForgettingRiskCardProps {
  highRisk: ForgettingRiskWord[];
  mediumRisk: ForgettingRiskWord[];
  safeWords: number;
  onWordPress?: (wordId: number) => void;
}

export const ForgettingRiskCard = ({
  highRisk,
  mediumRisk,
  safeWords,
  onWordPress,
}: ForgettingRiskCardProps) => {
  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
    }
  };

  const getRiskEmoji = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgetting Risk</Text>
        <Text style={styles.subtitle}>Words that need your attention</Text>
      </View>

      {/* Risk Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>🔴</Text>
          <Text style={styles.summaryCount}>{highRisk.length}</Text>
          <Text style={styles.summaryLabel}>High Risk</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>🟡</Text>
          <Text style={styles.summaryCount}>{mediumRisk.length}</Text>
          <Text style={styles.summaryLabel}>Medium</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryEmoji}>🟢</Text>
          <Text style={styles.summaryCount}>{safeWords}</Text>
          <Text style={styles.summaryLabel}>Safe</Text>
        </View>
      </View>

      {/* High Risk Words */}
      {highRisk.length > 0 && (
        <View style={styles.riskSection}>
          <Text style={[styles.riskTitle, { color: Colors.danger }]}>
            🔴 High Risk ({highRisk.length})
          </Text>
          <Text style={styles.riskDescription}>
            Not reviewed in 14+ days
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.wordScroll}
            contentContainerStyle={styles.wordScrollContent}
          >
            {highRisk.slice(0, 10).map((word) => (
              <TouchableOpacity
                key={word.wordId}
                style={[styles.wordChip, { borderColor: Colors.danger }]}
                onPress={() => onWordPress?.(word.wordId)}
              >
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.daysText}>{word.daysSinceReview}d ago</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Medium Risk Words */}
      {mediumRisk.length > 0 && (
        <View style={styles.riskSection}>
          <Text style={[styles.riskTitle, { color: Colors.warning }]}>
            🟡 Medium Risk ({mediumRisk.length})
          </Text>
          <Text style={styles.riskDescription}>
            Not reviewed in 7-13 days
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.wordScroll}
            contentContainerStyle={styles.wordScrollContent}
          >
            {mediumRisk.slice(0, 10).map((word) => (
              <TouchableOpacity
                key={word.wordId}
                style={[styles.wordChip, { borderColor: Colors.warning }]}
                onPress={() => onWordPress?.(word.wordId)}
              >
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.daysText}>{word.daysSinceReview}d ago</Text>
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
  summary: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  summaryCount: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  riskSection: {
    marginBottom: Spacing.lg,
  },
  riskTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  riskDescription: {
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
    minWidth: 100,
  },
  wordText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  daysText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
});
