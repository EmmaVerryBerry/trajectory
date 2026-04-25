import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

import { socialAPI } from '../services/api';

// Color Constants
const COLORS = {
  background: '#000814',
  cardBackground: '#1E293B',
  yellow: '#ffc300',
  orange: '#ff8904',
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDisabled: 'rgba(255, 255, 255, 0.4)',
  gold: '#ffc300',
  silver: '#d1d5dc',
  bronze: '#ff8904',
  searchBackground: 'rgba(255, 255, 255, 0.1)',
  currentUserHighlight: 'rgba(255, 195, 0, 0.15)',
};

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsData, setFriendsData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [friends, leaderboard, activity] = await Promise.all([
        socialAPI.getFriends(1),
        socialAPI.getLeaderboard(1),
        socialAPI.getActivity(1),
      ]);
      setFriendsData(friends);
      setLeaderboardData(leaderboard);
      setActivityData(activity);
    };
    loadData();
  }, []);

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return COLORS.gold;
    if (rank === 2) return COLORS.silver;
    if (rank === 3) return COLORS.bronze;
    return COLORS.orange;
  };

  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'session':
        return '=�';
      case 'achievement':
        return '<�';
      case 'streak':
        return '=%';
      default:
        return 'P';
    }
  };

  const filteredFriends = friendsData.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAllFriendsTab = () => (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>=
</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={COLORS.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Friends List */}
      <View style={styles.friendsList}>
        {filteredFriends.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.friendLeft}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>{friend.initials}</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendUsername}>{friend.username}</Text>
                <View style={styles.friendStats}>
                  <Image
                    source={require('../../assets/icons/clock.png')}
                    style={styles.friendStatsIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.friendStatsText}>{friend.hours} this week</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );

  const renderLeaderboardTab = () => (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.leaderboardList}>
        {leaderboardData.map((user) => (
          <View
            key={user.id}
            style={[
              styles.leaderboardCard,
              user.isCurrentUser && styles.currentUserCard
            ]}
          >
            <View style={styles.leaderboardLeft}>
              <View style={[
                styles.rankBadge,
                { backgroundColor: getRankBadgeColor(user.rank) }
              ]}>
                <Text style={styles.rankNumber}>{user.rank}</Text>
                <Text style={styles.rankSuffix}>{getRankSuffix(user.rank)}</Text>
              </View>
              <View style={styles.leaderboardAvatar}>
                <Text style={styles.leaderboardAvatarText}>{user.initials}</Text>
              </View>
              <View style={styles.leaderboardInfo}>
                <Text style={[
                  styles.leaderboardUsername,
                  user.isCurrentUser && styles.currentUserText
                ]}>
                  {user.username} {user.isCurrentUser && '(You)'}
                </Text>
                <Text style={styles.leaderboardHours}>{user.hours} this week</Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <Image
                source={require('../../assets/icons/flame.png')}
                style={styles.streakIcon}
                resizeMode="contain"
              />
              <Text style={styles.streakCount}>{user.streak}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );

  const renderActivityTab = () => (
    <ScrollView
      style={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.activityFeed}>
        {activityData.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Text style={styles.activityEmoji}>{getActivityIcon(activity.type)}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityUsername}>{activity.username}</Text>
                <Text style={styles.activityDetail}> {activity.detail}</Text>
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FRIENDS</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'all' && renderAllFriendsTab()}
      {activeTab === 'leaderboard' && renderLeaderboardTab()}
      {activeTab === 'activity' && renderActivityTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 2,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.yellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.yellow,
  },

  // Tab Content
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // All Friends Tab
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.searchBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
  },
  friendsList: {
    gap: 16,
  },
  friendCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  friendAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.background,
  },
  friendInfo: {
    flex: 1,
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 6,
  },
  friendStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendStatsIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.textSecondary,
    marginRight: 6,
  },
  friendStatsText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  messageButton: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },

  // Leaderboard Tab
  leaderboardList: {
    gap: 16,
  },
  leaderboardCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentUserCard: {
    backgroundColor: COLORS.currentUserHighlight,
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexDirection: 'row',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  rankSuffix: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 1,
    marginTop: -6,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.background,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  currentUserText: {
    color: COLORS.yellow,
  },
  leaderboardHours: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 137, 4, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  streakIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.orange,
    marginRight: 6,
  },
  streakCount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Activity Feed Tab
  activityFeed: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 195, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
  activityUsername: {
    fontWeight: '700',
    color: COLORS.yellow,
  },
  activityDetail: {
    color: COLORS.white,
  },
  activityTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
