# Design Tokens - Aerospace Control System

This document contains all design tokens extracted from the application's CSS. Use these to set up Figma variables and styles for consistency.

## Color Palette

### Primary Colors
```css
--primary-blue: #4a9dd7
--primary-blue-light: #60a5fa
--primary-blue-dark: #4a7ba7
```

### Semantic Colors
```css
--success-green: #4ade80
--success-green-dark: #22c55e
--warning-yellow: #f59e0b
--warning-yellow-dark: #d97706
--warning-amber: #fbbf24
--error-red: #ef4444
--info-blue: #3b82f6
--info-purple: #8b5cf6
--info-pink: #ec4899
```

### Background Colors
```css
--bg-primary: #1a1a1a
--bg-secondary: #0a0a0a
--bg-card: #2a2a2a
--bg-card-secondary: #1f1f1f
--bg-overlay: rgba(26, 26, 26, 0.95)
--bg-overlay-dark: rgba(26, 26, 26, 0.98)
--bg-overlay-card: rgba(42, 42, 42, 0.95)
```

### Text Colors
```css
--text-primary: #e0e0e0
--text-secondary: #999
--text-tertiary: #666
--text-white: #fff
```

### Border Colors
```css
--border-primary: rgba(74, 157, 215, 0.2)
--border-light: rgba(255, 255, 255, 0.05)
--border-medium: rgba(74, 157, 215, 0.15)
```

### Alpha/Opacity Variants
```css
--blue-alpha-10: rgba(74, 157, 215, 0.1)
--blue-alpha-15: rgba(74, 157, 215, 0.15)
--blue-alpha-20: rgba(74, 157, 215, 0.2)
--blue-alpha-30: rgba(74, 157, 215, 0.3)
--blue-alpha-40: rgba(74, 157, 215, 0.4)
--blue-alpha-60: rgba(74, 157, 215, 0.6)

--green-alpha-10: rgba(74, 222, 128, 0.1)
--green-alpha-15: rgba(74, 222, 128, 0.15)
--green-alpha-20: rgba(74, 222, 128, 0.2)

--yellow-alpha-15: rgba(245, 158, 11, 0.15)
--yellow-alpha-20: rgba(251, 191, 36, 0.2)

--white-alpha-05: rgba(255, 255, 255, 0.05)
--white-alpha-10: rgba(255, 255, 255, 0.1)

--black-alpha-20: rgba(0, 0, 0, 0.2)
--black-alpha-30: rgba(0, 0, 0, 0.3)
--black-alpha-40: rgba(0, 0, 0, 0.4)
--black-alpha-50: rgba(0, 0, 0, 0.5)
```

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
```css
--font-size-xs: 10px
--font-size-sm: 11px
--font-size-base: 12px
--font-size-md: 13px
--font-size-lg: 14px
--font-size-xl: 16px
--font-size-2xl: 18px
--font-size-3xl: 20px
--font-size-4xl: 28px
--font-size-5xl: 32px
```

### Font Weights
```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Line Heights
```css
--line-height-tight: 1.4
--line-height-normal: 1.5
--line-height-relaxed: 1.6
```

### Letter Spacing
```css
--letter-spacing-tight: -0.5px
--letter-spacing-normal: 0
--letter-spacing-wide: 0.5px
```

## Spacing Scale

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-7: 28px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
--spacing-15: 60px
--spacing-20: 80px
--spacing-22: 90px
```

## Border Radius

```css
--radius-sm: 2px
--radius-base: 4px
--radius-md: 8px
--radius-lg: 10px
--radius-xl: 12px
--radius-2xl: 16px
--radius-full: 50%
```

## Shadows

### Box Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2)
--shadow-base: 0 4px 16px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 20px rgba(74, 157, 215, 0.4)
--shadow-lg: 0 4px 24px rgba(0, 0, 0, 0.4)
--shadow-xl: 0 6px 28px rgba(74, 157, 215, 0.6)
--shadow-2xl: 0 8px 24px rgba(74, 157, 215, 0.3)
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.1)
```

### Text Shadows
```css
--text-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5)
--text-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.8)
```

### Glow Effects
```css
--glow-blue: 0 0 8px currentColor (with blue color)
--glow-green: 0 0 8px currentColor (with green color)
```

## Gradients

### Background Gradients
```css
--gradient-primary: linear-gradient(135deg, #4a7ba7 0%, #4a9dd7 100%)
--gradient-card: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)
--gradient-nav: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%)
--gradient-progress-blue: linear-gradient(90deg, #4a9dd7 0%, #60a5fa 100%)
--gradient-progress-green: linear-gradient(90deg, #4ade80, #22c55e)
--gradient-progress-yellow: linear-gradient(90deg, #f59e0b, #d97706)
```

## Backdrop Effects

```css
--backdrop-blur-sm: blur(8px)
--backdrop-blur-base: blur(12px)
--backdrop-blur-lg: blur(16px)
```

## Z-Index Scale

```css
--z-base: 1
--z-dropdown: 100
--z-sticky: 200
--z-fixed: 500
--z-overlay: 800
--z-modal: 900
--z-popover: 1000
--z-tooltip: 1100
```

## Transitions

### Duration
```css
--duration-fast: 0.2s
--duration-base: 0.3s
--duration-slow: 0.5s
```

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: ease-out
--ease-in: ease-in
--ease: ease
```

## Component-Specific Tokens

### Navigation
```css
--nav-height: 70px
--nav-item-padding: 8px 20px
--nav-item-gap: 8px
--nav-badge-size: 10px
```

### FAB Button
```css
--fab-size: 60px
--fab-icon-size: 28px
--fab-shadow: 0 4px 20px rgba(74, 157, 215, 0.4)
```

### Cards
```css
--card-padding: 20px
--card-border-width: 1px
--card-gap: 16px
```

### KPI Cards
```css
--kpi-icon-size: 40px
--kpi-value-size: 32px
--kpi-progress-height: 4px
```

### Scrollbar
```css
--scrollbar-width: 8px
--scrollbar-height: 8px
--scrollbar-radius: 4px
```

## Animation Keyframes

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Slide In
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Usage Guidelines

### In Figma

1. **Create Color Styles**: Set up color styles for all primary, semantic, and background colors
2. **Create Text Styles**: Set up text styles using the typography scale
3. **Create Effect Styles**: Set up shadow and blur effects
4. **Variables**: Use Figma variables for spacing, radius, and z-index values
5. **Gradients**: Create gradient styles for backgrounds and progress bars

### Naming Convention

Follow this naming pattern in Figma:
- Colors: `color/[category]/[name]` (e.g., `color/primary/blue`)
- Text: `text/[size]/[weight]` (e.g., `text/lg/semibold`)
- Effects: `effect/shadow/[size]` (e.g., `effect/shadow/md`)
- Spacing: `spacing/[number]` (e.g., `spacing/6`)
