import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { goalsAPI, authAPI } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function GoalsScreen() {
  const [creditHours, setCreditHours] = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [studyDays, setStudyDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [currentGoal, setCurrentGoal] = useState(null);

  useEffect(() => {
    loadGoal();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const selectedDays = DAYS.filter((day) => studyDays[day]);
  const weeklyHours = Number(creditHours || 0) * (difficulty === 'hard' ? 3 : 2);
  const hoursPerDay = selectedDays.length > 0 ? weeklyHours / selectedDays.length : 0;

  const toggleDay = (day) => {
    setStudyDays({
      ...studyDays,
      [day]: !studyDays[day],
    });
  };

  const loadGoal = async () => {
    const userId = await getUserId();
    const goal = await goalsAPI.getGoal(userId);
    setCurrentGoal(goal);

    if (goal?.credit_hours || goal?.creditHours) {
      setCreditHours(String(goal.credit_hours || goal.creditHours));
      setDifficulty(goal.difficulty_level || 'normal');

      if (Array.isArray(goal.study_days)) {
        const updatedDays = {};
        DAYS.forEach((day) => {
          updatedDays[day] = goal.study_days.includes(day);
        });
        setStudyDays(updatedDays);
      }
    }
  };

  const saveGoal = async () => {
    if (!creditHours || Number(creditHours) <= 0) {
      alert('Please enter valid credit hours');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Please select at least one study day');
      return;
    }

    const userId = await getUserId();

    const goalData = {
      user_id: userId,
      credit_hours: Number(creditHours),
      difficulty_level: difficulty,
      study_days: selectedDays,
    };

    const saved = await goalsAPI.createGoal(goalData);
    setCurrentGoal(saved);
    alert('Goal saved!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Study Goals</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Goal</Text>

          <Text style={styles.label}>Credit Hours</Text>
          <TextInput
            style={styles.input}
            value={creditHours}
            onChangeText={(text) => setCreditHours(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder="Example: 15"
            placeholderTextColor="rgba(255, 214, 10, 0.5)"
          />

          <Text style={styles.label}>Course Difficulty</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionButton, difficulty === 'normal' && styles.optionButtonActive]}
              onPress={() => setDifficulty('normal')}
            >
              <Text style={[styles.optionText, difficulty === 'normal' && styles.optionTextActive]}>
                Normal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, difficulty === 'hard' && styles.optionButtonActive]}
              onPress={() => setDifficulty('hard')}
            >
              <Text style={[styles.optionText, difficulty === 'hard' && styles.optionTextActive]}>
                Hard
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Study Days</Text>
          <View style={styles.daysContainer}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, studyDays[day] && styles.dayButtonActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayText, studyDays[day] && styles.dayTextActive]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Weekly Hours: {weeklyHours.toFixed(1)}</Text>
            <Text style={styles.summaryText}>Hours Per Study Day: {hoursPerDay.toFixed(1)}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
            <Text style={styles.saveButtonText}>Save Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Schedule</Text>
          {currentGoal ? (
            <>
              <Text style={styles.placeholderText}>
                {creditHours || currentGoal.credit_hours || currentGoal.creditHours} credit hours
              </Text>
              <Text style={styles.infoText}>
                Difficulty: {difficulty}
              </Text>
              <Text style={styles.infoText}>
                Study days: {selectedDays.join(', ')}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>No schedule set</Text>
          )}
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
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC300',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#FFD60A',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#001D3D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC300',
    padding: 12,
    color: '#FFC300',
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFC300',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FFC300',
  },
  optionText: {
    color: '#FFC300',
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#000814',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#FFC300',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dayButtonActive: {
    backgroundColor: '#FFC300',
  },
  dayText: {
    color: '#FFC300',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#000814',
  },
  summaryBox: {
    backgroundColor: '#001D3D',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  summaryText: {
    color: '#FFD60A',
    fontSize: 15,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#FFC300',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000814',
    fontWeight: 'bold',
    fontSize: 16,
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