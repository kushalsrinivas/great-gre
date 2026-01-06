// Theme constants matching the design

export const Colors = {
  // Background colors
  background: '#1A1B2E',
  cardBackground: '#242538',
  cardBackgroundLight: '#2D2E42',
  
  // Primary colors
  primary: '#2563EB', // Blue
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  
  // Accent colors
  success: '#10B981', // Green
  warning: '#F59E0B', // Yellow/Orange
  danger: '#EF4444', // Red
  info: '#3B82F6', // Light Blue
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  
  // UI Element colors
  border: '#374151',
  borderLight: '#4B5563',
  
  // Special colors for word lists
  listColors: {
    blue: '#3B82F6',
    purple: '#A855F7',
    orange: '#F97316',
    green: '#10B981',
    pink: '#EC4899',
    yellow: '#F59E0B',
  },
  
  // Mastery level colors
  masteryDontKnow: '#EF4444',
  masteryUnsure: '#F59E0B',
  masteryKnowIt: '#2563EB',
  
  // Streak & Gems
  streakOrange: '#F97316',
  gemBlue: '#3B82F6',
};

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

