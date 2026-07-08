# Starz Cosmic Oracle — Architecture

## Overview

Starz Cosmic Oracle is a React Native / Expo mobile app built with a modular, layered architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.76.9 + Expo SDK 52 |
| Navigation | React Navigation (Bottom Tabs + Stack) |
| State | Zustand |
| Styling | StyleSheet + Expo LinearGradient / Blur |
| Animation | React Native Reanimated |
| Storage | AsyncStorage |
| Notifications | Expo Notifications |
| Payments | react-native-iap + RevenueCat (ready) |
| Ads | react-native-google-mobile-ads (ready) |

## Directory Structure

```
src/
├── api/              # Data layer — astrology calculations, mock API
├── components/       # Reusable UI components (Starfield, CosmicCard, etc.)
├── constants/        # Colors, typography, astrology data, monetization config
├── hooks/            # Custom React hooks (useAuth, useDailyReset)
├── navigation/       # Root and Tab navigators
├── screens/          # 8+ screen components
├── stores/           # Zustand stores (auth, history)
├── types/            # TypeScript type definitions
├── utils/            # Astro calculations, theme, storage, notifications
├── App.tsx           # Entry point
```

## Data Flow

1. **User action** → Screen component
2. **Screen** → calls API function or Zustand store action
3. **API** → uses astro calculations (pure functions) or AsyncStorage
4. **Store** → updates state + persists to AsyncStorage
5. **Component** → re-renders with new state

## Key Patterns

- **Pure calculations**: All astrology math is in `utils/astroCalculations.ts` with no side effects
- **Deterministic readings**: Horoscopes and tarot shuffles are seeded by date so same inputs = same outputs
- **Feature gates**: Subscription checks live in `useAuthStore.canRead()`
- **Local-first**: All data is stored locally; no backend required for core features

## Monetization Architecture

| Tier | Limitations | Backend |
|------|-------------|---------|
| Free | 3 readings/day, ads shown | N/A |
| Premium | Unlimited, no ads | RevenueCat / IAP |
| Pro | + Birth chart, priority | RevenueCat / IAP |

The `constants/revenuecat.ts` and `constants/ads.ts` files contain configuration stubs ready for production credentials.

## Testing

- Jest with jest-expo preset
- Tests cover: Julian day calculations, moon phases, sun sign logic, birth chart generation, tarot shuffle, store logic

## Build Pipeline

- EAS Build via `eas.json` (dev, preview, production)
- GitHub Actions workflow triggers EAS builds on push to main
- App signed with bundle IDs `com.starz.cosmicoracle` (iOS + Android)
