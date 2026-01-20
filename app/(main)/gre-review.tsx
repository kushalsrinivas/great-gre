import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { GREReviewAccordion } from '@/components/ui/GREReviewAccordion';
import { getGREAttemptsForSession, getGREPracticeSession } from '@/lib/storage/database';
import { GREPracticeSession, GREQuestionAttempt } from '@/lib/types';

type Filter = 'all' | 'incorrect';

export default function GREReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const sid = useMemo(() => parseInt(sessionId || '0', 10), [sessionId]);
  const [session, setSession] = useState<GREPracticeSession | null>(null);
  const [attempts, setAttempts] = useState<GREQuestionAttempt[]>([]);
  const [filter, setFilter] = useState<Filter>('incorrect');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [s, a] = await Promise.all([
        sid ? getGREPracticeSession(sid) : Promise.resolve(null),
        sid ? getGREAttemptsForSession(sid) : Promise.resolve([]),
      ]);
      setSession(s);
      setAttempts(a);
      setLoading(false);
    };
    load().catch((e) => {
      console.error('Failed to load GRE review:', e);
      setLoading(false);
    });
  }, [sid]);

  const total = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const filterLabel = filter === 'incorrect' ? 'Filter: Incorrect' : 'Filter: All';

  const headerSubtitle = session?.questionTypes?.length
    ? session.questionTypes.includes('equivalent_meaning') && session.questionTypes.some((t) => t.includes('blank'))
      ? 'GRE Verbal Mixed'
      : session.questionTypes.includes('equivalent_meaning')
        ? 'Sentence Equivalence'
        : 'Text Completion'
    : 'GRE Verbal';

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading review...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky-like header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.replace('/(main)/(tabs)/test')}
              activeOpacity={0.85}
              style={styles.resultsBtn}
            >
              <IconSymbol name="chevron.left" size={18} color={Colors.primary} />
              <Text style={styles.resultsText}>Results</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Review Mode</Text>
            <View style={{ width: 72 }} />
          </View>

          <View style={styles.progressMeta}>
            <Text style={styles.sessionLabel}>{headerSubtitle}</Text>
            <Text style={styles.scoreLabel}>{correct} / {total} Correct</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${accuracyPct}%` }]} />
          </View>
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Question Review</Text>
          <TouchableOpacity
            onPress={() => setFilter((f) => (f === 'incorrect' ? 'all' : 'incorrect'))}
            activeOpacity={0.85}
            style={styles.filterPill}
          >
            <Text style={styles.filterText}>{filterLabel}</Text>
          </TouchableOpacity>
        </View>

        <GREReviewAccordion attempts={attempts} filter={filter} />
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
        <Button title="Start Practice Session" onPress={() => router.replace('/(main)/gre-practice-setup')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.md,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  resultsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    width: 72,
  },
  resultsText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
  },
  sessionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  filterPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  filterText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
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

