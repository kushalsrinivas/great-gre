import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { MicroInsight } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface MicroInsightCardProps {
  insight: MicroInsight;
}

export const MicroInsightCard = ({ insight }: MicroInsightCardProps) => {
  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'positive':
        return 'rgba(16, 185, 129, 0.1)';
      case 'suggestion':
        return 'rgba(245, 158, 11, 0.1)';
      case 'neutral':
        return Colors.cardBackgroundLight;
    }
  };

  const getBorderColor = () => {
    switch (insight.type) {
      case 'positive':
        return Colors.success;
      case 'suggestion':
        return Colors.warning;
      case 'neutral':
        return Colors.border;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <View style={styles.icon}>
        <IconSymbol
          name={(insight.icon || 'lightbulb.fill') as any}
          size={22}
          color={insight.type === 'positive' ? Colors.success : insight.type === 'suggestion' ? Colors.warning : Colors.textSecondary}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{insight.title}</Text>
        <Text style={styles.message}>{insight.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
