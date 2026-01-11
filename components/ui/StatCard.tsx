import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  style?: ViewStyle;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const StatCard = ({
  icon,
  label,
  value,
  subtitle,
  style,
  variant = 'default',
}: StatCardProps) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          iconBg: 'rgba(59, 130, 246, 0.2)',
          valueColor: Colors.primary,
        };
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.1)',
          iconBg: 'rgba(16, 185, 129, 0.2)',
          valueColor: Colors.success,
        };
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          iconBg: 'rgba(245, 158, 11, 0.2)',
          valueColor: '#F59E0B',
        };
      default:
        return {
          background: Colors.cardBackground,
          iconBg: 'rgba(255, 255, 255, 0.05)',
          valueColor: Colors.text,
        };
    }
  };

  const colors = getVariantColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: colors.valueColor }]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
  },
  subtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
