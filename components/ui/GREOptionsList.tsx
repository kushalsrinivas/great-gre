import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { GREOption } from '@/lib/questions/gre';
import { IconSymbol } from '@/components/ui/icon-symbol';

type SelectionMode = 'single' | 'multiple';

interface GREOptionsListProps {
  options: GREOption[];
  mode: SelectionMode;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  disabled: boolean;
  showResult: boolean;
  correctIds: Set<string>;
}

export const GREOptionsList: React.FC<GREOptionsListProps> = ({
  options,
  mode,
  selectedIds,
  onToggle,
  disabled,
  showResult,
  correctIds,
}) => {
  const selected = useMemo(() => selectedIds, [selectedIds]);

  const getOptionStyle = (id: string) => {
    const isSelected = selected.has(id);
    if (!showResult) {
      return [
        styles.option,
        isSelected ? styles.optionSelected : null,
      ];
    }

    const isCorrect = correctIds.has(id);
    const isIncorrectSelected = isSelected && !isCorrect;

    return [
      styles.option,
      isCorrect ? styles.optionCorrect : null,
      isIncorrectSelected ? styles.optionIncorrect : null,
    ];
  };

  const renderControl = (id: string) => {
    const isSelected = selected.has(id);
    const isCorrect = correctIds.has(id);

    if (showResult && isCorrect) {
      return (
        <View style={[styles.control, styles.controlCorrect]}>
          <IconSymbol name="checkmark" size={16} color={Colors.background} />
        </View>
      );
    }

    if (mode === 'multiple') {
      return (
        <View
          style={[
            styles.control,
            styles.controlSquare,
            isSelected ? styles.controlSelected : null,
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.control,
          styles.controlCircle,
          isSelected ? styles.controlSelected : null,
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = selected.has(opt.id);
        const showCheck = showResult && correctIds.has(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            style={getOptionStyle(opt.id)}
            onPress={() => onToggle(opt.id)}
            disabled={disabled}
            activeOpacity={0.85}
          >
            {renderControl(opt.id)}
            <View style={styles.textColumn}>
              <View style={styles.row}>
                <Text style={[styles.optionLabel, isSelected ? styles.optionLabelSelected : null]}>
                  {opt.id}.
                </Text>
                {showCheck && (
                  <IconSymbol name="checkmark.circle.fill" size={18} color={Colors.success} />
                )}
              </View>
              <Text style={styles.optionText}>{opt.text}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.10)',
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
  },
  optionIncorrect: {
    borderColor: Colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
  },
  control: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlCircle: {
    borderRadius: 11,
  },
  controlSquare: {
    borderRadius: 6,
  },
  controlSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  controlCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  textColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  optionLabelSelected: {
    color: Colors.text,
  },
  optionText: {
    fontSize: Typography.base,
    color: Colors.text,
    lineHeight: 22,
  },
});

