import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';
import { ProgressQuality } from '@/lib/types';

interface ProgressQualityCardProps {
  progressQuality: ProgressQuality;
}

export const ProgressQualityCard = ({ progressQuality }: ProgressQualityCardProps) => {
  const { speedVsStability } = progressQuality;

  const getCategoryColor = () => {
    switch (speedVsStability.category) {
      case 'Fast & Stable':
        return Colors.success;
      case 'Slow & Stable':
        return Colors.primary;
      case 'Fast & Fragile':
        return Colors.warning;
      case 'Slow & Fragile':
        return Colors.danger;
    }
  };

  const getCategoryIcon = () => {
    switch (speedVsStability.category) {
      case 'Fast & Stable':
        return 'bolt.fill';
      case 'Slow & Stable':
        return 'brain.head.profile';
      case 'Fast & Fragile':
        return 'exclamationmark.triangle.fill';
      case 'Slow & Fragile':
        return 'tortoise.fill';
    }
  };

  const getCategoryDescription = () => {
    switch (speedVsStability.category) {
      case 'Fast & Stable':
        return 'You learn quickly AND retain well. Optimal learning pattern!';
      case 'Slow & Stable':
        return 'You prefer thorough understanding. Great for long-term retention!';
      case 'Fast & Fragile':
        return 'Fast learning but lower retention. Try more review sessions.';
      case 'Slow & Fragile':
        return 'Focus on consistency and spaced repetition to improve.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Style</Text>
        <Text style={styles.subtitle}>Speed vs Stability Analysis</Text>
      </View>

      <View
        style={[
          styles.categoryCard,
          { backgroundColor: `${getCategoryColor()}20`, borderColor: getCategoryColor() },
        ]}
      >
        <IconSymbol name={getCategoryIcon()} size={32} color={getCategoryColor()} />
        <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
          {speedVsStability.category}
        </Text>
      </View>

      <Text style={styles.description}>{getCategoryDescription()}</Text>

      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Learning Speed</Text>
          <Text style={styles.metricValue}>
            {speedVsStability.wordsPerDay} words/day
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Retention Rate</Text>
          <Text style={styles.metricValue}>{speedVsStability.retentionRate}%</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Learning Depth</Text>
          <Text style={styles.metricValue}>
            {progressQuality.learningDepth.toFixed(1)}x
          </Text>
        </View>
      </View>

      {/* Quadrant Visualization */}
      <View style={styles.quadrant}>
        <Text style={styles.quadrantTitle}>Learning Quadrant</Text>
        <View style={styles.quadrantGrid}>
          <View style={styles.quadrantRow}>
            <View
              style={[
                styles.quadrantCell,
                speedVsStability.category === 'Fast & Stable' && styles.activeCell,
              ]}
            >
              <IconSymbol name="bolt.fill" size={24} color={Colors.textSecondary} />
              <Text style={styles.quadrantLabel}>Fast & Stable</Text>
            </View>
            <View
              style={[
                styles.quadrantCell,
                speedVsStability.category === 'Fast & Fragile' && styles.activeCell,
              ]}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={Colors.textSecondary} />
              <Text style={styles.quadrantLabel}>Fast & Fragile</Text>
            </View>
          </View>
          <View style={styles.quadrantRow}>
            <View
              style={[
                styles.quadrantCell,
                speedVsStability.category === 'Slow & Stable' && styles.activeCell,
              ]}
            >
              <IconSymbol name="brain.head.profile" size={24} color={Colors.textSecondary} />
              <Text style={styles.quadrantLabel}>Slow & Stable</Text>
            </View>
            <View
              style={[
                styles.quadrantCell,
                speedVsStability.category === 'Slow & Fragile' && styles.activeCell,
              ]}
            >
              <IconSymbol name="tortoise.fill" size={24} color={Colors.textSecondary} />
              <Text style={styles.quadrantLabel}>Slow & Fragile</Text>
            </View>
          </View>
        </View>
      </View>
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
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  categoryText: {
    fontSize: Typography.xl,
    fontWeight: Typography.extrabold,
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  metrics: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  quadrant: {
    marginTop: Spacing.md,
  },
  quadrantTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  quadrantGrid: {
    gap: Spacing.sm,
  },
  quadrantRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quadrantCell: {
    flex: 1,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    opacity: 0.5,
  },
  activeCell: {
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  quadrantLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
