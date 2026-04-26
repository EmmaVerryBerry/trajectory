import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { socialAPI, authAPI } from '../services/api';

export default function FriendsScreen() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    loadFriends();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadFriends = async () => {
    const userId = await getUserId();
    const data = await socialAPI.getFriends(userId);
    setFriends(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Friends</Text>

      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <View key={friend.user_id || friend.id || index} style={styles.card}>
            <Text style={styles.name}>{friend.username}</Text>
            <Text style={styles.sub}>
              {friend.current_streak || 0} day streak
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No friends yet</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001D3D', padding: 20 },
  title: { fontSize: 28, color: '#FFC300', marginBottom: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#003566',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { color: '#FFD60A', fontSize: 16, fontWeight: '600' },
  sub: { color: '#FFD60A', opacity: 0.7 },
  empty: { color: '#FFD60A' },
});