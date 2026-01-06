import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from './Card';

interface MCQCardProps {
  word: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number | null;
  onSelectOption: (index: number) => void;
  disabled: boolean;
}

export const MCQCard: React.FC<MCQCardProps> = ({
  word,
  options,
  selectedIndex,
  correctIndex,
  onSelectOption,
  disabled,
}) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const getOptionStyle = (index: number) => {
    if (selectedIndex === null) {
      return styles.option;
    }

    // After answering, show correct/incorrect
    if (correctIndex !== null) {
      if (index === correctIndex) {
        return [styles.option, styles.optionCorrect];
      }
      if (index === selectedIndex && index !== correctIndex) {
        return [styles.option, styles.optionIncorrect];
      }
    } else if (index === selectedIndex) {
      return [styles.option, styles.optionSelected];
    }

    return styles.option;
  };

  const getOptionIconStyle = (index: number) => {
    if (correctIndex !== null && index === correctIndex) {
      return styles.optionIconCorrect;
    }
    if (selectedIndex !== null && index === selectedIndex && index !== correctIndex) {
      return styles.optionIconIncorrect;
    }
    return styles.optionIcon;
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.word}>{word}</Text>
      <Text style={styles.instruction}>Choose the correct definition:</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => onSelectOption(index)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View style={getOptionIconStyle(index)}>
              <Text style={styles.optionLabel}>{optionLabels[index]}</Text>
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {correctIndex !== null && (
        <View style={styles.feedbackContainer}>
          {selectedIndex === correctIndex ? (
            <>
              <Text style={styles.feedbackIconCorrect}>✓</Text>
              <Text style={styles.feedbackTextCorrect}>Correct!</Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackIconIncorrect}>✕</Text>
              <Text style={styles.feedbackTextIncorrect}>Incorrect</Text>
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
  word: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  instruction: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  optionIncorrect: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconCorrect: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconIncorrect: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    lineHeight: 22,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  feedbackIconCorrect: {
    fontSize: 32,
    color: Colors.success,
  },
  feedbackIconIncorrect: {
    fontSize: 32,
    color: Colors.danger,
  },
  feedbackTextCorrect: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.success,
  },
  feedbackTextIncorrect: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.danger,
  },
});

