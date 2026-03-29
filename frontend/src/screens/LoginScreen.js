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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

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
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Continue your mission</Text>

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
            />

            <Button
              title="Enter →"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
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

  // Header
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

  // Form
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
