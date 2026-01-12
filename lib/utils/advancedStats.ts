import {
  getForgettingRiskWords,
  getWordsReviewedInLastNDays,
  getTotalWordsLearned,
  getHardestWords,
  getWeakestLists,
  getNeglectedWords,
  getAverageReviewsToMaster,
  getAllLearningProgress,
  getLearningActivityByDay,
  getBookmarkEffectiveness,
  getActiveDaysInLastNDays,
  getTotalWordsAvailable,
  getTestScores,
} from '../storage/database';
import { getUserProfile } from '../storage/async-storage';
import {
  AdvancedStats,
  RetentionHealth,
  LearningEfficiency,
  GREReadiness,
  WeaknessAnalysis,
  ConsistencyMetrics,
  ProgressQuality,
  MicroInsight,
} from '../types';

// Calculate Retention Health Score
export const calculateRetentionHealth = async (): Promise<RetentionHealth> => {
  const wordsReviewedLast7Days = await getWordsReviewedInLastNDays(7);
  const wordsReviewedLast14Days = await getWordsReviewedInLastNDays(14);
  const totalLearnedWords = await getTotalWordsLearned();

  // Calculate score based on review frequency
  let score = 0;
  
  if (totalLearnedWords > 0) {
    const reviewRate7Days = (wordsReviewedLast7Days / totalLearnedWords) * 100;
    const reviewRate14Days = (wordsReviewedLast14Days / totalLearnedWords) * 100;
    
    // Weight recent reviews more heavily
    score = Math.min(100, Math.round((reviewRate7Days * 0.6) + (reviewRate14Days * 0.4)));
  }

  let status: 'Excellent' | 'Good' | 'Fair' | 'Needs Work' = 'Needs Work';
  if (score >= 80) status = 'Excellent';
  else if (score >= 60) status = 'Good';
  else if (score >= 40) status = 'Fair';

  return {
    score,
    status,
    wordsReviewedLast7Days,
    wordsReviewedLast14Days,
    totalLearnedWords,
  };
};

// Calculate Learning Efficiency
export const calculateLearningEfficiency = async (): Promise<LearningEfficiency> => {
  const progressList = await getAllLearningProgress();
  
  const masteryConversionFunnel = {
    dontKnow: 0,
    unsure: 0,
    knowIt: 0,
  };

  let totalReviews = 0;
  let masteredWords = 0;

  progressList.forEach((progress) => {
    totalReviews += progress.reviewCount;
    
    if (progress.masteryLevel === 'dont_know') {
      masteryConversionFunnel.dontKnow++;
    } else if (progress.masteryLevel === 'unsure') {
      masteryConversionFunnel.unsure++;
    } else if (progress.masteryLevel === 'know_it') {
      masteryConversionFunnel.knowIt++;
      masteredWords++;
    }
  });

  const reviewsPerLearnedWord = masteredWords > 0 
    ? Number((totalReviews / masteredWords).toFixed(1))
    : 0;
  
  const averageReviewsToMaster = await getAverageReviewsToMaster();

  return {
    reviewsPerLearnedWord,
    masteryConversionFunnel,
    averageReviewsToMaster,
  };
};

// Calculate GRE Readiness Score
export const calculateGREReadiness = async (): Promise<GREReadiness> => {
  const totalWordsLearned = await getTotalWordsLearned();
  const totalWordsAvailable = await getTotalWordsAvailable();
  const retentionHealth = await calculateRetentionHealth();
  const consistencyMetrics = await calculateConsistencyMetrics();
  const testScores = await getTestScores();

  // Vocabulary Coverage (0-30 points)
  const vocabularyCoverage = totalWordsAvailable > 0 
    ? Math.round((totalWordsLearned / totalWordsAvailable) * 100)
    : 0;
  const vocabularyPoints = Math.min(30, (vocabularyCoverage / 100) * 30);

  // Retention Score (0-25 points)
  const retentionPoints = (retentionHealth.score / 100) * 25;

  // Test Accuracy (0-30 points)
  let testAccuracyPoints = 0;
  if (testScores.length > 0) {
    const recentScores = testScores.slice(0, 10);
    let totalCorrect = 0;
    let totalQuestions = 0;

    recentScores.forEach((score) => {
      const [correct, total] = score.score.split('/').map(Number);
      totalCorrect += correct;
      totalQuestions += total;
    });

    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    testAccuracyPoints = (accuracy / 100) * 30;
  }

  // Consistency Score (0-15 points)
  const consistencyPoints = (consistencyMetrics.score / 100) * 15;

  const score = Math.round(vocabularyPoints + retentionPoints + testAccuracyPoints + consistencyPoints);

  let status: 'Exam Ready' | 'On Track' | 'Needs Work' | 'Just Starting' = 'Just Starting';
  if (score >= 80) status = 'Exam Ready';
  else if (score >= 60) status = 'On Track';
  else if (score >= 30) status = 'Needs Work';

  return {
    score,
    status,
    vocabularyCoverage,
    retentionScore: retentionHealth.score,
    testAccuracy: testScores.length > 0 ? Math.round((testAccuracyPoints / 30) * 100) : 0,
    consistencyScore: consistencyMetrics.score,
  };
};

