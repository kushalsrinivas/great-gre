import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { useUser } from '@/contexts/UserContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Scholar {user?.name || 'Alex'}</Text>
            <Text style={styles.profileEmail}>Member since {new Date(user?.startDate || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>
      </Card>

      {/* Settings Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🎯</Text>
              <Text style={styles.optionText}>Daily Goal</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>{user?.dailyGoal || 10} words</Text>
              <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🔔</Text>
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <View style={styles.optionRight}>
              <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🌙</Text>
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>Always On</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>ℹ️</Text>
              <Text style={styles.optionText}>App Version</Text>
            </View>
            <Text style={styles.optionValue}>1.0.0</Text>
          </TouchableOpacity>
        </Card>

        <Card style={[styles.optionCard, styles.dangerCard]}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>⚠️</Text>
              <Text style={[styles.optionText, styles.dangerText]}>Reset All Progress</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: Spacing['5xl'],
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing['3xl'],
  },
  profileCard: {
    marginBottom: Spacing['3xl'],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.text,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  optionCard: {
    marginBottom: Spacing.sm,
    padding: 0,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.text,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  optionValue: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  dangerCard: {
    borderColor: Colors.danger,
    borderWidth: 1,
  },
  dangerText: {
    color: Colors.danger,
  },
});

