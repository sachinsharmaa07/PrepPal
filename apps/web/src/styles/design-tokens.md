# PrepPal Design Tokens

This document serves as the single source of truth for the PrepPal design system.

## 1. Color Palette (Dark Theme Default)

### Core Backgrounds
- **Background**: `#020617` (Deep Slate)
- **Card/Surface**: `#0f172a` (Elevated Slate)
- **Border/Divider**: `#1e293b` (Subtle Slate)

### Typography
- **Primary Text**: `#f8fafc` (Off-white)
- **Muted Text**: `#94a3b8` (Slate Gray)

### Accents (Brand Identity)
- **Primary (Indigo)**: `#4f46e5` (Hover: `#4338ca`)
- **Secondary (Cyan)**: `#06b6d4` (Hover: `#0891b2`)
- **Success (Emerald)**: `#10b981`
- **Destructive (Red)**: `#ef4444`

## 2. Typography Scale (Inter / Geist)

| Tag | Size | Line Height | Weight | Tailwind Class |
|---|---|---|---|---|
| H1 | 2.25rem (36px) | 2.5rem | Bold (700) | `text-4xl font-bold tracking-tight` |
| H2 | 1.875rem (30px)| 2.25rem | Semibold (600) | `text-3xl font-semibold` |
| H3 | 1.5rem (24px) | 2rem | Semibold (600) | `text-2xl font-semibold` |
| Body | 1rem (16px) | 1.5rem | Normal (400) | `text-base` |
| Small | 0.875rem (14px)| 1.25rem | Medium (500) | `text-sm font-medium text-muted-foreground` |

## 3. Spacing & Radius

- **Radius Base**: `0.5rem` (`rounded-lg`) for buttons, cards, and inputs.
- **Radius Large**: `0.75rem` (`rounded-xl`) for main content panels and hero elements.
- **Page padding**: `px-4 sm:px-6 lg:px-8` (Standard Tailwind breakpoints).

## 4. Shadows & Elevation

Instead of solid borders everywhere, we use a combination of subtle borders + glows.
- **Card Hover Glow**: `shadow-[0_0_20px_rgba(79,70,229,0.15)]` (Indigo glow)
- **Button Glow**: `shadow-[0_0_15px_rgba(79,70,229,0.4)]`