// Calculate Weakness Analysis
export const calculateWeaknessAnalysis = async (): Promise<WeaknessAnalysis> => {
  const hardestWords = await getHardestWords(10);
  const weakLists = await getWeakestLists(5);
  const neglectedWords = await getNeglectedWords(20);

  return {
    hardestWords,
    weakLists,
    neglectedWords,
  };
};

// Calculate Consistency Metrics
export const calculateConsistencyMetrics = async (): Promise<ConsistencyMetrics> => {
  const activeDaysLast30 = await getActiveDaysInLastNDays(30);
  const userProfile = await getUserProfile();
  const bestLearningDays = await getLearningActivityByDay();

  // Calculate consistency score based on active days
  const score = Math.min(100, Math.round((activeDaysLast30 / 30) * 100));

  // Calculate streak stability (ratio of current streak to max streak)
  const streakStability = userProfile?.maxStreak && userProfile.maxStreak > 0
    ? Math.round(((userProfile.streak ?? 0) / userProfile.maxStreak) * 100)
    : 0;

  return {
    score,
    activeDaysLast30,
    streakStability,
    bestLearningDays: bestLearningDays.slice(0, 3), // Top 3 days
  };
};

// Calculate Progress Quality
export const calculateProgressQuality = async (): Promise<ProgressQuality> => {
  const progressList = await getAllLearningProgress();
  const totalReviews = progressList.reduce((sum, p) => sum + p.reviewCount, 0);
  const masteredWords = progressList.filter(p => p.masteryLevel === 'know_it').length;
  
  const learningDepth = masteredWords > 0 
    ? Number((totalReviews / masteredWords).toFixed(1))
    : 0;

  const userProfile = await getUserProfile();
  const startDate = userProfile?.startDate ? new Date(userProfile.startDate) : new Date();
  const daysActive = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const wordsPerDay = daysActive > 0 ? Number((masteredWords / daysActive).toFixed(1)) : 0;

  const retentionHealth = await calculateRetentionHealth();
  const retentionRate = retentionHealth.score;

  // Categorize learning style
  let category: 'Fast & Stable' | 'Fast & Fragile' | 'Slow & Stable' | 'Slow & Fragile' = 'Slow & Fragile';
  
  const isFast = wordsPerDay >= 5;
  const isStable = retentionRate >= 60;

  if (isFast && isStable) category = 'Fast & Stable';
  else if (isFast && !isStable) category = 'Fast & Fragile';
  else if (!isFast && isStable) category = 'Slow & Stable';
  else category = 'Slow & Fragile';

  return {
    learningDepth,
    speedVsStability: {
      category,
      wordsPerDay,
      retentionRate,
    },
  };
};

// Generate Micro Insights
export const generateMicroInsights = async (): Promise<MicroInsight[]> => {
  const insights: MicroInsight[] = [];

  const efficiency = await calculateLearningEfficiency();
  const retentionHealth = await calculateRetentionHealth();
  const consistency = await calculateConsistencyMetrics();
  const progressQuality = await calculateProgressQuality();
  const testScores = await getTestScores();

  // Insight about review efficiency
  if (efficiency.averageReviewsToMaster <= 3) {
    insights.push({
      title: 'Quick Learner',
      message: `You master words in just ${efficiency.averageReviewsToMaster} reviews on average!`,
      type: 'positive',
      icon: '⚡',
    });
  } else if (efficiency.averageReviewsToMaster >= 7) {
    insights.push({
      title: 'Deep Learning',
      message: 'You prefer thorough understanding over speed—great for long-term retention!',
      type: 'neutral',
      icon: '🧠',
    });
  }

  // Insight about retention drop-off
  if (retentionHealth.score < 50) {
    insights.push({
      title: 'Review Alert',
      message: 'Your retention could improve. Try reviewing words more frequently.',
      type: 'suggestion',
      icon: '⚠️',
    });
  }

  // Insight about consistency
  if (consistency.activeDaysLast30 >= 20) {
    insights.push({
      title: 'Consistency Champion',
      message: `You've been active ${consistency.activeDaysLast30} out of 30 days!`,
      type: 'positive',
      icon: '🎯',
    });
  }

  // Insight about learning style
  if (progressQuality.speedVsStability.category === 'Fast & Stable') {
    insights.push({
      title: 'Optimal Learning',
      message: 'You learn quickly AND retain well. Keep it up!',
      type: 'positive',
      icon: '🚀',
    });
  }

  // Insight about test performance
  if (testScores.length >= 5) {
    const recentScores = testScores.slice(0, 5);
    const accuracies = recentScores.map((score) => {
      const [correct, total] = score.score.split('/').map(Number);
      return (correct / total) * 100;
    });
    
    const avgAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    
    if (avgAccuracy >= 80) {
      insights.push({
        title: 'Test Master',
        message: `Your average test accuracy is ${Math.round(avgAccuracy)}%!`,
        type: 'positive',
        icon: '🏆',
      });
    }
  }

  // Insight about best learning day
  if (consistency.bestLearningDays.length > 0) {
    const bestDay = consistency.bestLearningDays[0];
    insights.push({
      title: 'Peak Performance',
      message: `You learn best on ${bestDay.day}s with ${bestDay.wordCount} words learned!`,
      type: 'neutral',
      icon: '📊',
    });
  }

  return insights.slice(0, 5); // Return top 5 insights
};

