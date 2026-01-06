import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { initializeUserProfile } from '@/lib/storage/async-storage';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [learningVibe, setLearningVibe] = useState<'chill' | 'intense'>('chill');
  const [greTestDate, setGreTestDate] = useState('');
  const [dailyGoal, setDailyGoal] = useState(10);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Initialize user profile
      await initializeUserProfile(
        name || 'Scholar',
        new Date().toISOString(),
        dailyGoal,
        learningVibe,
        greTestDate || undefined
      );
      
      // Navigate to main app
      router.replace('/(main)/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleComplete}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📴</Text>
            </View>
            <Text style={styles.heading}>
              Study Anywhere,{'\n'}
              <Text style={styles.headingBlue}>Anytime</Text>
            </Text>
            <Text style={styles.description}>
              Learn 1000+ GRE words fully offline. No internet? No problem, keep
              learning on the go.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Choose Your{'\n'}Learning Vibe</Text>
            <Text style={styles.description}>
              How would you like to pace your learning?
            </Text>

            <View style={styles.vibeContainer}>
              <TouchableOpacity
                style={[
                  styles.vibeOption,
                  learningVibe === 'chill' && styles.vibeOptionSelected,
                ]}
                onPress={() => setLearningVibe('chill')}
              >
                <Text style={styles.vibeIcon}>😌</Text>
                <Text style={styles.vibeTitle}>Chill Mode</Text>
                <Text style={styles.vibeDesc}>Learn at your own pace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.vibeOption,
                  learningVibe === 'intense' && styles.vibeOptionSelected,
                ]}
                onPress={() => setLearningVibe('intense')}
              >
                <Text style={styles.vibeIcon}>🔥</Text>
                <Text style={styles.vibeTitle}>Intense Mode</Text>
                <Text style={styles.vibeDesc}>Fast-track your learning</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Let's Get Started!</Text>
            <Text style={styles.description}>
              Tell us a bit about yourself to personalize your experience.
            </Text>

            <Card style={styles.formCard}>
              <Text style={styles.label}>What should we call you?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Daily Learning Goal</Text>
              <View style={styles.goalContainer}>
                {[5, 10, 20, 30].map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalOption,
                      dailyGoal === goal && styles.goalOptionSelected,
                    ]}
                    onPress={() => setDailyGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalText,
                        dailyGoal === goal && styles.goalTextSelected,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.helperText}>words per day</Text>

              <Text style={styles.label}>When is your GRE test? (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., June 2026"
                placeholderTextColor={Colors.textSecondary}
                value={greTestDate}
                onChangeText={setGreTestDate}
              />
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Progress indicator */}
      <View style={styles.footer}>
        <View style={styles.progressDots}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                step >= dot ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Button
          title={step === 3 ? 'Get Started →' : 'Next'}
          onPress={handleNext}
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Spacing['2xl'],
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.semibold,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['5xl'],
  },
  stepContainer: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 60,
  },
  heading: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 48,
  },
  headingBlue: {
    color: Colors.primary,
  },
  description: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: Spacing.xl,
  },
  vibeContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  vibeOption: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vibeOptionSelected: {
    borderColor: Colors.primary,
  },
  vibeIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  vibeTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  vibeDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    marginTop: Spacing.xl,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.text,
  },
  goalContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  goalOption: {
    flex: 1,
    backgroundColor: Colors.cardBackgroundLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  goalText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  goalTextSelected: {
    color: Colors.primary,
  },
  helperText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing['2xl'],
    gap: Spacing.xl,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  button: {
    width: '100%',
  },
});

