import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { colors } from '../constants';
import { studyAPI, socialAPI, usersAPI, authAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState({ currentStreak: 0, current_streak: 0 });
  const [stats, setStats] = useState({ totalHours: 0, achievements: 0, weeklyHours: 0 });
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const getUserId = async () => {
    const storedUser = await Promise.resolve(authAPI.getStoredUser());
    setUser(storedUser);
    return storedUser?.userId || storedUser?.user_id || 1;
  };

  const loadData = async () => {
    const userId = await getUserId();

    const [streakData, statsData, lbData] = await Promise.all([
      studyAPI.getStreak(userId),
      usersAPI.getStats(userId),
      socialAPI.getLeaderboard(userId),
    ]);

    setStreak(streakData);
    setStats(statsData);
    setLeaderboardData(lbData.slice(0, 3));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatWeeklyHours = (hours) => {
    const safeHours = Number(hours || 0);
    const h = Math.floor(safeHours);
    const m = Math.round((safeHours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const currentStreak = streak.current_streak ?? streak.currentStreak ?? 0;
  const weeklyHours = stats.weekly_hours ?? stats.weeklyHours ?? 0;
  const achievements = stats.achievements ?? stats.achievements_count ?? 0;
  const displayName = user?.username ? user.username.toUpperCase() : 'STUDENT';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.moonEmoji}>🌙</Text>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.welcomeText}>{displayName}!</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.streakCard} activeOpacity={0.8}>
          <View style={styles.streakIconContainer}>
            <Image
              source={require('../../assets/icons/flame.png')}
              style={styles.streakIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.streakContent}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakCount}>{currentStreak} days</Text>
          </View>
          <Text style={styles.streakMessage}>Keep it up!</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Image
                source={require('../../assets/icons/clock.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>{formatWeeklyHours(weeklyHours)}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Image
                source={require('../../assets/icons/trophy.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>{achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        <View style={styles.leaderboardSection}>
          <View style={styles.leaderboardHeader}>
            <View style={styles.leaderboardTitleContainer}>
              <Image
                source={require('../../assets/icons/trophy.png')}
                style={styles.leaderboardTitleIcon}
                resizeMode="contain"
              />
              <Text style={styles.leaderboardTitle}>LEADERBOARD</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Community')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {leaderboardData.map((item, index) => {
            const initials = item.initials || item.username?.slice(0, 2).toUpperCase() || 'U';
            const hours = item.hours || `${Math.round(item.total_hours || 0)}h`;
            const streakValue = item.streak ?? item.current_streak ?? 0;

            return (
              <View key={item.id || item.user_id || index} style={styles.leaderboardItem}>
                <View style={styles.leaderboardLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{initials}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.username}</Text>
                    <Text style={styles.userTime}>{hours} this week</Text>
                  </View>
                </View>
                <View style={styles.pointsBadge}>
                  <Image
                    source={require('../../assets/icons/flame.png')}
                    style={styles.pointsIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.pointsText}>{streakValue}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moonEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: colors.white,
    opacity: 0.6,
    marginBottom: 4,
    lineHeight: 20,
  },
  welcomeText: {
    fontFamily: 'Aldrich',
    fontSize: 30,
    color: colors.white,
    letterSpacing: 0,
    lineHeight: 36,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 28,
  },
  streakCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakIcon: {
    width: 30,
    height: 30,
    tintColor: colors.white,
  },
  streakContent: {
    flex: 1,
  },
  streakLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.6,
    marginBottom: 6,
  },
  streakCount: {
    fontFamily: 'Aldrich',
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  streakMessage: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    color: colors.white,
    opacity: 0.6,
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '48%',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  statIcon: {
    width: 28,
    height: 28,
    tintColor: colors.accent,
  },
  statValue: {
    fontFamily: 'Aldrich',
    fontSize: 30,
    color: colors.white,
    marginBottom: 4,
    lineHeight: 36,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: colors.white,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 16,
  },
  leaderboardSection: {
    marginBottom: 24,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leaderboardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardTitleIcon: {
    width: 24,
    height: 24,
    tintColor: colors.accent,
    marginRight: 10,
  },
  leaderboardTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1.5,
  },
  viewAllText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  leaderboardItem: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  userTime: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: colors.white,
    opacity: 0.6,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  pointsIcon: {
    width: 18,
    height: 18,
    tintColor: '#FF6B35',
    marginRight: 6,
  },
  pointsText: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});