import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WordCard } from '@/components/ui/WordCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useProgress } from '@/contexts/ProgressContext';
import { useUser } from '@/contexts/UserContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getVocabularyEntry, isWordBookmarked, toggleBookmark } from '@/lib/storage/database';
import { VocabularyEntry } from '@/lib/types';
import { updateLastSessionTime, scheduleDailyReminder } from '@/lib/services/notifications';

export default function LearningSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { listName, mode } = useLocalSearchParams<{ listName: string; mode: string }>();
  const { currentSession, startSession, answerWord, completeWord, goToPreviousWord, getCurrentWord, endSession } = useProgress();
  const { addWordsLearned, addGems } = useUser();
  
  const [vocabularyEntry, setVocabularyEntry] = useState<VocabularyEntry | null>(null);
  const [sessionSettings, setSessionSettings] = useState({
    wordCount: 10,
    order: 'random' as 'random' | 'serial',
  });
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [definitionRevealed, setDefinitionRevealed] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadCurrentWordDetails();
      // Reset definition revealed state when moving to a new word
      setDefinitionRevealed(false);
    }
  }, [currentSession?.currentIndex]);

  const initializeSession = async () => {
    if (!listName) return;
    
    try {
      await startSession(
        listName as string,
        sessionSettings.wordCount,
        sessionSettings.order,
        (mode as 'learn' | 'review') || 'learn',
        0
      );
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const loadCurrentWordDetails = async () => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;
    
    const entry = await getVocabularyEntry(currentWord.word);
    setVocabularyEntry(entry);
    
    // Check bookmark status
    const bookmarked = await isWordBookmarked(currentWord.id);
    setIsBookmarked(bookmarked);
  };
  
  const handleBookmark = async () => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;
    
    const newBookmarkState = await toggleBookmark(currentWord.id, currentWord.word);
    setIsBookmarked(newBookmarkState);
  };

  const handleAnswer = async (masteryLevel: 'dont_know' | 'unsure' | 'know_it') => {
    if (!currentSession) return;
    
    await answerWord(masteryLevel);
    
    // Add gems based on mastery level
    if (masteryLevel === 'know_it') {
      await addGems(10);
    } else if (masteryLevel === 'unsure') {
      await addGems(5);
    }
    
    // Check if session is complete
    if (currentSession.currentIndex + 1 >= currentSession.totalWords) {
      // Update words learned count
      await addWordsLearned(currentSession.results.knowIt + 1);
      
      // Update last session time and schedule next reminder
      await updateLastSessionTime();
      await scheduleDailyReminder();
      
      // Navigate to summary
      router.replace({
        pathname: '/(main)/session-summary',
        params: { listName, mode: currentSession.mode },
      });
    }
  };

  const handleComplete = async () => {
    if (!currentSession) return;
    
    await completeWord();
    await addGems(10);
    
    // Check if session is complete
    if (currentSession.currentIndex + 1 >= currentSession.totalWords) {
      // Update words learned count
      await addWordsLearned(currentSession.results.knowIt + 1);
      
      // Navigate to summary
      router.replace({
        pathname: '/(main)/session-summary',
        params: { listName, mode: currentSession.mode },
      });
    }
  };

  const handleGoBack = () => {
    goToPreviousWord();
  };

  const handleEndSession = () => {
    endSession();
    router.back();
  };

  const handleSettingsChange = async (newSettings: typeof sessionSettings) => {
    setSessionSettings(newSettings);
    // Restart session with new settings
    await startSession(
      listName as string,
      newSettings.wordCount,
      newSettings.order,
      (mode as 'learn' | 'review') || 'learn',
      0
    );
    setSettingsExpanded(false);
  };

  if (!currentSession) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing your session...</Text>
        </View>
      </View>
    );
  }

  const currentWord = getCurrentWord();
  const isLearnMode = currentSession.mode === 'learn';
  const isReviewMode = currentSession.mode === 'review';
  
  if (!currentWord) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Session complete!</Text>
        </View>
      </View>
    );
  }

  const progress = ((currentSession.currentIndex + 1) / currentSession.totalWords) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleEndSession}>
          <IconSymbol name="chevron.left" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isLearnMode ? 'LEARNING' : 'REVIEW'}</Text>
        <TouchableOpacity onPress={() => setSettingsExpanded(!settingsExpanded)}>
          <IconSymbol name="gearshape.fill" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>PROGRESS</Text>
          <Text style={styles.progressText}>
            {currentSession.currentIndex + 1} / {currentSession.totalWords}
          </Text>
        </View>
        <ProgressBar progress={progress} height={8} />
      </View>

      {/* Word Card */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <WordCard
          word={currentWord.word}
          definition={currentWord.definition}
          vocabularyEntry={vocabularyEntry}
          partOfSpeech="ADJECTIVE"
          pronunciation={currentWord.word.toLowerCase()}
          showBookmark={true}
          isBookmarked={isBookmarked}
          onBookmark={handleBookmark}
          hideDefinition={isReviewMode && !definitionRevealed}
          onRevealDefinition={() => setDefinitionRevealed(true)}
        />
      </ScrollView>

      {/* Answer Buttons */}
      {isLearnMode ? (
        <View style={[styles.answerSection, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
          <TouchableOpacity
            style={[styles.answerButton, styles.answerButtonGoBack]}
            onPress={handleGoBack}
            disabled={currentSession.currentIndex === 0}
          >
            <Text style={styles.answerIcon}>←</Text>
            <Text style={styles.answerText}>GO BACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.answerButtonComplete]}
            onPress={handleComplete}
          >
            <Text style={styles.answerIcon}>✓</Text>
            <Text style={styles.answerText}>COMPLETE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.answerSection, { paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}>
          <TouchableOpacity
            style={[styles.answerButton, styles.answerButtonDontKnow]}
            onPress={() => handleAnswer('dont_know')}
          >
            <Text style={styles.answerIcon}>✕</Text>
            <Text style={styles.answerText}>DON'T KNOW</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.answerButtonUnsure]}
            onPress={() => handleAnswer('unsure')}
          >
            <Text style={styles.answerIcon}>?</Text>
            <Text style={styles.answerText}>UNSURE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.answerButtonKnowIt]}
            onPress={() => handleAnswer('know_it')}
          >
            <Text style={styles.answerIcon}>★</Text>
            <Text style={styles.answerText}>KNOW IT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Next Session Setup (Expandable) */}
      {settingsExpanded && (
        <View style={styles.settingsPanel}>
          <Card style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>NEXT SESSION SETUP</Text>
            
            <Text style={styles.settingsLabel}>Words per session</Text>
            <View style={styles.settingsOptions}>
              {[5, 10, 20].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.settingOption,
                    sessionSettings.wordCount === count && styles.settingOptionActive,
                  ]}
                  onPress={() =>
                    handleSettingsChange({ ...sessionSettings, wordCount: count })
                  }
                >
                  <Text
                    style={[
                      styles.settingOptionText,
                      sessionSettings.wordCount === count && styles.settingOptionTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.settingOption, styles.settingOptionCustom]}
              >
                <Text style={styles.settingOptionText}>Custom</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.settingsLabel}>Order</Text>
            <View style={styles.settingsOptions}>
              <TouchableOpacity
                style={[
                  styles.settingOption,
                  sessionSettings.order === 'random' && styles.settingOptionActive,
                ]}
                onPress={() =>
                  handleSettingsChange({ ...sessionSettings, order: 'random' })
                }
              >
                <Text
                  style={[
                    styles.settingOptionText,
                    sessionSettings.order === 'random' && styles.settingOptionTextActive,
                  ]}
                >
                  Random
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.settingOption,
                  sessionSettings.order === 'serial' && styles.settingOptionActive,
                ]}
                onPress={() =>
                  handleSettingsChange({ ...sessionSettings, order: 'serial' })
                }
              >
                <Text
                  style={[
                    styles.settingOptionText,
                    sessionSettings.order === 'serial' && styles.settingOptionTextActive,
                  ]}
                >
                  Serial
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    letterSpacing: 2,
  },
  progressSection: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  progressText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  answerSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
  },
  answerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  answerButtonDontKnow: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  answerButtonUnsure: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  answerButtonKnowIt: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  answerButtonComplete: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  answerButtonGoBack: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  answerIcon: {
    fontSize: 32,
  },
  answerText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.text,
    letterSpacing: 1,
  },
  settingsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  settingsCard: {
    padding: Spacing.xl,
  },
  settingsTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  settingsLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  settingsOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  settingOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  settingOptionActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: Colors.primary,
  },
  settingOptionCustom: {
    flex: 0.8,
  },
  settingOptionText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  settingOptionTextActive: {
    color: Colors.primary,
  },
});

