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
import { ReadinessGauge } from '@/components/ui/ReadinessGauge';
import { ForgettingRiskCard } from '@/components/ui/ForgettingRiskCard';
import { RetentionHealthCard } from '@/components/ui/RetentionHealthCard';
import { LearningEfficiencyCard } from '@/components/ui/LearningEfficiencyCard';
import { WeaknessAnalysisCard } from '@/components/ui/WeaknessAnalysisCard';
import { ConsistencyMetricsCard } from '@/components/ui/ConsistencyMetricsCard';
import { ProgressQualityCard } from '@/components/ui/ProgressQualityCard';
import { MicroInsightCard } from '@/components/ui/MicroInsightCard';
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

  const advancedStats = stats.advancedStats;

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
        <Text style={styles.subtitle}>Advanced learning analytics</Text>
      </View>

      {/* GRE Readiness - Flagship Feature */}
      {advancedStats && (
        <View style={styles.section}>
          <ReadinessGauge
            score={advancedStats.greReadiness.score}
            status={advancedStats.greReadiness.status}
          />
        </View>
      )}

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

      {/* Micro Insights - Rotating "Did you know?" */}
      {advancedStats && advancedStats.microInsights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          <View style={styles.insightsContainer}>
            {advancedStats.microInsights.map((insight, index) => (
              <MicroInsightCard key={index} insight={insight} />
            ))}
          </View>
        </View>
      )}

      {/* Forgetting Risk - High Impact */}
      {advancedStats && (
        <View style={styles.section}>
          <ForgettingRiskCard
            highRisk={advancedStats.forgettingRisk.highRisk}
            mediumRisk={advancedStats.forgettingRisk.mediumRisk}
            safeWords={advancedStats.forgettingRisk.safeWords}
            onWordPress={(wordId) => {
              // TODO: Navigate to word detail
              console.log('Navigate to word:', wordId);
            }}
          />
        </View>
      )}

      {/* Retention Health */}
      {advancedStats && (
        <View style={styles.section}>
          <RetentionHealthCard retentionHealth={advancedStats.retentionHealth} />
        </View>
      )}

      {/* Learning Efficiency */}
      {advancedStats && (
        <View style={styles.section}>
          <LearningEfficiencyCard learningEfficiency={advancedStats.learningEfficiency} />
        </View>
      )}

      {/* Progress Quality - Speed vs Stability */}
      {advancedStats && (
        <View style={styles.section}>
          <ProgressQualityCard progressQuality={advancedStats.progressQuality} />
        </View>
      )}

      {/* Mastery Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mastery Breakdown</Text>
        <MasteryChart
          dontKnow={stats.masteryBreakdown.dontKnow}
          unsure={stats.masteryBreakdown.unsure}
          knowIt={stats.masteryBreakdown.knowIt}
        />
      </View>

      {/* Consistency Metrics */}
      {advancedStats && (
        <View style={styles.section}>
          <ConsistencyMetricsCard consistencyMetrics={advancedStats.consistencyMetrics} />
        </View>
      )}

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

      {/* Weakness Analysis */}
      {advancedStats && (
        <View style={styles.section}>
          <WeaknessAnalysisCard
            weaknessAnalysis={advancedStats.weaknessAnalysis}
            onWordPress={(wordId) => {
              // TODO: Navigate to word detail
              console.log('Navigate to word:', wordId);
            }}
          />
        </View>
      )}

      {/* Vocabulary Coverage */}
      {advancedStats && (
        <View style={styles.section}>
          <Card style={styles.coverageCard}>
            <Text style={styles.cardTitle}>📖 Vocabulary Coverage</Text>
            <View style={styles.coverageContent}>
              <Text style={styles.coveragePercentage}>
                {advancedStats.greReadiness.vocabularyCoverage}%
              </Text>
              <Text style={styles.coverageLabel}>
                of GRE vocabulary covered
              </Text>
            </View>
            <Text style={styles.coverageDescription}>
              {advancedStats.greReadiness.vocabularyCoverage < 50
                ? 'Keep learning! You\'re building a solid foundation.'
                : advancedStats.greReadiness.vocabularyCoverage < 80
                ? 'Good progress! You\'re covering a significant portion.'
                : 'Excellent! You\'ve covered most of the GRE vocabulary.'}
            </Text>
          </Card>
        </View>
      )}

      {/* Bookmark Effectiveness */}
      {advancedStats && advancedStats.bookmarkEffectiveness.totalBookmarked > 0 && (
        <View style={styles.section}>
          <Card style={styles.bookmarkCard}>
            <Text style={styles.cardTitle}>🔖 Bookmark Effectiveness</Text>
            <View style={styles.bookmarkMetrics}>
              <View style={styles.bookmarkMetric}>
                <Text style={styles.bookmarkValue}>
                  {advancedStats.bookmarkEffectiveness.effectivenessPercentage}%
                </Text>
                <Text style={styles.bookmarkLabel}>Success Rate</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.bookmarkMetric}>
                <Text style={styles.bookmarkValue}>
                  {advancedStats.bookmarkEffectiveness.bookmarkedMastered}/
                  {advancedStats.bookmarkEffectiveness.totalBookmarked}
                </Text>
                <Text style={styles.bookmarkLabel}>Mastered</Text>
              </View>
            </View>
            <Text style={styles.bookmarkInsight}>
              {advancedStats.bookmarkEffectiveness.insight}
            </Text>
          </Card>
        </View>
      )}

      {/* Accuracy vs Time Trend */}
      {advancedStats && advancedStats.accuracyVsTimeMetrics.recentTests.length > 0 && (
        <View style={styles.section}>
          <Card style={styles.accuracyCard}>
            <Text style={styles.cardTitle}>📈 Test Performance Trend</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>
                {advancedStats.accuracyVsTimeMetrics.trend === 'improving' ? '📈 Improving' :
                 advancedStats.accuracyVsTimeMetrics.trend === 'declining' ? '📉 Declining' :
                 '➡️ Stable'}
              </Text>
            </View>
            <Text style={styles.accuracyInsight}>
              {advancedStats.accuracyVsTimeMetrics.insight}
            </Text>
          </Card>
        </View>
      )}

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

      {/* Learning Insights Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Summary</Text>
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
  insightsContainer: {
    gap: Spacing.md,
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
  coverageCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  coverageContent: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  coveragePercentage: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.extrabold,
    color: Colors.primary,
  },
  coverageLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  coverageDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bookmarkCard: {
    padding: Spacing.lg,
  },
  bookmarkMetrics: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bookmarkMetric: {
    flex: 1,
    alignItems: 'center',
  },
  bookmarkValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bookmarkLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: Spacing.sm,
  },
  bookmarkInsight: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  accuracyCard: {
    padding: Spacing.lg,
  },
  trendBadge: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  trendText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  accuracyInsight: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
