import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StreakCalendar } from '@/components/ui/StreakCalendar';
import { MasteryChart } from '@/components/ui/MasteryChart';
import { TestHistoryList } from '@/components/ui/TestHistoryList';
import { useStats } from '@/lib/hooks/useStats';
import { useState } from 'react';

export default function StatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats, loading, refresh } = useStats();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { 
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80 
      }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      {/* Key Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statRow}>
          <StatCard
            icon={<Text style={styles.statIcon}>📚</Text>}
            label="Words Learned"
            value={stats.totalWordsLearned}
            variant="primary"
            style={styles.statCard}
          />
          <StatCard
            icon={<Text style={styles.statIcon}>🔥</Text>}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            variant="success"
            style={styles.statCard}
          />
        </View>
        <View style={styles.statRow}>
          <StatCard
            icon={<Text style={styles.statIcon}>🎯</Text>}
            label="Test Accuracy"
            value={`${stats.testAccuracy}%`}
            variant="warning"
            style={styles.statCard}
          />
          <StatCard
            icon={<Text style={styles.statIcon}>⚡</Text>}
            label="Learning Velocity"
            value={`${stats.learningVelocity}/day`}
            variant="default"
            style={styles.statCard}
          />
        </View>
      </View>

      {/* Mastery Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mastery Breakdown</Text>
        <MasteryChart
          dontKnow={stats.masteryBreakdown.dontKnow}
          unsure={stats.masteryBreakdown.unsure}
          knowIt={stats.masteryBreakdown.knowIt}
        />
      </View>

      {/* Streak Calendar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity Calendar</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>
              🏆 Best: {stats.maxStreak} days
            </Text>
          </View>
        </View>
        <StreakCalendar streakDays={stats.streakDays} />
      </View>

      {/* Learning Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Insights</Text>
        <Card style={styles.insightsCard}>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Total Reviews</Text>
              <Text style={styles.insightValue}>{stats.totalReviews}</Text>
            </View>
            <View style={styles.insightDivider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Days Active</Text>
              <Text style={styles.insightValue}>{stats.daysActive}</Text>
            </View>
            <View style={styles.insightDivider} />
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>Max Streak</Text>
              <Text style={styles.insightValue}>{stats.maxStreak}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Test History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          {stats.testHistory.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/test')}>
              <Text style={styles.sectionLink}>Take Test →</Text>
            </TouchableOpacity>
          )}
        </View>
        <TestHistoryList
          tests={stats.testHistory}
          onTestPress={() => router.push('/(main)/(tabs)/test')}
        />
      </View>

      {/* Word Lists Progress */}
      {stats.wordLists.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lists Progress</Text>
          <View style={styles.listsContainer}>
            {stats.wordLists.slice(0, 5).map((list) => (
              <TouchableOpacity
                key={list.id}
                style={styles.listItem}
                onPress={() => router.push('/(main)/(tabs)/lists')}
              >
                <View style={styles.listLeft}>
                  <View
                    style={[styles.listColorDot, { backgroundColor: list.color }]}
                  />
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listProgress}>
                      {list.learnedWords}/{list.totalWords} words
                    </Text>
                  </View>
                </View>
                <Text style={styles.listPercentage}>{list.masteryPercentage}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionSection}>
        <Button
          title="Continue Learning"
          onPress={() => router.push('/(main)/(tabs)/lists')}
          size="large"
          icon={<Text style={styles.buttonIcon}>🎓</Text>}
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
  content: {
    // Dynamic padding applied inline
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  header: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  statsGrid: {
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  statRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
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
    marginBottom: Spacing.lg,
  },
  sectionLink: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  streakBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  streakBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.success,
  },
  insightsCard: {
    padding: Spacing.lg,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  insightValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  insightDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  listsContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  listColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  listProgress: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  listPercentage: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  actionSection: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing.lg,
  },
  buttonIcon: {
    fontSize: 20,
  },
});
