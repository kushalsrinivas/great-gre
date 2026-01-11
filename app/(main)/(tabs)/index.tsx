import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUser } from "@/contexts/UserContext";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/lib/constants/theme";
import { getEncouragementMessage } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, todayProgress, dailyGoal, streak, gems, refreshUser } =
    useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  const progressPercentage = (todayProgress / dailyGoal) * 100;
  const encouragementText = getEncouragementMessage(todayProgress, dailyGoal);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </Text>
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Scholar {user?.name || "Alex"}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(main)/(tabs)/settings")}
        >
          <IconSymbol name="gearshape.fill" size={28} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Hello, Scholar 👋</Text>

      {/* Stats Badges */}
      <View style={styles.badgesContainer}>
        <Badge
          text={`${streak} Day Streak`}
          icon={<Text style={styles.badgeIcon}>🔥</Text>}
          variant="streak"
        />
        <Badge
          text={`${gems} Gems`}
          icon={<Text style={styles.badgeIcon}>💎</Text>}
          variant="gems"
        />
      </View>

      {/* Today's Goal Card */}

      <Card style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalLabel}>Today's Goal</Text>
          <Text style={styles.goalProgress}>
            {todayProgress}/{dailyGoal}
          </Text>
        </View>
        <Text style={styles.goalTitle}>Learn {dailyGoal} new words</Text>
        <ProgressBar
          progress={progressPercentage}
          height={10}
          style={styles.progressBar}
        />
        <Text style={styles.encouragementText}>{encouragementText}</Text>
      </Card>

      {/* Learn Words - Primary Action */}
      <TouchableOpacity
        style={styles.primaryCard}
        onPress={() => router.push("/(main)/(tabs)/lists")}
      >
        <View style={styles.primaryCardContent}>
          <View style={styles.primaryCardIcon}>
            <Text style={styles.primaryIconText}>🎓</Text>
          </View>
          <View style={styles.primaryCardText}>
            <View style={styles.startBadge}>
              <Text style={styles.startBadgeText}>START HERE</Text>
            </View>
            <Text style={styles.primaryCardTitle}>Learn Words</Text>
            <Text style={styles.primaryCardSubtitle}>
              Start your daily session
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.goalContainer}>
        <Button
          title="Review Learned Words"
          onPress={() => router.push("/(main)/(tabs)/review")}
          variant="secondary"
          size="large"
          style={styles.reviewButton}
          icon={<Text style={styles.reviewIcon}>🔄</Text>}
        />
      </View>

      {/* Action Cards Grid */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(main)/(tabs)/test")}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: "rgba(16, 185, 129, 0.2)" },
            ]}
          >
            <Text style={styles.actionIconText}>📋</Text>
          </View>
          <Text style={styles.actionTitle}>Take Test</Text>
          <Text style={styles.actionSubtitle}>Test your skills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(main)/(tabs)/review")}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: "rgba(168, 85, 247, 0.2)" },
            ]}
          >
            <Text style={styles.actionIconText}>📊</Text>
          </View>
          <Text style={styles.actionTitle}>Progress</Text>
          <Text style={styles.actionSubtitle}>Check your stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(main)/(tabs)/lists")}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: "rgba(245, 158, 11, 0.2)" },
            ]}
          >
            <Text style={styles.actionIconText}>📚</Text>
          </View>
          <Text style={styles.actionTitle}>Word Lists</Text>
          <Text style={styles.actionSubtitle}>Browse collections</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(main)/(tabs)/lists")}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: "rgba(236, 72, 153, 0.2)" },
            ]}
          >
            <Text style={styles.actionIconText}>🔍</Text>
          </View>
          <Text style={styles.actionTitle}>Search</Text>
          <Text style={styles.actionSubtitle}>Find a word</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.learnedToday}>
          <Text style={styles.learnedTodayLabel}>LEARNED TODAY</Text>
          <View style={styles.learnedTodayValue}>
            <Text style={styles.learnedTodayNumber}>{todayProgress} Words</Text>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  welcomeText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  goalContainer: {
    marginHorizontal: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  userName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  greeting: {
    fontSize: Typography["3xl"],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    paddingHorizontal: Spacing["2xl"],
    marginBottom: Spacing.lg,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  badgeIcon: {
    fontSize: 20,
  },
  goalCard: {
    marginHorizontal: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  goalLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  goalProgress: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  goalTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  progressBar: {
    marginBottom: Spacing.sm,
  },
  encouragementText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  primaryCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing["2xl"],
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  primaryCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  primaryCardIcon: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryIconText: {
    fontSize: 32,
  },
  primaryCardText: {
    flex: 1,
  },
  startBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  startBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.text,
    letterSpacing: 1,
  },
  primaryCardTitle: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  primaryCardSubtitle: {
    fontSize: Typography.base,
    color: "rgba(255, 255, 255, 0.9)",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
    marginBottom: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  bottomSection: {
    padding: Spacing["2xl"],
    gap: Spacing.lg,
    marginBottom: Spacing["3xl"],
  },
  learnedToday: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  learnedTodayLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  learnedTodayValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  learnedTodayNumber: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  checkmark: {
    fontSize: 24,
    color: Colors.success,
  },
  reviewButton: {
    width: "100%",
  },
  reviewIcon: {
    fontSize: 20,
  },
});
