import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Colors, Typography, Spacing } from '@/lib/constants/theme';
import { Button } from '@/components/ui/Button';
import { WrittenInputCard } from '@/components/ui/WrittenInputCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Word } from '@/lib/types';
import {
  getRandomWordsForTest,
  getLearnedWordsForTest,
} from '@/lib/storage/database';

interface WrittenQuestion {
  word: string;
  definition: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function WrittenTestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: string }>();
  const [questions, setQuestions] = useState<WrittenQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState<number | null>(null);

  useEffect(() => {
    if (wordCount !== null) {
      loadQuestions();
    }
  }, [wordCount]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const count = wordCount || 10;
      
      // Get words based on test type
      let words: Word[];
      if (type === 'learned') {
        words = await getLearnedWordsForTest(count);
      } else {
        words = await getRandomWordsForTest(count, true);
      }

      const writtenQuestions: WrittenQuestion[] = words.map((word) => ({
        word: word.word,
        definition: word.definition,
      }));

      setQuestions(writtenQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading written questions:', error);
      setLoading(false);
    }
  };

  const handleSubmit = (answer: string, isCorrect: boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = answer;
    updatedQuestions[currentIndex].isCorrect = isCorrect;
    setQuestions(updatedQuestions);
    setAnswered(true);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
    } else {
      // Test complete, navigate to results
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      router.replace({
        pathname: '/(main)/test-results',
        params: {
          testType: `Written - ${type === 'learned' ? 'Learned Words' : 'Random Words'}`,
          score: `${score}/${questions.length}`,
          timeTaken: timeTaken.toString(),
        },
      });
    }
  };

  if (wordCount === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={28} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Written Test Setup</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.setupContainer}>
          <Text style={styles.setupTitle}>
            {type === 'learned' ? 'Test Your Learned Words' : 'Challenge with Random Words'}
          </Text>
          <Text style={styles.setupDescription}>
            Select how many questions you want:
          </Text>

          <View style={styles.optionsGrid}>
            {[10, 15, 20, 25].map((count) => (
              <TouchableOpacity
                key={count}
                style={styles.countOption}
                onPress={() => setWordCount(count)}
              >
                <Text style={styles.countNumber}>{count}</Text>
                <Text style={styles.countLabel}>Questions</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing your test...</Text>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            {type === 'learned'
              ? 'No learned words available for testing. Complete some learning sessions first!'
              : 'No words available for testing.'}
          </Text>
          <Button title="Go Back" onPress={() => router.back()} style={styles.button} />
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Written Test</Text>
        <Text style={styles.scoreText}>
          {score}/{questions.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <View style={styles.content}>
        <WrittenInputCard
          definition={currentQuestion.definition}
          correctAnswer={currentQuestion.word}
          onSubmit={handleSubmit}
          answered={answered}
        />
      </View>

      {/* Next Button */}
      {answered && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing['2xl']) }]}>
          <Button
            title={currentIndex < questions.length - 1 ? 'Next Question →' : 'View Results'}
            onPress={handleNext}
            size="large"
            style={styles.button}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  scoreText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  progressSection: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    padding: Spacing['2xl'],
  },
  button: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
  },
  loadingText: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 28,
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  setupTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  setupDescription: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  countOption: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  countNumber: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  countLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
});

