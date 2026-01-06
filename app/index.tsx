import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/lib/constants/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { isOnboardingCompleted } from '@/lib/storage/async-storage';
import { importWordLists, checkDataImportStatus } from '@/lib/storage/import-data';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing streaks...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Step 1: Check data import
      setProgress(20);
      setStatusText('Checking word database...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataExists = await checkDataImportStatus();
      
      if (!dataExists) {
        setProgress(40);
        setStatusText('Importing core knowledge base...');
        await importWordLists();
      } else {
        setProgress(60);
        setStatusText('Core knowledge base loaded.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Check onboarding status
      setProgress(80);
      setStatusText('Preparing your arena...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const onboardingDone = await isOnboardingCompleted();
      
      setProgress(100);
      setStatusText('Importing core knowledge base complete.');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to appropriate screen
      if (onboardingDone) {
        router.replace('/(main)/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setStatusText('Error loading app. Please restart.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎓</Text>
        </View>
        <Text style={styles.title}>
          GRE<Text style={styles.titleBlue}>World</Text>
        </Text>
        <Text style={styles.subtitle}>VOCABULARY ARENA</Text>
      </View>

      {/* Loading animation - circular pattern */}
      <View style={styles.loadingAnimation}>
        <View style={styles.circle} />
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{statusText}</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
        <ProgressBar progress={progress} height={6} />
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingVertical: Spacing['5xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing['5xl'],
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  titleBlue: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    letterSpacing: 4,
  },
  loadingAnimation: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    backgroundColor: Colors.cardBackground,
  },
  progressSection: {
    gap: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  statusText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

