import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500);
  };  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Pomodoro Timer</Text>

  <View style={styles.timerContainer}>
        {/* This now uses the formatTime function and timeLeft variable from above! */}
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        {/* These buttons trigger the toggleTimer and resetTimer functions from above! */}
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
          <Text style={[styles.buttonText, { color: '#FFC300' }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsText}>Settings:</Text>
        <Text style={styles.placeholderText}>- Adjustable duration</Text>
        <Text style={styles.placeholderText}>- Focus sounds (Lofi, waves, rain, thunder)</Text>
        <Text style={styles.placeholderText}>- Study tips</Text>
        <Text style={styles.placeholderText}>- Break suggestions</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001D3D',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1, // This tells the scroll view to expand to fit the screen
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
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#FFC300',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#003566',
    borderWidth: 2,
    borderColor: '#FFC300',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001D3D',
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
