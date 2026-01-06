import { Stack } from 'expo-router';
import { Colors } from '@/lib/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

