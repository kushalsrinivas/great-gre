import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '@/lib/constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = Colors.cardBackgroundLight,
  progressColor = Colors.primary,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

