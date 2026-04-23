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
import { colors, fontSizes, spacing, borderRadius, sizes, fontWeights, fontFamilies } from '../constants';
import { goalsAPI } from '../services/api';

export default function GoalSettingScreen({ navigation }) {
  // State Management
  const [creditHours, setCreditHours] = useState(15);
  const [intensityLevel, setIntensityLevel] = useState('Normal'); // 'Low', 'Normal', 'High'
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

  // Calculate weekly and daily targets
  const calculations = useMemo(() => {
    // Base calculation: 2 hours per credit
    const baseHoursPerWeek = creditHours * 2;

    // Adjust based on intensity level
    let weeklyTarget = baseHoursPerWeek;
    if (intensityLevel === 'Low') {
      weeklyTarget = baseHoursPerWeek * 0.75;
    } else if (intensityLevel === 'High') {
      weeklyTarget = baseHoursPerWeek * 1.25;
    }

    // Count selected study days
    const studyDaysCount = Object.values(selectedDays).filter(Boolean).length;

    // Calculate daily hours
    const dailyHours = studyDaysCount > 0 ? (weeklyTarget / studyDaysCount).toFixed(1) : 0;

    return {
      weeklyTarget: Math.round(weeklyTarget),
      dailyHours: parseFloat(dailyHours),
      studyDaysCount,
    };
  }, [creditHours, intensityLevel, selectedDays]);

  // Toggle a study day
  const toggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Handle credit hours change
  const incrementCreditHours = () => {
    setCreditHours(prev => Math.min(prev + 1, 24)); // Max 24 credits
  };

  const decrementCreditHours = () => {
    setCreditHours(prev => Math.max(prev - 1, 3)); // Min 3 credits
  };

  // Handle intensity level change
  const selectIntensity = (level) => {
    setIntensityLevel(level);
  };

  // Handle save
  const handleSave = async () => {
    const goalData = {
      creditHours,
      intensityLevel,
      selectedDays,
      weeklyTarget: calculations.weeklyTarget,
      dailyHours: calculations.dailyHours,
    };
    await goalsAPI.create(goalData);
    if (navigation) {
      navigation.navigate('Home');
    }
  };

  // Handle skip
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>🎯 Set Your Goals</Text>
          <Text style={styles.headerSubtitle}>Let's plan your study schedule!</Text>
        </View>

        {/* Credit Hours Card */}
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Credit Hours</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={decrementCreditHours}
              >
                <Text style={styles.stepperButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{creditHours}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={incrementCreditHours}
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Intensity Level Card */}
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Intensity Level</Text>
            <View style={styles.intensityButtonsContainer}>
              {['Low', 'Normal', 'High'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.intensityButton,
                    intensityLevel === level && styles.intensityButtonActive,
                  ]}
                  onPress={() => selectIntensity(level)}
                >
                  <Text style={[
                    styles.intensityButtonText,
                    intensityLevel === level && styles.intensityButtonTextActive,
                  ]}>
                    {level === 'Low' && '🔵 Low'}
                    {level === 'Normal' && '🟡 Normal'}
                    {level === 'High' && '🔴 High'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Weekly Target Display - MAIN FOCAL POINT */}
        <View style={styles.weeklyTargetContainer}>
          <Text style={styles.weeklyTargetLabel}>Weekly Target</Text>
          <Text style={styles.weeklyTargetNumber}>{calculations.weeklyTarget}</Text>
          <Text style={styles.weeklyTargetUnit}>hours per week</Text>
          <Text style={styles.weeklyTargetFormula}>
            (2h per credit × {creditHours} credits)
          </Text>
        </View>

        {/* Study Days Selection */}
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.studyDaysTitle}>📅 Study Days</Text>
            <Text style={styles.studyDaysSubtitle}>Pick your study schedule</Text>

            {/* Days Checkboxes */}
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
                  <Text style={[
                    styles.dayCheckboxText,
                    selectedDays[day] && styles.dayCheckboxTextSelected,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* Daily Hours Display */}
        <View style={styles.dailyHoursContainer}>
          <Text style={styles.dailyHoursNumber}>{calculations.dailyHours}</Text>
          <Text style={styles.dailyHoursLabel}>per study day</Text>
        </View>

        {/* Bottom Buttons Section */}
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

        {/* Bottom spacing for safe area */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueBackgroundLight, // #eff6ff - Light blue background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl, // 24px
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.xl,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'], // 40px
  },
  headerTitle: {
    fontSize: fontSizes['2xl'], // 24px
    fontFamily: fontFamilies.heading, // Aldrich
    color: colors.white, // White text on light background (design uses white)
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: fontSizes.base, // 14px
    fontFamily: fontFamilies.body,
    color: colors.blue, // #003566
    opacity: 0.6,
    textAlign: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: colors.white,
    marginBottom: spacing.xl, // 24px
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  cardContent: {
    width: '100%',
  },
  cardLabel: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.blue, // #003566
    opacity: 0.7,
    marginBottom: spacing.base,
  },

  // Stepper Container (Credit Hours)
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent, // #ffc300 - Yellow
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontFamily: fontFamilies.body,
  },
  stepperValue: {
    fontSize: fontSizes['2xl'],
    fontFamily: fontFamilies.heading,
    color: colors.blue, // #003566
    fontWeight: fontWeights.normal,
    minWidth: 60,
    textAlign: 'center',
  },

  // Intensity Level Buttons
  intensityButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.base,
    justifyContent: 'space-between',
  },
  intensityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.grayBorder, // #e5e7eb
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  intensityButtonActive: {
    backgroundColor: colors.accent, // #ffc300
    borderColor: colors.accent,
  },
  intensityButtonText: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.blue, // #003566
  },
  intensityButtonTextActive: {
    color: colors.primary, // #000814
  },

  // Weekly Target Section - MAIN FOCAL POINT
  weeklyTargetContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'], // 40px
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  weeklyTargetLabel: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.primary, // #000814
    opacity: 0.7,
    marginBottom: spacing.base,
  },
  weeklyTargetNumber: {
    fontSize: fontSizes['5xl'], // 60px - HUGE number
    fontFamily: fontFamilies.heading, // Aldrich
    color: colors.primary, // #000814
    fontWeight: fontWeights.normal,
    lineHeight: 60,
  },
  weeklyTargetUnit: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.primary, // #000814
    opacity: 0.8,
    marginTop: spacing.sm,
  },
  weeklyTargetFormula: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.body,
    color: colors.gray,
    marginTop: spacing.sm,
    opacity: 0.6,
  },

  // Study Days Section
  studyDaysTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.blue, // #003566
    marginBottom: spacing.sm,
  },
  studyDaysSubtitle: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.body,
    color: colors.blue,
    opacity: 0.6,
    marginBottom: spacing.lg,
  },

  // Days Container
  daysContainer: {
    gap: spacing.sm, // 8px gap between checkboxes
  },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // 56px height as per spec
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.grayBackground, // #f9fafb
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayCheckboxSelected: {
    backgroundColor: colors.blueBackground, // #dbeafe
    borderColor: colors.accent, // #ffc300
  },
  dayCheckboxInner: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.grayBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  dayCheckboxCheck: {
    fontSize: fontSizes.md,
    color: colors.accent, // #ffc300
    fontWeight: fontWeights.bold,
  },
  dayCheckboxText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    color: colors.blue, // #003566
    flex: 1,
  },
  dayCheckboxTextSelected: {
    color: colors.primary, // #000814
    fontWeight: fontWeights.bold,
  },

  // Daily Hours Display
  dailyHoursContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'], // 40px
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  dailyHoursNumber: {
    fontSize: fontSizes['4xl'], // 48px or close
    fontFamily: fontFamilies.heading,
    color: colors.primary, // #000814
    fontWeight: fontWeights.normal,
  },
  dailyHoursLabel: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.body,
    color: colors.blue,
    opacity: 0.7,
    marginTop: spacing.sm,
  },

  // Buttons Container
  buttonsContainer: {
    gap: spacing.base,
  },
  skipButton: {
    marginBottom: 0,
  },
  saveButton: {
    marginBottom: 0,
  },
});
