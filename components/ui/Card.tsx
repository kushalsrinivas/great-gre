import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/lib/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    { padding: Spacing[padding] },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
  },
  card_default: {
    backgroundColor: Colors.cardBackground,
  },
  card_elevated: {
    backgroundColor: Colors.cardBackground,
    ...Shadows.md,
  },
  card_outline: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

