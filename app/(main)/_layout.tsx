import { Stack } from 'expo-router';
import { Colors } from '@/lib/constants/theme';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="list-detail" />
      <Stack.Screen name="learning-session" />
      <Stack.Screen name="session-summary" />
    </Stack>
  );
}

