import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Button, Card } from '../components/common';
import { colors, fontSizes, spacing, borderRadius, fontWeights } from '../constants';
import { goalsAPI, authAPI } from '../services/api';

export default function GoalSettingScreen({ navigation }) {
  const [creditHours, setCreditHours] = useState(15);
  const [difficultyLevel, setDifficultyLevel] = useState('normal');
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const calculations = useMemo(() => {
    const multiplier = difficultyLevel === 'hard' ? 3 : 2;
    const weeklyTarget = creditHours * multiplier;
    const studyDaysCount = Object.values(selectedDays).filter(Boolean).length;
    const dailyHours = studyDaysCount > 0 ? weeklyTarget / studyDaysCount : 0;

    return {
      weeklyTarget,
      dailyHours: Number(dailyHours.toFixed(1)),
      studyDaysCount,
    };
  }, [creditHours, difficultyLevel, selectedDays]);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const incrementCreditHours = () => {
    setCreditHours(prev => Math.min(prev + 1, 24));
  };

  const decrementCreditHours = () => {
    setCreditHours(prev => Math.max(prev - 1, 3));
  };

  const handleSave = async () => {
    const studyDays = daysArray.filter(day => selectedDays[day]);

    if (studyDays.length === 0) {
      alert('Please select at least one study day');
      return;
    }

    const userId = await getUserId();

    await goalsAPI.createGoal({
      user_id: userId,
      credit_hours: creditHours,
      difficulty_level: difficultyLevel,
      study_days: studyDays,
    });

    alert('Goal saved!');

    if (navigation) {
      navigation.navigate('Home');
    }
  };

  const handleSkip = () => {
    if (navigation) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.blueBackgroundLight} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>🎯 Set Your Goals</Text>
          <Text style={styles.headerSubtitle}>Plan your study schedule</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Credit Hours</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepperButton} onPress={decrementCreditHours}>
                <Text style={styles.stepperButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.stepperValue}>{creditHours}</Text>

              <TouchableOpacity style={styles.stepperButton} onPress={incrementCreditHours}>
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Course Difficulty</Text>
            <View style={styles.intensityButtonsContainer}>
              {[
                { label: 'Normal', value: 'normal' },
                { label: 'Hard', value: 'hard' },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.intensityButton,
                    difficultyLevel === option.value && styles.intensityButtonActive,
                  ]}
                  onPress={() => setDifficultyLevel(option.value)}
                >
                  <Text
                    style={[
                      styles.intensityButtonText,
                      difficultyLevel === option.value && styles.intensityButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.weeklyTargetContainer}>
          <Text style={styles.weeklyTargetLabel}>Weekly Target</Text>
          <Text style={styles.weeklyTargetNumber}>{calculations.weeklyTarget}</Text>
          <Text style={styles.weeklyTargetUnit}>hours per week</Text>
          <Text style={styles.weeklyTargetFormula}>
            {difficultyLevel === 'hard' ? '3h' : '2h'} per credit × {creditHours} credits
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.studyDaysTitle}>📅 Study Days</Text>
            <Text style={styles.studyDaysSubtitle}>Pick your study schedule</Text>

            <View style={styles.daysContainer}>
              {daysArray.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCheckbox,
                    selectedDays[day] && styles.dayCheckboxSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <View style={styles.dayCheckboxInner}>
                    {selectedDays[day] && (
                      <Text style={styles.dayCheckboxCheck}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.dayCheckboxText,
                      selectedDays[day] && styles.dayCheckboxTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <View style={styles.dailyHoursContainer}>
          <Text style={styles.dailyHoursNumber}>{calculations.dailyHours}</Text>
          <Text style={styles.dailyHoursLabel}>hours per study day</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="secondary"
            style={styles.skipButton}
          />
          <Button
            title="Save & Continue"
            onPress={handleSave}
            variant="primary"
            style={styles.saveButton}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.blueBackgroundLight || '#001D3D' },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg || 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerSection: { marginBottom: spacing.xl || 32 },
  headerTitle: {
    fontSize: fontSizes['3xl'] || 28,
    fontWeight: fontWeights.bold || 'bold',
    color: colors.accent || '#FFC300',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: fontSizes.base || 16,
    color: colors.white || '#FFFFFF',
    opacity: 0.8,
  },
  card: {
    marginBottom: spacing.lg || 20,
    padding: spacing.lg || 20,
  },
  cardContent: { gap: spacing.sm || 8 },
  cardLabel: {
    fontSize: fontSizes.lg || 18,
    fontWeight: fontWeights.bold || 'bold',
    color: colors.primary || '#000814',
    marginBottom: 12,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md || 8,
    backgroundColor: colors.accent || '#FFC300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary || '#000814',
  },
  stepperValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary || '#000814',
    marginHorizontal: 28,
  },
  intensityButtonsContainer: { flexDirection: 'row', gap: 12 },
  intensityButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.accent || '#FFC300',
    borderRadius: borderRadius.md || 8,
    padding: 14,
    alignItems: 'center',
  },
  intensityButtonActive: { backgroundColor: colors.accent || '#FFC300' },
  intensityButtonText: {
    color: colors.accent || '#FFC300',
    fontWeight: 'bold',
  },
  intensityButtonTextActive: { color: colors.primary || '#000814' },
  weeklyTargetContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl || 32,
  },
  weeklyTargetLabel: {
    color: colors.white || '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },
  weeklyTargetNumber: {
    color: colors.accent || '#FFC300',
    fontSize: 64,
    fontWeight: 'bold',
  },
  weeklyTargetUnit: {
    color: colors.white || '#FFFFFF',
    fontSize: 18,
  },
  weeklyTargetFormula: {
    color: colors.white || '#FFFFFF',
    opacity: 0.6,
    marginTop: 8,
  },
  studyDaysTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#000814',
  },
  studyDaysSubtitle: {
    color: colors.gray || '#666',
    marginBottom: 12,
  },
  daysContainer: { gap: 10 },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: borderRadius.md || 8,
    backgroundColor: colors.grayBackground || '#F2F2F2',
  },
  dayCheckboxSelected: { backgroundColor: colors.accent || '#FFC300' },
  dayCheckboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary || '#000814',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCheckboxCheck: {
    color: colors.primary || '#000814',
    fontWeight: 'bold',
  },
  dayCheckboxText: {
    color: colors.primary || '#000814',
    fontSize: 16,
  },
  dayCheckboxTextSelected: { fontWeight: 'bold' },
  dailyHoursContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg || 24,
  },
  dailyHoursNumber: {
    color: colors.accent || '#FFC300',
    fontSize: 44,
    fontWeight: 'bold',
  },
  dailyHoursLabel: {
    color: colors.white || '#FFFFFF',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.lg || 24,
  },
  skipButton: { flex: 1 },
  saveButton: { flex: 1 },
});