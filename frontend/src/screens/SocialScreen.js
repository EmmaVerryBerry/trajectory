import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { socialAPI, authAPI } from '../services/api';

export default function SocialScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activity, setActivity] = useState([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);

  useEffect(() => {
    loadSocialData();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadSocialData = async () => {
    const userId = await getUserId();

    const [friendsData, leaderboardData, activityData, globalData] = await Promise.all([
      socialAPI.getFriends(userId),
      socialAPI.getFriendsLeaderboard(userId),
      socialAPI.getActivity(userId),
      socialAPI.getGlobalLeaderboard(),
    ]);

    setFriends(friendsData);
    setLeaderboard(leaderboardData);
    setActivity(activityData);
    setGlobalLeaderboard(globalData);
  };

  const renderLeaderboardRow = (item, index) => (
    <Text key={item.user_id || item.id || index} style={styles.placeholderText}>
      {item.rank || index + 1}. {item.username} — {item.current_streak ?? item.streak ?? 0} day streak
    </Text>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Social</Text>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>Friends</Text>
            {navigation && (
              <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
                <Text style={styles.linkText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          {friends.length > 0 ? (
            friends.slice(0, 5).map((friend, index) => (
              <Text key={friend.user_id || friend.id || index} style={styles.placeholderText}>
                {friend.username} — {friend.current_streak || 0} day streak
              </Text>
            ))
          ) : (
            <Text style={styles.placeholderText}>No friends added yet</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Friends Leaderboard</Text>
          <Text style={styles.infoText}>Ranked by streak length</Text>
          {leaderboard.length > 0 ? (
            leaderboard.slice(0, 5).map(renderLeaderboardRow)
          ) : (
            <Text style={styles.placeholderText}>Connect with friends to see leaderboard</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity Feed</Text>
          {activity.length > 0 ? (
            activity.slice(0, 5).map((item, index) => (
              <Text key={item.activity_id || item.id || index} style={styles.placeholderText}>
                {item.username ? `${item.username} ` : ''}
                {item.activity_text || item.detail || 'completed an activity'}
              </Text>
            ))
          ) : (
            <Text style={styles.placeholderText}>No recent activity</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>Community</Text>
            {navigation && (
              <TouchableOpacity onPress={() => navigation.navigate('Community')}>
                <Text style={styles.linkText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.infoText}>Global rankings</Text>
          {globalLeaderboard.length > 0 ? (
            globalLeaderboard.slice(0, 5).map(renderLeaderboardRow)
          ) : (
            <>
              <Text style={styles.placeholderText}>- Universities</Text>
              <Text style={styles.placeholderText}>- Majors</Text>
              <Text style={styles.placeholderText}>- Friend groups</Text>
              <Text style={styles.placeholderText}>- Clubs</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001D3D',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#003566',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC300',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    color: '#FFD60A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#FFD60A',
    opacity: 0.7,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    color: '#FFC300',
    fontSize: 14,
    fontWeight: '600',
  },
});