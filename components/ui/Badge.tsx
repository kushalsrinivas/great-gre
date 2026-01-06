import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';

interface BadgeProps {
  text: string;
  icon?: React.ReactNode;
  variant?: 'streak' | 'gems' | 'info' | 'success' | 'warning';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  icon,
  variant = 'info',
  style,
}) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  badge_streak: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderColor: Colors.streakOrange,
  },
  badge_gems: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderWidth: 1,
    borderColor: Colors.gemBlue,
  },
  badge_info: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: Colors.info,
  },
  badge_success: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  badge_warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  text: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
});

