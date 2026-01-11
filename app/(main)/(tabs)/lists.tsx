import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Colors, Typography, Spacing, BorderRadius } from '@/lib/constants/theme';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WordList } from '@/lib/types';
import { getWordLists } from '@/lib/storage/database';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ListsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [lists, setLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const wordLists = await getWordLists();
      setLists(wordLists);
    } catch (error) {
      console.error('Error loading word lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListPress = (list: WordList) => {
    router.push({
      pathname: '/(main)/list-detail',
      params: { listName: list.name },
    });
  };

  const getListColor = (color: string) => {
    return color || Colors.listColors.blue;
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Word Lists</Text>
        <TouchableOpacity>
          <IconSymbol name="magnifyingglass" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* My Curriculum Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Curriculum</Text>

        {loading ? (
          <Card style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading word lists...</Text>
          </Card>
        ) : (
          lists
            .filter((list) => list.learnedWords > 0 || list.masteryPercentage > 0)
            .map((list) => (
              <TouchableOpacity
                key={list.id}
                onPress={() => handleListPress(list)}
                activeOpacity={0.7}
              >
                <Card style={styles.listCard}>
                  <View style={styles.listContent}>
                    <View
                      style={[
                        styles.listIcon,
                        { backgroundColor: getListColor(list.color) },
                      ]}
                    >
                      <Text style={styles.listIconText}>
                        {list.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.listInfo}>
                      <View style={styles.listHeader}>
                        <Text style={styles.listName}>{list.name}</Text>
                        {list.masteryPercentage > 50 && (
                          <Text style={styles.trendIcon}>📈</Text>
                        )}
                      </View>
                      <Text style={styles.listDescription}>
                        {list.learnedWords}/{list.totalWords} words mastered
                      </Text>
                      <View style={styles.progressContainer}>
                        <ProgressBar
                          progress={list.masteryPercentage}
                          height={6}
                          style={styles.progressBar}
                        />
                        <Text style={styles.percentageText}>
                          {list.masteryPercentage}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
        )}
      </View>

      {/* Your Library Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Library</Text>

        {lists
          .filter((list) => list.learnedWords === 0 && list.masteryPercentage === 0)
          .map((list) => (
            <TouchableOpacity
              key={list.id}
              onPress={() => handleListPress(list)}
              activeOpacity={0.7}
            >
              <Card style={styles.listCard}>
                <View style={styles.listContent}>
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: getListColor(list.color) },
                    ]}
                  >
                    <Text style={styles.listIconText}>
                      {list.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listDescription}>
                      {list.description || `${list.totalWords} Essential Words`}
                    </Text>
                    <View style={styles.startButtonContainer}>
                      <Text style={styles.startButton}>Start Now</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}

        {/* Custom Lists Option */}
        <Card style={styles.customListCard}>
          <View style={styles.customListContent}>
            <View style={styles.customListIcon}>
              <Text style={styles.customListIconText}>🔖</Text>
            </View>
            <View style={styles.customListInfo}>
              <Text style={styles.customListTitle}>Your Custom Lists</Text>
              <Text style={styles.customListSubtitle}>
                230 words saved • 3 sub-lists
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
          </View>
        </Card>

        {/* Create New List Button */}
        <TouchableOpacity style={styles.createListButton}>
          <Text style={styles.createListIcon}>➕</Text>
          <Text style={styles.createListText}>Create New List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  loadingCard: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  listCard: {
    marginBottom: Spacing.lg,
  },
  listContent: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  listIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIconText: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.text,
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  listName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.text,
    flex: 1,
  },
  trendIcon: {
    fontSize: 20,
  },
  listDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
  },
  percentageText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  startButtonContainer: {
    marginTop: Spacing.sm,
  },
  startButton: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  customListCard: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  customListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  customListIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customListIconText: {
    fontSize: 24,
  },
  customListInfo: {
    flex: 1,
  },
  customListTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  customListSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  createListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  createListIcon: {
    fontSize: 24,
  },
  createListText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
});

