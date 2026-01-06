import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/contexts/ProgressContext';
import { formatTime, getTimeElapsed } from '@/lib/utils';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const { listName } = useLocalSearchParams<{ listName: string }>();
  const { currentSession, endSession } = useProgress();

  if (!currentSession) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No session data available</Text>
        </View>
      </View>
    );
  }

  const timeTaken = getTimeElapsed(currentSession.startTime);
  const formattedTime = formatTime(timeTaken);
  const { dontKnow, unsure, knowIt } = currentSession.results;
  const totalWords = dontKnow + unsure + knowIt;

  const handleContinue = () => {
    endSession();
    router.replace('/(main)/(tabs)');
  };

  const handleReviewWords = () => {
    endSession();
    router.replace({
      pathname: '/(main)/learning-session',
      params: { listName, mode: 'review' },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎉</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Session Complete!</Text>
      <Text style={styles.subtitle}>Great job on completing your learning session</Text>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>List</Text>
          <Text style={styles.statValue}>{listName}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Words Reviewed</Text>
          <Text style={styles.statValue}>{totalWords}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Time Taken</Text>
          <Text style={styles.statValue}>{formattedTime}</Text>
        </View>
      </Card>

      {/* Results Breakdown */}
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>Results Breakdown</Text>

        <View style={styles.resultCards}>
          <Card style={[styles.resultCard, styles.resultCardKnowIt]}>
            <Text style={styles.resultIcon}>★</Text>
            <Text style={styles.resultCount}>{knowIt}</Text>
            <Text style={styles.resultLabel}>Know It</Text>
          </Card>

          <Card style={[styles.resultCard, styles.resultCardUnsure]}>
            <Text style={styles.resultIcon}>?</Text>
            <Text style={styles.resultCount}>{unsure}</Text>
            <Text style={styles.resultLabel}>Unsure</Text>
          </Card>

          <Card style={[styles.resultCard, styles.resultCardDontKnow]}>
            <Text style={styles.resultIcon}>✕</Text>
            <Text style={styles.resultCount}>{dontKnow}</Text>
            <Text style={styles.resultLabel}>Don't Know</Text>
          </Card>
        </View>
      </View>

      {/* Words We Learnt Today */}
      <Card style={styles.wordsCard}>
        <Text style={styles.wordsTitle}>Words We Learnt Today</Text>
        <View style={styles.wordsList}>
          {currentSession.words.slice(0, totalWords).map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.wordNumber}>{index + 1}.</Text>
              <View style={styles.wordContent}>
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.wordDefinition}>{word.definition}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <Button
          title="Continue →"
          onPress={handleContinue}
          size="large"
          style={styles.primaryButton}
        />

        <Button
          title="Review These Words Again"
          onPress={handleReviewWords}
          variant="secondary"
          size="medium"
          style={styles.secondaryButton}
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
  contentContainer: {
    padding: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: Spacing['5xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  statsCard: {
    marginBottom: Spacing['3xl'],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  statValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  resultsSection: {
    marginBottom: Spacing['3xl'],
  },
  resultsTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  resultCards: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  resultCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  resultCardKnowIt: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
  },
  resultCardUnsure: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  resultCardDontKnow: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  resultIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  resultCount: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  resultLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  wordsCard: {
    marginBottom: Spacing['3xl'],
  },
  wordsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  wordsList: {
    gap: Spacing.lg,
  },
  wordItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  wordNumber: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    minWidth: 24,
  },
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  wordDefinition: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsSection: {
    gap: Spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});

