import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/lib/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./icon-symbol";
import { CircularProgress } from "./CircularProgress";

interface ReadinessGaugeProps {
  score: number; // 0-100
  status: string;
}

export const ReadinessGauge = ({ score, status }: ReadinessGaugeProps) => {
  const getStatusColor = () => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.primary;
    if (score >= 30) return Colors.warning;
    return Colors.danger;
  };

  const getStatusIcon = () => {
    if (score >= 80) return "graduationcap.fill";
    if (score >= 60) return "books.vertical.fill";
    if (score >= 30) return "book.fill";
    return "leaf.fill";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GRE Readiness</Text>
        <IconSymbol name={getStatusIcon()} size={24} color={getStatusColor()} />
      </View>

      <View style={styles.gaugeContainer}>
        <CircularProgress
          size={180}
          strokeWidth={12}
          progress={score}
          progressColor={getStatusColor()}
        />
        <View style={styles.centerContent}></View>
      </View>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: `${getStatusColor()}20` },
        ]}
      >
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {status}
        </Text>
      </View>

      <Text style={styles.description}>
        Your composite score based on vocabulary, retention, accuracy, and
        consistency
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  gaugeContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: Typography["5xl"],
    fontWeight: Typography.extrabold,
  },
  outOf: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  statusText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
  },
});
