import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';

function renderQuestionWithBlank(question: string) {
  // Replace long underscore runs with a consistent blank marker.
  const normalized = question.replace(/_{3,}/g, '_____');
  const parts = normalized.split('_____');

  if (parts.length <= 1) {
    return <Text style={styles.questionText}>{normalized}</Text>;
  }

  // Interleave parts with a styled blank.
  const nodes: React.ReactNode[] = [];
  parts.forEach((p, i) => {
    if (p) nodes.push(<Text key={`t-${i}`} style={styles.questionText}>{p}</Text>);
    if (i < parts.length - 1) {
      nodes.push(
        <Text key={`b-${i}`} style={styles.blankText}>
          {'_____'}
        </Text>
      );
    }
  });

  return <Text style={styles.questionText}>{nodes}</Text>;
}

interface GREQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  prompt: string;
  instruction: string;
}

export const GREQuestionCard: React.FC<GREQuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  prompt,
  instruction,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.questionLabel}>QUESTION {questionNumber}</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{instruction.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.promptContainer}>
        {renderQuestionWithBlank(prompt)}
      </View>

      <Text style={styles.progressHint}>
        {questionNumber} of {totalQuestions}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing['2xl'],
    padding: Spacing['2xl'],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  questionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  pill: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  pillText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  promptContainer: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    color: Colors.text,
    lineHeight: 30,
  },
  blankText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(37, 99, 235, 0.35)',
  },
  progressHint: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});

