import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { useUser } from '@/contexts/UserContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { resetAllData } from '@/lib/storage/async-storage';
import { getDatabase } from '@/lib/storage/database';
import { reimportWordLists } from '@/lib/storage/import-data';
import { useState, useEffect } from 'react';
import { requestNotificationPermissions, cancelAllReminders, scheduleDailyReminder } from '@/lib/services/notifications';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [isReimporting, setIsReimporting] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      if (value) {
        // Request permissions and enable notifications
        const granted = await requestNotificationPermissions();
        if (granted) {
          await scheduleDailyReminder();
          setNotificationsEnabled(true);
          Alert.alert(
            'Notifications Enabled',
            'You will receive daily reminders to keep your learning streak alive!'
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'Please enable notifications in your device settings to receive learning reminders.'
          );
        }
      } else {
        // Disable notifications
        await cancelAllReminders();
        setNotificationsEnabled(false);
        Alert.alert(
          'Notifications Disabled',
          'You will no longer receive daily learning reminders.'
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const handleRefreshWordData = () => {
    Alert.alert(
      'Refresh Word Data',
      'This will reload all word lists and definitions from the source files. Your learning progress will be preserved. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Refresh',
          onPress: async () => {
            try {
              setIsReimporting(true);
              const success = await reimportWordLists();
              setIsReimporting(false);
              
              if (success) {
                Alert.alert(
                  'Success',
                  'Word data has been refreshed successfully!',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Error', 'Failed to refresh word data. Please try again.');
              }
            } catch (error) {
              console.error('Error refreshing word data:', error);
              setIsReimporting(false);
              Alert.alert('Error', 'Failed to refresh word data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'Are you sure you want to reset all your progress? This will delete all learned words, test scores, and statistics. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage data
              await resetAllData();
              
              // Clear database learning progress and test scores
              const database = getDatabase();
              await database.execAsync(`
                DELETE FROM learning_progress;
                DELETE FROM test_scores;
              `);
              
              Alert.alert(
                'Success',
                'All progress has been reset. The app will now restart.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to onboarding
                      router.replace('/(auth)/onboarding');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error resetting progress:', error);
              Alert.alert('Error', 'Failed to reset progress. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, { 
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80 
      }]}
    >
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
              <IconSymbol name="target" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Daily Goal</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>{user?.dailyGoal || 10} words</Text>
              <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.optionCard}>
          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <IconSymbol name="bell.fill" size={24} color={Colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Daily Reminders</Text>
                <Text style={styles.optionSubtext}>
                  Get notified 24 hours after your last session
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.cardBackgroundLight, true: Colors.primary }}
              thumbColor={Colors.text}
            />
          </View>
        </Card>

        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <IconSymbol name="moon.fill" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>Always On</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <Card style={styles.optionCard}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={handleRefreshWordData}
            disabled={isReimporting}
          >
            <View style={styles.optionLeft}>
              <IconSymbol name="arrow.clockwise" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Refresh Word Data</Text>
            </View>
            {isReimporting && (
              <ActivityIndicator size="small" color={Colors.primary} />
            )}
          </TouchableOpacity>
        </Card>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <IconSymbol name="info.circle.fill" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>App Version</Text>
            </View>
            <Text style={styles.optionValue}>1.0.0</Text>
          </TouchableOpacity>
        </Card>

        <Card style={[styles.optionCard, styles.dangerCard]}>
          <TouchableOpacity style={styles.option} onPress={handleResetProgress}>
            <View style={styles.optionLeft}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={Colors.danger} />
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
  optionTextContainer: {
    flex: 1,
  },
  optionSubtext: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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

