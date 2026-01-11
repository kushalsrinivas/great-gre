import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { TestScore } from '@/lib/types';

interface TestHistoryListProps {
  tests: TestScore[];
  onTestPress?: (test: TestScore) => void;
}

export const TestHistoryList = ({ tests, onTestPress }: TestHistoryListProps) => {
  const getScorePercentage = (score: string) => {
    const [correct, total] = score.split('/').map(Number);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 60) return '#F59E0B';
    return Colors.danger;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (tests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No test history yet</Text>
        <Text style={styles.emptySubtext}>Take a test to see your results here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tests.map((test, index) => {
        const percentage = getScorePercentage(test.score);
        const performanceColor = getPerformanceColor(percentage);

        return (
          <TouchableOpacity
            key={test.id || index}
            style={styles.testItem}
            onPress={() => onTestPress?.(test)}
            activeOpacity={0.7}
          >
            <View style={styles.testLeft}>
              <View style={[styles.scoreCircle, { borderColor: performanceColor }]}>
                <Text style={[styles.scorePercentage, { color: performanceColor }]}>
                  {percentage}%
                </Text>
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testType}>{test.testType}</Text>
                <Text style={styles.testDate}>{formatDate(test.date)}</Text>
              </View>
            </View>
            <View style={styles.testRight}>
              <Text style={styles.testScore}>{test.score}</Text>
              <Text style={styles.testTime}>{test.timeTaken}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  testLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scorePercentage: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  testInfo: {
    flex: 1,
  },
  testType: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  testDate: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  testRight: {
    alignItems: 'flex-end',
  },
  testScore: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  testTime: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
