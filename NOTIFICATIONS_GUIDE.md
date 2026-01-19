# Daily Learning Notifications

## Overview
The app now includes an automated notification system that helps users maintain their learning streak by sending reminders 24 hours after their last learning session.

## Features

### 1. **Automatic Reminders**
- After completing a learning session, a notification is automatically scheduled for 24 hours later
- If the user hasn't learned in 24+ hours, they'll receive a reminder when they open the app

### 2. **Smart Notification Timing**
- Notifications are triggered 24 hours after the last completed session
- The system tracks when users complete learning sessions automatically
- No manual intervention required

### 3. **Settings Control**
- Users can enable/disable notifications from the Settings screen
- Toggle switch for "Daily Reminders" with description
- Permission requests are handled gracefully

## How It Works

### Session Tracking
When a user completes a learning session:
1. The timestamp is saved to AsyncStorage
2. A notification is scheduled for 24 hours later
3. Any previous scheduled notifications are cancelled

### Notification Triggers
The app checks for reminders in two scenarios:
1. **On App Launch**: Checks if 24+ hours have passed since last session
2. **After Session**: Schedules next reminder automatically

### Permission Handling
- First time: App requests notification permissions
- Permissions are remembered for future sessions
- Users can enable/disable in Settings at any time

## Implementation Details

### Files Modified/Created
1. **`lib/services/notifications.ts`** - Core notification service
2. **`app/_layout.tsx`** - Check reminders on app start
3. **`app/(main)/learning-session.tsx`** - Track session completion
4. **`app/(main)/(tabs)/settings.tsx`** - Settings UI for notifications

### Key Functions
- `updateLastSessionTime()` - Saves session timestamp
- `scheduleDailyReminder()` - Schedules 24-hour reminder
- `checkAndSendReminderIfNeeded()` - Checks and sends if needed
- `requestNotificationPermissions()` - Handles permission requests

## Installation

After pulling these changes, run:
```bash
npm install
```

This will install the required `expo-notifications` package.

## Testing

### Test Notification Scheduling
1. Complete a learning session
2. Check scheduled notifications (can be viewed in Settings)
3. Wait 24 hours or modify the timer for testing

### Test Permission Flow
1. Fresh install or clear app data
2. Complete first learning session
3. Permission dialog should appear
4. Grant or deny permissions

### Test Settings Toggle
1. Go to Settings
2. Toggle "Daily Reminders" switch
3. Verify notifications are enabled/disabled

## Platform Support

### iOS
- Uses native iOS notification system
- Requires notification permissions
- Notifications appear in Notification Center

### Android
- Uses Android notification channels
- "Daily Learning Reminders" channel created
- High priority notifications with vibration

### Web
- Limited notification support
- Falls back gracefully

## Notification Content

### Daily Reminder (24 hours)
- **Title**: "Time to learn! 📚"
- **Body**: "Don't break your streak! Learn 10 new GRE words today."

### Missed Session (24+ hours)
- **Title**: "Don't forget to learn! 🎓"
- **Body**: "It's been X hours since your last session. Keep your streak alive!"

## Future Enhancements
- Custom notification times
- Multiple daily reminders
- Streak-based notifications
- Achievement notifications
- Weekly progress summaries
