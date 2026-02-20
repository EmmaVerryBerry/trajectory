import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SocialScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Social</Text>

        {/* Placeholder for friends list */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Friends</Text>
          <Text style={styles.placeholderText}>No friends added yet</Text>
        </View>

        {/* Placeholder for leaderboard */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Friends Leaderboard</Text>
          <Text style={styles.infoText}>Ranked by streak length</Text>
          <Text style={styles.placeholderText}>Connect with friends to see leaderboard</Text>
        </View>

        {/* Placeholder for activity feed */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity Feed</Text>
          <Text style={styles.placeholderText}>No recent activity</Text>
        </View>

        {/* Placeholder for community */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Community</Text>
          <Text style={styles.infoText}>Group-based leaderboards:</Text>
          <Text style={styles.placeholderText}>- Universities</Text>
          <Text style={styles.placeholderText}>- Majors</Text>
          <Text style={styles.placeholderText}>- Friend groups</Text>
          <Text style={styles.placeholderText}>- Clubs</Text>
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
});
