import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getTotalWordsLearned, getTestAccuracy } from '@/lib/storage/database';

export default function TestingCenterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [wordsLearned, setWordsLearned] = useState(0);
  const [recentAccuracy, setRecentAccuracy] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const learned = await getTotalWordsLearned();
    const accuracy = await getTestAccuracy();
    setWordsLearned(learned);
    setRecentAccuracy(accuracy);
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, { 
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80 
      }]}
    >
      <Text style={styles.title}>Testing Center</Text>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <IconSymbol name="books.vertical.fill" size={32} color={Colors.primary} />
          <Text style={styles.statLabel}>Words Learned</Text>
          <Text style={styles.statValue}>{wordsLearned}</Text>
        </Card>

        <Card style={styles.statCard}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color={Colors.success} />
          <Text style={styles.statLabel}>Recent Accuracy</Text>
          <Text style={styles.statValue}>{recentAccuracy}%</Text>
        </Card>
      </View>

      {/* Multiple Choice Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multiple Choice (MCQ)</Text>

        <Card style={styles.testCard}>
          <View style={styles.testHeader}>
            <View style={styles.testIconContainer}>
              <IconSymbol name="graduationcap.fill" size={28} color={Colors.primary} />
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>Learned Words</Text>
              <Text style={styles.testDescription}>
                Test your memory on words you've studied.
              </Text>
            </View>
          </View>
          <Button
            title="Start Test"
            onPress={() =>
              router.push({
                pathname: '/(main)/test-mcq',
                params: { type: 'learned' },
              })
            }
            style={styles.testButton}
          />
        </Card>

        <Card style={styles.testCard}>
          <View style={styles.testHeader}>
            <View style={[styles.testIconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
              <IconSymbol name="sparkles" size={28} color="#A855F7" />
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>Random Words</Text>
              <Text style={styles.testDescription}>
                Challenge yourself with new vocabulary.
              </Text>
            </View>
          </View>
          <Button
            title="Start Test"
            onPress={() =>
              router.push({
                pathname: '/(main)/test-mcq',
                params: { type: 'random' },
              })
            }
            variant="secondary"
            style={styles.testButton}
          />
        </Card>
      </View>

      {/* Written Response Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Written Response</Text>

        <Card style={styles.testCard}>
          <View style={styles.testHeader}>
            <View style={[styles.testIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <IconSymbol name="pencil" size={28} color={Colors.success} />
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>Learned Words</Text>
              <Text style={styles.testDescription}>
                Practice spelling and precise recall.
              </Text>
            </View>
          </View>
          <Button
            title="Start Writing"
            onPress={() =>
              router.push({
                pathname: '/(main)/test-written',
                params: { type: 'learned' },
              })
            }
            style={styles.testButton}
          />
        </Card>

        <Card style={styles.testCard}>
          <View style={styles.testHeader}>
            <View style={[styles.testIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <IconSymbol name="flame.fill" size={28} color={Colors.warning} />
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>Random Words</Text>
              <Text style={styles.testDescription}>
                Test yourself on new words.
              </Text>
            </View>
          </View>
          <Button
            title="Start Writing"
            onPress={() =>
              router.push({
                pathname: '/(main)/test-written',
                params: { type: 'random' },
              })
            }
            variant="secondary"
            style={styles.testButton}
          />
        </Card>
      </View>

      {/* Advanced Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced</Text>

        <Card style={[styles.testCard, styles.lockedCard]}>
          <View style={styles.testHeader}>
            <View style={[styles.testIconContainer, { backgroundColor: 'rgba(107, 114, 128, 0.2)' }]}>
              <IconSymbol name="cpu" size={28} color={Colors.textSecondary} />
            </View>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>Adaptive Test</Text>
              <Text style={styles.testDescription}>
                AI-driven difficulty adjustment based on performance.
              </Text>
            </View>
          </View>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>COMING SOON</Text>
          </View>
          <View style={styles.lockedOverlay}>
            <IconSymbol name="lock.fill" size={32} color={Colors.textSecondary} />
            <Text style={styles.lockedText}>Locked</Text>
          </View>
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
    marginBottom: Spacing['2xl'],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  testCard: {
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  testHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  testIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  testDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  testButton: {
    width: '100%',
  },
  lockedCard: {
    opacity: 0.6,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.cardBackgroundLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  comingSoonText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  lockedOverlay: {
    alignItems: 'center',
    marginTop: Spacing.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  lockedText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
});

