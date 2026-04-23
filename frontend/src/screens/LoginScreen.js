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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authAPI.login(email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      const msg = error.response?.data?.error || 'Could not connect to server';
      Alert.alert('Login Failed', msg);
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
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Continue your mission</Text>

          {errors.form && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errors.form}</Text>
            </View>
          )}

          <View style={styles.form}>
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
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
              editable={!loading}
            />

            <Button
              title={loading ? 'Logging in...' : 'Enter →'}
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              disabled={loading}
              style={styles.signUpContainer}
            >
              <Text style={styles.signUpText}>
                Create new account
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
    paddingTop: 72,
    paddingBottom: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
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
  welcomeText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: fontSizes['2xl'],
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing['2xl'],
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
    gap: spacing.base,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  signUpContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.45)',
    textDecorationLine: 'underline',
  },
});