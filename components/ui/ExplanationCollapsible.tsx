import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ExplanationCollapsibleProps {
  title?: string;
  explanation: string;
  enabled: boolean;
  defaultOpen?: boolean;
}

export const ExplanationCollapsible: React.FC<ExplanationCollapsibleProps> = ({
  title = 'Detailed Explanation',
  explanation,
  enabled,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const hasContent = useMemo(() => explanation.trim().length > 0, [explanation]);
  const canToggle = enabled && hasContent;

  if (!enabled || !hasContent) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <IconSymbol name="info.circle.fill" size={18} color={Colors.primary} />
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          onPress={() => canToggle && setOpen((v) => !v)}
          activeOpacity={0.8}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleText}>{open ? 'Hide' : 'Show'}</Text>
          <IconSymbol
            name="chevron.right"
            size={16}
            color={Colors.primary}
            style={{ transform: [{ rotate: open ? '-90deg' : '90deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {open && (
        <Text style={styles.body}>{explanation.trim()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginTop: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  toggleText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  body: {
    fontSize: Typography.sm,
    color: Colors.text,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
});

