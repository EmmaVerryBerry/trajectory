import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>

      {/* Placeholder for timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>25:00</Text>
      </View>

      {/* Placeholder for controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.placeholderText}>Timer controls will appear here</Text>
      </View>

      {/* Placeholder for settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsText}>Settings:</Text>
        <Text style={styles.placeholderText}>- Adjustable duration</Text>
        <Text style={styles.placeholderText}>- Focus sounds (Lofi, waves, rain, thunder)</Text>
        <Text style={styles.placeholderText}>- Study tips</Text>
        <Text style={styles.placeholderText}>- Break suggestions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001D3D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 40,
  },
  timerContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#003566',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD60A',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  settingsContainer: {
    backgroundColor: '#003566',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  settingsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC300',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#FFD60A',
    opacity: 0.8,
    marginBottom: 4,
  },
});
