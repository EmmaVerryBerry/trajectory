import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Academic Weapon Challenge</Text>
        <Text style={styles.subtitle}>Your Study Dashboard</Text>

        {/* Placeholder for study streak */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Streak</Text>
          <Text style={styles.streakNumber}>0 days</Text>
        </View>

        {/* Placeholder for weekly progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <Text style={styles.progressText}>0 / 0 hours</Text>
        </View>

        {/* Placeholder for recent achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Achievements</Text>
          <Text style={styles.placeholderText}>No achievements yet</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD60A',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#003566',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // This is required for shadows to show up on Android!
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC300',
    marginBottom: 12,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD60A',
  },
  progressText: {
    fontSize: 24,
    color: '#FFD60A',
  },
  placeholderText: {
    fontSize: 16,
    color: '#FFD60A',
    opacity: 0.7,
  },
});
