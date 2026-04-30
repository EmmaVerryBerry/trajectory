import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { socialAPI, authAPI } from '../services/api';

export default function FriendsScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newFriend, setNewFriend] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadFriends = async () => {
    const userId = await getUserId();

    const [friendsData, leaderboardData] = await Promise.all([
      socialAPI.getFriends(userId),
      socialAPI.getLeaderboard(userId),
    ]);

    setFriends(friendsData);
    setLeaderboard(leaderboardData);
  };

  const handleAddFriend = async () => {
    if (!newFriend.trim()) {
      alert('Please enter a username or email');
      return;
    }

    const userId = await getUserId();
    const value = newFriend.trim();

    try {
      await socialAPI.addFriend({
        user_id: userId,
        username: value,
        email: value,
      });

      setNewFriend('');
      await loadFriends();
      alert('Friend added!');
    } catch (error) {
      alert(error.response?.data?.error || 'Could not add friend');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    const userId = await getUserId();

    try {
      await socialAPI.removeFriend(userId, friendId);
      await loadFriends();
      alert('Friend removed');
    } catch (error) {
      alert(error.response?.data?.error || 'Could not remove friend');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.back} onPress={() => navigation.goBack()}>
          ←
        </Text>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>

      <ScrollView>
        <View style={styles.addContainer}>
          <TextInput
            style={styles.input}
            value={newFriend}
            onChangeText={setNewFriend}
            placeholder="Enter username"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Friends Leaderboard</Text>

        {leaderboard.length > 0 ? (
          leaderboard.map((item, index) => (
            <View key={item.user_id || item.id || index} style={styles.card}>
              <Text style={styles.name}>
                #{item.rank || index + 1} {item.username}
              </Text>
              <Text style={styles.sub}>
                {Math.round(item.total_hours || 0)}h this week • {item.current_streak || 0} day streak
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No leaderboard data yet</Text>
        )}

        <Text style={styles.sectionTitle}>Friends List</Text>

        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <View key={friend.user_id || friend.id || index} style={styles.card}>
              <Text style={styles.name}>{friend.username}</Text>
              <Text style={styles.sub}>
                {friend.current_streak || friend.streak || 0} day streak
              </Text>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFriend(friend.user_id || friend.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No friends yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001D3D',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: {
    color: '#FFC300',
    fontSize: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFC300',
    fontWeight: 'bold',
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#FFC300',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#001D3D',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFC300',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#003566',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: '#FFD60A',
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    color: '#FFD60A',
    opacity: 0.7,
  },
  empty: {
    color: '#FFD60A',
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});