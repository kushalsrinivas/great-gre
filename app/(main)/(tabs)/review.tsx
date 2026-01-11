import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState, useEffect } from 'react';
import { getAllLearningProgress, getVocabularyEntry } from '@/lib/storage/database';
import { LearningProgress, VocabularyEntry } from '@/lib/types';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [learnedWords, setLearnedWords] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; vocab: VocabularyEntry } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadLearnedWords();
  }, []);

  const loadLearnedWords = async () => {
    try {
      setLoading(true);
      const progress = await getAllLearningProgress();
      // Only show words with 'know_it' mastery level
      const learned = progress.filter(p => p.masteryLevel === 'know_it');
      setLearnedWords(learned);
    } catch (error) {
      console.error('Error loading learned words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLearnedWords();
    setRefreshing(false);
  };

  const handleWordPress = async (word: LearningProgress) => {
    try {
      const vocab = await getVocabularyEntry(word.word);
      if (vocab) {
        setSelectedWord({ word: word.word, vocab });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error loading word details:', error);
    }
  };

  const handleStartReview = () => {
    if (learnedWords.length === 0) {
      return;
    }
    // Navigate to a review session with learned words
    router.push({
      pathname: '/(main)/learning-session',
      params: { listName: 'Review Session', mode: 'review' },
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading learned words...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { 
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 80 
      }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Review Words</Text>
        <Text style={styles.subtitle}>
          {learnedWords.length} {learnedWords.length === 1 ? 'word' : 'words'} learned
        </Text>
      </View>

      {/* Start Review Button */}
      {learnedWords.length > 0 && (
        <View style={styles.reviewButtonContainer}>
          <Button
            title={`Start Review Session (${learnedWords.length} words)`}
            onPress={handleStartReview}
            size="large"
            icon={<Text style={styles.buttonIcon}>🔄</Text>}
          />
        </View>
      )}

      {/* Empty State */}
      {learnedWords.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Words Learned Yet</Text>
          <Text style={styles.emptyText}>
            Start learning words from your lists to see them here for review.
          </Text>
          <Button
            title="Go to Lists"
            onPress={() => router.push('/(main)/(tabs)/lists')}
            variant="secondary"
            style={styles.emptyButton}
          />
        </Card>
      )}

      {/* Learned Words List */}
      {learnedWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Learned Words</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any word to see its definition
          </Text>
          
          <View style={styles.wordsGrid}>
            {learnedWords.map((word, index) => (
              <TouchableOpacity
                key={word.id || index}
                style={styles.wordCard}
                onPress={() => handleWordPress(word)}
                activeOpacity={0.7}
              >
                <Text style={styles.wordText}>{word.word}</Text>
                <View style={styles.wordMeta}>
                  <Text style={styles.reviewCount}>
                    {word.reviewCount} {word.reviewCount === 1 ? 'review' : 'reviews'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Word Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedWord?.word}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedWord?.vocab && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Definition</Text>
                    <Text style={styles.modalText}>{selectedWord.vocab.definition}</Text>
                  </View>

                  {selectedWord.vocab.shortExplanation && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Short Explanation</Text>
                      <Text style={styles.modalText}>{selectedWord.vocab.shortExplanation}</Text>
                    </View>
                  )}

                  {selectedWord.vocab.longExplanation && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Detailed Explanation</Text>
                      <Text style={styles.modalText}>{selectedWord.vocab.longExplanation}</Text>
                    </View>
                  )}

                  {selectedWord.vocab.synonyms && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Synonyms</Text>
                      <Text style={styles.modalText}>{selectedWord.vocab.synonyms}</Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    // Dynamic padding applied inline
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  header: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  reviewButtonContainer: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['3xl'],
  },
  buttonIcon: {
    fontSize: 20,
  },
  emptyCard: {
    marginHorizontal: Spacing['2xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  wordCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    minWidth: '47%',
    maxWidth: '47%',
  },
  wordText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  wordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    paddingTop: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalBody: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
  },
  modalSection: {
    marginBottom: Spacing.xl,
  },
  modalSectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalText: {
    fontSize: Typography.base,
    color: Colors.text,
    lineHeight: 24,
  },
  modalFooter: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
