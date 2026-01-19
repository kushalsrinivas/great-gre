import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { WordList } from '@/lib/types';
import { getWordListByName } from '@/lib/storage/database';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ListDetailScreen() {
  const router = useRouter();
  const { listName } = useLocalSearchParams<{ listName: string }>();
  const [list, setList] = useState<WordList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listName) {
      loadListDetails();
    }
  }, [listName]);

  const loadListDetails = async () => {
    try {
      const listData = await getWordListByName(listName as string);
      setList(listData);
    } catch (error) {
      console.error('Error loading list details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBeginLearning = () => {
    router.push({
      pathname: '/(main)/learning-session',
      params: { listName, mode: 'learn' },
    });
  };

  const handleReviewLearned = () => {
    router.push({
      pathname: '/(main)/learning-session',
      params: { listName, mode: 'review' },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!list) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>List not found</Text>
        </View>
      </View>
    );
  }

  const remaining = list.totalWords - list.learnedWords;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{listName}</Text>
        <TouchableOpacity>
          <IconSymbol name="gearshape.fill" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* List Info */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.label}>VOCABULARY LIST</Text>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.subtitle}>
            {list.description || 'Targeting High-Frequency Words'}
          </Text>
        </View>

        {/* Mastery Progress */}
        <View style={styles.progressSection}>
          <CircularProgress
            progress={list.masteryPercentage}
            size={180}
            strokeWidth={12}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(37, 99, 235, 0.2)' }]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text style={styles.statValue}>{list.learnedWords}</Text>
            <Text style={styles.statLabel}>LEARNED</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(107, 114, 128, 0.2)' }]}>
              <Text style={styles.statIconText}>○</Text>
            </View>
            <Text style={styles.statValue}>{remaining}</Text>
            <Text style={styles.statLabel}>REMAINING</Text>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="▶ Begin Learning"
            onPress={handleBeginLearning}
            size="large"
            style={styles.primaryButton}
          />

          <View style={styles.secondaryButtons}>
            <Button
              title="Review Learned"
              onPress={handleReviewLearned}
              variant="secondary"
              size="medium"
              style={styles.secondaryButton}
              icon={<IconSymbol name="arrow.clockwise" size={16} color={Colors.text} />}
            />

            <Button
              title="Flashcards"
              onPress={() => {}}
              variant="secondary"
              size="medium"
              style={styles.secondaryButton}
              icon={<IconSymbol name="rectangle.stack.fill" size={16} color={Colors.text} />}
            />
          </View>
        </View>

        {/* Reset Progress */}
        <TouchableOpacity style={styles.resetButton}>
          <IconSymbol name="trash.fill" size={20} color={Colors.danger} />
          <Text style={styles.resetText}>Reset Progress</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: {
    paddingHorizontal: Spacing['2xl'],
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
  errorText: {
    fontSize: Typography.lg,
    color: Colors.danger,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  actionsSection: {
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  resetText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.danger,
  },
});

