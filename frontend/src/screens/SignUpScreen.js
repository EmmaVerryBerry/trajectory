import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input } from '../components/common';
import { colors, fontSizes, spacing, borderRadius } from '../constants';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!university) newErrors.university = 'University is required';
    if (!major) newErrors.major = 'Major is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: replace with real auth — bypassing to main app for now
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoStar}>✦</Text>
          </View>
          <Text style={styles.appName}>TRAJECTORY</Text>
          <Text style={styles.tagline}>Chart your academic orbit</Text>
        </View>

        {/* Form area */}
        <View style={styles.formContainer}>
          <Text style={styles.headingText}>Create Account</Text>
          <Text style={styles.subtitleText}>Begin your journey</Text>

          <View style={styles.form}>
            <Input
              label="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({ ...errors, username: null });
              }}
              placeholder="Enter username"
              autoCapitalize="none"
              error={errors.username}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <Input
              label="University"
              value={university}
              onChangeText={(text) => {
                setUniversity(text);
                if (errors.university) setErrors({ ...errors, university: null });
              }}
              placeholder="Enter your university"
              autoCapitalize="words"
              error={errors.university}
            />

            <Input
              label="Major"
              value={major}
              onChangeText={(text) => {
                setMajor(text);
                if (errors.major) setErrors({ ...errors, major: null });
              }}
              placeholder="Enter your major"
              autoCapitalize="words"
              error={errors.major}
            />

            <Button
              title="Launch →"
              onPress={handleSignUp}
              style={styles.signUpButton}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.logInContainer}
            >
              <Text style={styles.logInText}>
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    paddingBottom: spacing['3xl'],
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  logoStar: {
    fontSize: 24,
    color: colors.primary,
  },
  appName: {
    fontFamily: 'Aldrich',
    fontSize: fontSizes['2xl'],
    color: colors.white,
    letterSpacing: 6,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Form
  formContainer: {
    flex: 1,
  },
  headingText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: fontSizes['2xl'],
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.sm,
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  logInContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  logInText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.45)',
    textDecorationLine: 'underline',
  },
});
