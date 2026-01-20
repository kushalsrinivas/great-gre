import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { Colors, Typography, Spacing } from '@/lib/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { GREOptionsList } from '@/components/ui/GREOptionsList';
import { GREQuestionCard } from '@/components/ui/GREQuestionCard';
import { ExplanationCollapsible } from '@/components/ui/ExplanationCollapsible';
import { loadGREQuestions, GREQuestionNormalized } from '@/lib/questions/gre';
import { shuffleArray } from '@/lib/utils';
import {
  createGREPracticeSession,
  endGREPracticeSession,
  saveGREQuestionAttempt,
} from '@/lib/storage/database';

function setsEqual<T>(a: Set<T>, b: Set<T>) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function typeTitle(type: string) {
  if (type === 'equivalent_meaning') return 'Sentence Equivalence';
  if (type === 'single_blank') return 'Text Completion';
  if (type === 'double_blank') return 'Text Completion';
  if (type === 'triple_blank') return 'Text Completion';
  return 'GRE Practice';
}

export default function GREPracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { questionTypes, count, mode } = useLocalSearchParams<{
    questionTypes: string;
    count: string;
    mode: string;
  }>();

  const parsedTypes = useMemo<string[]>(() => {
    try {
      const parsed = JSON.parse(questionTypes || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [questionTypes]);

  const questionCount = useMemo(() => {
    const n = parseInt(count || '20', 10);
    return Number.isFinite(n) && n > 0 ? n : 20;
  }, [count]);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<GREQuestionNormalized[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionStart, setQuestionStart] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentIndex];

  const correctIds = useMemo(() => new Set(currentQuestion?.correctOptionIds ?? []), [currentQuestion]);
  const requiredSelectionCount = currentQuestion?.requiredSelectionCount ?? 1;
  const selectionMode = requiredSelectionCount > 1 ? 'multiple' : 'single';
  const canCheck = !submitted && selectedIds.size === requiredSelectionCount;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const loaded = loadGREQuestions({ includeTypes: parsedTypes.length ? parsedTypes : undefined });
      const shuffled = shuffleArray(loaded);
      const sliced = shuffled.slice(0, Math.min(questionCount, shuffled.length));
      setQuestions(sliced);

      const sid = await createGREPracticeSession({
        mode: mode || 'practice',
        questionTypes: parsedTypes.length ? parsedTypes : ['equivalent_meaning', 'single_blank', 'double_blank', 'triple_blank'],
        questionCount: sliced.length,
      });
      setSessionId(sid);
      setLoading(false);
    };

    init().catch((e) => {
      console.error('Failed to init GRE practice:', e);
      setLoading(false);
    });
  }, [mode, parsedTypes, questionCount]);

  useEffect(() => {
    setQuestionStart(Date.now());
  }, [currentIndex]);

  const toggleOption = (id: string) => {
    if (submitted) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selectionMode === 'single') {
        next.clear();
        next.add(id);
        return next;
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || !sessionId) return;
    if (!canCheck) return;

    const selected = new Set(selectedIds);
    const correct = correctIds;
    const isCorrect = setsEqual(selected, correct);
    const timeMs = Math.max(0, Date.now() - questionStart);

    setSubmitted(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    await saveGREQuestionAttempt({
      sessionId,
      questionKey: currentQuestion.questionKey,
      questionType: currentQuestion.type,
      questionText: currentQuestion.question,
      explanationText: currentQuestion.explanation,
      optionsJson: JSON.stringify(currentQuestion.options.map((o) => ({ id: o.id, text: o.text }))),
      correctJson: JSON.stringify([...correct]),
      selectedJson: JSON.stringify([...selected]),
      isCorrect,
      timeMs,
      createdAt: Date.now(),
    });
  };

  const handleNext = async () => {
    if (!submitted) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedIds(new Set());
      setSubmitted(false);
      return;
    }

    if (sessionId) {
      await endGREPracticeSession(sessionId);
      router.replace({
        pathname: '/(main)/gre-review',
        params: { sessionId: sessionId.toString() },
      });
    } else {
      router.replace('/(main)/gre-practice-setup');
    }
  };

  const progressPct = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const headerTitle = currentQuestion ? typeTitle(currentQuestion.type) : 'GRE Practice';

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing your session...</Text>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No questions available.</Text>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const instruction =
    requiredSelectionCount === 1 ? 'Select one option' : `Select ${requiredSelectionCount} options`;

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={[styles.topNav, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.topNavCenter}>
          <Text style={styles.topTitle}>GRE VERBAL REASONING</Text>
          <Text style={styles.topSubtitle}>{headerTitle}</Text>
        </View>

        <Text style={styles.topRight}>{currentIndex + 1}/{questions.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.body}>
        <GREQuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          prompt={currentQuestion.question}
          instruction={instruction}
        />

        <GREOptionsList
          options={currentQuestion.options}
          mode={selectionMode}
          selectedIds={selectedIds}
          onToggle={toggleOption}
          disabled={submitted}
          showResult={submitted}
          correctIds={correctIds}
        />

        {/* Post-check feedback + explanation */}
        {submitted && (
          <View style={styles.feedbackArea}>
            <View style={styles.feedbackRow}>
              <IconSymbol
                name={setsEqual(selectedIds, correctIds) ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                size={18}
                color={setsEqual(selectedIds, correctIds) ? Colors.success : Colors.danger}
              />
              <Text style={[styles.feedbackText, { color: setsEqual(selectedIds, correctIds) ? Colors.success : Colors.danger }]}>
                {setsEqual(selectedIds, correctIds) ? 'Correct selection' : 'Incorrect selection'}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.scoreHint}>{correctCount}/{questions.length}</Text>
            </View>

            <ExplanationCollapsible enabled={submitted} explanation={currentQuestion.explanation} />
          </View>
        )}
      </View>

      {/* Bottom action bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        {!submitted ? (
          <Button title="Check Answer" onPress={handleCheckAnswer} disabled={!canCheck} />
        ) : (
          <Button title={currentIndex < questions.length - 1 ? 'Next Question' : 'Review Session'} onPress={handleNext} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topNav: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topNavCenter: {
    alignItems: 'center',
    flex: 1,
  },
  topTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.text,
    letterSpacing: 1,
  },
  topSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  topRight: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
    minWidth: 56,
    textAlign: 'right',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.cardBackgroundLight,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  body: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  bottomBar: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  feedbackArea: {
    paddingHorizontal: Spacing['2xl'],
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  feedbackText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
  scoreHint: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
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
});

