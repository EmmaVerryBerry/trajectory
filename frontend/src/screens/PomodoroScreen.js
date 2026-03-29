import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import { colors, fontSizes, borderRadius, spacing } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const MODES = {
  FOCUS: { name: 'Focus', duration: 25 * 60 },
  SHORT_BREAK: { name: 'Short Break', duration: 5 * 60 },
  LONG_BREAK: { name: 'Long Break', duration: 15 * 60 },
};
const SOUNDS = [
    { id: 'none', name: 'None', icon: '' },
    { id: 'lofi', name: 'Lofi', icon: '' },
    { id: 'rain', name: 'Rain', icon: '' },
    { id: 'waves', name: 'Waves', icon: '' },
    { id: 'thunder', name: 'Thunder', icon: '' },
    { id: 'fire', name: 'Fire', icon: '' },
];

const STUDY_TIPS = [
  'Take regular breaks to maintain focus and prevent burnout',
  'Stay hydrated - keep water nearby during study sessions',
  'Use the Pomodoro technique: 25 min focus, 5 min break',
  'Eliminate distractions - put your phone on silent mode',
  'Review material before bed to improve retention',
  'Active recall is more effective than passive reading',
];

export default function PomodoroScreen() {
  const [mode, setMode] = useState('FOCUS');
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState('none');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessionPomodoros, setSessionPomodoros] = useState(0);
  const [sound, setSound] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup timer and sound on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    Vibration.vibrate([0, 500, 200, 500]);

    if (mode === 'FOCUS') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      setSessionPomodoros(sessionPomodoros + 1);

      // Suggest break after focus session
      if (newCount % 4 === 0) {
        setMode('LONG_BREAK');
        setTimeLeft(MODES.LONG_BREAK.duration);
      } else {
        setMode('SHORT_BREAK');
        setTimeLeft(MODES.SHORT_BREAK.duration);
      }
    } else {
      // After break, return to focus mode
      setMode('FOCUS');
      setTimeLeft(MODES.FOCUS.duration);
    }
  };

  const handleStart = async () => {
    setIsRunning(true);

    // Play ambient sound if selected
    if (selectedSound !== 'none') {
      await playAmbientSound();
    }
  };

  const handlePause = async () => {
    setIsRunning(false);

    // Pause ambient sound
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);

    // Stop ambient sound
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);

    // Stop current sound when changing modes
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const playAmbientSound = async () => {
    try {
      // In production, load actual sound files
      // For now, this is a placeholder
      console.log(`Playing ${selectedSound} sound`);

      // Example of how to load and play sound:
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   require(`../assets/sounds/${selectedSound}.mp3`),
      //   { isLooping: true, shouldPlay: true }
      // );
      // setSound(newSound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const total = MODES[mode].duration;
    return ((total - timeLeft) / total) * 100;
  };

  const getCurrentTip = () => {
    const index = sessionPomodoros % STUDY_TIPS.length;
    return STUDY_TIPS[index];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Pomodoro Timer</Text>

        <Card style={styles.timerCard}>
          {/* Mode Tabs */}
          <View style={styles.modeContainer}>
            {Object.keys(MODES).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modeTab,
                  mode === key && styles.modeTabActive,
                ]}
                onPress={() => handleModeChange(key)}
                disabled={isRunning}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    mode === key && styles.modeTabTextActive,
                  ]}
                >
                  {MODES[key].name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Timer Display */}
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.modeLabel}>{MODES[mode].name}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            {!isRunning ? (
              <Button
                title="Start"
                onPress={handleStart}
                style={styles.controlButton}
              />
            ) : (
              <Button
                title="Pause"
                onPress={handlePause}
                variant="secondary"
                style={styles.controlButton}
              />
            )}
            <Button
              title="Reset"
              onPress={handleReset}
              variant="secondary"
              style={[styles.controlButton, styles.resetButton]}
            />
          </View>
        </Card>

        {/* Pomodoro Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.pomodoroProgress}>
            <View style={styles.pomodoroCount}>
              <Text style={styles.pomodoroNumber}>{completedPomodoros}</Text>
              <Text style={styles.pomodoroLabel}>Completed</Text>
            </View>
            <View style={styles.pomodoroCount}>
              <Text style={styles.pomodoroNumber}>
                {Math.floor((completedPomodoros * 25) / 60)}h{' '}
                {(completedPomodoros * 25) % 60}m
              </Text>
              <Text style={styles.pomodoroLabel}>Focus Time</Text>
            </View>
          </View>
          <View style={styles.pomodoroIndicators}>
            {[...Array(8)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pomodoroIndicator,
                  index < completedPomodoros && styles.pomodoroIndicatorComplete,
                ]}
              />
            ))}
          </View>
        </Card>

        {/* Sound Options */}
        <Card style={styles.soundCard}>
          <Text style={styles.sectionTitle}>Ambient Sounds</Text>
          <View style={styles.soundGrid}>
            {SOUNDS.map((soundOption) => (
              <TouchableOpacity
                key={soundOption.id}
                style={[
                  styles.soundOption,
                  selectedSound === soundOption.id && styles.soundOptionActive,
                ]}
                onPress={() => setSelectedSound(soundOption.id)}
              >
                <Text style={styles.soundIcon}>{soundOption.icon}</Text>
                <Text
                  style={[
                    styles.soundName,
                    selectedSound === soundOption.id && styles.soundNameActive,
                  ]}
                >
                  {soundOption.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Study Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>Study Tip</Text>
          <Text style={styles.tipText}>{getCurrentTip()}</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  header: {
    fontSize: fontSizes['3xl'],
    fontFamily: 'Aldrich',
    color: colors.accent,
    marginBottom: spacing.xl,
  },
  timerCard: {
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
    width: '100%',
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.accent,
  },
  modeTabText: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.gray,
  },
  modeTabTextActive: {
    color: colors.primary,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  timerText: {
    fontSize: fontSizes['4xl'],
    fontFamily: 'Aldrich',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  modeLabel: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: spacing.base,
    width: '100%',
  },
  controlButton: {
    flex: 1,
  },
  resetButton: {
    maxWidth: 100,
  },
  progressCard: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.primary,
    marginBottom: spacing.base,
  },
  pomodoroProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.base,
  },
  pomodoroCount: {
    alignItems: 'center',
  },
  pomodoroNumber: {
    fontSize: fontSizes['2xl'],
    fontFamily: 'Aldrich',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  pomodoroLabel: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
  },
  pomodoroIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  pomodoroIndicator: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.grayBackground,
    borderWidth: 2,
    borderColor: colors.grayBorder,
  },
  pomodoroIndicatorComplete: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  soundCard: {
    marginBottom: spacing.base,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  soundOption: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.grayBackground,
  },
  soundOptionActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },
  soundIcon: {
    fontSize: fontSizes['2xl'],
    marginBottom: spacing.xs,
  },
  soundName: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.gray,
  },
  soundNameActive: {
    color: colors.primary,
  },
  tipsCard: {
    marginBottom: spacing.base,
    backgroundColor: colors.blueBackground,
  },
  tipText: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.primary,
    lineHeight: 24,
  },
});
