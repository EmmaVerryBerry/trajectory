import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../constants';
import { achievementsAPI, authAPI } from '../services/api';

export default function AchievementsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const normalizeUnlockedIds = (userAchievements) => {
    return userAchievements.map(item =>
      item.achievement_id || item.id || item
    );
  };

  const loadAchievements = async () => {
    const userId = await getUserId();
    const [allAchievements, userAchievements] = await Promise.all([
      achievementsAPI.getAll(),
      achievementsAPI.getUserAchievements(userId),
    ]);

    const unlockedIds = normalizeUnlockedIds(userAchievements);

    const merged = allAchievements.map(item => {
      const id = item.achievement_id || item.id;
      return {
        ...item,
        id,
        achievement_id: id,
        icon: item.icon || '🏆',
        progress: item.progress ?? (unlockedIds.includes(id) || item.unlocked ? 100 : 0),
        unlocked: unlockedIds.includes(id) || item.unlocked || false,
      };
    });

    setAchievements(merged);
  };

  const getFilteredAchievements = () => {
    switch (activeFilter) {
      case 'locked':
        return achievements.filter((a) => !a.unlocked);
      case 'unlocked':
        return achievements.filter((a) => a.unlocked);
      default:
        return achievements;
    }
  };

  const filteredAchievements = getFilteredAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercent}% Complete</Text>
        </View>

        <View style={styles.filterContainer}>
          {['all', 'locked', 'unlocked'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredAchievements.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.achievement_id || achievement.id || index}
                achievement={achievement}
                index={index}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏆</Text>
            <Text style={styles.emptyStateText}>No achievements yet!</Text>
            <Text style={styles.emptyStateSubtext}>
              Keep studying to earn achievements.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function AchievementCard({ achievement, index }) {
  const isEvenIndex = index % 2 === 0;

  return (
    <View style={[styles.cardWrapper, !isEvenIndex && { marginLeft: spacing.base }]}>
      <TouchableOpacity
        style={[styles.card, !achievement.unlocked && styles.cardLocked]}
        activeOpacity={0.8}
      >
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>{achievement.icon || '🏆'}</Text>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedIcon}>✓</Text>
            </View>
          )}
        </View>

        <Text style={styles.achievementName}>{achievement.name}</Text>

        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>

        {!achievement.unlocked && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${achievement.progress || 0}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>
              {achievement.progress || 0}%
            </Text>
          </View>
        )}

        <View
          style={[
            styles.statusBadge,
            achievement.unlocked ? styles.statusBadgeUnlocked : styles.statusBadgeLocked,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              achievement.unlocked ? styles.statusTextUnlocked : styles.statusTextLocked,
            ]}
          >
            {achievement.unlocked ? 'Unlocked' : 'Locked'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.xl,
  },
  header: { marginBottom: spacing['2xl'] },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    fontFamily: 'Aldrich',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk',
    color: colors.white,
  },
  progressContainer: { marginBottom: spacing['2xl'] },
  progressBar: {
    height: 8,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success || colors.accent,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: 'SpaceGrotesk',
    color: colors.gray,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    padding: 4,
    marginBottom: spacing['2xl'],
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  filterTabActive: { backgroundColor: colors.accent },
  filterTabText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  filterTabTextActive: { color: colors.primary },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '47%',
    marginBottom: spacing.base,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    minHeight: 220,
  },
  cardLocked: { opacity: 0.65 },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
    position: 'relative',
  },
  badgeIcon: { fontSize: 42 },
  unlockedBadge: {
    position: 'absolute',
    right: 18,
    top: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success || '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedIcon: {
    color: colors.white,
    fontWeight: 'bold',
  },
  achievementName: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  achievementDescription: {
    color: colors.gray,
    fontSize: fontSizes.sm,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  progressBarContainer: { marginTop: 'auto' },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressPercentage: {
    color: colors.gray,
    fontSize: fontSizes.xs || 12,
    textAlign: 'center',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  statusBadgeUnlocked: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  statusBadgeLocked: { backgroundColor: colors.whiteOpacity10 },
  statusText: {
    fontSize: fontSizes.xs || 12,
    fontWeight: fontWeights.bold,
  },
  statusTextUnlocked: { color: colors.success || '#10B981' },
  statusTextLocked: { color: colors.gray },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'] || 48,
  },
  emptyStateIcon: { fontSize: 50, marginBottom: spacing.base },
  emptyStateText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    color: colors.gray,
    textAlign: 'center',
  },
});