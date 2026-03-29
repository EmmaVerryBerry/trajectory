import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, borderRadius, sizes, spacing } from '../../constants';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  error,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.35)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Medium',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.base,
    fontSize: fontSizes.base,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontSizes.sm,
    fontFamily: 'SpaceGrotesk-Regular',
    color: colors.error,
    marginTop: spacing.xs,
  },
});
