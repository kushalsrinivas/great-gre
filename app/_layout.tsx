import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { initDatabase } from '@/lib/storage/database';
import { importWordLists } from '@/lib/storage/import-data';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/lib/constants/theme';

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      // Import word lists on first launch
      await importWordLists();
      setDbInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <UserProvider>
      <ProgressProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </ProgressProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
