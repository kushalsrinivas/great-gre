import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.text : Colors.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  button_primary: {
    backgroundColor: Colors.primary,
  },
  button_secondary: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button_danger: {
    backgroundColor: Colors.danger,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  button_medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  button_large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
  },
  button_disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: Typography.semibold,
  },
  text_primary: {
    color: Colors.text,
    fontSize: Typography.base,
  },
  text_secondary: {
    color: Colors.text,
    fontSize: Typography.base,
  },
  text_danger: {
    color: Colors.text,
    fontSize: Typography.base,
  },
  text_ghost: {
    color: Colors.primary,
    fontSize: Typography.base,
  },
  text_small: {
    fontSize: Typography.sm,
  },
  text_medium: {
    fontSize: Typography.base,
  },
  text_large: {
    fontSize: Typography.lg,
  },
  text_disabled: {
    opacity: 0.7,
  },
});

