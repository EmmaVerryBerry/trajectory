import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fontSizes, borderRadius, sizes, fontWeights } from '../../constants';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'text'
  disabled = false,
  loading = false,
  style,
  textStyle
}) {
  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.buttonDisabled, style];
    }

    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary, style];
      case 'text':
        return [styles.buttonText, style];
      default:
        return [styles.button, styles.buttonPrimary, style];
    }
  };

  const getTextStyle = () => {
    if (disabled) {
      return [styles.text, styles.textDisabled, textStyle];
    }

    switch (variant) {
      case 'secondary':
        return [styles.text, styles.textSecondary, textStyle];
      case 'text':
        return [styles.text, styles.textSecondary, textStyle];
      default:
        return [styles.text, styles.textPrimary, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.primary : colors.accent} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: sizes.buttonHeight,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  buttonText: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
  },
  buttonDisabled: {
    backgroundColor: colors.grayLight,
    opacity: 0.5,
  },
  text: {
    fontSize: fontSizes.md,
    fontFamily: 'SpaceGrotesk-Medium',
    fontWeight: fontWeights.medium,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.accent,
  },
  textDisabled: {
    color: colors.gray,
  },
});
