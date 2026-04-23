import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../constants';
import { achievementsAPI } from '../services/api';

export default function AchievementsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const data = await achievementsAPI.getAll();
      setAchievements(data);
    };
    loadAchievements();
  }, []);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(unlockedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </Text>
        </View>

        {/* Filter Tabs */}
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

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏆</Text>
            <Text style={styles.emptyStateText}>
              No achievements yet!
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeFilter === 'locked'
                ? 'Work towards your first achievement!'
                : 'Keep studying to earn achievements!'}
            </Text>
          </View>
        )}

        {/* Bottom spacing for navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Achievement Card Component
function AchievementCard({ achievement, index }) {
  const isEvenIndex = index % 2 === 0;

  return (
    <View
      style={[
        styles.cardWrapper,
        !isEvenIndex && { marginLeft: spacing.base },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          !achievement.unlocked && styles.cardLocked,
        ]}
        activeOpacity={0.8}
      >
        {/* Badge Icon */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>{achievement.icon}</Text>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedIcon}></Text>
            </View>
          )}
        </View>

        {/* Achievement Name */}
        <Text style={styles.achievementName}>{achievement.name}</Text>

        {/* Achievement Description */}
        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>

        {/* Progress Bar */}
        {!achievement.unlocked && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${achievement.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>
              {achievement.progress}%
            </Text>
          </View>
        )}

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            achievement.unlocked
              ? styles.statusBadgeUnlocked
              : styles.statusBadgeLocked,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              achievement.unlocked
                ? styles.statusTextUnlocked
                : styles.statusTextLocked,
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
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.xl,
  },

  // Header
  header: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    fontFamily: 'Aldrich',
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    fontFamily: 'SpaceGrotesk',
    color: colors.white,
  },

  // Progress Container
  progressContainer: {
    marginBottom: spacing['2xl'],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: 'SpaceGrotesk',
    color: colors.gray,
    textAlign: 'right',
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: 'SpaceGrotesk',
    color: colors.white,
  },
  filterTabTextActive: {
    color: colors.primary,
  },

  // Grid Container
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: spacing.lg,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLocked: {
    backgroundColor: colors.whiteOpacity10,
    borderWidth: 1,
    borderColor: colors.gray,
  },

  // Badge Container
  badgeContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  badgeIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  unlockedBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  unlockedIcon: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },

  // Achievement Text
  achievementName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: 'SpaceGrotesk',
    color: colors.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    fontFamily: 'SpaceGrotesk',
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 14,
  },

  // Progress Bar in Card
  progressBarContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  progressPercentage: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    fontFamily: 'SpaceGrotesk',
    color: colors.gray,
    textAlign: 'right',
  },

  // Status Badge
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  statusBadgeUnlocked: {
    backgroundColor: colors.success,
  },
  statusBadgeLocked: {
    backgroundColor: colors.gray,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    fontFamily: 'SpaceGrotesk',
    textAlign: 'center',
  },
  statusTextUnlocked: {
    color: colors.white,
  },
  statusTextLocked: {
    color: colors.white,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    fontFamily: 'SpaceGrotesk',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    fontFamily: 'SpaceGrotesk',
    color: colors.gray,
    textAlign: 'center',
  },
});
