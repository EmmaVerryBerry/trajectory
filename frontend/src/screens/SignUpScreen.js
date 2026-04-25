import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input } from '../components/common';
import { colors, fontSizes, spacing, borderRadius } from '../constants';
import { authAPI } from '../services/api';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async () => {
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

    setLoading(true);
    try {
      await authAPI.register(username, email, password, university, major);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      const msg = error.response?.data?.error || 'Could not connect to server';
      Alert.alert('Sign Up Failed', msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
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

          {errors.form && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errors.form}</Text>
            </View>
          )}

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
              editable={!loading}
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
              editable={!loading}
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
              editable={!loading}
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
              editable={!loading}
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
              editable={!loading}
            />

            <Button
              title={loading ? 'Creating account...' : 'Launch →'}
              onPress={handleSignUp}
              style={styles.signUpButton}
              disabled={loading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
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
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: spacing.base,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.base,
  },
  errorText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.sm,
    color: '#FCA5A5',
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