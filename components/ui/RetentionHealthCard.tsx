import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';
import { RetentionHealth } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

interface RetentionHealthCardProps {
  retentionHealth: RetentionHealth;
}

export const RetentionHealthCard = ({ retentionHealth }: RetentionHealthCardProps) => {
  const getStatusColor = () => {
    switch (retentionHealth.status) {
      case 'Excellent':
        return Colors.success;
      case 'Good':
        return Colors.primary;
      case 'Fair':
        return Colors.warning;
      case 'Needs Work':
        return Colors.danger;
    }
  };

  const getStatusIcon = () => {
    switch (retentionHealth.status) {
      case 'Excellent':
        return 'star.fill';
      case 'Good':
        return 'hand.thumbsup.fill';
      case 'Fair':
        return 'chart.line.uptrend.xyaxis';
      case 'Needs Work':
        return 'exclamationmark.triangle.fill';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Retention Health</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
          <IconSymbol name={getStatusIcon()} size={14} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {retentionHealth.status}
          </Text>
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getStatusColor() }]}>
          {retentionHealth.score}%
        </Text>
      </View>

      <ProgressBar
        progress={retentionHealth.score}
        color={getStatusColor()}
        height={8}
      />

      <View style={styles.metrics}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Reviewed in last 7 days</Text>
          <Text style={styles.metricValue}>
            {retentionHealth.wordsReviewedLast7Days} words
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Reviewed in last 14 days</Text>
          <Text style={styles.metricValue}>
            {retentionHealth.wordsReviewedLast14Days} words
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Total learned words</Text>
          <Text style={styles.metricValue}>
            {retentionHealth.totalLearnedWords} words
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        Regular reviews maintain strong retention. Aim for 60%+ score.
      </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  score: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
  },
  metrics: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  metricValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  description: {
    marginTop: Spacing.lg,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
