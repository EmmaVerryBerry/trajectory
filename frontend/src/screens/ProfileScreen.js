import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Placeholder for profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👽</Text>
          </View>
          <Text style={styles.username}>Username</Text>
          <Text style={styles.bio}>Academic Weapon</Text>
        </View>

        {/* Placeholder for stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Placeholder for achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Achievements</Text>
          <Text style={styles.placeholderText}>No achievements yet</Text>
          <Text style={styles.infoText}>
            Earn achievements by maintaining streaks, reaching study goals, and more!
          </Text>
        </View>

        {/* Placeholder for study history */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Study History</Text>
          <Text style={styles.placeholderText}>No study sessions logged</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#003566',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 48,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    color: '#FFD60A',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC300',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFD60A',
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#FFD60A',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