// Calculate Accuracy vs Time metrics
export const calculateAccuracyVsTime = async (): Promise<any> => {
  const testScores = await getTestScores();
  
  if (testScores.length === 0) {
    return {
      recentTests: [],
      trend: 'stable' as const,
      insight: 'Take some tests to track your accuracy over time.',
    };
  }

  const recentTests = testScores.slice(0, 10).map((score) => {
    const [correct, total] = score.score.split('/').map(Number);
    const accuracy = (correct / total) * 100;
    
    // Parse time taken (HH:MM:SS format)
    const timeParts = score.timeTaken.split(':').map(Number);
    const timeTaken = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];

    return {
      accuracy,
      timeTaken,
      date: score.date,
    };
  }).reverse(); // Reverse to get chronological order

  // Calculate trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (recentTests.length >= 3) {
    const firstHalf = recentTests.slice(0, Math.floor(recentTests.length / 2));
    const secondHalf = recentTests.slice(Math.floor(recentTests.length / 2));
    
    const firstHalfAvgAccuracy = firstHalf.reduce((sum, t) => sum + t.accuracy, 0) / firstHalf.length;
    const secondHalfAvgAccuracy = secondHalf.reduce((sum, t) => sum + t.accuracy, 0) / secondHalf.length;
    
    const firstHalfAvgTime = firstHalf.reduce((sum, t) => sum + t.timeTaken, 0) / firstHalf.length;
    const secondHalfAvgTime = secondHalf.reduce((sum, t) => sum + t.timeTaken, 0) / secondHalf.length;

    if (secondHalfAvgAccuracy > firstHalfAvgAccuracy + 5 && secondHalfAvgTime <= firstHalfAvgTime) {
      trend = 'improving';
    } else if (secondHalfAvgAccuracy < firstHalfAvgAccuracy - 5) {
      trend = 'declining';
    }
  }

  let insight = '';
  if (trend === 'improving') {
    insight = 'Excellent! Your accuracy is improving while maintaining or reducing time—exam-ready behavior!';
  } else if (trend === 'declining') {
    insight = 'Your accuracy is declining. Consider reviewing more before taking tests.';
  } else {
    insight = 'Your performance is stable. Keep practicing to improve further!';
  }

  return {
    recentTests,
    trend,
    insight,
  };
};

// Main function to get all advanced statistics
export const getAdvancedStatistics = async (): Promise<AdvancedStats> => {
  const [
    forgettingRiskWords,
    retentionHealth,
    learningEfficiency,
    greReadiness,
    weaknessAnalysis,
    consistencyMetrics,
    bookmarkEffectiveness,
    progressQuality,
    microInsights,
    accuracyVsTimeMetrics,
  ] = await Promise.all([
    getForgettingRiskWords(),
    calculateRetentionHealth(),
    calculateLearningEfficiency(),
    calculateGREReadiness(),
    calculateWeaknessAnalysis(),
    calculateConsistencyMetrics(),
    getBookmarkEffectiveness(),
    calculateProgressQuality(),
    generateMicroInsights(),
    calculateAccuracyVsTime(),
  ]);

  const highRisk = forgettingRiskWords.filter(w => w.riskLevel === 'high');
  const mediumRisk = forgettingRiskWords.filter(w => w.riskLevel === 'medium');
  const safeWords = forgettingRiskWords.filter(w => w.riskLevel === 'low').length;

  return {
    forgettingRisk: {
      highRisk,
      mediumRisk,
      safeWords,
    },
    retentionHealth,
    learningEfficiency,
    greReadiness,
    weaknessAnalysis,
    consistencyMetrics,
    bookmarkEffectiveness,
    progressQuality,
    microInsights,
    accuracyVsTimeMetrics,
  };
};
