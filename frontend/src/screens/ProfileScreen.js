import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { colors, fontSizes, borderRadius, spacing, sizes, fontWeights } from '../constants';
import { usersAPI, authAPI } from '../services/api';

export default function ProfileScreen() {
  const [isEditMode, setIsEditMode] = useState(false);

  // User data state
  const [userData, setUserData] = useState({
    username: 'academicweapon',
    email: 'user@university.edu',
    university: 'University Name',
    major: 'Computer Science',
    bio: 'Striving to become an academic weapon',
    avatar: null,
    totalHours: 0,
    streak: 0,
    achievements: 0,
  });

  // Edit mode state
  const [editData, setEditData] = useState({ ...userData });

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      const [profile, stats] = await Promise.all([
        usersAPI.getProfile(1),
        usersAPI.getStats(1),
      ]);
      const merged = { ...userData, ...profile, totalHours: stats.totalHours, streak: stats.streak, achievements: stats.achievements };
      setUserData(merged);
      setEditData(merged);
    };
    loadProfile();
  }, []);

  // Notification settings
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    streakAlerts: true,
    achievementUnlocks: true,
    weeklyReports: false,
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    darkMode: true,
    soundEffects: true,
    language: 'English',
  });

  const handleSaveProfile = async () => {
    await usersAPI.updateProfile(1, editData);
    setUserData({ ...editData });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditData({ ...userData });
    setIsEditMode(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    console.log('Logged out');
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const togglePreference = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  // Render Edit Mode
  if (isEditMode) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Edit Mode Header */}
          <Text style={styles.screenTitle}>Edit Profile</Text>

          {/* Avatar Upload Section */}
          <View style={styles.avatarEditSection}>
            <TouchableOpacity style={styles.avatarEditContainer}>
              <View style={styles.avatarLarge}>
                {editData.avatar ? (
                  <Image source={{ uri: editData.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarPlaceholder}>👽</Text>
                )}
              </View>
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Fields */}
          <Card style={styles.editCard}>
            <Input
              label="Username"
              value={editData.username}
              onChangeText={(text) => setEditData({ ...editData, username: text })}
              placeholder="Enter username"
              autoCapitalize="none"
            />

            <Input
              label="Email"
              value={editData.email}
              onChangeText={(text) => setEditData({ ...editData, email: text })}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="University"
              value={editData.university}
              onChangeText={(text) => setEditData({ ...editData, university: text })}
              placeholder="Enter university"
            />

            <Input
              label="Major"
              value={editData.major}
              onChangeText={(text) => setEditData({ ...editData, major: text })}
              placeholder="Enter major"
            />

            <Input
              label="Bio"
              value={editData.bio}
              onChangeText={(text) => setEditData({ ...editData, bio: text })}
              placeholder="Enter bio"
              multiline
              numberOfLines={3}
              style={styles.bioInput}
            />
          </Card>

          {/* Action Buttons */}
          <View style={styles.editActions}>
            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              variant="primary"
              style={styles.saveButton}
            />
            <Button
              title="Cancel"
              onPress={handleCancelEdit}
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  // Render Full View Mode
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholder}>👽</Text>
            )}
          </View>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userData.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Account Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{userData.email}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Password</Text>
            <Text style={styles.settingValue}>••••••••</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>University</Text>
            <Text style={styles.settingValue}>{userData.university}</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Major</Text>
            <Text style={styles.settingValue}>{userData.major}</Text>
          </View>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Study Reminders</Text>
            <Switch
              value={notifications.studyReminders}
              onValueChange={() => toggleNotification('studyReminders')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Streak Alerts</Text>
            <Switch
              value={notifications.streakAlerts}
              onValueChange={() => toggleNotification('streakAlerts')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Achievement Unlocks</Text>
            <Switch
              value={notifications.achievementUnlocks}
              onValueChange={() => toggleNotification('achievementUnlocks')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Weekly Reports</Text>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={() => toggleNotification('weeklyReports')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        {/* App Preferences */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={preferences.darkMode}
              onValueChange={() => togglePreference('darkMode')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={preferences.soundEffects}
              onValueChange={() => togglePreference('soundEffects')}
              trackColor={{ false: colors.grayLight, true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>{preferences.language}</Text>
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.settingLink}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingLink}>View</Text>
          </TouchableOpacity>
        </Card>

        {/* Edit Profile Button */}
        <Button
          title="Edit Profile"
          onPress={() => setIsEditMode(true)}
          variant="primary"
          style={styles.editButton}
        />

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
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
  screenTitle: {
    fontSize: fontSizes['2xl'],
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: fontWeights.bold,
    color: colors.accent,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },

  // Profile Header Styles
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 48,
  },
  username: {
    fontSize: fontSizes.xl,
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bio: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.accentLight,
  },

  // Stats Section Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
    paddingVertical: spacing.base,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSizes['3xl'],
    fontFamily: 'Aldrich',
    fontWeight: fontWeights.normal,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.white,
  },

  // Settings Card Styles
  settingsCard: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.base,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorder,
  },
  settingLabel: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.primary,
    flex: 1,
  },
  settingValue: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.gray,
  },
  settingLink: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Medium',
    fontWeight: fontWeights.medium,
    color: colors.blue,
  },

  // Edit Mode Styles
  avatarEditSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarEditContainer: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Medium',
    fontWeight: fontWeights.medium,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  editCard: {
    marginBottom: spacing.xl,
  },
  bioInput: {
    marginBottom: 0,
  },
  editActions: {
    gap: spacing.md,
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    marginBottom: spacing.lg,
  },

  // Button Styles
  editButton: {
    marginTop: spacing.base,
    marginBottom: spacing.md,
  },
  logoutButton: {
    borderColor: colors.errorLight,
    marginBottom: spacing.xl,
  },
  logoutButtonText: {
    color: colors.errorLight,
  },
});
