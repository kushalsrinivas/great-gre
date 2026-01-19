import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SESSION_KEY = '@last_learning_session';
const NOTIFICATION_PERMISSION_KEY = '@notification_permission_requested';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Mark that we've requested permissions
    await AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Learning Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Check if we should request notification permissions
 */
export async function shouldRequestPermissions(): Promise<boolean> {
  try {
    const alreadyRequested = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY);
    return !alreadyRequested;
  } catch (error) {
    console.error('Error checking notification permission status:', error);
    return false;
  }
}

/**
 * Update the last learning session timestamp
 */
export async function updateLastSessionTime(): Promise<void> {
  try {
    const now = Date.now();
    await AsyncStorage.setItem(LAST_SESSION_KEY, now.toString());
  } catch (error) {
    console.error('Error updating last session time:', error);
  }
}

/**
 * Get the last learning session timestamp
 */
export async function getLastSessionTime(): Promise<number | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SESSION_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last session time:', error);
    return null;
  }
}

/**
 * Schedule a daily learning reminder notification
 * This will trigger 24 hours after the last session
 */
export async function scheduleDailyReminder(): Promise<void> {
  try {
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('No notification permission, skipping reminder schedule');
      return;
    }

    // Schedule notification for 24 hours from now
    const trigger = {
      seconds: 24 * 60 * 60, // 24 hours
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to learn! 📚",
        body: "Don't break your streak! Learn 10 new GRE words today.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'daily-reminder' },
      },
      trigger,
    });

    console.log('Daily reminder scheduled for 24 hours from now');
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
}

/**
 * Check if user needs a reminder (hasn't learned in 24+ hours)
 * and send an immediate notification if needed
 */
export async function checkAndSendReminderIfNeeded(): Promise<void> {
  try {
    const lastSession = await getLastSessionTime();
    if (!lastSession) {
      // No previous session, don't send reminder yet
      return;
    }

    const now = Date.now();
    const hoursSinceLastSession = (now - lastSession) / (1000 * 60 * 60);

    // If it's been more than 24 hours, send a reminder
    if (hoursSinceLastSession >= 24) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Don't forget to learn! 🎓",
          body: `It's been ${Math.floor(hoursSinceLastSession)} hours since your last session. Keep your streak alive!`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'missed-session' },
        },
        trigger: null, // Send immediately
      });

      console.log('Sent immediate reminder notification');
    }
  } catch (error) {
    console.error('Error checking and sending reminder:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
  } catch (error) {
    console.error('Error cancelling reminders:', error);
  }
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}
