import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';
import { LearningEfficiency } from '@/lib/types';
import { ProgressBar } from './ProgressBar';

interface LearningEfficiencyCardProps {
  learningEfficiency: LearningEfficiency;
}

export const LearningEfficiencyCard = ({
  learningEfficiency,
}: LearningEfficiencyCardProps) => {
  const { masteryConversionFunnel } = learningEfficiency;
  const total =
    masteryConversionFunnel.dontKnow +
    masteryConversionFunnel.unsure +
    masteryConversionFunnel.knowIt;

  const dontKnowPercent = total > 0 ? (masteryConversionFunnel.dontKnow / total) * 100 : 0;
  const unsurePercent = total > 0 ? (masteryConversionFunnel.unsure / total) * 100 : 0;
  const knowItPercent = total > 0 ? (masteryConversionFunnel.knowIt / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Efficiency</Text>
        <Text style={styles.subtitle}>How effectively you master words</Text>
      </View>

      {/* Reviews Per Learned Word */}
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Average Reviews to Master</Text>
        <Text style={styles.metricValue}>
          {learningEfficiency.reviewsPerLearnedWord}
          <Text style={styles.metricUnit}> reviews/word</Text>
        </Text>
        <View style={styles.metricDescriptionContainer}>
          <IconSymbol 
            name={learningEfficiency.reviewsPerLearnedWord <= 3 ? 'bolt.fill' :
                  learningEfficiency.reviewsPerLearnedWord <= 5 ? 'hand.thumbsup.fill' :
                  'brain.head.profile'}
            size={16}
            color={learningEfficiency.reviewsPerLearnedWord <= 3 ? Colors.warning :
                   learningEfficiency.reviewsPerLearnedWord <= 5 ? Colors.success :
                   Colors.primary}
          />
          <Text style={styles.metricDescription}>
            {learningEfficiency.reviewsPerLearnedWord <= 3
              ? 'Excellent! You master words quickly'
              : learningEfficiency.reviewsPerLearnedWord <= 5
              ? 'Good efficiency'
              : 'You prefer deep learning—great for retention'}
          </Text>
        </View>
      </View>

      {/* Mastery Conversion Funnel */}
      <View style={styles.funnelSection}>
        <Text style={styles.sectionTitle}>Mastery Conversion Funnel</Text>
        <Text style={styles.sectionDescription}>
          Where your words stand in the learning journey
        </Text>

        <View style={styles.funnelItem}>
          <View style={styles.funnelHeader}>
            <View style={styles.funnelLabelContainer}>
              <IconSymbol name="circle.fill" size={12} color={Colors.danger} />
              <Text style={styles.funnelLabel}>Don't Know</Text>
            </View>
            <Text style={styles.funnelCount}>
              {masteryConversionFunnel.dontKnow} words
            </Text>
          </View>
          <ProgressBar progress={dontKnowPercent} color={Colors.danger} height={8} />
        </View>

        <View style={styles.funnelItem}>
          <View style={styles.funnelHeader}>
            <View style={styles.funnelLabelContainer}>
              <IconSymbol name="circle.fill" size={12} color={Colors.warning} />
              <Text style={styles.funnelLabel}>Unsure</Text>
            </View>
            <Text style={styles.funnelCount}>
              {masteryConversionFunnel.unsure} words
            </Text>
          </View>
          <ProgressBar progress={unsurePercent} color={Colors.warning} height={8} />
        </View>

        <View style={styles.funnelItem}>
          <View style={styles.funnelHeader}>
            <View style={styles.funnelLabelContainer}>
              <IconSymbol name="circle.fill" size={12} color={Colors.success} />
              <Text style={styles.funnelLabel}>Know It</Text>
            </View>
            <Text style={styles.funnelCount}>
              {masteryConversionFunnel.knowIt} words
            </Text>
          </View>
          <ProgressBar progress={knowItPercent} color={Colors.success} height={8} />
        </View>
      </View>

      {/* Insight */}
      {unsurePercent > 50 && (
        <View style={styles.insightBox}>
          <IconSymbol name="lightbulb.fill" size={16} color={Colors.warning} />
          <Text style={styles.insightText}>
            Most words are in "Unsure" stage. Focus on deep revision to move them to
            "Know It"!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  metricCard: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  metricLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  metricUnit: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  metricDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  metricDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  funnelSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  funnelItem: {
    marginBottom: Spacing.lg,
  },
  funnelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  funnelLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  funnelLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  funnelCount: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.text,
    lineHeight: 20,
  },
});
