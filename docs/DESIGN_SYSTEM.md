# Academic Weapon Challenge - Design System

This document defines the visual design language for the Academic Weapon Challenge application.

## Color Palette

### Primary Colors

```
Ink Black       #000814     rgb(0, 8, 20)
Persian Blue    #001D3D     rgb(0, 29, 61)
Regal Navy      #003566     rgb(0, 53, 102)
```

### Accent Colors

```
School Bus Yellow   #FFC300     rgb(255, 195, 0)
Gold               #FFD60A     rgb(255, 214, 10)
```

### Usage Guidelines

- **Ink Black (#000814)**: Primary background, navigation bars, headers
- **Persian Blue (#001D3D)**: Screen backgrounds, secondary elements
- **Regal Navy (#003566)**: Cards, containers, raised elements
- **School Bus Yellow (#FFC300)**: Primary text, active states, CTAs
- **Gold (#FFD60A)**: Secondary text, highlights, success states

### Color Constants (React Native)

```javascript
export const COLORS = {
  PRIMARY: '#000814',
  SECONDARY: '#001D3D',
  BACKGROUND: '#001D3D',
  CARD_BACKGROUND: '#003566',
  ACCENT: '#FFC300',
  ACCENT_LIGHT: '#FFD60A',
  TEXT_PRIMARY: '#FFC300',
  TEXT_SECONDARY: '#FFD60A',
};
```

## Typography

### Font Families

#### Primary (Titles)
**Aldrich**
- Use for: App title, section headers, page titles
- Weight: Regular (400)
- Style: Bold, geometric, tech-inspired

#### Secondary (Body Text)
**Space Grotesk** (Recommended)
- Use for: Body text, labels, descriptions
- Weights: Light (300), Regular (400), Medium (500), Bold (700)
- Style: Modern, readable, versatile

#### Alternative Options
- **Agdasima**: Clean, minimalist
- **Alumni Sans SC**: Traditional, academic
- **Pixelify Sans**: Playful, retro gaming aesthetic

### Type Scale

```
Hero:       32-36px / Bold
Title:      24-28px / Bold
Heading:    18-20px / SemiBold
Body:       14-16px / Regular
Caption:    12-14px / Regular
Label:      10-12px / Medium
```

### Implementation (React Native)

```javascript
const typography = {
  hero: {
    fontFamily: 'Aldrich',
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.ACCENT,
  },
  title: {
    fontFamily: 'Aldrich',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  body: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
};
```

## Spacing System

Use an 8-point grid system for consistent spacing:

```
XS:   4px
SM:   8px
MD:   16px
LG:   24px
XL:   32px
XXL:  48px
```

### React Native Constants

```javascript
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};
```

## Component Styles

### Cards

```javascript
{
  backgroundColor: COLORS.CARD_BACKGROUND,
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5, // Android
}
```

### Buttons

#### Primary Button
```javascript
{
  backgroundColor: COLORS.ACCENT,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
}
// Text
{
  color: COLORS.PRIMARY,
  fontSize: 16,
  fontWeight: 'bold',
}
```

#### Secondary Button
```javascript
{
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: COLORS.ACCENT,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
}
// Text
{
  color: COLORS.ACCENT,
  fontSize: 16,
  fontWeight: 'bold',
}
```

### Input Fields

```javascript
{
  backgroundColor: COLORS.CARD_BACKGROUND,
  borderWidth: 2,
  borderColor: COLORS.REGAL_NAVY,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  color: COLORS.TEXT_PRIMARY,
}
// Focus state
{
  borderColor: COLORS.ACCENT,
}
```

## Iconography

### Character/Mascot
**Alien Guy** 👽
- Use as default avatar
- Friendly, approachable aesthetic
- Aligns with "Academic Weapon" branding

### Icon Style
- Line icons with 2px stroke
- Rounded caps and joins
- Color: COLORS.ACCENT or COLORS.ACCENT_LIGHT

### Recommended Icon Library
- **Ionicons** (included with Expo)
- Style: Outline variant
- Size: 24px (standard), 32px (large), 16px (small)

## Layout Patterns

### Screen Layout

```javascript
{
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: SPACING.LG,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
}
```

### Navigation Bar

```javascript
{
  tabBarStyle: {
    backgroundColor: COLORS.PRIMARY,
    borderTopWidth: 0,
    elevation: 10,
    height: 60,
  },
  tabBarActiveTintColor: COLORS.ACCENT,
  tabBarInactiveTintColor: COLORS.REGAL_NAVY,
  headerStyle: {
    backgroundColor: COLORS.PRIMARY,
  },
  headerTintColor: COLORS.ACCENT,
}
```

## Animations

### Timing
- **Fast**: 150ms - Small UI changes (button presses, toggles)
- **Medium**: 300ms - Card animations, transitions
- **Slow**: 500ms - Page transitions, complex animations

### Easing
- **Default**: ease-in-out
- **Enter**: ease-out
- **Exit**: ease-in

### React Native

```javascript
import { Animated, Easing } from 'react-native';

Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  useNativeDriver: true,
}).start();
```

## States

### Interactive Elements

- **Default**: Base color
- **Hover/Press**: Opacity 0.8 or darker shade
- **Active**: COLORS.ACCENT
- **Disabled**: Opacity 0.4
- **Loading**: Spinner in COLORS.ACCENT

### Success/Error/Warning

```javascript
SUCCESS: '#10B981',   // Green
ERROR: '#EF4444',     // Red
WARNING: '#F59E0B',   // Orange
INFO: COLORS.ACCENT,  // Yellow
```

## Accessibility

### Contrast Ratios
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- Interactive elements: Minimum 3:1

### Touch Targets
- Minimum size: 44x44 points
- Spacing between: 8px minimum

### Text
- Minimum font size: 14px for body text
- Line height: 1.5x font size
- Max line length: ~65 characters

## Dark Theme (Current)

The app uses a dark theme by default:
- Reduces eye strain during study sessions
- Better for low-light environments
- Matches "night mode" study aesthetic

## Branding

### Voice & Tone
- Encouraging and motivational
- Friendly but focused
- Celebrates achievements without being overwhelming
- Academic yet approachable

### Visual Personality
- Tech-forward and modern
- Game-inspired but professional
- Clean and organized
- Energetic through use of yellow accents

## Assets Needed

### Images
- App icon (1024x1024)
- Splash screen
- Achievement badges (10 designs)
- Default avatar (alien guy)
- Empty state illustrations

### Sounds (for Pomodoro Timer)
- Lofi music tracks
- Wave sounds
- Rain sounds
- Thunder sounds
- Timer completion sound
- Achievement unlock sound

## Implementation Checklist

- [ ] Install custom fonts (Aldrich, Space Grotesk)
- [ ] Create colors.js constants file ✓
- [ ] Create spacing.js constants file
- [ ] Create typography.js constants file
- [ ] Set up common component styles
- [ ] Design app icon and splash screen
- [ ] Create achievement badge assets
- [ ] Source/create Pomodoro sounds
- [ ] Test color contrast ratios
- [ ] Verify touch target sizes
