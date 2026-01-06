import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from './Card';
import { Button } from './Button';

interface WrittenInputCardProps {
  definition: string;
  correctAnswer: string;
  onSubmit: (answer: string, isCorrect: boolean) => void;
  answered: boolean;
}

export const WrittenInputCard: React.FC<WrittenInputCardProps> = ({
  definition,
  correctAnswer,
  onSubmit,
  answered,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const correct = trimmedAnswer === correctAnswer.toLowerCase();
    setIsCorrect(correct);
    onSubmit(userAnswer, correct);
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.label}>DEFINITION</Text>
      <Text style={styles.definition}>{definition}</Text>

      <Text style={styles.instruction}>Type the word:</Text>

      <TextInput
        style={[
          styles.input,
          answered && (isCorrect ? styles.inputCorrect : styles.inputIncorrect),
        ]}
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholder="Enter your answer..."
        placeholderTextColor={Colors.textSecondary}
        editable={!answered}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!answered && (
        <Button
          title="Submit Answer"
          onPress={handleSubmit}
          disabled={userAnswer.trim().length === 0}
          size="large"
          style={styles.button}
        />
      )}

      {answered && isCorrect !== null && (
        <View style={styles.feedbackContainer}>
          {isCorrect ? (
            <>
              <Text style={styles.feedbackIconCorrect}>✓</Text>
              <View style={styles.feedbackTextContainer}>
                <Text style={styles.feedbackTextCorrect}>Correct!</Text>
                <Text style={styles.correctWord}>{correctAnswer}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.feedbackIconIncorrect}>✕</Text>
              <View style={styles.feedbackTextContainer}>
                <Text style={styles.feedbackTextIncorrect}>Incorrect</Text>
                <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                <Text style={styles.correctWord}>{correctAnswer}</Text>
                {userAnswer.trim() && (
                  <>
                    <Text style={styles.yourAnswerLabel}>Your answer:</Text>
                    <Text style={styles.yourAnswer}>{userAnswer}</Text>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  definition: {
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing['2xl'],
  },
  instruction: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.xl,
    color: Colors.text,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: Spacing.lg,
  },
  inputCorrect: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  inputIncorrect: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  button: {
    width: '100%',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  feedbackIconCorrect: {
    fontSize: 32,
    color: Colors.success,
  },
  feedbackIconIncorrect: {
    fontSize: 32,
    color: Colors.danger,
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTextCorrect: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  feedbackTextIncorrect: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.danger,
    marginBottom: Spacing.sm,
  },
  correctAnswerLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  correctWord: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  yourAnswerLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  yourAnswer: {
    fontSize: Typography.lg,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});

