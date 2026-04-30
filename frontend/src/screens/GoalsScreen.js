import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { goalsAPI, authAPI } from '../services/api';

export default function GoalsScreen({ navigation, route }) {
  const [goal, setGoal] = useState(route?.params?.goal || null);

  useEffect(() => {
    if (!goal) {
      loadGoal();
    }
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadGoal = async () => {
    const userId = await getUserId();
    const data = await goalsAPI.getGoal(userId);
    setGoal(data);
  };

  const creditHours = goal?.credit_hours || goal?.creditHours || 0;
  const difficulty = goal?.difficulty_level || goal?.difficultyLevel || 'normal';
  const studyDays = goal?.study_days || goal?.studyDays || [];
  const weeklyHours =
    goal?.weekly_hours ||
    goal?.weeklyHours ||
    creditHours * (difficulty === 'hard' ? 3 : 2);
  const hoursPerDay =
    goal?.hours_per_day ||
    goal?.hoursPerDay ||
    (studyDays.length > 0 ? weeklyHours / studyDays.length : 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Goals</Text>
      </View>

      <ScrollView>
        {goal ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Study Plan</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Credit Hours</Text>
              <Text style={styles.value}>{creditHours}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Difficulty</Text>
              <Text style={styles.value}>
                {difficulty === 'hard' ? 'Hard' : 'Normal'}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Weekly Study Target</Text>
              <Text style={styles.value}>{Number(weeklyHours).toFixed(1)} hours</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Hours Per Study Day</Text>
              <Text style={styles.value}>{Number(hoursPerDay).toFixed(1)} hours</Text>
            </View>

            <Text style={styles.sectionTitle}>Planned Study Days</Text>
            <View style={styles.daysContainer}>
              {studyDays.map((day) => (
                <View key={day} style={styles.dayPill}>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No Goal Saved</Text>
            <Text style={styles.emptyText}>
              Set a goal first to view your weekly study plan.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Goals')}
            >
              <Text style={styles.buttonText}>Set Goals</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFC300',
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#003566',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFC300',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    color: '#FFD60A',
    opacity: 0.75,
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#FFD60A',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#FFC300',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    backgroundColor: '#FFC300',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  dayText: {
    color: '#000814',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#FFD60A',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFC300',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000814',
    fontWeight: 'bold',
    fontSize: 16,
  },
});