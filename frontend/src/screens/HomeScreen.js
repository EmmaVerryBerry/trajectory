import React from 'react';
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
import { colors, fontSizes, spacing, borderRadius } from '../constants';

export default function HomeScreen({ navigation }) {
  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Mock data for leaderboard
  const leaderboardData = [
    { id: 1, rank: 1, initials: "ST", name: "StudyBuddy23", time: "28h this week", points: 12 },
    { id: 2, rank: 2, initials: "MA", name: "MathWhiz", time: "35h this week", points: 8 },
    { id: 3, rank: 3, initials: "CO", name: "CodeMaster", time: "42h this week", points: 15 }
  ];

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
          <View style={styles.greetingContainer}>
            <Text style={styles.moonEmoji}>🌙</Text>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.welcomeText}>STUDENT!</Text>
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </View>

        {/* Streak Card */}
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
            <Text style={styles.streakCount}>3 days</Text>
          </View>
          <Text style={styles.streakMessage}>Keep it up!</Text>
        </TouchableOpacity>

        {/* Stats Cards Row */}
        <View style={styles.statsRow}>
          {/* Time Tracking Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Image
                source={require('../../assets/icons/clock.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>3h 20m</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>

          {/* Achievements Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Image
                source={require('../../assets/icons/trophy.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Leaderboard Section */}
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

          {leaderboardData.map((user) => (
            <View key={user.id} style={styles.leaderboardItem}>
              <View style={styles.leaderboardLeft}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNumber}>{user.rank}</Text>
                </View>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>{user.initials}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userTime}>{user.time}</Text>
                </View>
              </View>
              <View style={styles.pointsBadge}>
                <Image
                  source={require('../../assets/icons/flame.png')}
                  style={styles.pointsIcon}
                  resizeMode="contain"
                />
                <Text style={styles.pointsText}>{user.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing for navigation */}
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

  // Header
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

  // Streak Card
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

  // Stats Row
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
    elevation: 8, // This is required for shadows to show up on Android!
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

  // Leaderboard
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
