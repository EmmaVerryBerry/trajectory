import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function GoalsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Study Goals</Text>

        {/* Placeholder for goal setup */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Goal</Text>
          <Text style={styles.placeholderText}>Set up your study goals</Text>
          <Text style={styles.infoText}>
            Enter your credit hours and course difficulty to calculate your recommended study time.
          </Text>
        </View>

        {/* Placeholder for current goals */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Schedule</Text>
          <Text style={styles.placeholderText}>No schedule set</Text>
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
