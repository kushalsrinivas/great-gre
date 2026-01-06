import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/lib/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ReviewScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Review & Progress</Text>
      <Text style={styles.subtitle}>Track your learning journey</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Words to Review</Text>
        <Text style={styles.cardText}>
          You have words that need review. Regular practice helps solidify your vocabulary.
        </Text>
        <Button
          title="Start Review Session"
          onPress={() => router.push('/(main)/(tabs)/lists')}
          style={styles.button}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Coming Soon</Text>
        <Text style={styles.cardText}>
          • Progress charts{'\n'}
          • Test history{'\n'}
          • Performance analytics{'\n'}
          • Streak calendar
        </Text>
      </Card>
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
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing['3xl'],
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  cardText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  button: {
    width: '100%',
  },
});

