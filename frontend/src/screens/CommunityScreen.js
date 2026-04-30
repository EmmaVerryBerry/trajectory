import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { socialAPI, authAPI } from '../services/api';

export default function CommunityScreen({ navigation }) {
  const [global, setGlobal] = useState([]);

  useEffect(() => {
    loadCommunity();
  }, []);

  const loadCommunity = async () => {
    const data = await socialAPI.getGlobalLeaderboard();
    setGlobal(data);
  };

  return (
    <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.headerRow}>
      <Text style={styles.back} onPress={() => navigation.goBack()}>←</Text>
      <Text style={styles.headerTitle}>Community Leaderboard</Text>
    </View>

    <ScrollView>
      {global.length > 0 ? (
        global.map((user, index) => (
          <View key={user.user_id || index} style={styles.card}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.sub}>
                {Math.round(user.total_hours || 0)}h • {user.current_streak || 0} streak
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No community data yet</Text>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001D3D', padding: 20 },
  title: { fontSize: 28, color: '#FFC300', marginBottom: 20, fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#003566',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  rank: { color: '#FFC300', fontSize: 18, fontWeight: 'bold' },
  name: { color: '#FFD60A', fontSize: 16 },
  sub: { color: '#FFD60A', opacity: 0.7 },
  empty: { color: '#FFD60A' },

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
});