import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usersAPI, authAPI } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadProfile = async () => {
    const userId = await getUserId();

    const [p, s] = await Promise.all([
      usersAPI.getProfile(userId),
      usersAPI.getStats(userId),
    ]);

    setProfile(p);
    setStats(s);
  };

  const logout = () => {
    authAPI.logout();
    if (navigation) navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{profile.username}</Text>
        <Text style={styles.sub}>{profile.email}</Text>
        <Text style={styles.sub}>{profile.university}</Text>
        <Text style={styles.sub}>{profile.major}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Stats</Text>
        <Text style={styles.sub}>
          Weekly Hours: {stats.weekly_hours ?? stats.weeklyHours ?? 0}
        </Text>
        <Text style={styles.sub}>
          Total Hours: {stats.total_hours ?? stats.totalHours ?? 0}
        </Text>
        <Text style={styles.sub}>
          Streak: {stats.current_streak ?? stats.currentStreak ?? 0}
        </Text>
        <Text style={styles.sub}>
          Achievements: {stats.achievements ?? 0}
        </Text>
      </View>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  name: { color: '#FFC300', fontSize: 20, fontWeight: 'bold' },
  section: { color: '#FFC300', fontSize: 18, marginBottom: 10 },
  sub: { color: '#FFD60A', opacity: 0.8, marginBottom: 4 },
  logout: {
    backgroundColor: '#FFC300',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: '#000814', fontWeight: 'bold' },
});