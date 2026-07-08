# Starz Cosmic Oracle 🌟

A beautiful, fully-featured astrology and cosmic guidance mobile app built with React Native and Expo.

## Features

- ✨ **Daily Horoscope** — Personalized readings for all 12 zodiac signs
- 🌌 **Birth Chart (Natal Chart)** — Calculate your Big Three and planetary positions
- 🔮 **Tarot Reading** — Draw cards with flip animations and interpretations
- 🌙 **Moon Phase Tracker** — Accurate lunar calendar with illumination data
- 🪐 **Planetary Transits** — Current cosmic weather with retrograde tracking
- 📜 **Reading History** — Save and revisit past readings
- 💎 **Premium Subscriptions** — Free, Premium ($9.99/mo), and Pro ($29.99/mo) tiers
- 🔔 **Push Notifications** — Daily horoscope and moon event reminders
- 📤 **Share** — Share readings with friends

## Tech Stack

- **Framework**: React Native 0.76.9 + Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State**: Zustand
- **Styling**: StyleSheet + Expo LinearGradient + Expo Blur
- **Animation**: React Native Reanimated
- **Storage**: AsyncStorage
- **Payments**: react-native-iap + RevenueCat (ready)
- **Ads**: react-native-google-mobile-ads (ready)
- **Testing**: Jest + jest-expo

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

```bash
# Clone the repo
git clone https://github.com/michellemcbean5-droid/starz-cosmic-oracle.git
cd starz-cosmic-oracle

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android
```

## Project Structure

```
starz-cosmic-oracle/
├── src/
│   ├── api/              # Astrology data layer & calculations
│   ├── components/       # Reusable UI components
│   ├── constants/        # Colors, typography, astrology data, monetization
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Root & Tab navigators
│   ├── screens/          # 8 feature screens
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Astro calculations, storage, notifications
│   └── App.tsx           # Entry point
├── tests/                # Jest tests
├── docs/                 # Architecture, deployment, design system
├── assets/               # Images, icons, splash screens
├── app.json              # Expo configuration
├── eas.json              # EAS build profiles
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm test` | Run Jest tests |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |
| `npm run build:android` | EAS build Android |
| `npm run build:ios` | EAS build iOS |

## Testing

```bash
npm test
```

Tests cover:
- Julian day calculations
- Moon phase accuracy (New Moon, Full Moon)
- Sun sign determination
- Birth chart generation
- Tarot shuffle determinism
- Zustand store logic

## Astrological Accuracy

All calculations use real astronomical algorithms:
- **Julian Day** conversion for precise date math
- **Moon phase** using synodic month (29.53058867 days)
- **Sun longitude** using orbital elements with aberration correction
- **Moon longitude** using Meeus algorithm approximation
- **Planetary positions** using mean orbital elements
- **Aspects** calculated with standard orbs (8°)

## Monetization

### Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 3 readings/day, ads |
| Premium | $9.99/mo | Unlimited readings, no ads, tarot |
| Pro | $29.99/mo | Everything + birth chart + transits |

### Setup

1. Configure RevenueCat or direct IAP in `src/constants/revenuecat.ts`
2. Configure AdMob in `src/constants/ads.ts`
3. See `docs/deployment.md` for full store setup instructions

## Build & Deploy

### Development Build

```bash
eas build --profile development
```

### Production Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

See `docs/deployment.md` for complete App Store and Google Play submission guides.

## Design System

See `docs/DesignSystem.md` for:
- Color palette (cosmic dark theme with star golds)
- Typography scale
- Spacing system
- Animation guidelines

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Made with 💫 by the Starz Cosmic Oracle team.*
