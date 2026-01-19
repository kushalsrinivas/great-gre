import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';
import { ConsistencyMetrics } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

interface ConsistencyMetricsCardProps {
  consistencyMetrics: ConsistencyMetrics;
}

export const ConsistencyMetricsCard = ({
  consistencyMetrics,
}: ConsistencyMetricsCardProps) => {
  const getScoreColor = () => {
    if (consistencyMetrics.score >= 70) return Colors.success;
    if (consistencyMetrics.score >= 50) return Colors.primary;
    if (consistencyMetrics.score >= 30) return Colors.warning;
    return Colors.danger;
  };

  const getScoreStatus = () => {
    if (consistencyMetrics.score >= 70) return 'Highly Consistent';
    if (consistencyMetrics.score >= 50) return 'Good Consistency';
    if (consistencyMetrics.score >= 30) return 'Needs Improvement';
    return 'Irregular';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consistency Score</Text>
        <Text style={styles.subtitle}>Your learning habit strength</Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getScoreColor() }]}>
          {consistencyMetrics.score}%
        </Text>
        <Text style={styles.scoreLabel}>{getScoreStatus()}</Text>
      </View>

      <ProgressBar progress={consistencyMetrics.score} progressColor={getScoreColor()} height={8} />

      {/* Metrics */}
      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {consistencyMetrics.activeDaysLast30}
          </Text>
          <Text style={styles.metricLabel}>Active Days (Last 30)</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {consistencyMetrics.streakStability}%
          </Text>
          <Text style={styles.metricLabel}>Streak Stability</Text>
        </View>
      </View>

      {/* Best Learning Days */}
      {consistencyMetrics.bestLearningDays.length > 0 && (
        <View style={styles.daysSection}>
          <View style={styles.sectionTitleContainer}>
            <IconSymbol name="chart.bar.fill" size={16} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Your Best Learning Days</Text>
          </View>
          <View style={styles.daysList}>
            {consistencyMetrics.bestLearningDays.map((day, index) => (
              <View key={day.day} style={styles.dayItem}>
                <View style={styles.dayRank}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day.day}</Text>
                  <View style={styles.dayStats}>
                    <Text style={styles.dayCount}>{day.wordCount} words</Text>
                    <Text style={styles.dayPercentage}>({day.percentage}%)</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.dayTipContainer}>
            <IconSymbol name="lightbulb.fill" size={14} color={Colors.warning} />
            <Text style={styles.dayTip}>
              Schedule learning sessions on these days for better results
            </Text>
          </View>
        </View>
      )}

      {/* Consistency Tips */}
      <View style={styles.tipsBox}>
        <View style={styles.tipsTitleContainer}>
          <IconSymbol name="dumbbell.fill" size={16} color={Colors.primary} />
          <Text style={styles.tipsTitle}>Consistency Tips</Text>
        </View>
        <Text style={styles.tipsText}>
          {consistencyMetrics.score < 50
            ? 'Set a daily reminder and start with just 5-10 minutes per day'
            : consistencyMetrics.score < 70
            ? "You're building a good habit! Try to maintain your current pace"
            : 'Excellent consistency! Your habit is well-established'}
        </Text>
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  score: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.extrabold,
  },
  scoreLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  metrics: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  daysSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  daysList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  dayRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  dayStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  dayPercentage: {
    fontSize: Typography.sm,
    color: Colors.primary,
  },
  dayTipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  dayTip: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  tipsBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  tipsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tipsTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  tipsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
