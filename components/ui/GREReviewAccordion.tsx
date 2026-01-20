import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GREQuestionAttempt } from '@/lib/types';

type Filter = 'all' | 'incorrect';

function safeParseJson<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function renderQuestionWithBlank(question: string) {
  const normalized = question.replace(/_{3,}/g, '_____');
  const parts = normalized.split('_____');
  if (parts.length <= 1) return <Text style={styles.questionText}>{normalized}</Text>;

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

interface GREReviewAccordionProps {
  attempts: GREQuestionAttempt[];
  filter: Filter;
}

export const GREReviewAccordion: React.FC<GREReviewAccordionProps> = ({ attempts, filter }) => {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (filter === 'incorrect') return attempts.filter((a) => !a.isCorrect);
    return attempts;
  }, [attempts, filter]);

  const toggleOpen = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.list}>
      {filtered.map((a, idx) => {
        const id = a.id ?? idx;
        const open = openIds.has(id);
        const options = safeParseJson<Array<{ id: string; text: string }>>(a.optionsJson, []);
        const correct = new Set<string>(safeParseJson<string[]>(a.correctJson, []));
        const selected = new Set<string>(safeParseJson<string[]>(a.selectedJson, []));

        const selectedText = options
          .filter((o) => selected.has(o.id))
          .map((o) => o.text);
        const correctText = options
          .filter((o) => correct.has(o.id))
          .map((o) => o.text);

        return (
          <Card key={`${a.questionKey}-${id}`} style={styles.card}>
            <TouchableOpacity onPress={() => toggleOpen(id)} activeOpacity={0.85}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.qLabel}>QUESTION {idx + 1}</Text>
                  <IconSymbol
                    name={a.isCorrect ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                    size={16}
                    color={a.isCorrect ? Colors.success : Colors.danger}
                  />
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={18}
                  color={Colors.textSecondary}
                  style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}
                />
              </View>

              <View style={styles.questionRow}>
                {renderQuestionWithBlank(a.questionText)}
              </View>

              <View style={styles.pillsRow}>
                <View style={[styles.pill, a.isCorrect ? styles.pillSuccess : styles.pillDanger]}>
                  <Text style={[styles.pillTag, a.isCorrect ? styles.pillTagSuccess : styles.pillTagDanger]}>
                    Your Answer
                  </Text>
                  <Text style={styles.pillValue} numberOfLines={1}>
                    {selectedText.join(', ') || '—'}
                  </Text>
                </View>

                {!a.isCorrect && (
                  <View style={[styles.pill, styles.pillSuccess]}>
                    <Text style={[styles.pillTag, styles.pillTagSuccess]}>Correct</Text>
                    <Text style={styles.pillValue} numberOfLines={1}>
                      {correctText.join(', ') || '—'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {open && (
              <View style={styles.details}>
                <Text style={styles.detailsTitle}>Explanation</Text>
                <Text style={styles.detailsBody}>
                  {(a.explanationText ?? '').trim() || 'No explanation available.'}
                </Text>
              </View>
            )}
          </Card>
        );
      })}

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {filter === 'incorrect' ? 'No incorrect answers in this session.' : 'No attempts to review.'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.extrabold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  questionRow: {
    marginBottom: Spacing.md,
  },
  questionText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    lineHeight: 24,
  },
  blankText: {
    fontSize: Typography.base,
    fontWeight: Typography.extrabold,
    color: Colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(37, 99, 235, 0.35)',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    maxWidth: '100%',
  },
  pillSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  pillDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  pillTag: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pillTagSuccess: {
    color: Colors.success,
  },
  pillTagDanger: {
    color: Colors.danger,
  },
  pillValue: {
    fontSize: Typography.sm,
    color: Colors.text,
    flexShrink: 1,
  },
  details: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailsTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  detailsBody: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  empty: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

