import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, fontSizes, borderRadius, spacing } from '../constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { studyAPI, authAPI } from '../services/api';

export default function LogSessionScreen() {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadRecentSessions();
  }, []);

  const getUserId = async () => {
    const user = await Promise.resolve(authAPI.getStoredUser());
    return user?.userId || user?.user_id || 1;
  };

  const loadRecentSessions = async () => {
    const userId = await getUserId();
    const data = await studyAPI.getSessions(userId);
    setSessions(data);
  };

  const handleSaveSession = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject or course name');
      return;
    }

    const totalMinutes = parseInt(hours || 0) * 60 + parseInt(minutes || 0);

    if (totalMinutes === 0) {
      alert('Please enter a valid time duration');
      return;
    }

    const userId = await getUserId();

    const newSession = {
      user_id: userId,
      subject: subject.trim(),
      session_date: selectedDate.toISOString().split('T')[0],
      duration_minutes: totalMinutes,
      notes: notes.trim(),
    };

    const saved = await studyAPI.createSession(newSession);
    setSessions([saved, ...sessions.slice(0, 2)]);

    setSubject('');
    setHours('0');
    setMinutes('0');
    setNotes('');
    setSelectedDate(new Date());

    alert('Session logged successfully!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatDuration = (duration) => {
    const safeMinutes = Number(duration || 0);
    const hrs = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;

    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const incrementTime = (type) => {
    if (type === 'hours') {
      const newHours = parseInt(hours || 0) + 1;
      setHours(newHours.toString());
    } else {
      const newMinutes = parseInt(minutes || 0) + 5;
      if (newMinutes >= 60) {
        setMinutes('0');
        setHours((parseInt(hours || 0) + 1).toString());
      } else {
        setMinutes(newMinutes.toString());
      }
    }
  };

  const decrementTime = (type) => {
    if (type === 'hours') {
      const newHours = Math.max(0, parseInt(hours || 0) - 1);
      setHours(newHours.toString());
    } else {
      const newMinutes = parseInt(minutes || 0) - 5;
      if (newMinutes < 0) {
        if (parseInt(hours || 0) > 0) {
          setMinutes('55');
          setHours((parseInt(hours || 0) - 1).toString());
        } else {
          setMinutes('0');
        }
      } else {
        setMinutes(newMinutes.toString());
      }
    }
  };

  const adjustDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Log Session</Text>

        <Card style={styles.formCard}>
          <Input
            label="Subject/Course"
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Calculus II"
            autoCapitalize="words"
          />

          <View style={styles.timeSection}>
            <Text style={styles.sectionLabel}>Duration</Text>
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => incrementTime('hours')}
                >
                  <Text style={styles.timeButtonText}>+</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.timeInput}
                  value={hours}
                  onChangeText={(text) => setHours(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>hours</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => decrementTime('hours')}
                >
                  <Text style={styles.timeButtonText}>-</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timePicker}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => incrementTime('minutes')}
                >
                  <Text style={styles.timeButtonText}>+</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.timeInput}
                  value={minutes}
                  onChangeText={(text) => setMinutes(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>minutes</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => decrementTime('minutes')}
                >
                  <Text style={styles.timeButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>Date</Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => adjustDate(-1)}
              >
                <Text style={styles.dateButtonText}>&lt;</Text>
              </TouchableOpacity>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => adjustDate(1)}
              >
                <Text style={styles.dateButtonText}>&gt;</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={() => setSelectedDate(new Date())}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.sectionLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="What did you study?"
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Button
            title="Save Session"
            onPress={handleSaveSession}
            style={styles.saveButton}
          />
        </Card>

        {sessions.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentHeader}>Recent Sessions</Text>
            {sessions.slice(0, 3).map((session, index) => {
              const sessionSubject = session.subject || 'Study Session';
              const sessionDate = session.session_date || session.date;
              const sessionDuration = session.duration_minutes || session.duration;

              return (
                <Card key={session.session_id || session.id || index} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionSubject}>{sessionSubject}</Text>
                    <Text style={styles.sessionDate}>{formatDate(sessionDate)}</Text>
                  </View>
                  <View style={styles.sessionDetails}>
                    <Text style={styles.sessionDuration}>
                      {formatDuration(sessionDuration)}
                    </Text>
                    {session.notes && (
                      <Text style={styles.sessionNotes}>{session.notes}</Text>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
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
  formCard: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  timeSection: {
    marginBottom: spacing.lg,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timePicker: {
    alignItems: 'center',
  },
  timeButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  timeButtonText: {
    fontSize: fontSizes['2xl'],
    fontFamily: 'Aldrich',
    color: colors.primary,
  },
  timeInput: {
    width: 80,
    height: 80,
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontSize: fontSizes['4xl'],
    fontFamily: 'Aldrich',
    color: colors.primary,
    marginVertical: spacing.sm,
  },
  timeLabel: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
    marginTop: spacing.xs,
  },
  dateSection: {
    marginBottom: spacing.lg,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: fontSizes.xl,
    fontFamily: 'Aldrich',
    color: colors.primary,
  },
  dateDisplay: {
    flex: 1,
    marginHorizontal: spacing.base,
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: 'center',
  },
  dateText: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.primary,
  },
  todayButton: {
    marginTop: spacing.sm,
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.base,
  },
  todayButtonText: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.blue,
    textDecorationLine: 'underline',
  },
  notesSection: {
    marginBottom: spacing.lg,
  },
  notesInput: {
    backgroundColor: colors.grayBackground,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.primary,
    minHeight: 100,
  },
  saveButton: {
    marginTop: spacing.base,
  },
  recentSection: {
    marginTop: spacing.base,
  },
  recentHeader: {
    fontSize: fontSizes.xl,
    fontFamily: 'Aldrich',
    color: colors.accent,
    marginBottom: spacing.base,
  },
  sessionCard: {
    marginBottom: spacing.base,
    padding: spacing.base,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sessionSubject: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Medium',
    color: colors.primary,
    flex: 1,
  },
  sessionDate: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
  },
  sessionDetails: {
    gap: spacing.xs,
  },
  sessionDuration: {
    fontSize: fontSizes.lg,
    fontFamily: 'Aldrich',
    color: colors.accent,
  },
  sessionNotes: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
  },
});