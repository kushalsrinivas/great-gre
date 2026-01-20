import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';

type PracticeMode = 'se' | 'tc' | 'mixed';

export default function GREPracticeSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<PracticeMode>('mixed');
  const [count, setCount] = useState<number>(20);

  const questionTypes = useMemo(() => {
    if (mode === 'se') return ['equivalent_meaning'];
    if (mode === 'tc') return ['single_blank', 'double_blank', 'triple_blank'];
    return ['equivalent_meaning', 'single_blank', 'double_blank', 'triple_blank'];
  }, [mode]);

  const startPractice = () => {
    router.push({
      pathname: '/(main)/gre-practice',
      params: {
        questionTypes: JSON.stringify(questionTypes),
        count: count.toString(),
        mode,
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing['3xl'] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>GRE Practice</Text>
          <Text style={styles.subtitle}>Verbal question drills</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Practice Mode</Text>
        <View style={styles.modeGrid}>
          <TouchableOpacity
            style={[styles.modeCard, mode === 'se' && styles.modeCardActive]}
            onPress={() => setMode('se')}
            activeOpacity={0.85}
          >
            <Card style={styles.modeCardInner}>
              <IconSymbol name="book.fill" size={22} color={Colors.primary} />
              <Text style={styles.modeTitle}>Sentence Equivalence</Text>
              <Text style={styles.modeDesc}>Select two correct options</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, mode === 'tc' && styles.modeCardActive]}
            onPress={() => setMode('tc')}
            activeOpacity={0.85}
          >
            <Card style={styles.modeCardInner}>
              <IconSymbol name="pencil" size={22} color={Colors.primary} />
              <Text style={styles.modeTitle}>Text Completion</Text>
              <Text style={styles.modeDesc}>Single, double, and triple blank</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, mode === 'mixed' && styles.modeCardActive]}
            onPress={() => setMode('mixed')}
            activeOpacity={0.85}
          >
            <Card style={styles.modeCardInner}>
              <IconSymbol name="rectangle.stack.fill" size={22} color={Colors.primary} />
              <Text style={styles.modeTitle}>Mixed</Text>
              <Text style={styles.modeDesc}>Sentence Equivalence + Text Completion</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question Count</Text>
        <View style={styles.countGrid}>
          {[10, 20, 40].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.countOption, count === n && styles.countOptionActive]}
              onPress={() => setCount(n)}
              activeOpacity={0.85}
            >
              <Text style={[styles.countNumber, count === n && styles.countNumberActive]}>{n}</Text>
              <Text style={styles.countLabel}>Questions</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Start Practice" onPress={startPractice} size="large" />
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
    paddingHorizontal: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerText: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  modeGrid: {
    gap: Spacing.md,
  },
  modeCard: {
    borderRadius: BorderRadius.lg,
  },
  modeCardActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  modeCardInner: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  modeTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  modeDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  countGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  countOption: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  countOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  countNumber: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  countNumberActive: {
    color: Colors.primary,
  },
  countLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: Spacing.md,
  },
});

