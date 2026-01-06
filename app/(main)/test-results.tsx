import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { saveTestScore } from '@/lib/storage/database';

export default function TestResultsScreen() {
  const router = useRouter();
  const { testType, score, timeTaken } = useLocalSearchParams<{
    testType: string;
    score: string;
    timeTaken: string;
  }>();

  useEffect(() => {
    // Save test score to database
    saveScore();
  }, []);

  const saveScore = async () => {
    try {
      await saveTestScore({
        testType: testType || 'Unknown',
        score: score || '0/0',
        timeTaken: parseInt(timeTaken || '0'),
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error saving test score:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const calculatePercentage = (scoreStr: string) => {
    const [correct, total] = scoreStr.split('/').map(Number);
    return Math.round((correct / total) * 100);
  };

  const percentage = calculatePercentage(score || '0/0');
  const [correct, total] = (score || '0/0').split('/').map(Number);
  const incorrect = total - correct;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return '🎉 Outstanding!';
    if (percentage >= 80) return '👏 Excellent work!';
    if (percentage >= 70) return '👍 Good job!';
    if (percentage >= 60) return '💪 Keep practicing!';
    return '📚 Review and try again!';
  };

  const getPerformanceColor = () => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 60) return Colors.warning;
    return Colors.danger;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Trophy Icon */}
      <View style={styles.trophyContainer}>
        <Text style={styles.trophyIcon}>🏆</Text>
      </View>

      {/* Score Card */}
      <Card style={styles.scoreCard}>
        <Text style={styles.testType}>{testType}</Text>
        <View style={styles.scoreDisplay}>
          <Text style={[styles.percentage, { color: getPerformanceColor() }]}>
            {percentage}%
          </Text>
          <Text style={styles.scoreBreakdown}>
            {correct} / {total} Correct
          </Text>
        </View>
        <Text style={styles.performanceMessage}>{getPerformanceMessage()}</Text>
      </Card>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{formatTime(parseInt(timeTaken || '0'))}</Text>
          <Text style={styles.statLabel}>Time Taken</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{correct}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statIcon}>❌</Text>
          <Text style={styles.statValue}>{incorrect}</Text>
          <Text style={styles.statLabel}>Incorrect</Text>
        </Card>
      </View>

      {/* Performance Breakdown */}
      <Card style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>Performance Breakdown</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFull}>
            <View
              style={[
                styles.progressBarCorrect,
                { width: `${(correct / total) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {percentage}% Accuracy
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statText}>Correct: {correct}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: Colors.danger }]} />
            <Text style={styles.statText}>Incorrect: {incorrect}</Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Try Again"
          onPress={() => router.back()}
          size="large"
          style={styles.button}
        />
        <Button
          title="Back to Testing Center"
          onPress={() => router.push('/(main)/(tabs)/test')}
          variant="secondary"
          size="large"
          style={styles.button}
        />
        <Button
          title="Go Home"
          onPress={() => router.push('/(main)/(tabs)/')}
          variant="secondary"
          size="large"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: Spacing['5xl'],
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  trophyIcon: {
    fontSize: 80,
  },
  scoreCard: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  testType: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  percentage: {
    fontSize: 64,
    fontWeight: Typography.extrabold,
    marginBottom: Spacing.xs,
  },
  scoreBreakdown: {
    fontSize: Typography.xl,
    color: Colors.textSecondary,
  },
  performanceMessage: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  breakdownCard: {
    padding: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  breakdownTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  progressBarContainer: {
    marginBottom: Spacing.lg,
  },
  progressBarFull: {
    height: 16,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarCorrect: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  progressLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statText: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
});

