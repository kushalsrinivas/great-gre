import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from './icon-symbol';

interface MasteryChartProps {
  dontKnow: number;
  unsure: number;
  knowIt: number;
}

export const MasteryChart = ({ dontKnow, unsure, knowIt }: MasteryChartProps) => {
  const total = dontKnow + unsure + knowIt;

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const dontKnowPercent = getPercentage(dontKnow);
  const unsurePercent = getPercentage(unsure);
  const knowItPercent = getPercentage(knowIt);

  const masteryLevels = [
    {
      label: "Don't Know",
      value: dontKnow,
      percentage: dontKnowPercent,
      color: Colors.danger,
      icon: 'xmark.circle.fill',
    },
    {
      label: 'Unsure',
      value: unsure,
      percentage: unsurePercent,
      color: '#F59E0B',
      icon: 'questionmark.circle.fill',
    },
    {
      label: 'Know It',
      value: knowIt,
      percentage: knowItPercent,
      color: Colors.success,
      icon: 'checkmark.circle.fill',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        {knowItPercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              { width: `${knowItPercent}%`, backgroundColor: Colors.success },
            ]}
          />
        )}
        {unsurePercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              { width: `${unsurePercent}%`, backgroundColor: '#F59E0B' },
            ]}
          />
        )}
        {dontKnowPercent > 0 && (
          <View
            style={[
              styles.progressSegment,
              { width: `${dontKnowPercent}%`, backgroundColor: Colors.danger },
            ]}
          />
        )}
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {masteryLevels.map((level, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <IconSymbol name={level.icon} size={20} color={level.color} />
              <Text style={styles.legendLabel}>{level.label}</Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.legendValue}>{level.value}</Text>
              <Text style={[styles.legendPercentage, { color: level.color }]}>
                {level.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      {total > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Words Reviewed</Text>
          <Text style={styles.totalValue}>{total}</Text>
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
  progressBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: Spacing.lg,
  },
  progressSegment: {
    height: '100%',
  },
  legendContainer: {
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendLabel: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  legendValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  legendPercentage: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    minWidth: 45,
    textAlign: 'right',
  },
  totalContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
});
