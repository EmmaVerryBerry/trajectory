// Typography system extracted from Figma design
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 48,
  '5xl': 60,
};

export const fontWeights = {
  normal: '400',
  medium: '500',
  bold: '700',
};

export const fontFamilies = {
  heading: 'Aldrich',       // For headings, numbers, logo
  body: 'SpaceGrotesk',     // For body text, UI elements
};

// Text presets for common use cases
export const textPresets = {
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.normal,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.normal,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.normal,
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
  },
  button: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
};

export default {
  fontSizes,
  fontWeights,
  fontFamilies,
  textPresets,
};
